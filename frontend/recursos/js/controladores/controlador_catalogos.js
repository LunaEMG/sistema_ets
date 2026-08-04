/**
 * Controlador para administrar la interfaz CRUD de los distintos catálogos en el panel admin.
 */
import { servicio_api } from '../servicios/servicio_api.js';
import { escaparHTML } from '../utilidades/escape.js';
import { obtener_color_carrera } from '../utilidades/color_carrera.js';

let lista_carreras = [];

async function inicializar_pagina() {
    await verificar_acceso();
    await cargar_datos();
}

async function verificar_acceso() {
    const comprobacion = await servicio_api.verificar_sesion();
    if (comprobacion.estado !== 'autenticado') {
        window.location.href = '../../login.html';
    }
}

async function cargar_datos() {
    const [carreras, materias, profesores] = await Promise.all([
        servicio_api.obtener_carreras(),
        servicio_api.obtener_todas_materias(),
        servicio_api.obtener_profesores()
    ]);
    
    lista_carreras = carreras;

    renderizar_tabla_carreras(carreras);
    renderizar_tabla_materias(materias);
    renderizar_tabla_profesores(profesores);
}

function renderizar_tabla_carreras(carreras) {
    const contenedor = document.getElementById('contenedor_tabla_carreras');
    if (carreras.length === 0) {
        contenedor.innerHTML = '<p class="mensaje_alerta">No hay carreras registradas.</p>';
        return;
    }
    
    let html = `<table class="tabla_admin">
        <thead><tr><th>ID</th><th>Nombre de Carrera</th><th style="text-align:right">Acciones</th></tr></thead>
        <tbody>`;
    carreras.forEach(c => {
        html += `<tr>
            <td>${c.id}</td>
            <td class="destacado_primario">
                <span class="badge_carrera" style="background-color: ${obtener_color_carrera(c.nombre_carrera)}; font-size: 0.85rem; padding: 0.3rem 0.8rem;">
                    ${escaparHTML(c.nombre_carrera)}
                </span>
            </td>
            <td class="acciones_fila">
                <button class="btn_accion_nuevo editar" title="Editar Carrera" aria-label="Editar carrera ${escaparHTML(c.nombre_carrera)}" data-id="${c.id}" data-nombre="${escaparHTML(c.nombre_carrera)}" data-tipo="carrera"><i class="fa-solid fa-pen"></i></button>
                <button class="btn_accion_nuevo eliminar" title="Eliminar Carrera" aria-label="Eliminar carrera ${escaparHTML(c.nombre_carrera)}" data-id="${c.id}" data-tipo="carrera"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`;
    });
    html += `</tbody></table>`;
    contenedor.innerHTML = html;
    asignar_eventos();
}

function renderizar_tabla_materias(materias) {
    const contenedor = document.getElementById('contenedor_tabla_materias');
    if (materias.length === 0) {
        contenedor.innerHTML = '<p class="mensaje_alerta">No hay materias registradas.</p>';
        return;
    }
    
    let html = `<table class="tabla_admin">
        <thead><tr><th>ID</th><th>Nombre</th><th>Semestre</th><th>Carrera</th><th style="text-align:right">Acciones</th></tr></thead>
        <tbody>`;
    materias.forEach(m => {
        html += `<tr>
            <td>${m.id}</td>
            <td class="destacado_primario">${escaparHTML(m.nombre_materia)}</td>
            <td>${m.semestre_materia}</td>
            <td class="destacado_secundario">
                <span class="badge_carrera" style="background-color: ${obtener_color_carrera(m.nombre_carrera)};">
                    ${escaparHTML(m.nombre_carrera)}
                </span>
            </td>
            <td class="acciones_fila">
                <button class="btn_accion_nuevo editar" title="Editar Materia" aria-label="Editar materia ${escaparHTML(m.nombre_materia)}" data-id="${m.id}" data-nombre="${escaparHTML(m.nombre_materia)}" data-semestre="${m.semestre_materia}" data-carrera="${m.id_carrera}" data-tipo="materia"><i class="fa-solid fa-pen"></i></button>
                <button class="btn_accion_nuevo eliminar" title="Eliminar Materia" aria-label="Eliminar materia ${escaparHTML(m.nombre_materia)}" data-id="${m.id}" data-tipo="materia"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`;
    });
    html += `</tbody></table>`;
    contenedor.innerHTML = html;
    asignar_eventos();
}

function renderizar_tabla_profesores(profesores) {
    const contenedor = document.getElementById('contenedor_tabla_profesores');
    if (profesores.length === 0) {
        contenedor.innerHTML = '<p class="mensaje_alerta">No hay profesores registrados.</p>';
        return;
    }
    
    let html = `<table class="tabla_admin">
        <thead><tr><th>ID</th><th>Nombre</th><th style="text-align:right">Acciones</th></tr></thead>
        <tbody>`;
    profesores.forEach(p => {
        html += `<tr>
            <td>${p.id}</td>
            <td class="destacado_primario">${escaparHTML(p.nombre_profesor)}</td>
            <td class="acciones_fila">
                <button class="btn_accion_nuevo editar" title="Editar Profesor" aria-label="Editar profesor ${escaparHTML(p.nombre_profesor)}" data-id="${p.id}" data-nombre="${escaparHTML(p.nombre_profesor)}" data-tipo="profesor"><i class="fa-solid fa-pen"></i></button>
                <button class="btn_accion_nuevo eliminar" title="Eliminar Profesor" aria-label="Eliminar profesor ${escaparHTML(p.nombre_profesor)}" data-id="${p.id}" data-tipo="profesor"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`;
    });
    html += `</tbody></table>`;
    contenedor.innerHTML = html;
    asignar_eventos();
}

