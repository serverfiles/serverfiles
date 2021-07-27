/*
 *  Reads all handlebars files and compiles them into plain text.
 *  Created On 25 July 2021
 */

import { promise } from '@vasanthdeveloper/utilities'
import chalk from 'chalk'
import { highlight } from 'cli-highlight'
import fs from 'fs/promises'
import grayMatter from 'gray-matter'
import hbs from 'handlebars'
import Joi from 'joi'
import yaml from 'js-yaml'

import { logger } from '../../../logger.js'

const modSchema = Joi.object({
    name: Joi.string(),
    dest: Joi.string().required(),
    content: Joi.string().required(),
    executables: Joi.array().items(Joi.string()),
    file: Joi.string().required(),
    hook: Joi.string(),
    sudo: Joi.bool().default(false),
})

export default async ({ data, files, log }) => {
    logger.verbose('Starting parse modules')
    const returnable = []

    for (const file of files) {
        // read the file
        let text = await fs.readFile(file.file, 'utf-8')

        // parse handlebars
        const template = hbs.compile(text, { noEscape: true })
        text = template(data)

        // parse front-matter
        const { content, data: props } = grayMatter(text)

        const mod = {
            ...props,
            ...{
                content: content.trim() + '\n',
                file: file.file,
                hook: file.hook,
            },
        }

        // validate the module definition for any potentially
        // invalid properties
        const { error, returned } = await promise.handle(
            modSchema.validateAsync(mod),
        )

        if (error) {
            // code 4: invalid properties for a config file
            log.error(
                `Invalid property ${error.message} in 👇\n${chalk.gray.dim(
                    file.file,
                )}\n\n${highlight(
                    yaml.dump(props, {
                        indent: 4,
                    }),
                    {
                        language: 'yaml',
                    },
                )}`,
                4,
            )
        }

        // push a new module definition into our returnable
        returnable.push(returned)
    }

    return returnable
}
