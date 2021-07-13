/*
 *  Dynamically generates config files and installs them.
 *  Created On 13 July 2021
 */

const { Command } = require('commander')

const getConfig = require('../../config/index')

const action = async args => {
    // read the serverfiles.yml file in the current directory
    const config = await getConfig()

    console.log(config)
}

module.exports = new Command()
    .name('config')
    .description('dynamically 🪄 generates config files & installs')
    .action(action)
    .option('-d, --dir', 'directory to write config files to')
    .option('-r, --run-hooks', 'run hooks after writing config files')
    .option('-f, --full', "write config files even if they don't exist on root")
