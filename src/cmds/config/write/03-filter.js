/*
 *  Filter all loaded modules depending on whether
 *  the executables field contains values or if "-f, --full"
 *  flags are provided.
 *  Created On 25 July 2021
 */

import { promise } from '@vasanthdeveloper/utilities'
import execa from 'execa'

import { logger } from '../../../logger.js'

// first checks if the given executable is installed
// using the which command, if not found we also try
// using sudo because some executables are only visible
// to root user
const isExecutableInstalled = async name => {
    // first try normally
    let { error: normal } = await promise.handle(
        execa(`which "${name}"`, {
            shell: true,
        }),
    )

    // if there's an error, then try once more using root
    if (normal) {
        const { error: sudo } = await promise.handle(
            execa(`sudo which "${name}"`, {
                shell: true,
                stdio: 'pipe',
            }),
        )

        return !sudo
    } else {
        return true
    }
}

const checkExecutables = async ({ executables }) => {
    // if there's no executables field, or it has no values
    // we simply skip this function
    if (Boolean(executables) == false) return true

    // loop through each one of them and run the which command
    const results = []
    for (const exe of executables)
        results.push(await isExecutableInstalled(exe))

    return !results.includes(false)
}

export default async ({ args, modules }) => {
    // simply skip this function if "-f, --full" is provided
    if (args.full) return modules

    logger.verbose('Filtering loaded modules')
    const returnable = []

    // loop through each module
    for (const mod of modules) {
        // if the module contains no filter keys
        if (
            ['executables'].some(key => Object.keys(mod).includes(key)) == false
        )
            continue

        // handle executable field
        if ((await checkExecutables(mod)) == false) return

        // add it to our new list of modules
        returnable.push(mod)
    }

    return returnable
}
