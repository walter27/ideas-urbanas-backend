const Joi = require('@hapi/joi');

const addValidation = data => {

    const schema = {
        name: Joi.string().min(3).required(),
        type: Joi.string().required(),
        description: Joi.optional(),
        chart_type: Joi.string().required(),
        id_Clasification: Joi.string().required(),
        origins: Joi.optional(),
        values_indice: Joi.optional(),
        active: Joi.boolean(),
        is_indice: Joi.boolean(),
        //lamnda: Joi.optional(),

    };

    return Joi.validate(data, schema);
}


const updateValidation = data => {

    const schema = {
        name: Joi.string().min(3).required(),
        type: Joi.string().required(),
        description: Joi.optional(),
        chart_type: Joi.string().required(),
        id_Clasification: Joi.string().required(),
        origins: Joi.optional(),
        values_indice: Joi.optional(),
        active: Joi.boolean(),
        is_indice: Joi.boolean(),
        //lamnda: Joi.optional()

    };

    return Joi.validate(data, schema);
}

module.exports.addValidation = addValidation;
module.exports.updateValidation = updateValidation;