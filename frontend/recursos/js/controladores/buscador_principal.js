/**
 * Controlador principal para la vista publica del buscador de ETS.
 */
import { servicio_api } from '../servicios/servicio_api.js';
import { componente_tarjeta } from '../componentes/componente_tarjeta.js';

// Referencias a los elementos del DOM que manipularemos
const selector_carrera = document.getElementById('select_carrera');
const selector_semestre = document.getElementById('select_semestre');
const selector_materia = document.getElementById('select_materia');
const contenedor_resultados = document.getElementById('contenedor_bloques_examenes');
const boton_buscar = document.getElementById('btn_buscar');

// Funcion inicializadora que se ejecuta al cargar la pantalla
async function inicializar_buscador() {
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

    boton_buscar.addEventListener('click', ejecutar_busqueda_examenes);
    ejecutar_busqueda_examenes();
}

async function ejecutar_busqueda_examenes() {
    contenedor_resultados.innerHTML = '<p class="mensaje_carga">Buscando exámenes programados...</p>';

    const carrera = selector_carrera.value;
    const semestre = selector_semestre.value;
    const materia = selector_materia.value;

    const examenes_encontrados = await servicio_api.buscar_examenes(carrera, semestre, materia);
    contenedor_resultados.innerHTML = '';

    if (examenes_encontrados.length === 0) {
        contenedor_resultados.innerHTML = '<p class="mensaje_alerta">No se encontraron exámenes programados con los filtros seleccionados.</p>';
        return;
    }

    examenes_encontrados.forEach(examen => {
        const html_tarjeta = componente_tarjeta.crear_bloque_examen(examen);
        contenedor_resultados.innerHTML += html_tarjeta;
    });
}

document.addEventListener('DOMContentLoaded', inicializar_buscador);