/*
 *  Schema validation for a serverfiles.yml file.
 *  Created On 13 July 2021
 */

const Joi = require('joi')

module.exports = Joi.object({
    inherit: Joi.string(),
})
