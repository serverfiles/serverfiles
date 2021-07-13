/*
 *  Dynamically load all the commands in this directory.
 *  Created On 13 July 2021
 */

const glob = require('glob')
const path = require('path')

module.exports = async program => {
    // grab all files within every folder inside
    // commands directory
    const files = glob
        .sync(path.join(__dirname, '**', 'index.js'))
        .filter(file => path.dirname(file) != __dirname)

    // loop through each command and load it
    for (const file of files) {
        const { default: cmd } = await import(file)
        program.addCommand(cmd)
    }
}
