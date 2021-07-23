/*
 *  Renders the variables and writes the files to disk.
 *  Created On 16 July 2021
 */

import { promise } from '@vasanthdeveloper/utilities'
import chalk from 'chalk'
import fs from 'fs/promises'
import mkdirp from 'mkdirp'
import path from 'path'

import { logger } from '../../logger.js'
import fsUtility from '../../utilities/fs.js'
import { getRelative } from './04-files.js'
import { executeHook } from './05-hooks.js'

export const cleanBackup = async ({ file, backup, restore = true }) => {
    // copy the file back
    if (restore) await fsUtility.copy(backup, file)

    // delete our backup file that we created
    await fsUtility.del(backup)
}

const writeFile = async ({ args, file, content, relative, spinner }) => {
    spinner.text = `Writing ${file}`

    // construct the backup file path
    const { dir, base } = path.parse(file)
    const backup = path.join(dir, `${base}.serverfiles.backup`)

    // take a backup of the original file
    if (args.full == false) await fsUtility.copy(relative, backup)

    // write the rendered config file
    await fsUtility.write(file, content)

    return backup
}

export default async ({ args, data, files, hooks, spinner }) => {
    // loop through each file and render the variables
    for (const file of files) {
        // construct the paths
        const relative = getRelative(file, 'config')
        const dest = path.join(args.dir, ...relative.split(path.sep))

        // read the file and ensure dest path exists
        let read = await fs.readFile(file, 'utf8')
        await mkdirp(path.dirname(dest))

        // get a list of all variables used
        const varsUsed = read.match(/{.*}/g)

        // loop through each variable used and
        // replace with the value, if the variable
        // is not found we throw an error
        for (let varName of varsUsed || []) {
            // construct the variable name
            varName = varName.slice(1, -1)

            // get the variable value
            const value = data[varName]

            // if the variable is undefined
            if (value == undefined) {
                // code 4: Undefined variable used
                spinner.stop()
                logger.error(
                    `Undefined variable "${varName}" used in file 👇\n${chalk.gray(
                        path.relative(process.cwd(), file),
                    )}`,
                    4,
                )
                process.exit(4)
            } else {
                // replace the variable with the value
                read = read.replace(`{${varName}}`, value)
            }
        }

        // write the file
        const backup = await writeFile({
            args,
            spinner,
            relative,
            file: dest,
            content: read,
        })

        // run hooks for this file
        const hook = executeHook({ args, file, dest, hooks, backup, spinner })

        // await for it if requested in args
        if (args.asyncHooks == false) await promise.handle(hook)

        // clean up the backup file we've made
        await cleanBackup({
            backup,
            file: dest,
            restore: false,
        })
    }
}
