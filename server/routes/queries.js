const { response } = require('express');
const express = require('express');
const pgp = require('pg-promise')();

const connection = {
    host: 'localhost',
    port: 5432,
    database: 'titulacion',
    user: 'postgres',
    password: 'pass',
};
const db = pgp(connection);

const getNombreModalidades = (req, res) => {
    db.any('SELECT nombre FROM modalidad_titulacion ORDER BY id_mod ASC')
    .then( (data) => {
        res.send(data);
        
    })
    .catch( (error) => {
        res.send(error);
    })

};

const createStudent = (req, res) => {
    const [ estatus, student  ] = req.body;
    const { name, folio, age, genre, code, career, ingreso, egreso } = student
    const { graduated, startDate, endDate, average, type } = estatus
    

    db.one('SELECT id_mod from modalidad_titulacion WHERE nombre = $1 ', [ type ])
    .then( ( { id_mod } ) => db.one('INSERT INTO estatus (titulado, inicio_titulacion, fin_titulacion, calificacion, id_mod1) VALUES ($1, $2, $3, $4, $5) returning id_estatus', 
      [graduated, startDate, endDate, average, id_mod])
       .then( ( { id_estatus } ) => db.none('INSERT INTO alumno (codigo, folio, nombre, sexo, edad, carrera, ciclo_ingreso, ciclo_egreso, id_estatus1) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', 
       [code, folio, name,  genre, age , career, ingreso, egreso, id_estatus])
       .then(() => {
        console.log("success");
        res.status(201).json({
            message: "success",
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(201).json({
            message: "error",
        });
      })
       
       ));
};

const getStudents = (req, res) => {
    db.any('SELECT * FROM alumno JOIN estatus on id_estatus = id_estatus1;')
    .then( (data) => {
        res.send(data);
    } )
    .catch( (error) => {
        res.send(error);
    } )
};


const deleteStudent = (req, res) => {
    const[ id ] = req.body;
    db.one('DELETE FROM alumno WHERE codigo = $1 returning id_estatus', [id])
    .then( ({ id_estatus } ) => db.none( 'DELETE FROM estatus WHERE id_estatus = $1', [ id_estatus ]))
    .then( () => {
        console.log('success');
        res.status(201).json({
            message: "success",
        });
    })
    .catch( (err) => {
        console.log(err)
        res.status(201).json({
            message: "error",
        });
    });

};

module.exports = {
    getNombreModalidades,
    createStudent,
    getStudents,
    deleteStudent,
}
