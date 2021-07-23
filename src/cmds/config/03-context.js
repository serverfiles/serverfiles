/*
 *  Injects additional variables read from the operating system.
 *  Created On 16 July 2021
 */

import si from 'systeminformation'

const excluded = ['SERVER_CPU_FLAGS', 'SERVER_CPU_CACHE']

// add() will add the given object
// and a namespace into our data
const add = ({ data, namespace, obj }) => {
    for (const key in obj) {
        // continue to next if the value is empty
        if (Boolean(obj[key]) == false) continue

        // the key name
        const name = `${namespace.toUpperCase()}_${key.toUpperCase()}`

        // only if it's not excluded, add it to our data
        if (excluded.includes(name) == false) data[name] = obj[key]
    }
}

export default async (data, spinner) => {
    // log the status to the spinner
    spinner.text = 'Constructing context'

    // get in system information
    const os = await si.osInfo()
    const cpu = await si.cpu()
    const ram = await si.mem()
    const sys = await si.system()

    // add them one by one
    add({ data, namespace: 'SERVER', obj: os })
    add({ data, namespace: 'SERVER_CPU', obj: cpu })
    add({ data, namespace: 'SERVER_RAM', obj: ram })
    add({ data, namespace: 'SERVER_SYSTEM', obj: sys })
}
