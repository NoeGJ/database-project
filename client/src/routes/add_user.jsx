import './add_user.css';
import  '../career-List';

import { useEffect, useReducer, useState } from 'react';
import { Box, TextField, FormControl, Select, MenuItem, InputLabel, Paper, Button, Checkbox, FormControlLabel, Collapse, Divider, Typography, Snackbar, Alert } from '@mui/material';
import { LocalizationProvider, DateField } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Link, useNavigate } from 'react-router-dom';

import SaveIcon from '@mui/icons-material/Save';
import dayjs from 'dayjs';
import carreras from '../career-List';

let modList = [];

const initialStateStudent = {
  nombre: '',
  edad: 0,
  codigo: '',
  career: '',
  sexo: '',
  folio: '',
  cicloIngreso: dayjs(new Date()),
  calendarioIngreso: '',
};

const initialStudentValidation = {
  nombre: false,
  edad: false,
  codigo: false,
  career: false,
  sexo: false,
  folio: false,
  cicloIngreso: false,
  calendarioIngreso: false,
};

const initialStateStatus = {
  inicioTitulo: dayjs(new Date()),
  finTitulo: dayjs(new Date()),
  cicloEgreso: dayjs(new Date()),
  calendarioEgreso: '',
  mod: '',
  puntaje: 0,
};

const initialStatusValidation = {
  inicioTitulo: false,
  finTitulo: false,
  cicloEgreso: false,
  calendarioEgreso: false,
  mod: false,
  puntaje: false,
};

