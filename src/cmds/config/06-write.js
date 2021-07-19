/*
 *  Renders the variables and writes the files to disk.
 *  Created On 16 July 2021
 */

import { promise } from '@vasanthdeveloper/utilities'
import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'

import { getRelative } from './04-files.js'
import { executeHook } from './05-hooks.js'

export const restoreBackup = async (file, backup) => {
    // copy the file back
    await fs.promises.copyFile(backup, file)

    // delete our backup
    await fs.promises.unlink(backup)
}

const writeFile = async (file, content, relative) => {
    // check if the file already exists
    const { error: exists } = await promise.handle(fs.promises.stat(file))

    // check if the file has write perms
    // if not throw an error
    if (Boolean(exists) == false) {
        const { error: noAccess } = await promise.handle(
            fs.promises.access(file, fs.constants.W_OK),
        )
        if (noAccess) {
            // code 5: elevated privileges required
            console.log(
                `Elevated privileges required to write to 👇 please use sudo\n${file}`,
            )
            process.exit(5)
        }
    }

    // take a backup of the original file
    const { dir, base } = path.parse(file)
    const backup = path.join(dir, `${base}.serverfiles.backup`)
    await fs.promises.copyFile(relative, backup)

    // write the file
    await fs.promises.writeFile(file, content, 'utf-8')

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
        const backup = await writeFile(dest, read, relative)

        // run hooks for this file
        const hook = executeHook({ args, file, dest, hooks, backup })

        // await for it if requested in args
        if (args.asyncHooks == false) await promise.handle(hook)
    }
}
