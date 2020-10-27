const Joi = require('@hapi/joi');

const addValidation = data => {

    const schema = {

        id_Variable: Joi.string().required(),
        id_Canton: Joi.string().required(),
        ridit: Joi.number(),
        year: Joi.number(),
    };

    return Joi.validate(data, schema);
}


const updateValidation = data => {

    const schema = {
        id_Variable: Joi.string().required(),
        id_Canton: Joi.string().required(),
        ridit: Joi.number(),
        year: Joi.number(),
    };

    return Joi.validate(data, schema);
}

module.exports.addValidation = addValidation;
module.exports.updateValidation = updateValidation;