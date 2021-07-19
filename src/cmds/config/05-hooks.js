/*
 *  Gets a list of all hook files corresponding to the loaded config
 *  files and runs a hook file on demand.
 *  Created On 16 July 2021
 */

import { promise } from '@vasanthdeveloper/utilities'
import execa from 'execa'
import path from 'path'

import { getFiles } from './04-files.js'
import { getRelative } from './04-files.js'
import { restoreBackup } from './06-write.js'

// executeHook runs a hook file it's config
// file is passed
export const executeHook = async ({
    args,
    file,
    dest,
    hooks,
    backup,
    fatal = false,
}) => {
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
        execa(`bash "${hook}"`, {
            shell: true,
        }),
    )

    // handle the errors
    if (error) {
        if (fatal == false) {
            console.log(`Failed to run ${path.basename(file)} hooks`)
            console.log('Reverting to previous working config')
            await restoreBackup(dest, backup)

            // re-run the hooks once more
            await executeHook({
                args,
                backup,
                file,
                dest,
                hooks,
                fatal: true,
            })
        } else {
            // todo: show a fatal warning and exit the process
            console.log(
                'the process failed even after reverting to an older config',
            )
            // code 6: failed to restart the service
            process.exit(6)
        }
    }
}

export default getFiles({
    dir: 'hooks',
    fileType: '*.bash',
})
