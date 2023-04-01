 import './App.css';

import { Paper, TableContainer,Table, TableHead, TableCell, TableRow, Button, TablePagination, TableBody, IconButton } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import ArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const columns = [
  { id: 'view', label: '' },
  {id: 'code', label: 'Codigo'},
  {id: 'name', label: 'Nombre' },
  {id: 'career', label: 'Carrera'},
  {id:'admission', label: 'Admision'},
  {id: 'graduated', label: 'Titulado'},
  {id: 'actions', label: '', align: 'center',},
];

const createData = (code, name, career, admission, graduated) => {
  return { code, name, career, admission, graduated };
};


let stundentData = []

const App = () => {
  
  //Hooks

  const[page, setPage] = useState(0);
  const[rowsPerPage, setRowsPerPage] = useState(10);

  const [data, setData] = useState([]);
  const[student,setStudent] = useState([]);

  //Events

  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
  };

  const fetchGet = () => {
    fetch('http://localhost:9000/students') 
 .then( (res) =>  res.json() )
 .then( ( dataJson ) => {

   stundentData = dataJson.map(obj =>  createData( obj.codigo, obj.nombre, obj.carrera, obj.ciclo_ingreso, obj.titulado ) );
   setStudent(stundentData);
   setData( dataJson );

 }  ) 
 .catch( (error) => console.log( error ) );

};

  useEffect(  () => {
    fetchGet()
  },[])
  
  return (
    <header className='App-header'>

    <div className='Menu'>
      <Button variant='outlined' size='medium' className='btnTable' component={Link} to={"new"}>+ ADD</Button>
    </div>
    <div className="App">


      <Paper sx={ {width: '100%'}} elevation={ 3 }>
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650 }} >
          <TableHead>
            <TableRow>
              {columns.map( columns => (
                <TableCell
                  key={columns.id}
                  align={ columns.align }
                >
                  {columns.label}
                  </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
          { 
          //const[open, setOpen] = useState(false) 
          
          student.map( (row) => (

             

            <TableRow hover key={row.code} >
                <TableCell>
                  <IconButton
                  size='small'
                  
                  >
                    { <ArrowUpIcon/> }
                  </IconButton>
                </TableCell>
                <TableCell  >
                  {row.code}
                </TableCell>
                <TableCell>
                  {row.name}
                </TableCell>
                <TableCell>
                  {row.career}
                </TableCell>
                <TableCell>
                  {row.admission}
                </TableCell>
                <TableCell>
                  { row.graduated ? "SI" : "NO" }
                </TableCell>
                <TableCell>
                  <Button variant='contained' size='small' startIcon={<EditIcon />} sx= { { mr: 0.5 } } > Edit </Button>
                  <Button variant='contained' size='small' startIcon={<DeleteIcon/>} sx= { { mr: 0.5 } } >Delete</Button>
                </TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        
        rowsPerPageOptions={[10, 50, 100]}
        component="div"
        count={student.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={ (event, newPage) => { setPage(newPage) } }
        onRowsPerPageChange= { handleChangeRowsPerPage }      
      >
      </TablePagination>
      </Paper>
    </div>
    </header>
  );
}

export default App;
