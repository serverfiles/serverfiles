#!/usr/bin/env node
/*
 *  Entry executable file for serverfiles CLI.
 *  Created On 13 July 2021
 */

const { Command } = require('commander')
const cmds = require('./cmds/index')

// create a new command line interface
const program = new Command()
    .name('serverfiles')
    .helpOption('-h, --help', 'this message 🤷‍♂️')
    .option('-V, --verbose', 'show additional 🔬 output')
    .addHelpCommand(true, 'help 📖 for a given command')

const main = async () => {
    // link all commands to the program
    await cmds(program)

    // parse the command line arguments
    await program.parseAsync(process.argv)
}

main()
