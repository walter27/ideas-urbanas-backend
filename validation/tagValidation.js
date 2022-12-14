const Joi = require('@hapi/joi');

const addValidation = data => {

    const schema = {
        id_Canton: Joi.string().required(),
        id_Word: Joi.string().required()

    };

    return Joi.validate(data, schema);
}


const updateValidation = data => {

    const schema = {
        id_Canton: Joi.string().required(),
        id_Word: Joi.string().required(),

    };

    return Joi.validate(data, schema);
}

module.exports.addValidation = addValidation;
module.exports.updateValidation = updateValidation;