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


app.post('/getStudent', query.getStudent);
app.post('/createStudent', query.createStudent);

app.put('/updateStudent', query.updateStudent);

app.delete( '/deleteStudent', query.deleteStudent );


app.listen(port, () => {
    console.log( 'App running on port ' + port );

});

