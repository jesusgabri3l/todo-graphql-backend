const Joi = require('joi');

const schemaUpdate = Joi.object({
    username: Joi.string().required().alphanum().trim(false).min(3).max(15),
    name: Joi.string().required().min(8).max(15)
})

module.exports = {schemaUpdate}