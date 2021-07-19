/*
 *  Logs variables if -l, --log-variables is provided.
 *  Created On 18 July 2021
 */

import Table from 'cli-table'

const excluded = ['SERVER_CPU_FLAGS', 'SERVER_CPU_CACHE']

const excludeKeys = data => {
    for (const key of excluded) delete data[key]
    return data
}

export default async (args, data) => {
    // simply skip if the flags weren't provided
    if (Boolean(args.logVariables) == false) return

    // sort keys in data
    data = Object.keys(data)
        .sort()
        .reduce((obj, key) => {
            obj[key] = data[key]
            return obj
        }, {})

    // delete a few which are either
    // insecure to print, or cause
    // formatting problems
    data = excludeKeys(data)

    // create a new table
    const table = new Table({
        chars: {
            top: '',
            'top-mid': '',
            'top-left': '',
            'top-right': '',
            bottom: '',
            'bottom-mid': '',
            'bottom-left': '',
            'bottom-right': '',
            left: '',
            'left-mid': '',
            mid: '',
            'mid-mid': '',
            right: '',
            'right-mid': '',
            middle: ' ',
        },
        style: { 'padding-left': 0, 'padding-right': 3 },
        head: ['Name', 'Value'],
    })

    // add items
    for (const key in data) table.push([key, data[key]])

    // print the table
    console.log(table.toString())

    // stop execution here by exiting
    process.exit(0)
}
