/*
 *  Injects additional variables read from the operating system.
 *  Created On 16 July 2021
 */

import si from 'systeminformation'

// add() will add the given object
// and a namespace into our data
const add = ({ data, namespace, obj }) => {
    for (const key in obj) {
        if (Boolean(obj[key]) == false) continue
        data[`${namespace.toUpperCase()}_${key.toUpperCase()}`] = obj[key]
    }
}

export default async data => {
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
