const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };


    const [total, usuarios] = await Promise.all([
        Usuario.find(query)
            .skip((Number(desde)))
            .limit(Number(limite)),
        Usuario.countDocuments(query)
    ]);

    res.json({
        total,
        usuarios
    }
    );
};

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });


    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);
    // Guardar en DB
    await usuario.save();

    res.json(usuario);
}

const usuariosPut = async (req, res = response) => {
    const id = req.params.id;

    const { _id, password, correo, goggle, ...resto } = req.body;

    // TODO valida contra base de datos
    if (password) {
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json(usuario)
}
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controller'
    })
}

const usuariosDelete = async (req, res = response) => {
    const {id} = req.params;

    // Borrado fisico
    //const usuario = await Usuario.findByIdAndDelete(id);

    // Borrado lógico

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    console.log(usuario);
    res.json({usuario});
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}