function asignar_eventos() {
    document.querySelectorAll('.btn_accion_nuevo.editar').forEach(btn => {
        btn.onclick = (e) => manejar_edicion(e.currentTarget);
    });
    document.querySelectorAll('.btn_accion_nuevo.eliminar').forEach(btn => {
        btn.onclick = (e) => manejar_eliminacion(e.currentTarget);
    });
}

async function manejar_edicion(btn) {
    const tipo = btn.dataset.tipo;
    const id = btn.dataset.id;
    
    if (tipo === 'carrera') {
        const nombre_actual = btn.dataset.nombre;
        const { value: nuevo_nombre } = await Swal.fire({
            title: 'Editar Carrera',
            input: 'text',
            inputValue: nombre_actual,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            inputValidator: (val) => !val && 'Requerido'
        });
        if (nuevo_nombre && nuevo_nombre !== nombre_actual) {
            enviar_actualizacion({ accion: 'carrera', id, nombre_carrera: nuevo_nombre });
        }
    } else if (tipo === 'profesor') {
        const nombre_actual = btn.dataset.nombre;
        const { value: formValues } = await Swal.fire({
            title: 'Editar Profesor',
            html: `
                <label for="swal-in-nombre" class="label_swal_admin">Nombre del Profesor:</label>
                <input id="swal-in-nombre" type="text" class="swal2-input" value="${nombre_actual}">
                <label for="swal-in-correo" class="label_swal_admin">Nuevo Correo Institucional (requerido):</label>
                <input id="swal-in-correo" type="email" class="swal2-input" placeholder="correo@ipn.mx">
            `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const n = document.getElementById('swal-in-nombre').value;
                const c = document.getElementById('swal-in-correo').value;
                if(!n || !c) return Swal.showValidationMessage('Todos los campos son requeridos');
                return { nombre: n, correo: c };
            }
        });
        if (formValues) {
            enviar_actualizacion({ accion: 'profesor', id, nombre_profesor: formValues.nombre, correo_electronico: formValues.correo });
        }
    } else if (tipo === 'materia') {
        let opcionesCarrera = lista_carreras.map(c => `<option value="${c.id}" ${c.id == btn.dataset.carrera ? 'selected' : ''}>${c.nombre_carrera}</option>`).join('');
        
        const { value: formValues } = await Swal.fire({
            title: 'Editar Materia',
            html: `
                <label for="swal-m-nombre" class="label_swal_admin">Nombre de la Unidad de Aprendizaje:</label>
                <input id="swal-m-nombre" type="text" class="swal2-input" value="${btn.dataset.nombre}">
                <label for="swal-m-sem" class="label_swal_admin">Nivel / Semestre:</label>
                <input id="swal-m-sem" type="number" class="swal2-input" value="${btn.dataset.semestre}" min="1" max="10">
                <label for="swal-m-car" class="label_swal_admin">Programa Académico (Carrera):</label>
                <select id="swal-m-car" class="swal2-select select_swal_admin">${opcionesCarrera}</select>
            `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const n = document.getElementById('swal-m-nombre').value;
                const s = document.getElementById('swal-m-sem').value;
                const c = document.getElementById('swal-m-car').value;
                if(!n || !s || !c) return Swal.showValidationMessage('Completar todos los datos');
                return { nombre: n, semestre: s, carrera: c };
            }
        });
        if (formValues) {
            enviar_actualizacion({ accion: 'materia', id, nombre_materia: formValues.nombre, semestre_materia: formValues.semestre, id_carrera: formValues.carrera });
        }
    }
}

async function enviar_actualizacion(datos) {
    const res = await servicio_api.actualizar_catalogo(datos);
    if (res.estado === 'exito') {
        Swal.fire('Actualizado', 'Los cambios han sido guardados.', 'success');
        cargar_datos();
    } else {
        Swal.fire('Error', res.mensaje, 'error');
    }
}

async function manejar_eliminacion(btn) {
    const tipo = btn.dataset.tipo;
    const id = btn.dataset.id;
    
    const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Si hay registros dependiendo de este elemento, la eliminación será denegada por seguridad.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
        const res = await servicio_api.eliminar_catalogo(tipo, id);
        if (res.estado === 'exito') {
            Swal.fire('Eliminado', 'El registro ha sido eliminado exitosamente.', 'success');
            cargar_datos();
        } else {
            Swal.fire('No se pudo eliminar', res.mensaje, 'error');
        }
    }
}

document.addEventListener('DOMContentLoaded', inicializar_pagina);
