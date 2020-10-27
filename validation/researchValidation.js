const Joi = require('@hapi/joi');

const addValidation = data => {

    const schema = {
        title: Joi.string().required(),
        author: Joi.string().required(),
        year: Joi.string().required(),
        link: Joi.string().required(),
        category: Joi.string().required(),
        id_Canton: Joi.string().required(),
        //active: Joi.boolean()

    };

    return Joi.validate(data, schema);
}


const updateValidation = data => {

    const schema = {
        title: Joi.string().required(),
        author: Joi.string().required(),
        year: Joi.string().required(),
        link: Joi.string().required(),
        category: Joi.string().required(),
        id_Canton: Joi.string().required(),
        //active: Joi.boolean()
    };

    return Joi.validate(data, schema);
}

module.exports.addValidation = addValidation;
module.exports.updateValidation = updateValidation;