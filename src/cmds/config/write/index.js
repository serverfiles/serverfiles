/*
 *  Load, parse and write the config files and execute
 *  a hook if present.
 *  Created On 24 July 2021
 */

import path from 'path'

import fsUtility from '../../../utilities/fs.js'
import getFiles from './01-files.js'
import parseFiles from './02-parse.js'
import filterModules from './03-filter.js'
import { backup } from './04-backup.js'
import runHook from './05-hook.js'

export default async ({ args, data, log }) => {
    // load the handlebars config template files
    // into memory recursively
    const files = await getFiles()

    // read the hbs files into memory, render them
    // and then read front-matter in them to separate properties
    let modules = await parseFiles({ data, files })

    // filter depending on if we have the
    // executable installed or not
    modules = await filterModules({ args, modules })

    // loop through each module
    for (const mod of modules) {
        // 1. take a backup of the config file we're writing
        await backup(args, mod)

        // 2. write the rendered config file
        mod.path = path.join(args.dir, mod.path)
        await fsUtility.write(mod.path, mod.content)

        // 3. run the hook file
        await runHook(args, mod)

        // 4. if hook, successfully runs, we clear the back up
        // 5. else we restore the backup and re-run the hooks
    }
}
