/*
    Puerto
*/

process.env.PORT = process.env.PORT || 3000;

/*
    Entorno
*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

/*
    Vencimiento del token
*/

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

/*
    seed de autenticacion
*/

process.env.SEED = process.env.SEED || 'secret'

/*
    Base de datos
*/

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}
else{
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB

/*
    Google client id
*/

process.env.CLIENT_ID = process.env.CLIENT_ID || '107223522356-1g7psnmklj6m1b6e5rms2jmr3dqnuvlp.apps.googleusercontent.com'