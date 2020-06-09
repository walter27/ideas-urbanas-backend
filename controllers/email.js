var nodemailer = require('nodemailer'); // email sender function 
const ConfigModel = require('../models/config');


async function sendEmail(data) {

    var user = await ConfigModel.findOne({name: 'EMAIL'});
    var pass = await ConfigModel.findOne({name: 'EMAIL_PASS'});

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user.value,
            pass: pass.value
        }
    });

    var mailOptions = {
        from: data.from, //'"Sales Funnel Company" <foo@blurdybloop.com>'
        to: data.to,     //Destinatario
        subject: data.subject, //Asunto
        text: data.content     //Contenido 
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error){
            return error;
        } else {
            return true;
        }
    });

};


module.exports = {
    sendEmail
}