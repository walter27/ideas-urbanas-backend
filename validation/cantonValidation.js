const Joi = require('@hapi/joi');

const addValidation = data => {

    const schema = {
        name: Joi.string().min(3).required(),
        description: Joi.optional(),
        code: Joi.string().regex(/^\d+$/).required(),
        is_intermediate: Joi.boolean().required(),
        covid: Joi.boolean(),
        indexes: Joi.boolean(),
        id_Provincia: Joi.string().required(),
        url: Joi.string(),
        color: Joi.optional()
    };

    return Joi.validate(data, schema);
}


const updateValidation = data => {

    const schema = {
        name: Joi.string().min(3).required(),
        description: Joi.optional(),
        code: Joi.string().regex(/^\d+$/).required(),
        is_intermediate: Joi.boolean(),
        covid: Joi.boolean(),
        indexes: Joi.boolean(),
        id_Provincia: Joi.string().required(),
        url: Joi.string(),
        color: Joi.optional()
    };

    return Joi.validate(data, schema);
}

module.exports.addValidation = addValidation;
module.exports.updateValidation = updateValidation;