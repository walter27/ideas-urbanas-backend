const Joi = require('@hapi/joi');

const addValidation = data => {
    
    const schema = {
        name: Joi.string().min(3).required(),
        description: Joi.optional(),
        code: Joi.string().regex(/^\d+$/).required(),
        active: Joi.boolean().required(),
        id_Provincia: Joi.string().required(),
        url: Joi.string().required(),
        color: Joi.optional()
    };

    return Joi.validate(data, schema);
}


const updateValidation = data => {
    
    const schema = {
        name: Joi.string().min(3).required(),
        description: Joi.optional(),
        code: Joi.string().regex(/^\d+$/).required(),
        active: Joi.boolean().required(),
        id_Provincia: Joi.string().required(),
        url: Joi.string().required(),
        color: Joi.optional()
    };

    return Joi.validate(data, schema);
}

module.exports.addValidation = addValidation;
module.exports.updateValidation = updateValidation;