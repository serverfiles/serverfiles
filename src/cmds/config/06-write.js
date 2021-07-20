/*
 *  Renders the variables and writes the files to disk.
 *  Created On 16 July 2021
 */

import { promise } from '@vasanthdeveloper/utilities'
import mkdirp from 'mkdirp'
import path from 'path'

import fs from '../../utilities/fs.js'
import { getRelative } from './04-files.js'
import { executeHook } from './05-hooks.js'

export const cleanBackup = async ({ file, backup, restore = true }) => {
    // copy the file back
    if (restore) await fs.copy(backup, file)

    // delete our backup file that we created
    await fs.del(backup)
}

const writeFile = async ({ args, file, content, relative }) => {
    // check if the file is readable if not, simply
    // throw an error
    if (await fs.isReadable(file))
        return console.log(`Could not read ${file} skipping it`)

    // construct the backup file path
    const { dir, base } = path.parse(file)
    const backup = path.join(dir, `${base}.serverfiles.backup`)

    // take a backup of the original file
    if (args.full == false) await fs.copy(relative, backup)

    // write the rendered config file
    await fs.write(file, content)

    return backup
}

export default async ({ args, data, files, hooks }) => {
    // loop through each file and render the variables
    for (const file of files) {
        // construct the paths
        const relative = getRelative(file, 'config')
        const dest = path.join(args.dir, ...relative.split(path.sep))

        // read the file and ensure dest path exists
        let read = await fs.promises.readFile(file, 'utf8')
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
                throw new Error(
                    `Variable ${varName} not defined used in ${file}`,
                )
            } else {
                // replace the variable with the value
                read = read.replace(`{${varName}}`, value)
            }
        }

        // write the file
        const backup = await writeFile({
            args,
            relative,
            file: dest,
            content: read,
        })

        // run hooks for this file
        const hook = executeHook({ args, file, dest, hooks, backup })

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
