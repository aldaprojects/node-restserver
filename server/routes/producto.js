const express = require('express')


const { verificaToken } = require('../middlewares/autenticacion')

let app = express()
let Producto = require('../models/producto')


/**
 * Buscar productos
 */
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino

    let regex = new RegExp(termino, 'i')

    Producto.find({nombre: regex})
    .populate('categoria', 'descripcion')
    .exec((err, productos) =>{
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            productos
        })
    })
})


/**
 * Obtener productos
 */
app.get('/producto', verificaToken, (req, res) => {

    let desde = Number(req.query.desde) || 0
    let hasta = Number(req.query.hasta) || 5

    //trae todos los productos
    //populate: usuario categoria
    //paginado
    Producto.find({disponible: true})
    .limit(hasta)
    .skip(desde)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        Producto.count({disponible: true}, (err, total) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productos,
                total
            })
        })
    })
})

/**
 * Obtener un producto por id
 */
app.get('/producto/:id', verificaToken, (req, res) => {
    //por id
    //populate: usuario categoria
    let id = req.params.id

    Producto.findById(id, (err, producto) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto
        })
    })
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
})

/**
 * Crear un producto
 */
app.post('/producto', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let body = req.body
    let usuario = req.usuario

    let producto = new Producto({
        nombre: body.nombre,
        precioUni : body.precioUni,
        categoria: body.categoria,
        usuario
    })

    producto.save((err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok : false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })

    
})

/**
 * Actualizar producto por id
 */
app.put('/producto/:id', verificaToken, (req, res) => {
    // actualizar por id
    let id = req.params.id
    let body = req.body

    Producto.findByIdAndUpdate(id, body, {new : true, runValidators: true}, (err, producto) => {

        if( err ){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if( !producto ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }
        
        res.json({
            ok: true,
            producto
        })

    })
})

/**
 * Borrar un producto
 */
app.delete('/producto/:id', verificaToken, (req, res) => {
    // debe existir fiscamente, disponile -> false
    let id = req.params.id
    
    Producto.findByIdAndUpdate(id, {disponible: false}, {new : true}, (err, producto) => {

        if( err ){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if( !producto ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }
        
        res.json({
            ok: true,
            producto
        })

    })
})

module.exports = app