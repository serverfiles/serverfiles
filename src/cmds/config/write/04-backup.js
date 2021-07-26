/*
 *  Write the config file
 *  Created On 25 July 2021
 */

import { promise } from '@vasanthdeveloper/utilities'
import fs from 'fs/promises'

import fsUtility from '../../../utilities/fs.js'

export const backup = async ({ dir }, { hook, dest, sudo }) => {
    // only write a backup when
    // 1. we're working directly on the root filesystem
    // 2. there's a hook file
    if (dir != '/') return
    if (Boolean(hook) == false) return

    await fsUtility.copy({
        sudo,
        src: dest,
        dest: `${dest}.serverfiles.backup`,
    })
}

export const restore = async ({ dest, sudo }, restore) => {
    // only execute this function when there's a backup file
    const backUpPath = `${dest}.serverfiles.backup`
    const { error } = await promise.handle(fs.stat(backUpPath))
    if (error) return

    // restore the config file
    if (restore)
        await fsUtility.copy({
            dest,
            src: backUpPath,
            sudo,
        })

    // clean up the backup file
    await fsUtility.del({
        sudo,
        file: backUpPath,
    })
}
