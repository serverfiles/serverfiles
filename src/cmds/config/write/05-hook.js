/*
 *  Runs a hook and optionally reverts the config to an older
 *  version if the hooks fail (in case we write an invalid config).
 *  Created On 25 July 2021
 */

import { promise } from '@vasanthdeveloper/utilities'
import execa from 'execa'

export default async (args, { hook, sudo }) => {
    // simply skip, if "-r, --run-hooks" is not provided
    // or if there's no hook file
    if (args.runHooks == false) return true
    if (Boolean(hook) == false) return true

    // use with sudo or without sudo accordingly
    const prefix = sudo ? 'sudo' : ''

    // run the command
    const { error } = await promise.handle(
        execa(`${prefix} bash ${hook}`, { shell: true }),
    )

    return Boolean(error)
}
