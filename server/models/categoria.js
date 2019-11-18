const mongoose = require('mongoose')
const Schema = mongoose.Schema

let categoriaSchema = new Schema({
    descripcion:{
        type: String,
        unique: true,
        required: [true, 'La descripción es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario'
    }
})

module.exports = mongoose.model('categoria', categoriaSchema)