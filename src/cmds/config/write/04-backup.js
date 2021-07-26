/*
 *  Write the config file
 *  Created On 25 July 2021
 */

import fsUtility from '../../../utilities/fs.js'

export const backup = async ({ dir }, { path }) => {
    // only write a backup when we're working directly on
    // the root filesystem, else we don't need to
    if (dir != '/') return

    await fsUtility.copy(path, `${path}.serverfiles.backup`)
}

// export const restore = async (modules, restore = true) => {
//     // loop through each module and restore the backup file
//     // in case of failure or simply delete the backup file
//     for (const mod of modules) {
//         const backUpPath = `${mod.path}.serverfiles.backup`
//     }
// }
