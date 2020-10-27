const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const path = require('path');


require('./config/config')

//Auth
const auth = require('./routes/auth');

app.use(express.static('images'));

//Admin
const user = require('./routes/user');
const config = require('./routes/config');
const server = require('./routes/server');
const provincia = require('./routes/provincia');
const canton = require('./routes/canton');
const research = require('./routes/research');
const clasification = require('./routes/clasification');
const origin = require('./routes/origin');
const variable = require('./routes/variable');
const data = require('./routes/data');
const tag = require('./routes/tag');
const indicator = require('./routes/indicator');

//Public
const inicio = require('./routes/inicio');
const charts = require('./routes/charts');
const category = require('./routes/category');
const reports = require('./routes/reports');
const file = require('./routes/file');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/idesdb', { useNewUrlParser: true })
    .then(() => {
        console.log('Conexion a la base de datos realizada');
        app.listen(process.env.PORT, () => console.log(`The server is running ${process.env.PORT}!`))
    })
    .catch((err) => {
        console.log(err);
    })


// cargar middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));


const { verifyAdmin } = require('./verifyToken');

// cors
app.use(cors());

// compress all responses
app.use(compression());

// Routes
app.use('/user', user);
app.use('/config', config);
app.use('/server', server);
app.use('/provincia', provincia);
app.use('/canton', canton);
app.use('/research', research);
app.use('/clasification', clasification);
app.use('/origin', origin);
app.use('/variable', variable);
app.use('/data', data);
app.use('/tag', tag);
app.use('/indicator', indicator);


// Routes Public
app.use('/charts', charts);
app.use('/category', category);
app.use('/auth', auth);
app.use('/', inicio);
app.use('/images', inicio);
app.use('/logo', inicio);
app.use('/reports', reports);
app.use('/addTag', inicio);


//Lists
app.use('/getVariableByClasification', inicio);
app.use('/getResearchsByCatAndCant', inicio);
app.use('/loadJSON', inicio);
app.use('/getTagsByCantByType', inicio);
app.use('/getStopwords', inicio);
app.use('/api', inicio);
app.use('/file', file);