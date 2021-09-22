/*
 *  Write the config file
 *  Created On 25 July 2021
 */

import { promise } from '@vsnthdev/utilities-node'
import chalk from 'chalk'
import fs from 'fs/promises'
import path from 'path'

import { logger } from '../../../logger.js'
import fsUtility from '../../../utilities/fs.js'

export const backup = async ({ dir }, { sudo, name, hook, dest }, log) => {
    // only write a backup when
    // 1. we're working directly on the root filesystem
    // 2. there's a hook file
    if (dir != '/') return
    if (Boolean(hook) == false) return

    // handle when source file doesn't exist
    const { error } = await promise.handle(fs.stat(dest))

    if (error)
        return log.warn(
            `No config found for ${chalk.gray(
                name || path.basename(dest),
            )}, skipping backup`,
        )

    logger.verbose(`Backing up ${chalk.gray(`${dest}.serverfiles.backup`)}`)
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
    logger.verbose(`Cleaning up ${chalk.gray(`${dest}.serverfiles.backup`)}`)
    await fsUtility.del({
        sudo,
        file: backUpPath,
    })
}
