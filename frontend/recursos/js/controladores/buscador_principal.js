/**
 * Controlador principal para la vista publica del buscador de ETS.
 */
import { servicio_api } from '../servicios/servicio_api.js';
import { componente_tarjeta } from '../componentes/componente_tarjeta.js';
import { exportador_calendario } from '../componentes/exportador_calendario.js';

const selector_carrera = document.getElementById('select_carrera');
const selector_semestre = document.getElementById('select_semestre');
const selector_materia = document.getElementById('select_materia');
const contenedor_resultados = document.getElementById('contenedor_bloques_examenes');
const boton_buscar = document.getElementById('btn_buscar');
const boton_exportar_pdf = document.getElementById('btn_exportar_pdf');
const boton_exportar_ics = document.getElementById('btn_exportar_ics');
const input_buscador_texto = document.getElementById('input_buscador_texto');
const contenedor_paginacion = document.getElementById('contenedor_paginacion');

let coleccion_examenes_actuales = [];
let pagina_actual = 1;
const ITEMS_POR_PAGINA = 12;

async function inicializar_buscador() {
    const btn_menu_movil = document.getElementById('btn_menu_movil');
    const navegacion_superior = document.getElementById('navegacion_superior');
    if (btn_menu_movil && navegacion_superior) {
        btn_menu_movil.addEventListener('click', () => {
            navegacion_superior.classList.toggle('mostrar_menu');
        });
    }

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
    boton_exportar_pdf.addEventListener('click', () => exportador_calendario.exportar_a_pdf());
    boton_exportar_ics.addEventListener('click', () => {
        exportador_calendario.exportar_a_ics(coleccion_examenes_actuales);
        const original = boton_exportar_ics.innerHTML;
        boton_exportar_ics.innerHTML = '<i class="fa-solid fa-check" style="color: #27ae60;"></i> ¡Descargado!';
        setTimeout(() => { boton_exportar_ics.innerHTML = original; }, 3000);
    });
    
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
    
    ejecutar_busqueda_examenes();
}

async function ejecutar_busqueda_examenes() {
    contenedor_resultados.innerHTML = `
        <div class="mensaje_carga">
            <div class="spinner_carga"></div>
            <p>Buscando exámenes programados...</p>
        </div>
    `;
    
    boton_exportar_pdf.disabled = true;
    const contenido_btn_original = boton_buscar.innerHTML;
    boton_buscar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    boton_buscar.disabled = true;
    selector_carrera.disabled = true;
    selector_semestre.disabled = true;
    selector_materia.disabled = true;
    if (input_buscador_texto) input_buscador_texto.disabled = true;

    const carrera = selector_carrera.value;
    const semestre = selector_semestre.value;
    const materia = selector_materia.value;

    try {
        coleccion_examenes_actuales = await servicio_api.buscar_examenes(carrera, semestre, materia);
    } finally {
        boton_buscar.innerHTML = contenido_btn_original;
        boton_buscar.disabled = false;
        selector_carrera.disabled = false;
        selector_semestre.disabled = false;
        if (selector_carrera.value > 0) selector_materia.disabled = false;
        if (input_buscador_texto) input_buscador_texto.disabled = false;
        pagina_actual = 1;
    }

    if (coleccion_examenes_actuales.length === 0) {
        renderizar_examenes([]);
        Swal.fire({
            icon: 'info',
            title: 'Búsqueda sin resultados',
            text: 'No se encontraron exámenes programados con los filtros seleccionados.',
            confirmButtonColor: '#006293'
        });
        return;
    }

    filtrar_por_texto();

    boton_exportar_pdf.disabled = false;
    boton_exportar_ics.disabled = false;
}

