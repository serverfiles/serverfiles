/*
 *  Runs a hook and optionally reverts the config to an older
 *  version if the hooks fail (in case we write an invalid config).
 *  Created On 25 July 2021
 */

export default async (args, mod) => {
    // simply skip, if "-r, --run-hooks" is not provided
    if (args.runHooks == false) return

    // try running the hook file
}
