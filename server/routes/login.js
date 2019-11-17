const express = require('express')
const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const app = express()

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDb)=> {
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if( !usuarioDb ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        if( !bcrypt.compareSync(body.password, usuarioDb.password) ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La contraseña no es correcta'
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioDb
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

        res.json({
            ok: true,
            usuario: usuarioDb,
            token: token
        })
    })
})

module.exports = app