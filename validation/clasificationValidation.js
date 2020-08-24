const Joi = require('@hapi/joi');

const addValidation = data => {

    const schema = {
        name: Joi.string().min(3).required(),
        description: Joi.optional(),
        active: Joi.boolean().required(),

    };

    return Joi.validate(data, schema);
}


const updateValidation = data => {

    const schema = {
        name: Joi.string().min(3).required(),
        description: Joi.optional(),
        active: Joi.boolean()

    };

    return Joi.validate(data, schema);
}

module.exports.addValidation = addValidation;
module.exports.updateValidation = updateValidation;