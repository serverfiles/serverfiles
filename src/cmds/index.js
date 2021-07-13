/*
 *  Dynamically load all the commands in this directory.
 *  Created On 13 July 2021
 */

import dirname from 'es-dirname'
import glob from 'glob'
import path from 'path'

export default async program => {
    // grab all files within every folder inside
    // commands directory
    const files = glob
        .sync(path.join(dirname(), '**', 'index.js'))
        .filter(file => path.dirname(file) != dirname())

    // loop through each command and load it
    for (const file of files) {
        const { default: cmd } = await import(file)
        program.addCommand(cmd)
    }
}
