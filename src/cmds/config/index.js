/*
 *  Dynamically generates config files and installs them.
 *  Created On 13 July 2021
 */

import { Command } from 'commander'
import path from 'path'

import getConfig from '../../config/index.js'
import sync from './01-sync.js'
import getVariables from './02-variables.js'
import context from './03-context.js'
import getLogger from './log.js'
import logVariables from './variables.js'
import write from './write/index.js'

const action = async (args, cmd) => {
    // pull global args
    args = { ...args, ...cmd.parent.opts() }

    // initialize the logger
    const log = getLogger(args)

    // read the serverfiles.yml file in the current directory
    const config = await getConfig({ log })

    // do "git clone" or "git pull" on the
    // inherited repositories
    await sync({ args, config, log })

    // construct a global variables object
    // with overrides and inherits
    const data = await getVariables({ config, log })

    // read system information and populate
    // some known context information
    await context({ data, log })

    // log all the variables loaded into context
    // which helpful to debug if a variable is not found
    await logVariables({ args, data, log })

    await write({ args, data, log })

    // tell the user we have completed writing
    log.success('Finished writing configuration files')
}

export default new Command()
    .name('config')
    .description('dynamically 🪄 generates config files & installs')
    .action(action)
    .helpOption('-h, --help', 'this message 📖')
    .option('-l, --log-variables', 'print a table 📋 of variables & exit')
    .option('-n, --no-sync', 'do not 🙅‍♂️ sync inherited repositories')
    .option('-f, --full', 'write all 💯 config files including inherits', false)
    .option(
        '-d, --dir <path>',
        'directory to write 📂 config files to',
        path.join(process.cwd(), 'config'),
    )
    .option(
        '-r, --run-hooks',
        'run ⚓️ hooks after writing config files',
        false,
    )
    .option('-a, --async-hooks', 'run hooks ⚡️ asynchronously', false)
