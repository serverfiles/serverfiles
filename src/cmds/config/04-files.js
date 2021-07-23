/*
 *  Reads all files within the config directories recursively
 *  and returns a list of all files found in order of their base files.
 *  Created On 16 July 2021
 */

import { promise } from '@vasanthdeveloper/utilities'
import fs from 'fs/promises'
import glob from 'glob'
import path from 'path'

export const getRelative = (file, dir) => {
    // construct the relative path of the file
    const split = file.split(`/${dir}/`)
    split.shift()
    return '/' + split.join('/')
}

export const getFiles =
    ({ dir, fileType }) =>
    async (args, spinner) => {
        spinner.text = 'Estimating execution'

        // grab all config files using globs
        const files = glob.sync(
            path.join(process.cwd(), '**', dir, '**', fileType),
            {
                nodir: true,
            },
        )

        // the variable where we'll store data
        // that we return at the end of this function
        let returnable = []

        for (const file of files) {
            // get relative path of the file
            const relative = getRelative(file, dir)

            // filter same file across all inherits
            const otherFiles = files.filter(f => f.endsWith(relative))

            // pull the shortest one
            const shortest = otherFiles.reduce((a, b) =>
                a.length > b.length ? b : a,
            )

            // check if the file exists on the root filesystem
            const { error } = await promise.handle(fs.stat(relative))

            // if full arg is enabled
            if (args.full) {
                // push the shortest one to our returnable
                returnable.push(shortest)
            } else {
                if (Boolean(error) == false) {
                    // push the shortest one to our returnable
                    returnable.push(shortest)
                }
            }
        }

        // filter duplicates
        returnable = Array.from(new Set(returnable))

        return returnable
    }

export default getFiles({
    dir: 'config',
    fileType: '*',
})
