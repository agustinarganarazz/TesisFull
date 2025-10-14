import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBRow } from 'mdb-react-ui-kit'
import { useState, useEffect, useContext} from 'react'
import { DataContext } from '../../context/DataContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import logo from '../../assets/LogoNobel.jpg'
import '../../App.css'


const Login = () => {

//ESTADOS

const [usuarios, setUsuarios] = useState([])
const [clave, setClave] = useState('')
const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('')


//URL
const { URL } = useContext(DataContext)
const navigate = useNavigate();


//TRAER USUARIOS
const seeUsuarios = () => {
    axios.get(`${URL}usuarios/verUsuarios`).then((response)=> {
        console.log(response.data)
        setUsuarios(response.data)
    }).catch((error) => {
        console.error('Error al traer los usuarios', error)
    })
}

//COMPROBAR LOGIN
const comprobarLogin = () => {
  console.log('Nombre de usuario:', usuarioSeleccionado)
  console.log('Clave:', clave)

  axios.post(`${URL}login/post`, {
    nombre_usuario : usuarioSeleccionado,
    clave : clave      
  })
  .then(response => {
    console.log(response.data)
    if (response.data.success) {
      // Guardamos el token en el localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('nombreUsuario', usuarioSeleccionado);
      localStorage.setItem('idUsuario', response.data.usuario.id);

      // Decodificar token para expiración
      const decodedToken = jwt_decode(response.data.token);
      const expirationDate = decodedToken.exp * 1000; 
      localStorage.setItem('tokenExpiration', expirationDate); 

      // 👉 Mostrar modal para ingresar fondo de caja
      Swal.fire({
        title: 'Fondo inicial de caja',
        input: 'number',
        inputLabel: 'Ingrese el dinero inicial en caja',
        inputAttributes: {
          min: 0,
          step: 0.01
        },
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
        allowEscapeKey: true,
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value || value <= 0) {
            return 'Debes ingresar un monto válido';
          }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const montoInicial = parseFloat(result.value);

          // Guardar monto inicial en la base de datos
          axios.post(`${URL}caja/registrarAperturaCaja`, {
            id_usuario: response.data.usuario.id,
            monto_inicial: montoInicial
          })
          .then((res) => {
            localStorage.setItem('idApertura',res.data.Id_apertura)
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: `¡Bienvenido, ${usuarioSeleccionado}!`,
              background: '#e0ffe0',     
              color: '#205522',        
              timer: 2500,
              timerProgressBar: true,
              showConfirmButton: false,
            });

            // Redirigir después de abrir caja
            navigate('/venta');
          })
          .catch(err => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Error al abrir la caja',
              text: 'No se pudo registrar la apertura de caja. Intente de nuevo.'
            });
          });
        }
      });

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Credenciales incorrectas',
        text: 'Por favor, verifica tu nombre de usuario y contraseña.',
      });
    }
  })
  .catch(err => {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Error al iniciar sesión',
      text: 'Ocurrió un problema al intentar iniciar sesión. Inténtalo de nuevo más tarde.',
    });
  });
}

useEffect(()=> {
    seeUsuarios()
},[])





  return (
    <>
    <div className="fondo-login"></div>
    <MDBContainer fluid className='d-flex justify-content-center align-items-center min-vh-100'>
        <MDBRow className='w-100'>
            <MDBCol className='d-flex justify-content-center'>
                <MDBCard className='bg-white my-5 shadow-sm' style={{ borderRadius: '1rem', maxWidth: '500px', padding: '30px', opacity: 0.87}}>
                    <MDBCardBody className='p-5 w-100 d-flex flex-column rounded-4'>
                        <img src={logo} alt="" style={{borderRadius: '15px', boxShadow: '0 4px 8px rgba(0,0,0, 0.3)' }}/>
                        <br />
                        <select className='form-select mb-4 w-100 rounded-3' value={usuarioSeleccionado} onChange={(e) => setUsuarioSeleccionado(e.target.value)}>
                        <option value="">Seleccione un usuario</option>
                        {usuarios.map((usuario) => (
                            <option key={usuario.Id_usuario} value={usuario.nombre_usuario}>
                                {usuario.nombre_usuario}
                            </option>
                        ))}
                        </select>    
                        <input className='form-control mb-4 w-100 rounded-3' placeholder='Ingrese clave...' type='password' size="lg" value={clave}  onChange={(e) => setClave(e.target.value)}/>
                        <MDBBtn size='lg' className='btn-animado rounded-3' onClick={comprobarLogin}>
                            INGRESAR
                        </MDBBtn>
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    </MDBContainer>
    </>
  )
}

export default Login