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
const write = async ({ dest, content, sudo }) => {
    if (sudo) {
        await execa(`sudo mkdir -p "${path.dirname(dest)}"`, {
            shell: true,
            stdin: 'inherit',
        })
        const operation = execa(`sudo tee "${dest}"`, { shell: true })
        operation.stdin.write(content)
        operation.stdin.end()
        await operation
    } else {
        await mkdirp(path.dirname(dest))
        const { error } = await promise.handle(
            writeFile(dest, content, 'utf-8'),
        )

        if (error) {
            // code 5: failed to write the file
            console.log(`Failed to write the config file 👇`)
            console.log(dest)
            console.log(error)
            process.exit(5)
        }
    }
}

// copies a file and uses root
// privileges if no permissions
const copy = async ({ src, dest, sudo }) => {
    if (sudo) {
        await execa(`sudo cp "${src}" "${dest}"`, {
            shell: true,
        })
    } else {
        await copyFile(src, dest)
    }
}

// deletes a file and uses root
// privileges if no permissions
const del = async ({ file, sudo }) => {
    if (sudo) {
        await execa(`sudo rm "${file}"`, {
            shell: true,
        })
    } else {
        fs.promises.unlink(file)
    }
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
