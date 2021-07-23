/*
 *  Loads the serverfiles.yml file in the current directory
 *  and returns the configuration object.
 *  Created On 13 July 2021
 */

import { promise } from '@vasanthdeveloper/utilities'
import chalk from 'chalk'
import fs from 'fs/promises'
import yaml from 'js-yaml'
import path from 'path'

import { logger } from '../logger.js'
import schema from './schema.js'

export default async ({ dir = process.cwd(), spinner }) => {
    // attempt to read the serverfiles.yml file
    const file = path.join(dir, 'serverfiles.yml')
    let { error, returned: read } = await promise.handle(
        fs.readFile(file, 'utf8'),
    )

    // handle errors
    if (error) {
        // code 2: No serverfiles.yml file found in the current directory
        spinner.stop()
        logger.error(
            `Cannot a find serverfiles.yml file in 👇\n${chalk.gray(dir)}`,
            2,
        )
    }

    // parse the yaml file
    const config = yaml.load(read)

    // validate the config file
    error = (await promise.handle(schema.validateAsync(config))).error
    if (error) {
        // code 3: Invalid property in serverfiles.yml
        spinner.stop()
        logger.error(`Invalid property ${error.message} in serverfiles.yml`, 3)
    }

    // return the config object
    return config || {}
}
