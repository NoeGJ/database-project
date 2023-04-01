/* eslint-disable react-hooks/rules-of-hooks */
import './add_user.css';

import { useEffect, useState } from 'react';
import { Box, TextField, FormControl, Select, MenuItem, InputLabel, Paper, Button, Checkbox, FormControlLabel, Collapse, Divider, Typography, Snackbar, Alert } from '@mui/material';
import { LocalizationProvider, DateField } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import SaveIcon from '@mui/icons-material/Save';


let listModalidad = [];

const Add_user = () => {
    
    //Hooks
    const [nombre, setNombre] = useState("");
    const [edad, setEdad] = useState(0);
    const [codigo,setCodigo] = useState('');

    const [career, setCareer] = useState('');
    const [sexo, setSexo] = useState('');
    const [folio, setFolio] = useState('');
    
    const [cicloIngreso, setCicloIngreso] = useState(null);
    const [calendarioIngreso, setCalendarioIngreso] = useState('');
    
    const [checked, setChecked] = useState(false);

    const [inicioTitulo, setInicioTitulo] = useState(null);
    const [finTitulo, setFinTitulo] = useState(null);

    const [cicloEgreso, setCicloEgreso] = useState(null);
    const [calendarioEgreso, setCalendarioEgreso] = useState('');

    const[mod, setMod] = useState("");
    const[puntaje, setPuntaje] = useState(0);

    const[success, setSuccess] = useState(false);
    const[error, setError] = useState(false);

    //Events
    const handleChangeCareer = (event) => {
        setCareer(event.target.value);
      };
    
      const handleChangeSexo = (event) => {
        setSexo(event.target.value);
      };

      const handleChangeCheckBox = (event) => {
        setChecked(event.target.checked);

        setInicioTitulo(null);
        setFinTitulo(null);
        setCalendarioEgreso('');
        setCicloEgreso(null);
        setMod("");
        setPuntaje(0);

      };

      const handleChangePuntaje = (event) => {
        console.log(event.target.value);
        setPuntaje(event.target.value);
      };

      const handleChangeMod = (event) => {
        setMod(event.target.value);
      };
      
      const handleClickSave = () => {
        //const cicloIngreso.format('YYYY') || '';
        //alert( cicloEgreso.format('L') ==  'Invalid Date' ? "Verdad" : "fALSE" );
        alert(  "aa"   );
        fetchInsert();


      };

      const handleCloseSuccess = (event, reason) => {
          if( reason === 'clickaway' )
            return;
            setSuccess(false);
      };

      const handleCloseError = (event, reason) => {
          if( reason === 'clickaway' )
            return;
            setError(false);
      };

      
      const fetchInsert = async () => {
        const startDate = inicioTitulo === null ? null :  inicioTitulo.format('YYYY-MM-DD');
        const endDate = finTitulo === null ? null :  finTitulo.format('YYYY-MM-DD');
        const egresoDate = cicloEgreso === null ? '' : cicloEgreso.format('YYYY');
        const IngresoDate = cicloIngreso === null ? '' : cicloIngreso.format('YYYY');
          
        let bodyPost = [
          ('estatus', {"graduated": checked, "startDate":   startDate, "endDate":  endDate, "average": puntaje, "type": mod }),
          ('student', {"name": nombre, "folio": folio, "age": edad, "genre": sexo, "code": codigo, "career": career, "egreso":  egresoDate + calendarioEgreso, "ingreso": IngresoDate + calendarioIngreso})
        ];
          const res = await  fetch('http://localhost:9000/createStudent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
          mode: 'cors',
          body: JSON.stringify( bodyPost )
       })

       if(res.ok){
          setSuccess(true);
       }
        else{
          setError(true);
        }

      };

      
      const fetchMod = async () => {
        listModalidad = await (await fetch('http://localhost:9000/modalidad')).json();
        console.log(listModalidad);
      };

      useEffect( () => {
          fetchMod();
      }, [] )


      const status = (
        <div>
          <Divider />
          <LocalizationProvider dateAdapter={AdapterDayjs} >
          <DateField label="Inicio de la titulación" variant='standard' format='DD/MM/YYYY' value={inicioTitulo} onChange={ (newValue) => setInicioTitulo(newValue) }  />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs} >
          <DateField variant='standard' label="Finalización de la titulación" format='DD/MM/YYYY' value={finTitulo} onChange={ (newValue) => setFinTitulo(newValue) } />
          </LocalizationProvider>


          <Paper component="form" variant='inlined' sx={{display: 'flex', alignItems: 'center' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} >
          <DateField variant='standard' label="Ciclo de egreso" format='YYYY' value={cicloEgreso} onChange={ (newValue) => setCicloEgreso(newValue) }  />
          </LocalizationProvider>
          
          <Divider orientation="vertical" sx={{height: 28, mt: 2, ml: -2, mr: 2}} />
          
          <FormControl variant='standard'>
          <Select
          required
          sx={{mt: 2, ml: -2}}
          value={calendarioEgreso}
          onChange={ (event) => setCalendarioEgreso(event.target.value) }
        
          >
          <MenuItem value={""}>Selecciona</MenuItem>
          <MenuItem value={"A"}>A</MenuItem>
          <MenuItem value={"B"}>B</MenuItem>
          </Select>
          </FormControl>
          </Paper>

          <TextField 
          required
          type="number"
          variant='standard'
          label='Puntaje obtenido'
          value={puntaje}
          onChange={handleChangePuntaje}
          />

          <FormControl variant='standard' sx={{m:2, minWidth: 400}}>
          <InputLabel>Modalidad de titulación</InputLabel>
          <Select
          required
          value={mod}
          onChange={handleChangeMod}
          >
          <MenuItem  key={''} value={""}>Seleccione</MenuItem>
          {listModalidad.map( ( {nombre}, index ) => (
          <MenuItem key={index} value={nombre} >{nombre}</MenuItem>
          ))} 

          </Select>
          </FormControl>

        </div>

      );


      return(
      
        <div className='app-new-user'>
        
            <Box component={Paper} sx={{ backgroundColor: 'white', padding: 5, '& .MuiTextField-root': {m: 2, ml: 5}, mb: 1,   display: 'inline-block' }} elevation={3}>
            <Typography variant='h4'> Registro </Typography>
            <Divider sx={{mt: 3}} />
    <div className='components-add-user'>
    <TextField
    required
    label="Nombre"
    variant='standard'
    value={nombre}
    onChange={ (event) => setNombre(event.target.value) }
    />

    <TextField
    required
    label="Edad"
    variant='standard'
    type="number"
    value={edad}
    onChange={ (event) => setEdad(event.target.value) }
    />

<FormControl variant='standard' sx={{m:2, minWidth: 120}}>
    <InputLabel>Sexo</InputLabel>
    <Select
      required
      value={sexo}
      label="Sexo"
      onChange={handleChangeSexo}
    >
      <MenuItem  value=''>Seleccione</MenuItem>
      <MenuItem value={'H'}>Hombre</MenuItem>
      <MenuItem value={'F'}>Mujer</MenuItem>
    </Select>
    </FormControl>
    </div>

    <div className='components-add-user'>
    <TextField
          required
          label="Codigo"
          variant='standard'
          value={codigo}
          onChange={ (event) => setCodigo(event.target.value) }
    />

    <FormControl variant='standard' sx={{m:2, minWidth: 120}}>
    <InputLabel>Carrera</InputLabel>
    <Select
      required
      value={career}
      label="Carrera"
      onChange={handleChangeCareer}
    >
      <MenuItem  value=''>Seleccione</MenuItem>
      <MenuItem value={'INNI'}>INNI</MenuItem>
      <MenuItem value={'INCO'}>INCO</MenuItem>
      <MenuItem value={'INCE'}>INCE</MenuItem>
      <MenuItem value={'INBI'}>INBI</MenuItem>
      <MenuItem>TOP</MenuItem>
      <MenuItem>QUI</MenuItem>
      <MenuItem>QFB</MenuItem>
      <MenuItem>MEL</MenuItem>
      <MenuItem>MAT</MenuItem>
      <MenuItem>LQFB</MenuItem>
      <MenuItem>LIMA</MenuItem>
      <MenuItem>LIFI</MenuItem>
      <MenuItem>LCMA</MenuItem>
      <MenuItem>INDU</MenuItem>

    </Select>
    </FormControl>
    
    <TextField 
      required
      label="Folio"
      variant='standard'
      value={folio}
      onChange={ (event) => setFolio(event.target.value) }
    />


    <Paper component="form" variant='inlined' sx={{display: 'flex', alignItems: 'center' }}>
    <LocalizationProvider dateAdapter={AdapterDayjs} >
    <DateField variant='standard' label="Ciclo de ingreso" format='YYYY' value={cicloIngreso} onChange={ (newValue) => setCicloIngreso(newValue) }  />
    </LocalizationProvider>

    <Divider orientation="vertical" sx={{height: 28, mt: 2, ml: -2, mr: 2}} />
    
    <FormControl variant='standard'>
    <Select
    required
    sx={{mt: 2, ml: -2}}
    value={calendarioIngreso}
    onChange={ (event) => setCalendarioIngreso(event.target.value) }
    >
          <MenuItem value="">Seleccione</MenuItem>
          <MenuItem value={"A"}>A</MenuItem>
          <MenuItem value={"B"}>B</MenuItem>
    </Select>
    </FormControl>
    </Paper>
    </div>
    <div className='components-add-user'>
    
      <FormControlLabel control={<Checkbox checked={checked} onChange={handleChangeCheckBox}  />} label="Titulado"  labelPlacement='start'/>
    

    </div>
    <div className='components-add-user'>
        <Collapse in={checked}>{status}</Collapse>
      </div>
    <div>
      <Button variant='contained' onClick={handleClickSave}  endIcon={<SaveIcon/>}>Save</Button>
    </div>
    <Snackbar open={success} autoHideDuration={10000} onClose={handleCloseSuccess} >
        <Alert onClose={handleCloseSuccess} severity="success" sx={ { width: "100%" } }>
          Se a agregado un nuevo elemento a la lista
        </Alert>
    </Snackbar>
    
    <Snackbar open={error} autoHideDuration={10000} onClose={handleCloseError} >
        <Alert onClose={handleCloseError} severity="error" sx={ { width: "100%" } }>
          Ha habido un error al agregar un elemento
        </Alert>
    </Snackbar>
    </Box>
    
    </div>
);
}

export default Add_user;