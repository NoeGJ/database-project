const express = require('express');
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const query = require('./routes/queries');

const port = 9000;

app.use(cors());
app.use(bodyParser.json());

app.get('/modalidad', query.getNombreModalidades);
app.get('/students', query.getStudents);


app.post('/createStudent', query.createStudent);
app.delete( '/deleteStudent', query.deleteStudent );

// app.get('/API', (req, res) => {
//     db.any('SELECT codigo,nombre,carrera FROM ALUMNO WHERE edad = "sada"')
//     .then( (data) => {
//         console.log(data);
//         //res.send(data);
//         res.send("Holaa");
//     } )
//     .catch( (error) => {
//         console.log(error);
//     } )
// });



app.listen(port, () => {
    console.log( 'App running on port ' + port );

});

