const jwt = require('jsonwebtoken');

const ConfigModel = require('./models/config');

async function verifyAdmin(req, res, next) {
    const token = req.header('Authorization');

    if (!token) return res.status(400).send({
        code: 'ERROR',
        message: 'Acceso denegado.',
        result: token });
    
    const token_secret = await ConfigModel.findOne({name: 'TOKEN_SECRET'});

    try {
        const verified = jwt.verify(token, token_secret.value);

        if ( !verified.user )
            return res.status(400).send({
                code: 'ERROR',
                message: 'Acceso denegado.',
                result: token });

        next();
    } catch (err) {
        return res.status(400).send({
            code: 'ERROR',
            message: 'Token inválido.',
            result: token });
    }
}



module.exports = {
    verifyAdmin
}