const Add_user = () => {
    
    //Hooks
    const navigate = useNavigate();

    const[ formStudent, setFormStudent ] = useReducer( (curVals, newVals) => ({ ...curVals, ...newVals }) ,initialStateStudent);
    const [ formStudentValidation, setFormStudentValidation ] = useReducer( (curVals, newVals) =>  ({...curVals, ...newVals}), initialStudentValidation );

    const [ formStatus, setFormStatus ] = useReducer( (curVals, newVals) => ({ ...curVals, ...newVals }) ,initialStateStatus);
    const [ formStatusValidation, setFormStatusValidation ] = useReducer( (curVals, newVals) =>  ({...curVals, ...newVals}), initialStatusValidation );

    const { nombre, edad, codigo, career, sexo, folio, cicloIngreso, calendarioIngreso  } = formStudent;
    
    const { inicioTitulo, finTitulo, cicloEgreso, calendarioEgreso, mod, puntaje } = formStatus;
    
     const [checked, setChecked] = useState(false);

    const[success, setSuccess] = useState(false);
    const[error, setError] = useState(false);

    const [ disableSave, setDisableSave ] = useState( false );
    const [ disableCancel, setDisableCancel ] = useState( false );

    //Events
    const handleChangeFormStudent = (e) => {
      const { name, value } = e.target;
      setFormStudent( { [name]: value } );

    }

    const handleChangeFormStatus = (e) => {
      const { name, value } = e.target;
      setFormStatus( { [name]: value } );

    }

    const handleBlurDate = (e) => {
      const { name, value } = e.target;
      
      setFormStudentValidation( { [name]:  dayjs(value, 'YYYY' ).isValid()  } );
      
    }

    const handleBlurStatusDate = (e) => {
      const { name, value } = e.target;
      setFormStatusValidation( { [name]:  dayjs(value, 'DD/MM/YYYY' ).isValid() ||  dayjs(value, 'YYYY' ).isValid() } );
      
    }

    const handleBlurFormStudent = (e) => {
      const { name, value, type } = e.target;
      if(type === 'number')
      setFormStudentValidation( { [name]: value > 0 } );
      else
      setFormStudentValidation( { [name] : value.length > 0 } )
    
        
    }

    const handleBlurFormStatus = (e) => {
      const { name, value, type } = e.target;
      if(type === 'number')
      setFormStatusValidation( { [name]: value > 0 } );
      else
      setFormStatusValidation( { [name] : value.length > 0 } )
        
        
    }

       const handleChangeCheckBox = (event) => {
         setChecked(event.target.checked);

          if( checked ){
          setFormStatus(initialStateStatus);
          setFormStatusValidation(initialStatusValidation);
          }
       };

      const validationStudent = () =>{
        for(let key in formStudentValidation){
          if( formStudentValidation[key] === false )            
            return false;
        }
        return true;
      }

      const validationStatus = () =>{
        for(let key in formStatusValidation){
          if( formStatusValidation[key] === false )            
            return false;
        }
        return true;
      }

      const handleClickSave = (event) => {
        event.preventDefault();
        if ((validationStudent() && !checked) || (validationStudent() && validationStatus() && checked)){
            setDisableCancel(true);
            setDisableSave(true);
            
            fetchInsert();
            
            setTimeout( () => {
              navigate("/");
              }, 1500)
          
        }
        else{
          alert( 'Faltan campos por llenar' );
        }

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
        const startDate = !checked ? null :  inicioTitulo.format('YYYY-MM-DD');
        const endDate = !checked? null :  finTitulo.format('YYYY-MM-DD');
        
        const egresoDate = !checked ? null : cicloEgreso.format('YYYY') + calendarioEgreso;

        const IngresoDate = cicloIngreso.format('YYYY') + calendarioIngreso;
        
        const modalidad =  !checked ? null : mod
        
        let bodyPost = [
          ('estatus', {"graduated": checked, "startDate":   startDate, "endDate":  endDate, "average": puntaje, "type": modalidad }),
          ('student', {"name": nombre, "folio": folio, "age": edad, "genre": sexo, "code": codigo, "career": career, "egreso":  egresoDate, "ingreso": IngresoDate })
        ];
          //console.log( bodyPost );
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
        modList = await (await fetch('http://localhost:9000/modalidad')).json();
        //console.log(modList);
      };

      useEffect( () => {
          fetchMod();
      }, [] )

      const status = (        
        <div>
          <div className='components-add-user'>
          <Divider />
          <LocalizationProvider dateAdapter={AdapterDayjs} key={'inicioTitulo'} >
          <DateField label="Inicio de la titulación" variant='filled' format='DD/MM/YYYY' value={inicioTitulo} 
          name='inicioTitulo'
          key={'inicioTitulo'}
          onChange={ value => formStatus.inicioTitulo = dayjs(value) } 
          onBlur={ handleBlurStatusDate }          
          sx={{width: '50%'}}  />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs} >
          <DateField variant='filled' label="Finalización de la titulación" format='DD/MM/YYYY' value={finTitulo} 
          name='finTitulo'
          onChange={ value => formStatus.finTitulo = dayjs(value) } 
          onBlur={ handleBlurStatusDate }
          sx={{width: '50%'}}/>
          </LocalizationProvider>
          </div>

          <div className='components-add-user'>
          <Paper component="form" variant='inlined' sx={{display: 'flex', alignItems: 'center', width: "50%" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} >
          <DateField variant='filled' label="Ciclo de egreso" format='YYYY' value={cicloEgreso} 
          name='cicloEgreso'
          onChange={ value => formStatus.cicloEgreso = dayjs(value) }  
          onBlur={ handleBlurStatusDate }
          sx={{width:'70%'}}/>
          </LocalizationProvider>
          
          <Divider orientation="vertical" sx={{height: 28, mt: 2, ml: -2, mr: 2}} />
          
          <FormControl variant='filled'>
          <Select
          required
          sx={{mt: 0, ml: -2.2,minWidth: 50}}
          value={calendarioEgreso}
          name='calendarioEgreso'
          onChange={ handleChangeFormStatus }
          onBlur={handleBlurFormStatus }
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
          variant='filled'
          label='Puntaje obtenido'
          value={puntaje}
          name='puntaje'
          onChange={ handleChangeFormStatus }
          onBlur={ handleBlurFormStatus }
          sx={{ width: '45%' }}
          />
          </div>
          <div className='components-add-user'>
          <FormControl variant='filled' sx={{m:2, ml:5, minWidth: 400, width: '100%' }}>
          <InputLabel>Modalidad de titulación</InputLabel>
          <Select
          required
          value={mod}
          name='mod'
          onChange={handleChangeFormStatus}
          onBlur={ handleBlurFormStatus }
          >
          <MenuItem  key={''} value={""}>Seleccione</MenuItem>
          {modList.map( ( {nombre}, index ) => (
          <MenuItem key={index} value={nombre} >{nombre}</MenuItem>
          ))} 

          </Select>
          </FormControl>
          </div>
        </div>

      );


      return(
      
    <div className='app-new-user'>
        
          <Box component={Paper} sx={{ backgroundColor: 'white', padding: 5, '& .MuiTextField-root': {m: 2, ml: 5}, mb: 1,   display: 'inline-block' }} elevation={3}>
          <Typography variant='h4'> Registro de estudiantes </Typography>
          <Divider sx={{mt: 3}} />

          <div className='components-add-user'>
      <TextField
            required
            label="Codigo"
            variant='filled'
            name='codigo'
            type='text'
            value={codigo}
            onChange={ handleChangeFormStudent }
            onBlur={ handleBlurFormStudent }
            sx={ { width: "50%" } }
      />

      <TextField 
        required
        label="Folio"
        variant='filled'
        name='folio'
        type='text'
        value={folio}
        onChange={ handleChangeFormStudent }
        onBlur={ handleBlurFormStudent }
        sx={ { width: "50%" } }
      />
      </div>

      <div className='components-add-user'>
      <TextField
      required
      label="Nombre"
      variant='filled'
      type='text'
      name='nombre'
      value={nombre}
      onChange={ handleChangeFormStudent }
      onBlur={ handleBlurFormStudent }
      sx={ {width: "100%", minWidth: 150} }
      />
      </div>
      <div className='components-add-user'>
      <TextField
      required
      label="Edad"
      variant='filled'
      type="number"
      name='edad'
      value={edad}
      onChange={ handleChangeFormStudent }
      onBlur={ handleBlurFormStudent }
      sx={{ width: '22%', minWidth: 70 }}
      />

      <FormControl variant='filled' sx={{m:2, minWidth: 120}}>
      <InputLabel>Sexo</InputLabel>
      <Select
        required
        value={sexo}
        label="Sexo"
        type='select'
        name='sexo'
        onChange={handleChangeFormStudent}
        onBlur={ handleBlurFormStudent }>
        <MenuItem  value=''>Seleccione</MenuItem>
        <MenuItem value={'H'}>Hombre</MenuItem>
        <MenuItem value={'F'}>Mujer</MenuItem>
      </Select>
      </FormControl>

      <Paper component="form" variant='inlined' sx={{display: 'flex', alignItems: 'center', width: "50%", ml: 1 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      
      <DateField variant='filled' label="Ciclo de ingreso" format='YYYY' value={cicloIngreso} name='cicloIngreso'
      onBlur={ handleBlurDate }
      onChange={ value => formStudent.cicloIngreso = dayjs(value)     }     
      sx={{ width: '70%' }}/>
      
      </LocalizationProvider>

      <Divider orientation="vertical" sx={{height: 28, mt: 2, ml: -2, mr: 2}} />
      
      <FormControl variant='filled'>
      <Select
      required
      sx={{mt: 0, ml: -2.2, minWidth: 60}}
      value={calendarioIngreso}
      name='calendarioIngreso'
      type='select'
      onChange={ handleChangeFormStudent }
      onBlur={ handleBlurFormStudent }
      >
            <MenuItem value="">Seleccione</MenuItem>
            <MenuItem value={"A"}>A</MenuItem>
            <MenuItem value={"B"}>B</MenuItem>
      </Select>
      </FormControl>
      </Paper>


      </div>

      
      <div className='components-add-user'>
      <FormControl variant='filled' sx={{mt:2, ml: 5, minWidth: 150, width: "93%"}}>
      <InputLabel>Carrera</InputLabel>
      <Select
        required
        value={career}
        label="Carrera"
        name='career'
        type='select'
        onChange={handleChangeFormStudent}
        onBlur={ handleBlurFormStudent }
      >
        <MenuItem key={0}  value=''>Seleccione</MenuItem>
        {carreras.map( element => (
          <MenuItem key={ element.key } value={ element.value } >{element.name} ({element.value})  </MenuItem>
        ))}
      </Select>
      </FormControl>


      </div>
      <Typography align='left' variant='h6'  > Estatus </Typography>
      <div className='components-add-user'>
      
        <FormControlLabel control={<Checkbox checked={checked} onChange={handleChangeCheckBox }  />} label="Titulado"  labelPlacement='start' sx={{ ml:5 }}/>
      

      </div>
      <div >
          <Collapse in={checked} unmountOnExit  >{status}</Collapse>
        </div>
      <div >
         <Button variant='contained' component={Link} to={"/"}  sx={ { mr: 5 } } disabled={ disableCancel } >Cancel</Button>

        <Button variant='contained' onClick={ (event) => handleClickSave(event)} sx={ { ml: 5 } } disabled={ disableSave }  endIcon={<SaveIcon/>}  >Save</Button>
      </div>


      <Snackbar open={success} autoHideDuration={5000} onClose={handleCloseSuccess} >
          <Alert onClose={handleCloseSuccess} severity="success" sx={ { width: "100%" } }>
            Se a agregado un nuevo elemento a la lista
          </Alert>
      </Snackbar>
      
      <Snackbar open={error} autoHideDuration={5000} onClose={handleCloseError} >
          <Alert onClose={handleCloseError} severity="error" sx={ { width: "100%" } }>
            Ha habido un error al agregar un elemento
          </Alert>
      </Snackbar>
      
      </Box>
    
    </div>
);
}

export default Add_user;