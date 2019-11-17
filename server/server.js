require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Configuracion global de las rutas
app.use( require('./routes/index' ))

mongoose.connect(process.env.URLDB, 
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, 
    (err, resp) => {
    if( err ) throw err;

    console.log('Base de datos online');
})
 
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto ', process.env.PORT);
}) 