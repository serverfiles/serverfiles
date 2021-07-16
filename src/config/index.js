/*
 *  Loads the serverfiles.yml file in the current directory
 *  and returns the configuration object.
 *  Created On 13 July 2021
 */

import { promise } from '@vasanthdeveloper/utilities'
import fs from 'fs/promises'
import yaml from 'js-yaml'
import path from 'path'

import schema from './schema.js'

export default async (dir = process.cwd()) => {
    // attempt to read the serverfiles.yml file
    const file = path.join(dir, 'serverfiles.yml')
    let { error, returned: read } = await promise.handle(
        fs.readFile(file, 'utf8'),
    )

    // handle errors
    if (error) {
        console.log('No serverfiles.yml file found in')
        console.log(dir)
        process.exit(2) // No serverfiles.yml file found
    }

    // parse the yaml file
    const config = yaml.load(read)

    // validate the config file
    error = (await promise.handle(schema.validateAsync(config))).error
    if (error) {
        console.log(`Invalid property ${error.message} in serverfiles.yml`)
        process.exit(3) // Invalid property in serverfiles.yml
    }

    // return the config object
    return config || {}
}
