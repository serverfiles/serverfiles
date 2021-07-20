/*
 *  Renders the variables and writes the files to disk.
 *  Created On 16 July 2021
 */

import { promise } from '@vasanthdeveloper/utilities'
import execa from 'execa'
import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'

import { getRelative } from './04-files.js'
import { executeHook } from './05-hooks.js'

export const cleanBackup = async ({ file, backup, restore = true }) => {
    // copy the file back
    if (restore) await fs.promises.copyFile(backup, file)

    // delete our backup, use sudo if required
    // to delete the backup file
    const { error: noWrite } = await promise.handle(
        fs.promises.access(backup, fs.constants.W_OK),
    )
    if (noWrite) {
        await execa(`sudo rm "${backup}"`, {
            shell: true,
        })
    } else {
        await fs.promises.unlink(backup)
    }
}

const writeFile = async ({ args, file, content, relative }) => {
    // check if the file is readable if not, simply
    // throw an error
    // code 5: config file not readable
    const { error: noRead } = await promise.handle(
        fs.promises.access(file, fs.constants.R_OK),
    )
    if (noRead) return console.log(`Could not read ${file} skipping it`)

    // take a backup of the original file
    const { dir, base } = path.parse(file)
    const backup = path.join(dir, `${base}.serverfiles.backup`)

    // check if we have write permission, if we have
    // write using the current user, else elevate to sudo
    // and use bash to execute copy operation
    const { error: noWrite } = await promise.handle(
        fs.promises.access(file, fs.constants.W_OK),
    )
    if (noWrite) {
        if (args.full == false)
            await execa(`sudo cp "${relative}" "${backup}"`, {
                shell: true,
            })
        const operation = execa(`sudo tee "${file}"`, { shell: true })
        operation.stdin.write(content)
        operation.stdin.end()
        await operation
    } else {
        if (args.full == false) await fs.promises.copyFile(relative, backup)
        await fs.promises.writeFile(file, content, 'utf-8')
    }

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
