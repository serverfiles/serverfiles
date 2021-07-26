/*
 *  Utility wrapper functions for filesystem operations
 *  which elevate to root when required.
 *  Created On 20 July 2021
 */

import { promise } from '@vasanthdeveloper/utilities'
import execa from 'execa'
import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'

const { R_OK } = fs.constants
const { access, copyFile, writeFile } = fs.promises

// attempts to write a file using the current
// thread and falls back to using root privileges
const write = async (file, content) => {
    await mkdirp(path.dirname(file))
    const { error } = await promise.handle(writeFile(file, content, 'utf-8'))

    if (error) {
        const operation = execa(`sudo tee "${file}"`, { shell: true })
        operation.stdin.write(content)
        operation.stdin.end()
        await operation
    }
}

// copies a file and uses root
// privileges if no permissions
const copy = async (src, dest) => {
    // unlike other methods, we first attempt
    // to copy normally & if it fails, we attempt
    // to elevate the permissions
    const { error } = await promise.handle(copyFile(src, dest))

    if (error)
        await execa(`sudo cp "${src}" "${dest}"`, {
            shell: true,
        })
}

// deletes a file and uses root
// privileges if no permissions
const del = async file => {
    const { error } = await promise.handle(fs.promises.unlink(file))

    if (error)
        await execa(`sudo rm "${file}"`, {
            shell: true,
        })
}

// returns a bool on whether we have read
// privileges or not
const isReadable = async file => {
    const { error } = await promise.handle(access(file, R_OK))
    return !error
}

export default {
    write,
    copy,
    del,
    isReadable,
}
