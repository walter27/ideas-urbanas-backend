const Joi = require('@hapi/joi');

const loginValidation = data => {
    
    const schema = {
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    };

    return Joi.validate(data, schema);
}

const forgotPasswordValidation = data => {
    
    const schema = {
        email: Joi.string().min(6).required().email()
    };

    return Joi.validate(data, schema);
}

const forceChangePasswordValidation = data => {
    
    const schema = {
        password: Joi.string().min(6).required()
    };

    return Joi.validate(data, schema);
}


module.exports.loginValidation = loginValidation;
module.exports.forgotPasswordValidation = forgotPasswordValidation;
module.exports.forceChangePasswordValidation = forceChangePasswordValidation;