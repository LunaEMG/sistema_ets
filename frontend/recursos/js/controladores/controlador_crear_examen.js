/**
 * Controlador modular para gestionar el formulario de alta de examenes ETS.
 */
import { servicio_api } from '../servicios/servicio_api.js';

const formulario = document.getElementById('formulario_alta_examen');
const selector_carrera = document.getElementById('select_carrera');
const selector_materia = document.getElementById('select_materia');
const input_fecha = document.getElementById('input_fecha');
const selector_turno = document.getElementById('select_turno');
const selector_profesor = document.getElementById('select_profesor');
const selector_salon = document.getElementById('select_salon');
const contenedor_mensaje = document.getElementById('mensaje_alerta');

async function inicializar_formulario() {
    const comprobacion = await servicio_api.verificar_sesion();
    if (comprobacion.estado !== 'autenticado') {
        window.location.href = '../../login.html';
        return;
    }

    const [carreras, profesores, salones] = await Promise.all([
        servicio_api.obtener_carreras(),
        servicio_api.obtener_profesores(),
        servicio_api.obtener_salones()
    ]);

    carreras.forEach(c => {
        const op = new Option(c.nombre_carrera, c.id);
        selector_carrera.add(op);
    });
    profesores.forEach(p => {
        const op = new Option(p.nombre_profesor, p.id);
        selector_profesor.add(op);
    });
    salones.forEach(s => {
        const op = new Option(s.ubicacion_completa, s.id);
        selector_salon.add(op);
    });
    selector_carrera.addEventListener('change', async (e) => {
        const id_carrera = parseInt(e.target.value);
        selector_materia.innerHTML = '<option value="0">Seleccione una materia...</option>';
        selector_materia.disabled = true;

        if (id_carrera > 0) {
            const materias = await servicio_api.obtener_materias_por_carrera(id_carrera);
            materias.forEach(m => {
                const op = new Option(`[Semestre ${m.semestre_materia}] - ${m.nombre_materia}`, m.id);
                selector_materia.add(op);
            });
            selector_materia.disabled = false;
        }
    });

    formulario.addEventListener('submit', procesar_registro_examen);
}

async function procesar_registro_examen(e) {
    e.preventDefault();
    ocultar_mensaje();

    const payload = {
        id_materia: parseInt(selector_materia.value),
        fecha_examen: input_fecha.value,
        turno_examen: selector_turno.value,
        id_salon: parseInt(selector_salon.value),
        id_profesor: parseInt(selector_profesor.value)
    };

    if (payload.id_materia === 0 || !payload.fecha_examen || !payload.turno_examen || payload.id_salon === 0 || payload.id_profesor === 0) {
        mostrar_mensaje('Todos los campos son obligatorios.', '#e74c3c', '#fde8e7');
        return;
    }

    const respuesta = await servicio_api.crear_examen(payload);

    if (respuesta.estado === 'exito') {
        mostrar_mensaje(respuesta.mensaje, '#27ae60', '#e8f8f5');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
    } else {
        mostrar_mensaje(respuesta.mensaje, '#e74c3c', '#fde8e7');
    }
}

function mostrar_mensaje(texto, color_texto, color_fondo) {
    contenedor_mensaje.textContent = texto;
    contenedor_mensaje.style.color = color_texto;
    contenedor_mensaje.style.backgroundColor = color_fondo;
    contenedor_mensaje.style.border = `1px solid ${color_texto}`;
    contenedor_mensaje.style.display = 'block';
}

function ocultar_mensaje() {
    contenedor_mensaje.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', inicializar_formulario);