const Joi = require('@hapi/joi');

const addValidation = data => {
    
    const schema = {
        name: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
        id_Canton: Joi.string().required()
    };

    return Joi.validate(data, schema);
}


const updateValidation = data => {
    
    const schema = {
        name: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
        id_Canton: Joi.string().required()
    };

    return Joi.validate(data, schema);
}

module.exports.addValidation = addValidation;
module.exports.updateValidation = updateValidation;