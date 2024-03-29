 import './App.css';
 import  '../career-List'

import { Paper, TableContainer,Table, TableHead, TableCell, TableRow, Button, TablePagination, TableBody, Snackbar, Alert, InputBase, Collapse, FormControl, Select, MenuItem, Box, InputLabel, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import VisibilityIcon from '@mui/icons-material/Visibility';
import 'dayjs/locale/es-mx'

import { Link } from 'react-router-dom';

import { useCallback, useEffect, useState } from 'react';
import queryString from 'query-string';

import carreras from '../career-List';
import  dayjs from 'dayjs';
dayjs.locale('es-mx')

const columns = [
  {id: 'code', label: 'Codigo'},
  {id: 'name', label: 'Nombre' },
  {id: 'career', label: 'Carrera'},
  {id:'admission', label: 'Admision'},
  {id: 'graduated', label: 'Titulado'},
  {id: 'actions', label: '', align: 'center',},
];

const createData = (codigo, nombre, carrera, ciclo_ingreso, titulado) => {
  return { codigo, nombre, carrera, ciclo_ingreso, titulado };
};

let modList = [];

const App = () => {
  
  //Hooks
  const [search, setSearch] = useState('');

  const[page, setPage] = useState(0);
  const[rowsPerPage, setRowsPerPage] = useState(10);

  const [data, setData] = useState([]);
  const[student,setStudent] = useState([]);
  const [studentList, setStudentList] = useState([]);

  const[success, setSuccess] = useState(false);
  const[error, setError] = useState(false);

  const [filterState, setFilterState] = useState(false);
  const [sexo, setSexo] = useState('Any');
  const [titulado, setTitulado] = useState('Any');
  const [carrera, setCarrera] = useState('Any');

  const[open, setOpen] = useState(false);
  //Events

  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
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

const handleSearchInput = (e) => {
  setSearch(e.target.value)  
};

const handleFilterBtn = () => {
  filterState === true?  setFilterState(false) : setFilterState(true);
  
}

const handleCarreraSelect = (e) => {
  setCarrera(e.target.value)
  
}

const handleSexoSelect = (e) => {
  setSexo(e.target.value);
  
};

const handleTituladoSelect = (e) => {
  setTitulado(e.target.value);

};

  const handleDelete = async (event, codeId) => {
    console.log( codeId );
     const res = await fetch('http://localhost:9000/deleteStudent',{
       method: 'delete',
       headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
       mode: 'cors',
       body: JSON.stringify( {id: codeId} ),
     })

     if(res.ok){
      refreshList(codeId)
       setSuccess(true);
    }
     else{
       setError(true);
     }
    
  };

  const refreshList = (id) => {
      let newData = data.filter( element => 
          element.codigo !== id
      );

      let newStudentList = student.filter( element => 
        element.codigo !== id 
      );

      setData( newData );
      setStudent( newStudentList );
      console.log( newData );
  };

  const handleOpenView = (codigo) => {
      setOpen(true);
      filterStudent(codigo)
  }

  const filterStudent = (codigo) => {
    let studentArray = data.filter( (element) => {
      if(element.codigo === codigo){
          return true;
      }
      return false;
  } );

  console.log( studentArray );
  setStudentList( studentArray );

  console.log( studentList );
  }

  const fetchGet = useCallback(async () => {

    await fetch('http://localhost:9000/students?' + queryString.stringify( 
      {"sexo": sexo === 'Any'? null : sexo ,
      "titulado" : titulado === 'Any'? null : titulado,
      "carrera": carrera === 'Any'?  null : carrera,
      "nombre": search === ''? null : search }, { skipNull: true })) 
 .then( (res) =>  res.json() )
 .then( ( dataJson ) => {

    let stundentData = [];
    stundentData = dataJson.map(obj =>  createData( obj.codigo, obj.nombre, obj.carrera, obj.ciclo_ingreso, obj.titulado ) );
   setStudent(stundentData);  
   setData( dataJson );
  console.log(dataJson);
 }  ) 
 .catch( (error) => console.log( error ) );

}, [carrera, search, sexo, titulado] );

const fetchMod = useCallback(async () => {
   modList = await fetch('http://localhost:9000/modalidad')
  .then( res =>  res.json() )
  .catch( error => console.log(error) );
  modList.map( (e, index) => e.id = (index + 1)  )
}, []);

  useEffect(  () => {
    fetchGet();
    fetchMod();
  },[fetchGet, fetchMod]);

  useEffect(() => {
    fetchGet();
  }, [search,fetchGet]);
  
  useEffect(() => {
    fetchGet(carrera);
  }, [carrera,fetchGet]);
  
  useEffect(() => {
    fetchGet(sexo);
  }, [sexo,fetchGet]);
  
  useEffect(() => {
    fetchGet(titulado);
  }, [titulado,fetchGet]);
  
  
  const filters = (
    <div >
      <Box sx={ { mb: 2 } }>
      <FormControl sx={{ mt: 1 }}>
        <InputLabel sx={{ color: 'white',  }}  >Titulado</InputLabel>
          <Select
          required
          size='small'
          sx={{mt:1, ml: 1, minWidth: 110, width: "50%", backgroundColor: '#ffffff' }}
          
          value={ titulado }
          onChange={ handleTituladoSelect }
          defaultValue={'Any'}
          >
          <MenuItem value={"Any"}>Any</MenuItem>
          <MenuItem value={'SI'}>Si</MenuItem>
          <MenuItem value={'NO'}>No</MenuItem>
          </Select>
          </FormControl>

        <FormControl sx={{ mt: 1 }}>
        <InputLabel sx={{ color: 'white',  }}  >Carrera</InputLabel>
          <Select
          required
          size='small'
          sx={{mt:1, ml: 1, minWidth: 110, width: "50%", backgroundColor: '#ffffff' }}
          
          value={carrera}
          onChange={ handleCarreraSelect }
          defaultValue={'Any'}
          >
            
          <MenuItem key={0}  value='Any'>Any</MenuItem>
          {carreras.map( element => (
            <MenuItem key={ element.key } value={ element.value } >{element.value}  </MenuItem>
          ))}
          </Select>
          </FormControl>

        <FormControl sx={{ mt: 1 }}>
        <InputLabel sx={{ color: 'white',  }}  >Sexo</InputLabel>
          <Select
          required
          size='small'
          sx={{mt:1, ml: 1, minWidth: 110, width: "50%", backgroundColor: '#ffffff' }}
          
          value={sexo}
          onChange={ handleSexoSelect }
          defaultValue={'Any'}
          >
            
          <MenuItem value='Any'>Any</MenuItem>
          <MenuItem value="F">Mujer</MenuItem>
          <MenuItem value="H">Hombre</MenuItem>
          </Select>
          </FormControl>
          </Box>
    </div>
  );



  return (
    <header className='App-header'>

    <div className='Menu'>
      <Button variant='contained' size='medium'  component={Link} to={"new"}>+ ADD</Button>
      <Paper component='form'  sx={{ alignItems: 'center', display: 'flex', borderRadius: 1, ml: 30,  p: '6px 12px', backgroundColor: '#ffffff', width: '50%' }} elevation={5}>
      <SearchIcon sx={{ color: 'black' }}/>
      <InputBase   sx={{ ml: 5,   flex: 1, width: '22%' }} placeholder='Busqueda por nombre' onChange={ handleSearchInput } value={search}></InputBase>
      </Paper >
      <FormControl ><Button variant='contained' size='medium' sx={{ position: 'relative', p: '10px 12px' }} startIcon={ <TuneIcon/> } onClick={ handleFilterBtn } type='checkbox'  > Filter </Button> </FormControl>


    </div>
    <div >
          <Collapse in={filterState} unmountOnExit  >{filters}</Collapse>
      </div>
      <Dialog open={ open } onClose={ () => setOpen(false) }  fullWidth={true}  >
      <DialogTitle> Estudiante </DialogTitle>
      <DialogContent dividers={true} >
      {studentList.map( (e, index) => 
      <List key={ index } sx={{ justifyContent: 'center', alignContent: 'flex-end' }} >
      
        <ListItem alignItems='center' >
          <ListItemText   primary='Codigo' secondary= { e.codigo   }  />
          <ListItemText  primary='Folio' secondary= {`${ e.folio }`}  />
          <ListItemText  primary='Titulacion' secondary= { e.titulado ? 'Terminado' : 'En proceso' }  />
        </ListItem>
        <ListItem alignItems='center'>
        <ListItemText  primary='Nombre' secondary= { `${e.nombre}`    }  />
        <ListItemText  primary='Edad' secondary= { `${ e.edad }`}  />
        <ListItemText  primary='Genero' secondary= { e.sexo === 'H' ? 'Hombre' : 'Mujer'   }  />
        </ListItem  >
        <ListItem alignItems='center'>
          <ListItemText  primary='Carrera' secondary= { carreras.map( (element) => {
            if(e.carrera.substring(0,4).includes(element.value)){ 
              return `${element.name} (${element.value})`; 
            } return false; }
             )}/>
          <ListItemText primary='Ciclo escolar' secondary= { `${ e.ciclo_ingreso } -  ${ e.ciclo_egreso == null ? '?' : e.ciclo_egreso } ` } />
        </ListItem>
        <ListItem>
          <ListItemText primary='Fecha de inicio de titulacion' secondary={ `${ e.inicio_titulacion == null ? 'No disponible' : dayjs(e.inicio_titulacion).format('dddd, MMMM D, YYYY') } ` } />
          <ListItemText primary='Fecha de cierre de titulacion' secondary={ `${ e.fin_titulacion == null ? 'No disponible' :  dayjs(e.fin_titulacion).format('dddd, MMMM D, YYYY') } ` } />
        </ListItem>

        <ListItem>
        <ListItemText primary='Modalidad de titulacion' secondary={  e.id_mod1 == null ? 'No disponible' : modList.map( element => {  if(element.id === e.id_mod1) { return `${element.nombre}` } return false; }  ) } />
        <ListItemText primary='Obtenido' secondary={ e.titulado ? e.calificacion : 'No disponible' } />
          <ListItemText />
        </ListItem>
        </List>
      )}
    
      </DialogContent>
      </Dialog>

    <div className="App">


      <Paper sx={ {width: '100%'}} elevation={ 3 }>
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650 }} >
          <TableHead sx={{ backgroundColor: '#09070a'  }} >
            <TableRow>
              {columns.map( columns => (
                <TableCell
                  key={columns.id}
                  align={ columns.align }
                  sx={ { color: '#ffffff', fontSize: 16 } }
                >
                  {columns.label}
                  </TableCell>
              ))}
            </TableRow>
          </TableHead>
          
          <TableBody>
          
          { 
            
          student.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map( (row) => (
             
            <TableRow hover key={row.codigo} >

                <TableCell  >
                  {row.codigo}
                </TableCell>
                <TableCell>
                  {row.nombre}
                </TableCell>
                <TableCell>
                  {row.carrera}
                </TableCell>
                <TableCell>
                  {row.ciclo_ingreso}
                </TableCell>
                <TableCell>
                  { row.titulado ? "SI" : "NO" }
                </TableCell>
                <TableCell>
                  <Button variant='contained' size='small' startIcon={<VisibilityIcon/>} sx= { { mr: 0.5 } } onClick={ (event) => handleOpenView(row.codigo) } >View</Button>
                  <Button variant='contained' size='small' startIcon={<EditIcon />} sx= { { mr: 0.5 } } component={Link} to={`edit/${row.codigo}`} > Edit </Button>
                  <Button variant='contained' size='small' type='button' startIcon={<DeleteIcon/>} sx= { { mr: 0.5  } } onClick={ (event) => handleDelete(event, row.codigo)} >Delete</Button>
                </TableCell>
            </TableRow>
          ))
          }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={ { mb: 5 } }
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={student.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={ (event, newPage) => { setPage(newPage) } }
        onRowsPerPageChange= { handleChangeRowsPerPage }      
        
      >
      </TablePagination>

      <Snackbar open={success} autoHideDuration={10000} onClose={handleCloseSuccess} >
        <Alert onClose={handleCloseSuccess} severity="success" sx={ { width: "100%" } }>
          Se a eliminado un elemento exitosamente 
        </Alert>
    </Snackbar>
    
    <Snackbar open={error} autoHideDuration={10000} onClose={handleCloseError} >
        <Alert onClose={handleCloseError} severity="error" sx={ { width: "100%" } }>
          Ha habido un error al eliminar un elemento
        </Alert>
    </Snackbar>


      </Paper>
    </div>
    </header>
  );
}

export default App;
