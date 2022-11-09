const Joi = require('@hapi/joi');

const addValidation = data => {

    const schema = {
        text: Joi.string().required(),
        type: Joi.string().required()
    };

    return Joi.validate(data, schema);
}

const updateValidation = data => {

    const schema = {
        text: Joi.string().required(),
        type: Joi.string().required()
    };

    return Joi.validate(data, schema);
}

module.exports.addValidation = addValidation;
module.exports.updateValidation = updateValidation;