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

const btn_agregar_carrera = document.getElementById('btn_agregar_carrera');
const btn_agregar_materia = document.getElementById('btn_agregar_materia');
const btn_agregar_profesor = document.getElementById('btn_agregar_profesor');

const selector_edificio = document.getElementById('select_edificio');
const selector_piso = document.getElementById('select_piso');
const selector_salon_final = document.getElementById('select_salon_final');

const error_carrera = document.getElementById('error_carrera');
const error_materia = document.getElementById('error_materia');
const error_fecha = document.getElementById('error_fecha');
const error_hora_manana = document.getElementById('error_hora_manana');
const error_hora_tarde = document.getElementById('error_hora_tarde');
const error_profesor = document.getElementById('error_profesor');
const error_edificio = document.getElementById('error_edificio');
const error_piso = document.getElementById('error_piso');
const error_salon_final = document.getElementById('error_salon_final');

let lista_salones_global = [];
let estado_formulario_modificado = false;

function marcar_modificado() {
    estado_formulario_modificado = true;
}

function mostrar_error_inline(input, span_error, mensaje) {
    span_error.textContent = mensaje;
    span_error.classList.remove('oculta_mensaje');
    input.classList.add('input_invalido');
}

function limpiar_error_inline(input, span_error) {
    span_error.classList.add('oculta_mensaje');
    input.classList.remove('input_invalido');
}

function validar_select(input, span_error, valor_invalido = ["0", ""]) {
    if (valor_invalido.includes(input.value)) {
        mostrar_error_inline(input, span_error, 'Por favor, seleccione una opción válida.');
        return false;
    }
    limpiar_error_inline(input, span_error);
    return true;
}

function validar_texto(input, span_error) {
    if (input.value.trim() === '') {
        mostrar_error_inline(input, span_error, 'Este campo es obligatorio.');
        return false;
    }
    limpiar_error_inline(input, span_error);
    return true;
}

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

    window.addEventListener('beforeunload', (e) => {
        if (estado_formulario_modificado) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    const enlace_volver = document.querySelector('a[href="dashboard.html"]');
    if (enlace_volver) {
        enlace_volver.addEventListener('click', (e) => {
            if (estado_formulario_modificado) {
                e.preventDefault();
                Swal.fire({
                    title: '¿Salir sin guardar?',
                    text: "Tienes cambios no guardados que se perderán.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#e74c3c',
                    cancelButtonColor: '#95a5a6',
                    confirmButtonText: 'Sí, salir',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        estado_formulario_modificado = false;
                        window.location.href = 'dashboard.html';
                    }
                });
            }
        });
    }

    // Configurar validaciones en línea (blur / change)
    [selector_carrera, selector_materia, selector_hora_manana, selector_hora_tarde, selector_profesor, selector_edificio, selector_piso, selector_salon_final].forEach(select => {
        if(select) {
            select.addEventListener('change', () => {
                marcar_modificado();
                validar_select(select, document.getElementById(`error_${select.id.replace('select_','')}`));
            });
        }
    });

    if (input_fecha) {
        flatpickr(input_fecha, {
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "d/m/Y",
            allowInput: true,
            locale: "es",
            minDate: "today",
            onChange: () => {
                marcar_modificado();
                validar_texto(input_fecha, error_fecha);
            }
        });
        input_fecha.addEventListener('blur', () => {
            validar_texto(input_fecha, error_fecha);
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
                if(btn_agregar_materia) btn_agregar_materia.disabled = false;
            } else {
                if(btn_agregar_materia) btn_agregar_materia.disabled = true;
            }
        });
    }

    if (btn_agregar_carrera) {
        btn_agregar_carrera.addEventListener('click', async () => {
            const { value: nombre_carrera } = await Swal.fire({
                title: 'Nueva Carrera',
                input: 'text',
                inputLabel: 'Nombre de la Carrera',
                inputPlaceholder: 'Ej. Ingeniería en Sistemas Computacionales',
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar',
                inputValidator: (value) => {
                    if (!value) return '¡El nombre es obligatorio!'
                }
            });

            if (nombre_carrera) {
                const res = await servicio_api.crear_catalogo({ accion: 'carrera', nombre_carrera });
                if (res.estado === 'exito') {
                    selector_carrera.add(new Option(nombre_carrera, res.id));
                    selector_carrera.value = res.id;
                    selector_carrera.dispatchEvent(new Event('change'));
                    Swal.fire('¡Éxito!', 'Carrera agregada correctamente.', 'success');
                } else {
                    Swal.fire('Error', res.mensaje, 'error');
                }
            }
        });
    }

    if (btn_agregar_materia) {
        btn_agregar_materia.addEventListener('click', async () => {
            const id_carrera = selector_carrera.value;
            if (!id_carrera || id_carrera == "0") return;

            const { value: formValues } = await Swal.fire({
                title: 'Nueva Materia',
                html:
                    '<input id="swal-input1" class="swal2-input" placeholder="Nombre de la Materia">' +
                    '<input id="swal-input2" type="number" class="swal2-input" placeholder="Semestre (Ej. 5)" min="1" max="10">',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const nombre = document.getElementById('swal-input1').value;
                    const semestre = document.getElementById('swal-input2').value;
                    if(!nombre || !semestre) {
                        Swal.showValidationMessage('Todos los campos son obligatorios');
                        return false;
                    }
                    return [nombre, semestre]
                }
            });

            if (formValues) {
                const [nombre_materia, semestre_materia] = formValues;
                const res = await servicio_api.crear_catalogo({ accion: 'materia', nombre_materia, semestre_materia, id_carrera });
                if (res.estado === 'exito') {
                    selector_materia.add(new Option(`[Semestre ${semestre_materia}] - ${nombre_materia}`, res.id));
                    selector_materia.value = res.id;
                    selector_materia.dispatchEvent(new Event('change'));
                    Swal.fire('¡Éxito!', 'Materia agregada correctamente.', 'success');
                } else {
                    Swal.fire('Error', res.mensaje, 'error');
                }
            }
        });
    }

    if (btn_agregar_profesor) {
        btn_agregar_profesor.addEventListener('click', async () => {
            const { value: formValues } = await Swal.fire({
                title: 'Nuevo Profesor',
                html:
                    '<input id="swal-input-p1" class="swal2-input" placeholder="Nombre Completo">' +
                    '<input id="swal-input-p2" type="email" class="swal2-input" placeholder="Correo Electrónico">',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const nombre = document.getElementById('swal-input-p1').value;
                    const correo = document.getElementById('swal-input-p2').value;
                    if(!nombre || !correo) {
                        Swal.showValidationMessage('Todos los campos son obligatorios');
                        return false;
                    }
                    return [nombre, correo]
                }
            });

            if (formValues) {
                const [nombre_profesor, correo_electronico] = formValues;
                const res = await servicio_api.crear_catalogo({ accion: 'profesor', nombre_profesor, correo_electronico });
                if (res.estado === 'exito') {
                    selector_profesor.add(new Option(nombre_profesor, res.id));
                    selector_profesor.value = res.id;
                    selector_profesor.dispatchEvent(new Event('change'));
                    Swal.fire('¡Éxito!', 'Profesor agregado correctamente.', 'success');
                } else {
                    Swal.fire('Error', res.mensaje, 'error');
                }
            }
        });
    }

    if (formulario) {
        formulario.addEventListener('submit', procesar_registro_examen);
    }
}

