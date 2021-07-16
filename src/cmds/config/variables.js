/*
 *  Load the variables from different serverfiles.yml files.
 *  Created On 15 July 2021
 */

const glob = require('glob')
const path = require('path')
const merge = require('deepmerge')
const fs = require('fs/promises')
const yaml = require('js-yaml')

module.exports = async config => {
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
        const read = await fs.readFile(file, 'utf-8')
        const parsed = await yaml.load(read)
        if (Boolean(parsed) == false) continue
        if (Boolean(parsed.variables) == false) continue

        // merge the variables from the current file
        variables = merge(variables, parsed.variables)
    }

    // finally override these variables with the
    // config variables
    variables = merge(variables, config.variables)

    return variables
}
