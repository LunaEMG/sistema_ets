/**
 * Controlador para blindar el Dashboard Administrativo y gestionar sus acciones.
 */
import { servicio_api } from '../servicios/servicio_api.js';

const texto_bienvenida_usuario = document.getElementById('texto_bienvenida_usuario');
const btn_cerrar_sesion = document.getElementById('btn_cerrar_sesion');

async function inicializar_dashboard() {
    const comprobacion = await servicio_api.verificar_sesion();

    if (comprobacion.estado !== 'autenticado') {
        window.location.href = '../../login.html';
        return;
    }

    texto_bienvenida_usuario.textContent = `Administrador activo: ${comprobacion.usuario.correo_electronico}`;
    btn_cerrar_sesion.addEventListener('click', procesar_salida);
}

async function procesar_salida() {
    const respuesta = await servicio_api.cerrar_sesion();
    
    if (respuesta.estado === 'exito') {
        window.location.href = '../../login.html';
    } else {
        alert('Hubo un problema al cerrar la sesión segura de forma interna.');
    }
}

document.addEventListener('DOMContentLoaded', inicializar_dashboard);