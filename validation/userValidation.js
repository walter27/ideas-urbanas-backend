const Joi = require('@hapi/joi');

const addValidation = data => {
    
    const schema = {
        name: Joi.string().max(20).required(),
        last_name: Joi.optional(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().required()
    };

    return Joi.validate(data, schema);
}


const updateValidation = data => {
    
    const schema = {
        name: Joi.string().max(20).required(),
        last_name: Joi.optional(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().required()
    };

    return Joi.validate(data, schema);
}

const update_passwordValidation = data => {
    
    const schema = {
        password: Joi.string().min(6).required(),
        password_new: Joi.string().min(6).required(),
        password_confirmation: Joi.any().valid(Joi.ref('password_new')).required().options({ language: { any: { allowOnly: 'Las contraseñas deben coincidir.' } } })
    };

    return Joi.validate(data, schema);
}

module.exports.addValidation = addValidation;
module.exports.updateValidation = updateValidation;
module.exports.update_passwordValidation = update_passwordValidation;