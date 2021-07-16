/*
 *  Dynamically generates config files and installs them.
 *  Created On 13 July 2021
 */

const { Command } = require('commander')

const getConfig = require('../../config/index')
const sync = require('./sync')
const getVariables = require('./variables')

const action = async args => {
    // read the serverfiles.yml file in the current directory
    const config = await getConfig()

    // do "git clone" or "git pull" on the
    // inherited repositories
    await sync(config, args)

    // construct a global variables object
    // with overrides and inherits
    const variables = await getVariables(config)
}

module.exports = new Command()
    .name('config')
    .description('dynamically 🪄 generates config files & installs')
    .action(action)
    .helpOption('-h, --help', 'this message 📖')
    .option('-d, --dir', 'directory to write 📂 config files to')
    .option('-r, --run-hooks', 'run ⚓️ hooks after writing config files')
    .option('-f, --full', 'write all 💯 config files including inherits')
    .option('-n, --no-sync', 'do not 🙅‍♂️ sync inherited repositories')