async function procesar_registro_examen(e) {
    e.preventDefault();

    const v1 = validar_select(selector_carrera, error_carrera);
    const v2 = validar_select(selector_materia, error_materia);
    const v3 = validar_texto(input_fecha, error_fecha);
    const v4 = validar_select(selector_hora_manana, error_hora_manana);
    const v5 = validar_select(selector_hora_tarde, error_hora_tarde);
    const v6 = validar_select(selector_profesor, error_profesor);
    const v7 = validar_select(selector_edificio, error_edificio);
    const v8 = validar_select(selector_piso, error_piso, [""]);
    const v9 = validar_select(selector_salon_final, error_salon_final);

    if (!(v1 && v2 && v3 && v4 && v5 && v6 && v7 && v8 && v9)) {
        const primer_error = formulario.querySelector('.input_invalido');
        if (primer_error) primer_error.focus();
        return;
    }

    const payload = {
        id_materia: parseInt(selector_materia.value),
        fecha_examen: input_fecha.value,
        hora_manana: selector_hora_manana.value,
        hora_tarde: selector_hora_tarde.value,
        id_salon: parseInt(selector_salon_final.value),
        id_profesor: parseInt(selector_profesor.value)
    };

    const boton_enviar = formulario.querySelector('button[type="submit"]');
    const texto_original = boton_enviar.innerHTML;
    boton_enviar.disabled = true;
    boton_enviar.innerHTML = 'Procesando... <i class="fa-solid fa-spinner fa-spin"></i>';

    const respuesta = await servicio_api.crear_examen(payload);
    
    boton_enviar.disabled = false;
    boton_enviar.innerHTML = texto_original;

    if (respuesta.estado === 'exito') {
        estado_formulario_modificado = false; 
        Swal.fire({
            icon: 'success',
            title: '¡Registrado!',
            text: respuesta.mensaje,
            showConfirmButton: false,
            timer: 2000
        }).then(() => {
            window.location.replace('dashboard.html');
        });
    } else {
        Swal.fire('Error', respuesta.mensaje, 'error');
    }
}



document.addEventListener('DOMContentLoaded', inicializar_formulario);