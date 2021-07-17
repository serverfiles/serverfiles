/*
 *  Attaches commands to the program & checks whether we're
 *  running in production ie. compiled binary or using node.
 *  Created On 17 July 2021
 */

import path from 'path'

import * as config from './cmds/config/index.js'

// checks if it's a binary we're running
// or if we're running as node to determine
// if we're in production or not
const isProd = () => {
    const exe = path.basename(process.argv[0])
    exe == 'node' ? (global.CLI_PROD = false) : (global.CLI_PROD = true)
    if (exe == 'node') {
        return false
    } else {
        return true
    }
}

export default async program => {
    // the function that adds a new command
    const addCommand = (cmd, onlyProd = false) => {
        // if there's a prod function exported
        // pass the command to it
        if (isProd()) if (cmd.prod) cmd.prod(cmd.default)

        // if the command is marked only for production
        // then attach it to the program only if we're in production
        if (onlyProd) {
            if (isProd()) program.addCommand(cmd.default)
        } else {
            program.addCommand(cmd.default)
        }
    }

    // link each command
    addCommand(config)
}
