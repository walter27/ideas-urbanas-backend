const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var email_math = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,"Correo electrónico inválido."];

var userSchema = new mongoose.Schema({
    
    name: {type: String, required: true, maxlength: [20, "El nombre debe contener a lo sumo 30 caracteres."] },
    last_name: {type: String, maxlength: [50, "Apellidos demasiado largos."] },
    email: {type: String, required: "El correo es obligatorio.", match: email_math },

    password: {type: String, minlength: [6, "La contraseña debe contener al menos 6 caracteres."] },
    password_changed: Boolean
});

//hashing a password before saving it to the database
userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

module.exports = userSchema;