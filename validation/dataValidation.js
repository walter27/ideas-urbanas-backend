const Joi = require('@hapi/joi');

const addValidation = data => {
    
    const schema = {
        value: Joi.number(),
        description: Joi.optional(),
        year: Joi.number(),
        id_Variable: Joi.string().required(),
        id_Canton: Joi.string().required()
    };

    return Joi.validate(data, schema);
}


const updateValidation = data => {
    
    const schema = {
        value: Joi.number(),
        description: Joi.optional(),
        year: Joi.number(),
        id_Variable: Joi.string().required(),
        id_Canton: Joi.string().required()
    };

    return Joi.validate(data, schema);
}

module.exports.addValidation = addValidation;
module.exports.updateValidation = updateValidation;