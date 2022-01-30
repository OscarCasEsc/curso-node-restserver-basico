const {Role, Categoria} = require('../models');
const Producto = require('../models/producto');
const Usuario = require('../models/usuario');


const esRolValido = async (rol='') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }

}

const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error(`El correo: ${correo} ya está registrado`);
    }
}

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
}

const existeCategoriaPorId = async(id) => {
    const categoria = await Categoria.findById(id);
    if(!categoria){
        throw new Error(`El id ${id} no existe`);
    }
}

const existeProductoPorId= async(id) => {
    const existeProducto = await Producto.findById(id);
    if(!existeProducto){
        throw new Error(`El id ${id} no existe`);
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}