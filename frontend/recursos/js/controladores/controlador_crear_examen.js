/**
 * Módulo de Alta de Exámenes - ESCOM IPN
 * Gestiona selectores encadenados y validación asíncrona de datos de forma defensiva.
 */
import { servicio_api } from '../servicios/servicio_api.js';

const formulario = document.getElementById('formulario_alta_examen');
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

let lista_salones_global = [];

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

    lista_salones_global = salones;

    if (input_fecha) {
        flatpickr(input_fecha, {
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "d/m/Y",
            allowInput: true,
            locale: "es",
            minDate: "today"
        });
    }

    if (selector_carrera && carreras) {
        selector_carrera.innerHTML = '<option value="0">Seleccione una carrera...</option>';
        carreras.forEach(c => selector_carrera.add(new Option(c.nombre_carrera, c.id)));
    }
    
    if (selector_profesor && profesores) {
        selector_profesor.innerHTML = '<option value="0">Seleccione un profesor...</option>';
        profesores.forEach(p => selector_profesor.add(new Option(p.nombre_profesor, p.id)));
    }

    if (selector_edificio && selector_piso && selector_salon_final) {
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
            const ed_num = selector_edificio.value;
            const piso_num = selector_piso.value;
            selector_salon_final.innerHTML = '<option value="">Seleccione aula...</option>';
            
            if (ed_num !== "" && piso_num !== "") {
                const prefijo_busqueda = `${ed_num}${piso_num}`;
                
                const aulas_filtradas = lista_salones_global.filter(s => {
                    const codigo_4_digitos = s.ubicacion_completa.split(' - ')[1];
                    return codigo_4_digitos.startsWith(prefijo_busqueda);
                });

                aulas_filtradas.forEach(s => {
                    const codigo_4_digitos = s.ubicacion_completa.split(' - ')[1];
                    const numero_aula_corto = codigo_4_digitos.substring(2);
                    selector_salon_final.add(new Option(`Aula / Lab ${numero_aula_corto} (Código ${codigo_4_digitos})`, s.id));
                });

                selector_salon_final.disabled = false;
            } else {
                selector_salon_final.disabled = true;
            }
        });
    }

    if (selector_carrera && selector_materia) {
        selector_carrera.addEventListener('change', async (e) => {
            const id_carrera = parseInt(e.target.value);
            selector_materia.innerHTML = '<option value="0">Seleccione una materia...</option>';
            selector_materia.disabled = true;

            if (id_carrera > 0) {
                const materias = await servicio_api.obtener_materias_por_carrera(id_carrera);
                materias.forEach(m => {
                    selector_materia.add(new Option(`[Semestre ${m.semestre_materia}] - ${m.nombre_materia}`, m.id));
                });
                selector_materia.disabled = false;
            }
        });
    }

    if (formulario) {
        formulario.addEventListener('submit', procesar_registro_examen);
    }
}

async function procesar_registro_examen(e) {
    e.preventDefault();

    const payload = {
        id_materia: parseInt(selector_materia.value),
        fecha_examen: input_fecha.value,
        type: undefined,
        hora_manana: selector_hora_manana.value,
        hora_tarde: selector_hora_tarde.value,
        id_salon: parseInt(selector_salon_final.value),
        id_profesor: parseInt(selector_profesor.value)
    };

    if (payload.id_materia === 0 || !payload.fecha_examen || !payload.hora_manana || !payload.hora_tarde || payload.id_salon === 0 || payload.id_profesor === 0) {
        Swal.fire('Atención', 'Todos los campos son obligatorios.', 'warning');
        return;
    }

    const respuesta = await servicio_api.crear_examen(payload);
    if (respuesta.estado === 'exito') {
        Swal.fire({
            icon: 'success',
            title: '¡Registrado!',
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



document.addEventListener('DOMContentLoaded', inicializar_formulario);