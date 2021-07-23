/*
 *  Load the variables from different serverfiles.yml files.
 *  Created On 15 July 2021
 */

import merge from 'deepmerge'
import fs from 'fs/promises'
import glob from 'glob'
import yaml from 'js-yaml'
import path from 'path'

export default async (config, spinner) => {
    // setting spinner text
    spinner.text = 'Constructing variables'

    // get all serverfiles.yml files and sort them
    // by picking the deepest file first
    const files = glob
        .sync(path.join(process.cwd(), 'inherits', '**', 'serverfiles.yml'))
        .sort((a, b) => b.length - a.length)

    // the variable where we'll store merged variables
    let variables = {}

    // loop over all serverfiles.yml files and
    // merge the variables from all of them
    for (const file of files) {
        // read and parse YAML file
        const parsed = await yaml.load(await fs.readFile(file, 'utf-8'))

        // conditions where we should skip to next one
        if (Boolean(parsed) == false) continue
        if (Boolean(parsed.variables) == false) continue

        // merge the variables from the current file
        variables = merge(variables, parsed.variables)
    }

    // finally override these variables with the
    // config variables
    variables = merge(variables, config.variables || {})

    return variables
}