function normalizar_texto(texto) {
    if (!texto) return '';
    return texto.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filtrar_por_texto() {
    const texto_busqueda = normalizar_texto(input_buscador_texto.value);
    
    if (texto_busqueda === '') {
        renderizar_examenes(coleccion_examenes_actuales);
        return;
    }

    const lista_filtrada = coleccion_examenes_actuales.filter(examen => {
        const mat = normalizar_texto(examen.nombre_materia);
        const prof = normalizar_texto(examen.nombre_profesor);
        const car = normalizar_texto(examen.nombre_carrera);
        const id = normalizar_texto(examen.id);
        
        return mat.includes(texto_busqueda) || 
               prof.includes(texto_busqueda) || 
               car.includes(texto_busqueda) || 
               id.includes(texto_busqueda);
    });

    renderizar_examenes(lista_filtrada);
}

function renderizar_examenes(lista_examenes) {
    contenedor_resultados.innerHTML = '';
    
    if (lista_examenes.length === 0) {
        contenedor_resultados.innerHTML = `
            <div class="mensaje_alerta">
                <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--color_gris_borde_fuerte); margin-bottom: 10px;"></i>
                <p style="font-weight: 600;">No se encontraron exámenes con tu búsqueda de texto.</p>
                <p style="font-size: 0.9rem; color: var(--color_texto_secundario); margin-top: 5px;">Revisa si la materia pertenece a otro semestre o limpia los filtros.</p>
                <button onclick="document.getElementById('input_buscador_texto').value=''; document.getElementById('input_buscador_texto').dispatchEvent(new Event('input'))" class="boton_primario" style="margin-top: 1rem; padding: 0.5rem 1rem; font-size: 0.9rem;">
                    <i class="fa-solid fa-broom"></i> Limpiar Búsqueda
                </button>
            </div>
        `;
        if (contenedor_paginacion) contenedor_paginacion.innerHTML = '';
        return;
    }

    const total_items = lista_examenes.length;
    const total_paginas = Math.ceil(total_items / ITEMS_POR_PAGINA);
    
    if (pagina_actual > total_paginas) pagina_actual = total_paginas;
    if (pagina_actual < 1) pagina_actual = 1;

    const indice_inicio = (pagina_actual - 1) * ITEMS_POR_PAGINA;
    const indice_fin = indice_inicio + ITEMS_POR_PAGINA;
    const examenes_pagina = lista_examenes.slice(indice_inicio, indice_fin);

    let html_acumulado = '';
    examenes_pagina.forEach(examen => {
        html_acumulado += componente_tarjeta.crear_bloque_examen(examen);
    });
    contenedor_resultados.innerHTML = html_acumulado;

    if (contenedor_paginacion) {
        renderizar_paginacion(total_paginas, lista_examenes);
    }
}

function renderizar_paginacion(total_paginas, lista_filtrada_referencia) {
    contenedor_paginacion.innerHTML = '';

    if (total_paginas <= 1) return;

    const btn_anterior = document.createElement('button');
    btn_anterior.className = 'btn_pagina';
    btn_anterior.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    btn_anterior.disabled = pagina_actual === 1;
    btn_anterior.addEventListener('click', () => {
        if (pagina_actual > 1) {
            pagina_actual--;
            renderizar_examenes(lista_filtrada_referencia);
            window.scrollTo({ top: document.getElementById('main_content').offsetTop - 20, behavior: 'smooth' });
        }
    });
    contenedor_paginacion.appendChild(btn_anterior);

    for (let i = 1; i <= total_paginas; i++) {
        const btn_num = document.createElement('button');
        btn_num.className = `btn_pagina ${i === pagina_actual ? 'activa' : ''}`;
        btn_num.textContent = i;
        btn_num.addEventListener('click', () => {
            pagina_actual = i;
            renderizar_examenes(lista_filtrada_referencia);
            window.scrollTo({ top: document.getElementById('main_content').offsetTop - 20, behavior: 'smooth' });
        });
        contenedor_paginacion.appendChild(btn_num);
    }

    const btn_siguiente = document.createElement('button');
    btn_siguiente.className = 'btn_pagina';
    btn_siguiente.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    btn_siguiente.disabled = pagina_actual === total_paginas;
    btn_siguiente.addEventListener('click', () => {
        if (pagina_actual < total_paginas) {
            pagina_actual++;
            renderizar_examenes(lista_filtrada_referencia);
            window.scrollTo({ top: document.getElementById('main_content').offsetTop - 20, behavior: 'smooth' });
        }
    });
    contenedor_paginacion.appendChild(btn_siguiente);
}

document.addEventListener('DOMContentLoaded', inicializar_buscador);