/**
 * Controlador para gestionar los eventos e interacciones de la pantalla de Login.
 */
import { servicio_api } from '../servicios/servicio_api.js';

const formulario_login = document.getElementById('formulario_login');
const input_correo = document.getElementById('input_correo');
const input_contrasena = document.getElementById('input_contrasena');

function inicializar_login() {
    formulario_login.addEventListener('submit', procesar_intento_acceso);
}

async function procesar_intento_acceso(evento) {
    evento.preventDefault();

    const correo = input_correo.value.trim();
    const contrasena = input_contrasena.value;

    if (correo === '' || contrasena === '') {
        Swal.fire('Atención', 'Todos los campos son obligatorios.', 'warning');
        return;
    }
    
    const respuesta_servidor = await servicio_api.iniciar_sesion(correo, contrasena);

    if (respuesta_servidor.estado === 'exito') {
        Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: respuesta_servidor.mensaje,
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.href = 'vistas/administracion/dashboard.html';
        });
    } else {
        Swal.fire('Error de Acceso', respuesta_servidor.mensaje, 'error');
    }
}



document.addEventListener('DOMContentLoaded', inicializar_login);