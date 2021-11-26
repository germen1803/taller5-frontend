import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import {Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Select, TextField, Button, MenuItem, InputLabel, FormControl, Container} from '@mui/material';


const AutosComponente = () => {
    //Array con los marcas y autos relacionados
    const [marcasAutos, setMarcasAutos] = useState([])
    //Patente proveniento del <TextField>
    const [patente, setPatente] = useState("")
    //Año proveniente del textfield
    const [anio, setAnio] = useState()
    //Array de marcas guardadas
    const [marcas, setMarcas] = useState([])
    //Array con los autos guardados
    const [autos, setAutos] = useState([])
    //ID de la marca seleccionada en el <Select>
    const [marca, setMarca] = useState("")

    const handleInputChangePatente = (event) => {
        setPatente(event.target.value)
    }

    const handleInputChangeAnio = (event) => {
        setAnio(event.target.value)
    }

    const handleInputChangeMarca = e => setMarca(e.target.value)

    useEffect ( () => {
        getAutos()
        getMarcasAutos()
        getMarcas()
    },[])

    async function getMarcasAutos () {
        try {
            const response = await axios.get('http://localhost:4000/api/marcas_autos');
        if(response.status == 200){
            setMarcasAutos(response.data.marcas_autos)
            //console.log(response.data.marcas_autos)
            //console.log(marcasAutos.map(marcasAutos => (marcasAutos.marcas.descripcion)))
        }
        } catch (error) {
            console.error(error);
        }
    }

    async function getMarcas () {
        try {
            const response = await axios.get('http://localhost:4000/api/marcas');
            if(response.status == 200){
                setMarcas(response.data.marca)
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function getAutos () {
        try {
            const response = await axios.get('http://localhost:4000/api/autos');
            if(response.status == 200){
                setAutos(response.data.autos)
            }
        } catch (error) {
            console.log(error);
        }
    }

    function guardarAutos() {
        axios.post('http://localhost:4000/api/autos', {
            patente: patente,
            anio: anio,
            idMarca: marca
        })
        .then(function(response) {
            if(response.status == 200){
                Swal.fire(
                    'Registro exitoso',
                    'El auto ha sido ingresado al sistema',
                    'success'
                )
                getMarcas()
                getMarcasAutos()
                getAutos()
            }else {
                Swal.fire(
                    'Error al guardar',
                    'error'
                )
            }
        })
        .catch(function(error) {
            console.log(error);
        })
        //se busca que, al guardar un auto automaticamente se guarde elidAuto y el idMarca
        guardarMarcaAuto()
    }

    function guardarMarcaAuto() {
        for(let i=0; i<autos.length; i++) {
            if(autos[i].patente === patente) {
                console.log(autos[i].marca)
                axios.post('http://localhost:4000/api/marcas_autos', {
                    idAuto: autos[i]._id,
                    idMarcas: autos[i].marca
                })
                .then(function (response) {
                    if(response.status==200)
                    {
                        console.log('Guardado con éxito')
                        getMarcas()
                        getMarcasAutos()
                        getAutos()
                        setPatente("")
                        setAnio("")
                        setMarca("")
                    }else{
                        console.log('Error al guardar')
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    });
            }
        }
    }


    return (
        <Container maxWidth="md">
            <div><h2>Registro de Autos</h2></div>
            <div>
                <TextField id="patente" label="Patente" name="patente" onChange={handleInputChangePatente} value={patente}  variant="outlined" style={{marginTop:10}}/>
            </div>
            <div>
                <TextField type="number" id="anio" label="Año" name="anio" onChange={handleInputChangeAnio} value={anio}  variant="outlined" style={{marginTop:10}}/>
            </div>

            <div>
                <FormControl style={{minWidth:200, marginTop:10}}>
                    <InputLabel >Marcas</InputLabel>
                    <Select onChange={handleInputChangeMarca} label="Marcas" defaultValue="">
                        {marcas.map(data =>(
                            <MenuItem value={data._id} >{data.descripcion}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div>
                <Button variant="contained" style={{marginTop:10}} onClick={guardarAutos}>Guardar</Button>
            </div>

            <div>
                <Button variant="contained" style={{marginTop:10}} onClick={guardarMarcaAuto}>Guardar Marca y Auto</Button>
            </div>

            <div className="App">
                <TableContainer style={{marginTop:20}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{fontWeight: 'bold', fontSize: 20, textAlign: 'center'}}>Marca</TableCell>
                                <TableCell style={{fontWeight: 'bold', fontSize: 20, textAlign: 'center'}}>Patente</TableCell>
                                <TableCell style={{fontWeight: 'bold', fontSize: 20, textAlign: 'center'}}>Año</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {marcasAutos.map(data=>(
                                <TableRow>
                                    <TableCell style={{textAlign: 'center'}}>{data.marcas.descripcion}</TableCell>
                                    <TableCell style={{textAlign: 'center'}}>{data.autos.patente}</TableCell>
                                    <TableCell style={{textAlign: 'center'}}>{data.autos.anio}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Container>
    )
}


export default AutosComponente