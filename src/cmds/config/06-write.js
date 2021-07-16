/*
 *  Renders the variables and writes the files to disk.
 *  Created On 16 July 2021
 */

import fs from 'fs/promises'
import mkdirp from 'mkdirp'
import path from 'path'

import { getRelative } from './04-files.js'
import { executeHook } from './05-hooks.js'

export default async ({ args, data, files, hooks }) => {
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
        for (let varName of varsUsed) {
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
        await fs.writeFile(dest, read, 'utf-8')

        // run hooks for this file
        const promise = executeHook({ args, file, hooks })

        // await for it if requested in args
        if (args.asyncHooks == false) await promise
    }
}
