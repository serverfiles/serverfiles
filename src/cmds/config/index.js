/*
 *  Dynamically generates config files and installs them.
 *  Created On 13 July 2021
 */

import { Command } from 'commander'

const action = async args => {
    console.log('generate and install config files')
}

export default new Command()
    .name('config')
    .description('dynamically 🪄 generates config files & installs')
    .action(action)
    .option('-d, --dir', 'directory to write config files to')
    .option('-r, --run-hooks', 'run hooks after writing config files')
    .option('-f, --full', "write config files even if they don't exist on root")
