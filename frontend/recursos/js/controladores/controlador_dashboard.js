/**
 * Controlador para blindar el Dashboard Administrativo y gestionar sus acciones.
 */
import { servicio_api } from '../servicios/servicio_api.js';
import { componente_tabla_admin } from '../componentes/componente_tabla_admin.js';

// 1. Declaración e indexación de elementos del DOM
const texto_bienvenida_usuario = document.getElementById('texto_bienvenida_usuario');
const btn_cerrar_sesion = document.getElementById('btn_cerrar_sesion');
const contenedor_tabla = document.getElementById('contenedor_tabla_examenes');
const contenedor_stats = document.getElementById('contenedor_estadisticas');

async function inicializar_dashboard() {
    const comprobacion = await servicio_api.verificar_sesion();

    if (comprobacion.estado !== 'autenticado') {
        window.location.href = '../../login.html';
        return;
    }

    texto_bienvenida_usuario.textContent = `Administrador activo: ${comprobacion.usuario.correo_electronico}`;
    
    btn_cerrar_sesion.addEventListener('click', procesar_salida);
    contenedor_tabla.addEventListener('click', evaluar_click_tabla);
    cargar_listado_examenes();
    cargar_tarjetas_estadisticas();
}

async function cargar_tarjetas_estadisticas() {
    try {
        const metricas = await servicio_api.obtener_estadisticas();
        console.log("[Dashboard Stats] Datos recibidos de la API:", metricas);
        
        const resolverIconoCarrera = (nombreCarrera) => {
            const nombre = nombreCarrera.toLowerCase();
            if (nombre.includes('sistema')) return 'fa-laptop-code';
            if (nombre.includes('inteligencia') || nombre.includes('artificial')) return 'fa-brain';
            if (nombre.includes('dato')) return 'fa-database';
            return 'fa-graduation-cap';
        };
        
        if (!metricas || metricas.length === 0) {
            contenedor_stats.innerHTML = `
                <div style="background-color: #ffffff; padding: 1.25rem; border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 5px solid #006293; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="font-size: 0.8rem; color: #666666; text-transform: uppercase; margin-bottom: 0.5rem; font-weight: 600;">Ingeniería en Sistemas Computacionales</h4>
                        <p style="font-size: 1.8rem; font-weight: 700; color: #006293; margin: 0;">0 <span style="font-size: 0.9rem; font-weight: 400; color: #7f8c8d;">registrados</span></p>
                    </div>
                    <i class="fa-solid fa-laptop-code" style="font-size: 1.75rem; color: #cbd5e1;"></i>
                </div>
                <div style="background-color: #ffffff; padding: 1.25rem; border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 5px solid #006293; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="font-size: 0.8rem; color: #666666; text-transform: uppercase; margin-bottom: 0.5rem; font-weight: 600;">Ingeniería en Inteligencia Artificial</h4>
                        <p style="font-size: 1.8rem; font-weight: 700; color: #006293; margin: 0;">0 <span style="font-size: 0.9rem; font-weight: 400; color: #7f8c8d;">registrados</span></p>
                    </div>
                    <i class="fa-solid fa-brain" style="font-size: 1.75rem; color: #cbd5e1;"></i>
                </div>
                <div style="background-color: #ffffff; padding: 1.25rem; border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 5px solid #006293; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="font-size: 0.8rem; color: #666666; text-transform: uppercase; margin-bottom: 0.5rem; font-weight: 600;">Licenciatura en Ciencia de Datos</h4>
                        <p style="font-size: 1.8rem; font-weight: 700; color: #006293; margin: 0;">0 <span style="font-size: 0.9rem; font-weight: 400; color: #7f8c8d;">registrados</span></p>
                    </div>
                    <i class="fa-solid fa-database" style="font-size: 1.75rem; color: #cbd5e1;"></i>
                </div>
            `;
            return;
        }

        let html_tarjetas = '';
        metricas.forEach(stat => {
            const iconoClase = resolverIconoCarrera(stat.nombre_carrera);
            html_tarjetas += `
                <div style="background-color: #ffffff; padding: 1.25rem; border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 5px solid #006293; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="font-size: 0.8rem; color: #666666; text-transform: uppercase; margin-bottom: 0.5rem; font-weight: 600;">
                            ${stat.nombre_carrera}
                        </h4>
                        <p style="font-size: 1.8rem; font-weight: 700; color: #006293; margin: 0;">
                            ${stat.total_examenes} <span style="font-size: 0.9rem; font-weight: 400; color: #7f8c8d;">registrados</span>
                        </p>
                    </div>
                    <i class="fa-solid ${iconoClase}" style="font-size: 1.75rem; color: #cbd5e1;"></i>
                </div>
            `;
        });
        
        contenedor_stats.innerHTML = html_tarjetas;
    } catch (err) {
        console.error("Error en cargar_tarjetas_estadisticas:", err);
    }
}

async function cargar_listado_examenes() {
    contenedor_tabla.innerHTML = '<p class="mensaje_carga">Cargando programación de exámenes...</p>';
    const todos_los_examenes = await servicio_api.buscar_examenes(0, 0, 0);
    contenedor_tabla.innerHTML = componente_tabla_admin.crear_tabla(todos_los_examenes);
}

async function evaluar_click_tabla(evento) {
    if (evento.target.classList.contains('btn_editar_examen') || evento.target.closest('.btn_editar_examen')) {
        const boton = evento.target.classList.contains('btn_editar_examen') ? evento.target : evento.target.closest('.btn_editar_examen');
        const id_seleccionado = parseInt(boton.getAttribute('data-id'));
        window.location.href = `editar_examen.html?id=${id_seleccionado}`;
        return;
    }

    if (evento.target.classList.contains('btn_eliminar_examen') || evento.target.closest('.btn_eliminar_examen')) {
        const boton = evento.target.classList.contains('btn_eliminar_examen') ? evento.target : evento.target.closest('.btn_eliminar_examen');
        const id_seleccionado = parseInt(boton.getAttribute('data-id'));
        const confirmacion = confirm('¿Está completamente seguro de que desea eliminar permanentemente este examen ETS de la programación oficial?');
        
        if (confirmacion) {
            const respuesta = await servicio_api.eliminar_examen(id_seleccionado);
            
            if (respuesta.estado === 'exito') {
                await cargar_listado_examenes();
                await cargar_tarjetas_estadisticas();
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
