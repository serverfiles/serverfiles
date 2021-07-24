/*
 *  Sync changes of the repositories.
 *  Created On 14 July 2021
 */

import { promise } from '@vasanthdeveloper/utilities'
import chalk from 'chalk'
import execa from 'execa'
import fs from 'fs/promises'
import mkdirp from 'mkdirp'
import path from 'path'

import getConfig from '../../config/index.js'
import { logger } from '../../logger.js'

// actually runs the git command to pull or clone a repo
const executeCmd = async ({ parents, name, operation, cmd, cwd, spinner }) => {
    parents.push(name)

    // log a message that we're syncing
    spinner.text = `${operation} ${path.join(...parents)}`
    logger.verbose(`Running ${chalk.gray(cmd)} in 👇\n${chalk.gray.dim(cwd)}`)
    await execa(cmd, {
        cwd: cwd,
        shell: true,
    })
}

const syncRepo = async ({ url, basePath, parents, args, spinner }) => {
    // sync the current one
    let { name } = path.parse(url)
    if (name.startsWith('serverfiles-'))
        name = name.replace(/serverfiles-/g, '')

    // construct the paths
    const inheritsPath = path.join(basePath, 'inherits')
    const repoPath = path.join(inheritsPath, name)

    // check if the repo is already cloned
    const { error } = await promise.handle(fs.stat(repoPath))

    // decide the command & log message depending on the error
    const cmd = error ? `git clone ${url} ${name}` : `git pull`
    const operation = error ? 'Pulling' : 'Syncing'

    // ensure the inherits directory exists
    await mkdirp(inheritsPath)

    // only clone if it doesn't exist
    if (args.sync == true) {
        await executeCmd({
            cmd,
            name,
            parents,
            spinner,
            operation,
            cwd: error ? inheritsPath : repoPath,
        })
    } else {
        if (error)
            await executeCmd({
                cmd,
                name,
                parents,
                spinner,
                operation,
                cwd: error ? inheritsPath : repoPath,
            })
    }

    // now that we know this repo is updated
    // go into another repo and sync the inherits
    const config = await getConfig({
        dir: repoPath,
        spinner,
    })

    // recursively call itself for each inherits
    if (Boolean(config) == false) return
    if (config.inherits) {
        for (const url of config.inherits)
            await syncRepo({ url, args, parents, spinner, basePath: repoPath })
    }
}

export default async ({ config, args, spinner }) => {
    // if this is an independent repo, we simply skip
    if (Boolean(config) == false) return
    if (Boolean(config.inherits) == false) return

    // loop through each inherits repo and pull
    // or clone it depending on whether they exist
    for (const url of config.inherits)
        await syncRepo({
            url,
            args,
            spinner,
            basePath: process.cwd(),
            parents: [path.basename(process.cwd())],
        })
}
