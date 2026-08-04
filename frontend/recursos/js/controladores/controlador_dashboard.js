/**
 * Controlador que maneja la vista principal del administrador y carga de estadísticas.
 */
import { servicio_api } from '../servicios/servicio_api.js';
import { componente_tabla_admin } from '../componentes/componente_tabla_admin.js';

const texto_bienvenida_usuario = document.getElementById('texto_bienvenida_usuario');
const btn_cerrar_sesion = document.getElementById('btn_cerrar_sesion');
const contenedor_tabla = document.getElementById('contenedor_tabla_examenes');
const contenedor_stats = document.getElementById('contenedor_estadisticas');

const selector_carrera = document.getElementById('select_carrera');
const selector_semestre = document.getElementById('select_semestre');
const selector_materia = document.getElementById('select_materia');
const boton_buscar = document.getElementById('btn_buscar');
const input_buscador_texto = document.getElementById('input_buscador_texto');

let examenes_memoria = [];
let examenes_filtrados = [];
let pagina_actual = 1;
const ITEMS_POR_PAGINA = 10;

async function inicializar_dashboard() {
    const comprobacion = await servicio_api.verificar_sesion();

    if (comprobacion.estado !== 'autenticado') {
        window.location.href = '../../login.html';
        return;
    }

    texto_bienvenida_usuario.textContent = `Administrador activo: ${comprobacion.usuario.correo_electronico}`;
    
    btn_cerrar_sesion.addEventListener('click', procesar_salida);
    contenedor_tabla.addEventListener('click', evaluar_click_tabla);
    
    await inicializar_selectores();

    cargar_listado_examenes();
    cargar_tarjetas_estadisticas();
}

