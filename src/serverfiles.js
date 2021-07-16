#!/usr/bin/env node
/*
 *  Entry executable file for serverfiles CLI.
 *  Created On 13 July 2021
 */

import { Command } from 'commander'

import config from './cmds/config/index.js'

// create a new command line interface
const program = new Command()
    .name('serverfiles')
    .helpOption('-h, --help', 'this message 📖')
    .option('-V, --verbose', 'show additional 🔬 output')
    .addHelpCommand(true, 'help 📖 for a given command')
    .addCommand(config)

const main = async () => {
    // parse the command line arguments
    await program.parseAsync(process.argv)
}

main()
