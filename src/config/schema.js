/*
 *  Schema validation for a serverfiles.yml file.
 *  Created On 13 July 2021
 */

import Joi from 'joi'

export default Joi.object({
    inherits: Joi.array().items(Joi.string()),
    variables: Joi.object(),
})
