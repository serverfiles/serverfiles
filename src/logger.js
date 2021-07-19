/*
 *  Configures itivrutaha logger.
 *  Created On 18 July 2021
 */

import itivrutaha from 'itivrutaha'

export let logger

export default async () => {
    logger = await itivrutaha.createNewLogger({
        appName: 'serverfiles',
        bootLog: false,
        shutdownLog: false,
        verboseIdentifier: ['-V', '--verbose'],
        quietIdentifier: ['-q', '--quiet'],
        theme: {
            string: `:type :message`,
        },
    })
}
