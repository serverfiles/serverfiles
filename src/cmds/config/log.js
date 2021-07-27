/*
 *  Configures Ora and itivrutaha and handles verbose output.
 *  Created On 24 July 2021
 */

import ora from 'ora'

import { logger } from '../../logger.js'

export default ({ quiet, verbose }) => {
    // create an ora spinner
    const spinner = ora({
        color: 'yellow',
        text: 'Reading serverfiles.yml file',
        hideCursor: true,
        isSilent: quiet || verbose,
    }).start()

    return {
        spinner,
        log: msg => (verbose ? logger.info(msg) : (spinner.text = msg)),
        warn: msg => {
            spinner.clear()
            logger.warning(msg)
        },
        error: (msg, code) => {
            spinner.stop()
            logger.error(msg, code)
        },
        success: msg => {
            spinner.stop()
            logger.success(msg)
        },
    }
}
