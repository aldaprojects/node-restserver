const express = require('express')

let { verificaToken } = require('../middlewares/autenticacion')

let app = express()

let Categoria = require('../models/categoria')


/**
 * Mostrar todas las categorias
 */

app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec( (err, categorias) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        Categoria.count({}, (err, total) => {
            res.json({
                ok: true,
                categorias,
                total
            })
        })
    })  
})

/**
 * Mostrar una categoria por ID
 */

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id

    Categoria.findById(id, (err, categoria) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if ( !categoria ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }
        res.json({
            ok: true,
            categoria
        })
    })

})

/**
 * Crear nueva categoria
 */

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario
    })

    categoria.save( (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

/**
 * Actualizar la categoria
 */

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id
    let descripcion = req.body.descripcion

    Categoria.findByIdAndUpdate(id, {descripcion}, {new : true, runValidators: true}, (err, categoria) => {  
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoria){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no enctrada'
                }
            })
        }

        res.json({
            ok: true,
            categoria
        })

    })

})

/**
 * Eliminar categoria
 */

app.delete('/categoria/:id', verificaToken, (req, res) => {
    // solo un admin puede borrar cat y el token y eliminar fisicamente
    let usuario = req.usuario
    if( usuario.role == 'ADMIN_ROLE') {

        let id = req.params.id

        Categoria.findByIdAndRemove(id, (err, categoria) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if( !categoria ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Categoria no encontrada'
                    }
                })
            }
            
            res.json({
                ok: true,
                categoriaBorrada: categoria
            })
        })

    }
    else{
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }
})


module.exports = app