async function inicializar_selectores() {
    const lista_carreras = await servicio_api.obtener_carreras();
    
    lista_carreras.forEach(carrera => {
        const opcion = document.createElement('option');
        opcion.value = carrera.id;
        opcion.textContent = carrera.nombre_carrera;
        selector_carrera.appendChild(opcion);
    });

    selector_carrera.addEventListener('change', async (evento) => {
        const id_seleccionado = evento.target.value;
        selector_materia.innerHTML = '<option value="0">Todas las materias</option>';
        selector_materia.disabled = true;

        if (id_seleccionado > 0) {
            const lista_materias = await servicio_api.obtener_materias_por_carrera(id_seleccionado);
            lista_materias.forEach(materia => {
                const opcion = document.createElement('option');
                opcion.value = materia.id;
                opcion.textContent = `[Semestre ${materia.semestre_materia}] - ${materia.nombre_materia}`;
                selector_materia.appendChild(opcion);
            });
            selector_materia.disabled = false;
        }
    });

    boton_buscar.addEventListener('click', cargar_listado_examenes);

    if (input_buscador_texto) {
        let temporizador_debounce;
        input_buscador_texto.addEventListener('input', () => {
            clearTimeout(temporizador_debounce);
            temporizador_debounce = setTimeout(() => {
                pagina_actual = 1;
                filtrar_por_texto();
            }, 300);
        });
    }
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
                <div class="tarjeta_stat_nueva">
                    <div class="info_stat_nueva">
                        <p class="titulo_stat_nuevo">Sistemas Computacionales</p>
                        <h3 class="valor_stat_nuevo">0</h3>
                    </div>
                    <div class="icono_stat_nuevo">
                        <i class="fa-solid fa-laptop-code"></i>
                    </div>
                </div>
                <div class="tarjeta_stat_nueva">
                    <div class="info_stat_nueva">
                        <p class="titulo_stat_nuevo">Inteligencia Artificial</p>
                        <h3 class="valor_stat_nuevo">0</h3>
                    </div>
                    <div class="icono_stat_nuevo">
                        <i class="fa-solid fa-brain"></i>
                    </div>
                </div>
                <div class="tarjeta_stat_nueva">
                    <div class="info_stat_nueva">
                        <p class="titulo_stat_nuevo">Ciencia de Datos</p>
                        <h3 class="valor_stat_nuevo">0</h3>
                    </div>
                    <div class="icono_stat_nuevo">
                        <i class="fa-solid fa-database"></i>
                    </div>
                </div>
            `;
            return;
        }

        let html_tarjetas = '';
        metricas.forEach(stat => {
            const iconoClase = resolverIconoCarrera(stat.nombre_carrera);
            html_tarjetas += `
                <div class="tarjeta_stat_nueva">
                    <div class="info_stat_nueva">
                        <p class="titulo_stat_nuevo">${stat.nombre_carrera}</p>
                        <h3 class="valor_stat_nuevo">${stat.total_examenes}</h3>
                    </div>
                    <div class="icono_stat_nuevo">
                        <i class="fa-solid ${iconoClase}"></i>
                    </div>
                </div>
            `;
        });
        
        contenedor_stats.innerHTML = html_tarjetas;
    } catch (err) {
        console.error("Error en cargar_tarjetas_estadisticas:", err);
    }
}

async function cargar_listado_examenes() {
    let skeletons_html = '';
    for(let i = 0; i < 5; i++) {
        skeletons_html += `
            <tr class="skeleton_row">
                <td><div class="skeleton_text w_70"></div></td>
                <td><div class="skeleton_text w_100"></div></td>
                <td><div class="skeleton_badge"></div></td>
                <td><div class="skeleton_text w_50"></div></td>
                <td><div class="skeleton_text w_100"></div></td>
                <td><div class="skeleton_text w_50"></div></td>
                <td><div class="skeleton_text w_70"></div></td>
                <td>
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                        <div class="skeleton_btn"></div><div class="skeleton_btn"></div>
                    </div>
                </td>
            </tr>
        `;
    }

    contenedor_tabla.innerHTML = `
        <div class="contenedor_tabla_nuevo">
            <table class="tabla_nueva">
                <thead class="encabezado_tabla_nuevo">
                    <tr><th>Materia</th><th>Carrera</th><th>Semestre</th><th>Fecha</th><th>Horarios</th><th>Ubicación</th><th>Coordinador</th><th style="text-align: right;">Acciones</th></tr>
                </thead>
                <tbody class="cuerpo_tabla_nuevo">
                    ${skeletons_html}
                </tbody>
            </table>
        </div>
    `;

    const carrera = selector_carrera ? selector_carrera.value : 0;
    const semestre = selector_semestre ? selector_semestre.value : 0;
    const materia = selector_materia ? selector_materia.value : 0;

    examenes_memoria = await servicio_api.buscar_examenes(carrera, semestre, materia);
    pagina_actual = 1;
    filtrar_por_texto();
}

function normalizar_texto(texto) {
    if (!texto) return '';
    return texto.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filtrar_por_texto() {
    if (!input_buscador_texto) {
        examenes_filtrados = [...examenes_memoria];
        renderizar_tabla_paginada();
        return;
    }

    const texto_busqueda = normalizar_texto(input_buscador_texto.value);
    
    if (texto_busqueda === '') {
        examenes_filtrados = [...examenes_memoria];
    } else {
        examenes_filtrados = examenes_memoria.filter(examen => {
            const mat = normalizar_texto(examen.nombre_materia);
            const prof = normalizar_texto(examen.nombre_profesor);
            const car = normalizar_texto(examen.nombre_carrera);
            const id = normalizar_texto(examen.id);
            
            return mat.includes(texto_busqueda) || 
                   prof.includes(texto_busqueda) || 
                   car.includes(texto_busqueda) || 
                   id.includes(texto_busqueda);
        });
    }

    renderizar_tabla_paginada();
}

function renderizar_tabla_paginada() {
    contenedor_tabla.innerHTML = componente_tabla_admin.crear_tabla(examenes_filtrados, pagina_actual, ITEMS_POR_PAGINA);
}

async function evaluar_click_tabla(evento) {
    if (evento.target.classList.contains('btn_nav_pagina') || evento.target.closest('.btn_nav_pagina')) {
        const boton = evento.target.classList.contains('btn_nav_pagina') ? evento.target : evento.target.closest('.btn_nav_pagina');
        if (!boton.disabled) {
            pagina_actual = parseInt(boton.getAttribute('data-pagina'));
            renderizar_tabla_paginada();
        }
        return;
    }

    if (evento.target.classList.contains('btn_editar_examen') || evento.target.closest('.btn_editar_examen')) {
        const boton = evento.target.classList.contains('btn_editar_examen') ? evento.target : evento.target.closest('.btn_editar_examen');
        const id_seleccionado = parseInt(boton.getAttribute('data-id'));
        window.location.href = `editar_examen.html?id=${id_seleccionado}`;
        return;
    }

    if (evento.target.classList.contains('btn_eliminar_examen') || evento.target.closest('.btn_eliminar_examen')) {
        const boton = evento.target.classList.contains('btn_eliminar_examen') ? evento.target : evento.target.closest('.btn_eliminar_examen');
        const id_seleccionado = parseInt(boton.getAttribute('data-id'));
        
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas eliminar permanentemente este examen ETS de la programación oficial?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: '#7f8c8d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const respuesta = await servicio_api.eliminar_examen(id_seleccionado);
                
                if (respuesta.estado === 'exito') {
                    Swal.fire('¡Eliminado!', 'El examen ha sido eliminado.', 'success');
                    await cargar_listado_examenes();
                    await cargar_tarjetas_estadisticas();
                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            }
        });
    }
}

async function procesar_salida() {
    Swal.fire({
        title: 'Cerrando sesión',
        text: '¡Hasta pronto!',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
        willClose: async () => {
            const respuesta = await servicio_api.cerrar_sesion();
            if (respuesta.estado === 'exito') {
                window.location.replace('../../login.html');
            } else {
                Swal.fire('Error', 'Hubo un problema al cerrar la sesión de forma segura.', 'error');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', inicializar_dashboard);
