// importamos los datos de la conexción 
var conn = require('./connection');
// importamos el paquete mysql
var mysql = require('mysql');
// Verifying a Password
const bcrypt = require('bcrypt');
// Creamos la conexcion a nuestra base de datos con los datos almacenados en conn
connection = mysql.createConnection(
    conn
);
// Creamos un objeto al que llamaremos usuarios 
var usuarios = {};

//Obetenemos todos los usuarios
usuarios.getUsuarios = function(callback) {
    if (connection) {
        connection.query('SELECT * FROM users', function(error, rows) {
            if(error) {
                throw error;
            } else {
                callback(null, rows);
            }
        });
    }
}

// Obtenemos usuario por medio de sus credenciales
usuarios.getUsuarioByUsernameAndPassword = function(username, password, callback) {
    if(connection) {
        var username = connection.escape(username);
        var sql = 'SELECT * FROM users WHERE username=' + username;
        connection.query(sql, function(error, row) {
            if(error) {
                throw error;
            } else {
                if (row.length !== 0) {
                    var hash = row[0]['password'];
                    bcrypt.compare(password, hash)
                    .then(function(res) {
                        res === true ?
                            callback(null, row)
                        :
                            callback(null, null)
                    });
                } else {
                    callback(null, null)
                }
            }
        });      
    }
}

// Unidades DataSource
// Obtenemos las unidades de una empresa en base a su usuario
usuarios.getUnidadesByEmpresa = function(empresaID, callback) {
    if(connection) {
        var sql = ' SELECT * FROM users_unidades INNER JOIN unidad ON unidad.ID = users_unidades.ID_unidad WHERE users_unidades.ID_empresa = ' + empresaID;
        connection.query(sql, function(error, rows) {
            if (error) {
                throw error;
            } else {
                callback(null, rows);
            }
        })
    }
}


// Obtenemos el reporte de la unidad seleccionada en base a fechas *** incompleto
// Parametros Fecha de Inicio, Fecha Final, Empresa ID y data de validacion(usuarioID).
usuarios.getReporteByUnidad = function(fechaInicio, fechaFinal, unidadID, callback) {
    var fechaInicio = connection.escape(fechaInicio);
    var fechaFinal = connection.escape(fechaFinal);
    if(connection) {
        var sql = 'SELECT * FROM reporte WHERE (fecha BETWEEN '+fechaInicio+' AND '+fechaFinal+') AND imei = '+ unidadID;
        connection.query(sql, function(error, rows) {
            if (error) {
                throw error;
            } else {
                callback(null, rows)
            }
        });
    }
}


// reporte de gas
usuarios.getOilByUnidad = function(fechaInicio, fechaFinal, unidadID, callback) {
    var fechaInicio = connection.escape(fechaInicio);
    var fechaFinal = connection.escape(fechaFinal);
    if(connection) {
        var sql = 'SELECT * FROM reporte WHERE (fecha BETWEEN '+fechaInicio+' AND '+fechaFinal+') AND oil != 0 AND imei = '+ unidadID;
        connection.query(sql, function(error, rows) {
            if (error) {
                throw error;
            } else {
                callback(null, rows)
            }
        });
    }
}

//Obtenemos un usuario por su id
usuarios.getUsuarioById = function(id,callback) {
    if(connection) {
        var sql = 'SELECT * FROM users WHERE id = ' + connection.escape(id);
        connection.query(sql, function(error, row) {
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
        });
    }
}

//Añadir un nuevo usuario
usuarios.insertUsuario = function(usuarioData,callback) {
    if (connection) {
        connection.query('INSERT INTO usuarios SET ?', usuarioData, function(error, result) {
            if(error) {
                throw error;
            } else {
                //devolvemos el id del usuario insertado
                callback(null, result.insertId);
            }
        });
    }
}

//Actualizar un usuario
usuarios.updateUsuario = function(datosUsuario, callback) {
    if(connection) {
        var sql = 'UPDATE usuarios SET nombre = ' + connection.escape(datosUsuario.nombre)  +' WHERE id = ' + datosUsuario.id;
        connection.query(sql, function(error, result) {
            if(error) {
                throw error;
            } else {
                callback(null,{"mensaje":"Actualizado"});
            }
        });
    }
}

//Eliminar un usuario por su id
usuarios.deleteUsuario = function(id, callback) {
    if(connection) {
        var sql = 'DELETE FROM usuarios WHERE id = ' + connection.escape(id);
        connection.query(sql, function(error, result) {
            if(error) {
                throw error;
            } else {
                callback(null,{"mensaje":"Borrado"});
            }
        });
    }
}

module.exports = usuarios;