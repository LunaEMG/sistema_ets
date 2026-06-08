/**
 * Controlador para la modificación de exámenes.
 */
import { servicio_api } from '../servicios/servicio_api.js';

const formulario = document.getElementById('formulario_editar_examen');
const selector_carrera = document.getElementById('select_carrera');
const selector_materia = document.getElementById('select_materia');
const input_fecha = document.getElementById('input_fecha');
const selector_hora_manana = document.getElementById('select_hora_manana');
const selector_hora_tarde = document.getElementById('select_hora_tarde');
const selector_profesor = document.getElementById('select_profesor');
const contenedor_mensaje = document.getElementById('mensaje_alerta');

const selector_edificio = document.getElementById('select_edificio');
const selector_piso = document.getElementById('select_piso');
const selector_salon_final = document.getElementById('select_salon_final');

const parametros_url = new URLSearchParams(window.location.search);
const id_examen_global = parseInt(parametros_url.get('id')) || 0;

let lista_salones_global = [];

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

        lista_salones_global = salones;

        const datos_examen = lista_examenes.find(e => Number(e.id) === Number(id_examen_global));
        if (!datos_examen) {
            window.location.href = 'dashboard.html';
            return;
        }

        carreras.forEach(c => selector_carrera.add(new Option(c.nombre_carrera, c.id)));
        profesores.forEach(p => selector_profesor.add(new Option(p.nombre_profesor, p.id)));

        const codigo_4_digitos = datos_examen.nombre_salon;
        const digito_edificio = codigo_4_digitos.charAt(0);
        const digito_piso = codigo_4_digitos.charAt(1);

        selector_edificio.value = digito_edificio;
        selector_piso.disabled = false;
        selector_piso.value = digito_piso;

        const prefijo = `${digito_edificio}${digito_piso}`;
        const aulas_filtradas = lista_salones_global.filter(s => s.ubicacion_completa.split(' - ')[1].startsWith(prefijo));
        
        selector_salon_final.innerHTML = '<option value="">Seleccione aula...</option>';
        aulas_filtradas.forEach(s => {
            const cod = s.ubicacion_completa.split(' - ')[1];
            selector_salon_final.add(new Option(`Aula/Lab ${cod.substring(2)} (Código ${cod})`, s.id));
        });
        
        selector_salon_final.disabled = false;
        
        const salon_encontrado = lista_salones_global.find(s => s.ubicacion_completa.split(' - ')[1] === codigo_4_digitos);
        if (salon_encontrado) selector_salon_final.value = salon_encontrado.id;

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

        if (input_fecha) {
            flatpickr(input_fecha, {
                dateFormat: "Y-m-d",
                altInput: true,
                altFormat: "d/m/Y",
                allowInput: true,
                locale: "es",
                defaultDate: datos_examen.fecha_examen
            });
        }
        selector_hora_manana.value = datos_examen.hora_manana;
        selector_hora_tarde.value = datos_examen.hora_tarde;
        
        const prof_encontrado = profesores.find(p => p.nombre_profesor === datos_examen.nombre_profesor);
        if (prof_encontrado) selector_profesor.value = prof_encontrado.id;

    } catch (error) {
        console.error("Error al inicializar edicion:", error);
    }

    selector_edificio.addEventListener('change', () => {
        if (selector_edificio.value !== "") {
            selector_piso.disabled = false;
            selector_piso.value = "";
            selector_salon_final.innerHTML = '<option value="">Seleccione piso...</option>';
            selector_salon_final.disabled = true;
        } else {
            selector_piso.disabled = true;
            selector_piso.value = "";
            selector_salon_final.innerHTML = '<option value="">Seleccione piso...</option>';
            selector_salon_final.disabled = true;
        }
    });

    selector_piso.addEventListener('change', () => {
        const ed = selector_edificio.value;
        const pi = selector_piso.value;
        selector_salon_final.innerHTML = '<option value="">Seleccione aula...</option>';
        if (ed && pi) {
            const pref = `${ed}${pi}`;
            const fil = lista_salones_global.filter(s => s.ubicacion_completa.split(' - ')[1].startsWith(pref));
            fil.forEach(s => {
                const c = s.ubicacion_completa.split(' - ')[1];
                selector_salon_final.add(new Option(`Aula/Lab ${c.substring(2)} (Código ${c})`, s.id));
            });
            selector_salon_final.disabled = false;
        } else {
            selector_salon_final.disabled = true;
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
        id_salon: parseInt(selector_salon_final.value),
        id_profesor: parseInt(selector_profesor.value)
    };

    if (payload.id_materia === 0 || !payload.fecha_examen || payload.id_salon === 0 || payload.id_profesor === 0) {
        Swal.fire('Atención', 'Todos los campos son obligatorios.', 'warning');
        return;
    }

    const respuesta = await servicio_api.actualizar_examen(payload);
    if (respuesta.estado === 'exito') {
        Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: respuesta.mensaje,
            showConfirmButton: false,
            timer: 2000
        }).then(() => {
            window.location.href = 'dashboard.html';
        });
    } else {
        Swal.fire('Error', respuesta.mensaje, 'error');
    }
}



document.addEventListener('DOMContentLoaded', inicializar_edicion);