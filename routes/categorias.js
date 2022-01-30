
const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategoria, obtenerCategorias, borrarCategoria, actualizarCategoria } = require('../controllers/categorias');
const { existeCategoria, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();


// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener una categoría por id - publico
router.get('/:id',[
    check('id','No es un id de mongo').isMongoId(), 
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

// Crear categoría - privado - cualquier persona con un token válido
router.post('/',
[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
], crearCategoria
);

// Actualizar - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('id').custom(existeCategoriaPorId),
    validarCampos
],actualizarCategoria);

// Borrar una categoría - Admin

router.delete('/:id',
[validarJWT,
esAdminRole,
check('id','No es un id de mongo válido').isMongoId(),
check('id').custom(existeCategoria),
validarCampos],
borrarCategoria);







module.exports = router;