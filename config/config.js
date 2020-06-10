//=====================================================
//                     puerto
//======================================================
process.env.PORT = process.env.PORT || 3000;

//=====================================================
//                     entorno
//======================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=====================================================
//                     verificacion del token
//======================================================
//60 segundos
//60 minutos
//24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '48h';




//=====================================================
//                     sedd de autenticacion
//======================================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//=====================================================
//                     Base de Datos
//======================================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/idesdb';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;