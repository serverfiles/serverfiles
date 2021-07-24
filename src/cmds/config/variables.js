/*
 *  Logs variables if -l, --log-variables is provided.
 *  Created On 18 July 2021
 */

import Table from 'cli-table'

export default async ({ args, data, log }) => {
    // simply skip if the flags weren't provided
    if (Boolean(args.logVariables) == false) return

    // stop the spinner
    log.spinner.stop()

    // sort keys in data
    data = Object.keys(data)
        .sort()
        .reduce((obj, key) => {
            obj[key] = data[key]
            return obj
        }, {})

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
