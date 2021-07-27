/*
 *  Load, parse and write the config files and execute
 *  a hook if present.
 *  Created On 24 July 2021
 */

import chalk from 'chalk'
import path from 'path'

import { logger } from '../../../logger.js'
import fsUtility from '../../../utilities/fs.js'
import getFiles from './01-files.js'
import parseFiles from './02-parse.js'
import filterModules from './03-filter.js'
import { backup, restore } from './04-backup.js'
import runHook from './05-hook.js'

export default async ({ args, data, log }) => {
    // load the handlebars config template files
    // into memory recursively
    const files = await getFiles(log)

    // read the hbs files into memory, render them
    // and then read front-matter in them to separate properties
    let modules = await parseFiles({ data, files, log })

    // filter depending on if we have the
    // executable installed or not
    modules = await filterModules({ args, modules })

    // loop through each module
    for (const mod of modules) {
        // 1. make the dest path absolute
        log.log(`Working on ${chalk.gray(mod.name || path.basename())}`)
        mod.dest = path.join(args.dir, mod.dest)

        // 2. take a backup of the config file we're writing
        await backup(args, mod, log)

        // 3. write the rendered config file
        logger.verbose(`Writing ${chalk.gray(mod.dest)}`)
        await fsUtility.write(mod)

        // 4. run the hook file
        const status = await runHook(args, mod)

        // 5. if hook, successfully runs, we clear the back up
        // else we restore the backup and re-run the hooks
        await restore(mod, status)
    }
}
