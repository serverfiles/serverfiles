/*
 *  Reads all files within the config directories recursively
 *  and returns a list of all files found in order of their base files.
 *  Created On 16 July 2021
 */

import { promise } from '@vasanthdeveloper/utilities'
import fs from 'fs/promises'
import glob from 'glob'
import path from 'path'

export const getRelative = path => {
    // construct the relative path of the file
    const split = path.split('/config/')
    split.shift()
    return '/' + split.join('/')
}

export default async args => {
    const files = glob.sync(path.join(process.cwd(), '**', 'config', '**'), {
        nodir: true,
    })

    let returnable = []

    for (const file of files) {
        // get relative path of the file
        const relative = getRelative(file)

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
