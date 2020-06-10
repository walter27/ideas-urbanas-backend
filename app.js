const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');

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
const csvFile = require('./routes/fileCSV');

const mongoose = require('mongoose');
mongoose.connect(process.env.URLDB, { useNewUrlParser: true })
    .then(() => {
        console.log('Conexion a la base de datos realizada');
        app.listen(process.env.PORT, () => console.log(`The server is running ${process.env.PORT}!`))
    })
    .catch((err) => {
        console.log(err);
    })


// cargar middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const { verifyAdmin } = require('./verifyToken');

// cors
app.use(cors());

// compress all responses
app.use(compression());

// Routes
app.use('/user', verifyAdmin, user);
app.use('/config', verifyAdmin, config);
app.use('/server', verifyAdmin, server);
app.use('/provincia', verifyAdmin, provincia);
app.use('/canton', verifyAdmin, canton);
app.use('/research', verifyAdmin, research);
app.use('/clasification', verifyAdmin, clasification);
app.use('/origin', verifyAdmin, origin);
app.use('/variable', verifyAdmin, variable);
app.use('/data', verifyAdmin, data);
app.use('/tag', verifyAdmin, tag);
app.use('/indicator', verifyAdmin, indicator);


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
app.use('/getCSV', csvFile);