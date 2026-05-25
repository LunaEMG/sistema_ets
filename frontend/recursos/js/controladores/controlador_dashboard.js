/**
 * Controlador para blindar el Dashboard Administrativo y gestionar sus acciones.
 */
import { servicio_api } from '../servicios/servicio_api.js';
import { componente_tabla_admin } from '../componentes/componente_tabla_admin.js';

const texto_bienvenida_usuario = document.getElementById('texto_bienvenida_usuario');
const btn_cerrar_sesion = document.getElementById('btn_cerrar_sesion');
const contenedor_tabla = document.getElementById('contenedor_tabla_examenes');

async function inicializar_dashboard() {
    const comprobacion = await servicio_api.verificar_sesion();

    if (comprobacion.estado !== 'autenticado') {
        window.location.href = '../../login.html';
        return;
    }

    texto_bienvenida_usuario.textContent = `Administrador activo: ${comprobacion.usuario.correo_electronico}`;
    
    btn_cerrar_sesion.addEventListener('click', procesar_salida);

    contenedor_tabla.addEventListener('click', evaluar_click_tabla);

    await cargar_listado_examenes();
}

async function cargar_listado_examenes() {
    contenedor_tabla.innerHTML = '<p class="mensaje_carga">Cargando programación de exámenes...</p>';
    
    const todos_los_examenes = await servicio_api.buscar_examenes(0, 0, 0);
    
    contenedor_tabla.innerHTML = componente_tabla_admin.crear_tabla(todos_los_examenes);
}

async function evaluar_click_tabla(evento) {
    if (evento.target.classList.contains('btn_eliminar_examen')) {
        const id_seleccionado = parseInt(evento.target.getAttribute('data-id'));
        
        const confirmacion = confirm('¿Está completamente seguro de que desea eliminar permanentemente este examen ETS de la programación oficial?');
        
        if (confirmacion) {
            const respuesta = await servicio_api.eliminar_examen(id_seleccionado);
            
            if (respuesta.estado === 'exito') {
                await cargar_listado_examenes();
            } else {
                alert(respuesta.mensaje);
            }
        }
    }
}

async function procesar_salida() {
    const respuesta = await servicio_api.cerrar_sesion();
    if (respuesta.estado === 'exito') {
        window.location.href = '../../login.html';
    } else {
        alert('Hubo un problema al cerrar la sesión de forma segura.');
    }
}

document.addEventListener('DOMContentLoaded', inicializar_dashboard);