//Importamos express
var express = require('express');
//Creamos el objeto para definir las rutas
var router = express.Router();
//Importamos el modelo que ejecutará las sentencias SQL
var usuariosModel = require('../models/usuarios');

// Coger todos los usuarios
router.get('/usuarios', function(request, response) {
    usuariosModel.getUsuarios(function(error, data) {
        response.status(200).json(data);
    });
});

// Coger un usuario por medio de sus credenciales
router.get('/auth', function(request, response) {
    var username = request.query.username;
    var password = request.query.password;
    usuariosModel.getUsuarioByUsernameAndPassword(username, password, function(error, datos) {
        if(datos) {
            response.status(200).json(datos);
        } else {
            response.status(400).json({'msg': '¡usuario o contraseña no valida!'});
        }
    });
});

// Unidades DataSource
//Coger unidades por id de empresa
router.get('/unidades', function(request, response) {
    var id = request.query.empresaID;
    usuariosModel.getUnidadesByEmpresa(id,function(error, datos) {
        if (datos.length > 0) {
            response.status(200).json(datos);
        } else {
            response.status(400).json({'msg': 'No cuenta con unidades'});
        }
    });
});


//Coger informacion de reportes por unidad seleccionada dentro de los campos establecidos
// Parametros Fecha de Inicio, Fecha Final, Empresa ID y data de validacion(usuarioID). 
router.get('/reporte', function(request, response) {
    //var usuarioID = request.query.usuario;
    var fechaInicio = request.query.fechaInicio;
    var fechaFinal = request.query.fechaFinal;
    var unidadID = request.query.unidadID;

    usuariosModel.getReporteByUnidad(fechaInicio, fechaFinal, unidadID,function(error, datos) {
        if (datos.length > 0) {
            response.status(200).json(datos);
        } else {
            response.status(404).json({"Mensaje": "Nada de nada"});
        }
    });
});

// Reporte de gas
router.get('/oil', function(request, response) {
    //var usuarioID = request.query.usuario;
    var fechaInicio = request.query.fechaInicio;
    var fechaFinal = request.query.fechaFinal;
    var unidadID = request.query.unidadID;

    usuariosModel.getOilByUnidad(fechaInicio, fechaFinal, unidadID,function(error, datos) {
        if (datos.length > 0) {
            response.status(200).json(datos);
        } else {
            response.status(404).json({"Mensaje": "Nada de nada"});
        }
    });
});

//Coger usuario por id
router.get('/usuario', function(request, response) {
    var id = request.query.id;
    usuariosModel.getUsuarioById(id,function(error, datos) {
        if (datos.length > 0) {
            response.status(200).json(datos);
        } else {
            response.status(400).json({'msg': "No existe"});
        }
    });
});

// Insertar usuario
// Ejemplo de uso: en el Body: { "nombre": "Usuario de Prueba" }
router.post('/usuario', function(request, response) {
    var datosUsuario = {
        id : null,
        nombre : request.body.nombre
    };
    usuariosModel.insertUsuario(datosUsuario,function(error, datos) {
        if(datos) {
            response.status(200).json({"Mensaje":"Insertado"});
        } else {
            response.status(500).json({"Mensaje":"Error"});
        }
    });
});

//Modificar un usuario
router.put('/usuario', function(request, response) {
    var datosUsuario = {
        id: request.query.id,
        nombre: request.query.nombre
    };
    usuariosModel.updateUsuario(datosUsuario,function(error, datos) {
        //si el usuario se ha actualizado correctamente mostramos un mensaje
        if(datos && datos.mensaje) {
            response.status(200).json(datos);
        } else {
            response.status(500).json({"mensaje":"Error"});    
        }
    });
});

//Borrar un usuario
router.delete('/usuario', function(request, response) {
    var id = request.query.id;
    usuariosModel.deleteUsuario(id,function(error, datos) {
        if(datos && datos.mensaje === "Borrado") {
            response.status(200).json(datos);
        } else {
            response.status(500).json({"mensaje":"Error"});
        }
    });
});

module.exports = router;