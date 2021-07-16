/*
 *  Dynamically generates config files and installs them.
 *  Created On 13 July 2021
 */

import { Command } from 'commander'
import path from 'path'

import getConfig from '../../config/index.js'
import getFiles from './files.js'
import sync from './sync.js'
import getVariables from './variables.js'
import write from './write.js'

const action = async args => {
    // read the serverfiles.yml file in the current directory
    const config = await getConfig()

    // do "git clone" or "git pull" on the
    // inherited repositories
    await sync(config, args)

    // construct a global variables object
    // with overrides and inherits
    const data = await getVariables(config)

    // get a list of all config files including their
    // overrides from inherited repositories
    const files = await getFiles(args)

    // render the file with the variables
    // and write to disk
    await write({ args, config, data, files })
}

export default new Command()
    .name('config')
    .description('dynamically 🪄 generates config files & installs')
    .action(action)
    .helpOption('-h, --help', 'this message 📖')
    .option('-n, --no-sync', 'do not 🙅‍♂️ sync inherited repositories')
    .option(
        '-d, --dir <path>',
        'directory to write 📂 config files to',
        path.join(process.cwd(), 'rendered'),
    )
    .option(
        '-r, --run-hooks',
        'run ⚓️ hooks after writing config files',
        false,
    )
    .option('-f, --full', 'write all 💯 config files including inherits', false)
