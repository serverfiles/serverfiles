/*
 *  Loads a list of handlebars config files and their
 *  hooks and return an array of array with path to hbs and bash file.
 *  Created On 24 July 2021
 */

import glob from 'glob'
import path from 'path'

import { logger } from '../../../logger.js'

// uses glob to get all hbs templates and
// bash hook files and returns them sorted
const getFiles = () =>
    glob
        // get the immediate modules
        .sync(path.join('modules', '*', `*.{hbs,bash}`))

        // now recursively grab all modules within inherits
        .concat(
            glob.sync(
                path.join('inherits', '**', 'modules', '*', `*.{hbs,bash}`),
            ),
        )

        // make the paths absolute
        .map(file => path.join(process.cwd(), file))

        // sort them from shortest to longest in ascending order
        .sort((a, b) => a.length - b.length)

const getRelative = hbs => {
    const split = hbs.split('/modules/')
    split.shift()
    return '/' + split.join(path.sep)
}

const filterOverrides = files => {
    logger.verbose('Filtering modules to be written')
    const returnable = []

    // loop through all handlebars files and
    // pick the latest one
    for (const hbs of files) {
        // get it's relative path from modules folder
        const relative = getRelative(hbs)

        // filter same file across all inherits
        const otherFiles = files.filter(f => f.endsWith(relative))

        // pull the shortest one
        const shortest = otherFiles.reduce((a, b) =>
            a.length > b.length ? b : a,
        )

        returnable.push(shortest)
    }

    // return our array by filtering duplicates
    return Array.from(new Set(returnable))
}

const formatFiles = files => {
    logger.verbose('Binding files with hooks')
    const returnable = []

    // filter all hbs files and
    // loop through each file and prepare our object
    for (const hbs of files.filter(f => path.parse(f).ext == '.hbs')) {
        // check if there's a hook file tied to this hbs file
        const relative = getRelative(hbs).slice(0, -4)

        // check if there's a bash file
        const hook = files
            .filter(f => path.parse(f).ext == '.bash')
            .find(f => getRelative(f).slice(0, -5) == relative)

        returnable.push({
            file: hbs,
            hook: hook,
        })
    }

    return returnable
}

export default async log => {
    log.log('Estimating execution')

    // get all module files from this repository
    // and then inherits including both bash scripts
    // and handlebar templates
    let files = getFiles()

    // filter overrides by eliminating the duplicate
    // files with same module and filename
    files = filterOverrides(files)

    // format the files in the form of array
    // of objects with their hbs file and bash file
    files = formatFiles(files)

    return files
}
