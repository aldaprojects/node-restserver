const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario')
const Producto = require('../models/producto')

const fs = require('fs')
const path = require('path')

// default options
app.use(fileUpload({useTempFiles: true}));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo
    let id = req.params.id

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    //validar tipo
    let tiposValidos = ['productos', 'usuarios']

    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok : false,
            err:{
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
                tipo
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.')
    let extension = nombreCortado[nombreCortado.length-1]

    //extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if(extensionesValidas.indexOf(extension) < 0 ){
        return res.status(400).json({
            ok : false,
            err:{
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                extension
            }
        })
    }


    //Cambiar nombre al archivo

    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`


    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err){

            return res.status(500).json({
                ok : false,
                err
            });
        }

        if ( tipo === 'usuarios') imagenUsuario(id, res, nombreArchivo, tipo)
        else if (tipo === 'productos') imagenProducto(id, res, nombreArchivo, tipo)

    });

})

function imagenUsuario(id, res, nombreArchivo, tipo) {
    Usuario.findById(id, (err, usuario) =>{
        if(err){
            borraArchivo(nombreArchivo, tipo)
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!usuario){
            borraArchivo(nombreArchivo, tipo)
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        borraArchivo(usuario.img, tipo)
        usuario.img = nombreArchivo

        usuario.save((err, usuarioDB) => {
            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo
            })
        })
    })
}   

function imagenProducto(id, res, nombreArchivo, tipo) {

    Producto.findById(id, (err, producto) => {
        if(err){
            borraArchivo(nombreArchivo, tipo)
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!producto){
            borraArchivo(nombreArchivo, tipo)
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }
        
        borraArchivo(producto.img, tipo)

        producto.img = nombreArchivo

        producto.save((err, producto) => {
            res.json({
                ok: true,
                producto,
                img: nombreArchivo
            })
        })

    })
    
}

function borraArchivo( nombreImagen, tipo ) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`)


    if( fs.existsSync(pathImagen) ){
        fs.unlinkSync(pathImagen)
    }
}

module.exports = app