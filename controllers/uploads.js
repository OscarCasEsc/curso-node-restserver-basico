const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto} = require('../models');
const { model } = require('mongoose');

const cargarArchivo = async (req, res = response) => {

    //txt, md
    try{
        const nombreCompleto = await subirArchivo(req.files, ['txt', 'md' ], 'textos');

        res.json({
            nombre: nombreCompleto
        })
    }catch(msg){
        res.status(400).json({msg})
    }
   
}

const actualizarImagen = async (req, res = response) => {
    const {id, coleccion} = req.params;

    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    try {
        // Limpiar imagenes previas
        if(modelo.img) {
            // Hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);
            if(fs.existsSync(pathImagen)){
                fs.unlinkSync(pathImagen);
            }
        }

        const nombre = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = nombre;
        await modelo.save();
        res.json({
            modelo
        });
    }catch(msg){
        res.json({msg});
    }
        
   

    
}

const actualizarImagenCloudinary = async (req, res = response) => {
    const {id, coleccion} = req.params;

    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    
    // Limpiar imagenes previas
    if(modelo.img) {
        const nombreArr =  modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length-1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }
    const { tempFilePath }= req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
    modelo.img = secure_url;
    await modelo.save();
    /*
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;*/
    res.json({
        modelo
    });
        
   

    
}

const mostrarImagen = async (req, res=response) => {
    const {id,coleccion} = req.params;
    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    try {
        // Limpiar imagenes previas
        if(modelo.img) {
            // Hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);
            if(fs.existsSync(pathImagen)){
                return res.sendFile(pathImagen);
            }
        }
        const pathImagen = path.join(__dirname,'../assets','no-image.jpg');
        return res.sendFile(pathImagen);
    }catch(msg){
        res.json({msg});
    }
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}