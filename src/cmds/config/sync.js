/*
 *  Sync changes of the repositories.
 *  Created On 14 July 2021
 */

import utilities from '@vasanthdeveloper/utilities'
import execa from 'execa'
import fs from 'fs/promises'
import mkdirp from 'mkdirp'
import { basename, join, parse } from 'path'

import getConfig from '../../config/index.js'

// actually runs the git command to pull or clone a repo
const executeCmd = async ({ parents, name, operation, cmd, inheritsPath }) => {
    parents.push(name)

    // log a message that we're syncing
    console.log(`${operation} ${join(...parents)}`)
    await execa(cmd, {
        cwd: inheritsPath,
        shell: true,
    })
}

const syncRepo = async ({ url, basePath, parents, args }) => {
    // sync the current one
    let { name } = parse(url)
    if (name.startsWith('serverfiles-'))
        name = name.replace(/serverfiles-/g, '')

    // construct the paths
    const inheritsPath = join(basePath, 'inherits')
    const repoPath = join(inheritsPath, name)

    // check if the repo is already cloned
    const { error } = await utilities.promise.handle(fs.stat(repoPath))

    // decide the command & log message depending on the error
    const cmd = error ? `git clone ${url} ${name}` : `git pull`
    const operation = error ? 'Pulling' : 'Syncing'

    // ensure the inherits directory exists
    await mkdirp(inheritsPath)

    // only clone if it doesn't exist
    if (args.sync == true) {
        await executeCmd({
            parents,
            name,
            operation,
            cmd,
            inheritsPath,
        })
    } else {
        if (error) {
            await executeCmd({
                parents,
                name,
                operation,
                cmd,
                inheritsPath,
            })
        }
    }

    // now that we know this repo is updated
    // go into another repo and sync the inherits
    const config = await getConfig(repoPath)

    // recursively call itself for each inherits
    if (Boolean(config) == false) return
    if (config.inherits) {
        for (const url of config.inherits)
            await syncRepo({ url, args, parents, basePath: repoPath })
    }
}

export default async (config, args) => {
    // if this is an independent repo, we simply skip
    if (Boolean(config.inherits) == false) return

    // loop through each inherits repo and pull
    // or clone it depending on whether they exist
    for (const url of config.inherits)
        await syncRepo({
            url,
            args,
            basePath: process.cwd(),
            parents: [basename(process.cwd())],
        })
}
