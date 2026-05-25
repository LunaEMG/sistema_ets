/**
 * Controlador para gestionar los eventos e interacciones de la pantalla de Login.
 */
import { servicio_api } from '../servicios/servicio_api.js';

const formulario_login = document.getElementById('formulario_login');
const input_correo = document.getElementById('input_correo');
const input_contrasena = document.getElementById('input_contrasena');
const contenedor_mensaje_error = document.getElementById('contenedor_mensaje_error');

function inicializar_login() {
    formulario_login.addEventListener('submit', procesar_intento_acceso);
}

async function procesar_intento_acceso(evento) {
    evento.preventDefault();
    
    contenedor_mensaje_error.textContent = '';
    contenedor_mensaje_error.classList.add('oculta_mensaje');

    const correo = input_correo.value.trim();
    const contrasena = input_contrasena.value;

    if (correo === '' || contrasena === '') {
        mostrar_error_interfaz('Todos los campos son obligatorios.');
        return;
    }
    
    const respuesta_servidor = await servicio_api.iniciar_sesion(correo, contrasena);

    if (respuesta_servidor.estado === 'exito') {
        window.location.href = 'vistas/administracion/dashboard.html';
    } else {
        mostrar_error_interfaz(respuesta_servidor.mensaje);
    }
}

function mostrar_error_interfaz(mensaje) {
    contenedor_mensaje_error.textContent = mensaje;
    contenedor_mensaje_error.classList.remove('oculta_mensaje');
}

document.addEventListener('DOMContentLoaded', inicializar_login);