/*
 *  Reads all handlebars files and compiles them into plain text.
 *  Created On 25 July 2021
 */

import fs from 'fs/promises'
import grayMatter from 'gray-matter'
import hbs from 'handlebars'

export default async ({ data, files }) => {
    const returnable = []

    for (const file of files) {
        // read the file
        let text = await fs.readFile(file.file, 'utf-8')

        // parse handlebars
        const template = hbs.compile(text, { noEscape: true })
        text = template(data)

        // parse front-matter
        const { content, data: props } = grayMatter(text)

        // push a new module definition into our returnable
        returnable.push({
            ...props,
            ...{
                content: content.trim() + '\n',
                file: file.file,
                hook: file.hook,
            },
        })
    }

    return returnable
}
