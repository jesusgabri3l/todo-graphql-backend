const Joi = require('joi');

const schema = Joi.object({
    title: Joi.string().required().trim(true).min(3).max(30),
    description: Joi.string().required().trim(true).min(10).max(50)
})

module.exports = schema