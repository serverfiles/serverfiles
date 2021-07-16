/*
 *  Gets a list of all hook files corresponding to the loaded config
 *  files and runs a hook file on demand.
 *  Created On 16 July 2021
 */

import { promise } from '@vasanthdeveloper/utilities'
import execa from 'execa'

import { getFiles } from './04-files.js'
import { getRelative } from './04-files.js'

// executeHook runs a hook file it's config
// file is passed
export const executeHook = async ({ args, file, hooks }) => {
    // skip this function if runHooks flag was
    // not provided
    if (args.runHooks == false) return

    // construct the relative path
    const relativeConfig = getRelative(file, 'config')

    // filter same file across all inherits
    const otherFiles = hooks.filter(f => {
        // get the file name without extension
        f = f.slice(0, -5)
        return f.endsWith(relativeConfig)
    })

    // pull the shortest one
    const hook = otherFiles.reduce((a, b) => (a.length > b.length ? b : a))

    // execute it with sudo
    const { error } = await promise.handle(
        execa(`sudo bash "${hook}"`, {
            shell: true,
        }),
    )

    if (error) {
        console.log(`Failed: ${error.message}`)
    } else {
        // todo: log the text returned as verbose
    }
}

export default getFiles({
    dir: 'hooks',
    fileType: '*.bash',
})
