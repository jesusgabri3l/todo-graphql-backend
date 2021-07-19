const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string().required().alphanum().trim(false).min(3).max(15),
    password: Joi.string().required().alphanum().trim(false).min(6).max(15),
})

module.exports = schema