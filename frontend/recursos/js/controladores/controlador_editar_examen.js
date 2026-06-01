import { servicio_api } from '../servicios/servicio_api.js';

const formulario = document.getElementById('formulario_editar_examen');
const selector_carrera = document.getElementById('select_carrera');
const selector_materia = document.getElementById('select_materia');
const input_fecha = document.getElementById('input_fecha');
// MODIFICADO: Agregados selectores de doble horario correspondientes
const selector_hora_manana = document.getElementById('select_hora_manana');
const selector_hora_tarde = document.getElementById('select_hora_tarde');
const selector_profesor = document.getElementById('select_profesor');
const selector_salon = document.getElementById('select_salon');
const contenedor_mensaje = document.getElementById('mensaje_alerta');

const parametros_url = new URLSearchParams(window.location.search);
const id_examen_global = parseInt(parametros_url.get('id')) || 0;

async function inicializar_edicion() {
    const comprobacion = await servicio_api.verificar_sesion();
    if (comprobacion.estado !== 'autenticado' || id_examen_global === 0) {
        window.location.href = '../../login.html';
        return;
    }

    try {
        const [carreras, profesores, salones, lista_examenes] = await Promise.all([
            servicio_api.obtener_carreras(),
            servicio_api.obtener_profesores(),
            servicio_api.obtener_salones(),
            servicio_api.buscar_examenes(0, 0, 0)
        ]);

        const datos_examen = lista_examenes.find(e => Number(e.id) === Number(id_examen_global));
        if (!datos_examen) {
            window.location.href = 'dashboard.html';
            return;
        }

        carreras.forEach(c => selector_carrera.add(new Option(c.nombre_carrera, c.id)));
        profesores.forEach(p => selector_profesor.add(new Option(p.nombre_profesor, p.id)));
        salones.forEach(s => selector_salon.add(new Option(s.ubicacion_completa, s.id)));

        const carrera_actual = carreras.find(c => c.nombre_carrera === datos_examen.nombre_carrera);
        if (carrera_actual) {
            selector_carrera.value = carrera_actual.id;
            
            const materias = await servicio_api.obtener_materias_por_carrera(carrera_actual.id);
            selector_materia.innerHTML = '<option value="0">Seleccione una materia...</option>';
            materias.forEach(m => {
                selector_materia.add(new Option(`[Semestre ${m.semestre_materia}] - ${m.nombre_materia}`, m.id));
            });
            selector_materia.disabled = false;

            const materia_encontrada = materias.find(m => m.nombre_materia === datos_examen.nombre_materia);
            if (materia_encontrada) selector_materia.value = materia_encontrada.id;
        }

        input_fecha.value = datos_examen.fecha_examen;
        
        selector_hora_manana.value = datos_examen.hora_manana;
        selector_hora_tarde.value = datos_examen.hora_tarde;
        
        const prof_encontrado = profesores.find(p => p.nombre_profesor === datos_examen.nombre_profesor);
        if (prof_encontrado) selector_profesor.value = prof_encontrado.id;

        const ubicacion_string = `${datos_examen.nombre_edificio} - ${datos_examen.nombre_salon}`;
        const salon_encontrado = salones.find(s => s.ubicacion_completa === ubicacion_string);
        if (salon_encontrado) selector_salon.value = salon_encontrado.id;

    } catch (error) {
        console.error("Error al inicializar edicion:", error);
    }

    selector_carrera.addEventListener('change', async (e) => {
        const id_carrera = parseInt(e.target.value);
        selector_materia.innerHTML = '<option value="0">Cargando materias...</option>';
        selector_materia.disabled = true;

        if (id_carrera > 0) {
            const materias = await servicio_api.obtener_materias_por_carrera(id_carrera);
            selector_materia.innerHTML = '<option value="0">Seleccione una materia...</option>';
            materias.forEach(m => {
                selector_materia.add(new Option(`[Semestre ${m.semestre_materia}] - ${m.nombre_materia}`, m.id));
            });
            selector_materia.disabled = false;
        }
    });

    formulario.addEventListener('submit', enviar_actualizacion);
}

async function enviar_actualizacion(e) {
    e.preventDefault();
    
    const payload = {
        id_examen: id_examen_global,
        id_materia: parseInt(selector_materia.value),
        fecha_examen: input_fecha.value,
        hora_manana: selector_hora_manana.value,
        hora_tarde: selector_hora_tarde.value,
        id_salon: parseInt(selector_salon.value),
        id_profesor: parseInt(selector_profesor.value)
    };

    const respuesta = await servicio_api.actualizar_examen(payload);
    if (respuesta.estado === 'exito') {
        window.location.href = 'dashboard.html';
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

document.addEventListener('DOMContentLoaded', inicializar_edicion);