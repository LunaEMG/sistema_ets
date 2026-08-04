/**
 * Controlador que gestiona la selección temporal de exámenes (carrito) y su barra flotante.
 */
import { exportador_calendario } from '../componentes/exportador_calendario.js';
import { obtener_color_carrera } from '../utilidades/color_carrera.js';

export const carrito_examenes = {
    examenes_seleccionados: new Map(), 

    inicializar() {
        this.btn_abrir = document.getElementById('btn_abrir_carrito');
        this.btn_cerrar = document.getElementById('btn_cerrar_carrito');
        this.panel = document.getElementById('panel_lateral_carrito');
        this.overlay = document.getElementById('overlay_carrito');
        this.badge = document.getElementById('badge_carrito');
        this.cuerpo = document.getElementById('cuerpo_carrito');
        
        this.btn_exportar_pdf = document.getElementById('btn_carrito_exportar_pdf');
        this.btn_exportar_ics = document.getElementById('btn_carrito_exportar_ics');

        this.barra_flotante = document.getElementById('barra_flotante_carrito');
        this.badge_flotante = document.getElementById('badge_flotante');
        this.cantidad_flotante = document.getElementById('cantidad_flotante');
        this.btn_flotante_abrir = document.getElementById('btn_flotante_abrir');
        
        this.ultimo_scroll = window.scrollY;

        if (!this.btn_abrir) return; 

        this.vincular_eventos();
    },

    vincular_eventos() {
        this.btn_abrir.addEventListener('click', (e) => {
            e.preventDefault();
            this.abrir_panel();
        });

        this.btn_cerrar.addEventListener('click', () => this.cerrar_panel());
        this.overlay.addEventListener('click', () => this.cerrar_panel());

        if (this.btn_flotante_abrir) {
            this.btn_flotante_abrir.addEventListener('click', () => {
                this.abrir_panel();
            });
        }

        this.btn_exportar_pdf.addEventListener('click', () => {
            if (this.examenes_seleccionados.size === 0) return;
            const lista_exportar = Array.from(this.examenes_seleccionados.values());
            exportador_calendario.exportar_a_pdf(lista_exportar);
        });

        this.btn_exportar_ics.addEventListener('click', () => {
            if (this.examenes_seleccionados.size === 0) return;
            const lista_exportar = Array.from(this.examenes_seleccionados.values());
            exportador_calendario.exportar_a_ics(lista_exportar);
        });

        document.body.addEventListener('change', (e) => {
            if (e.target && e.target.classList.contains('chk_seleccionar_examen')) {
                const id_examen = parseInt(e.target.dataset.id);
                const tarjeta = e.target.closest('.tarjeta_materia_ets_nueva');
                
                if (e.target.checked) {
                    const examen = window.obtener_examen_por_id(id_examen);
                    if (examen) {
                        this.agregar_examen(examen);
                        tarjeta.classList.add('seleccionada');
                    }
                } else {
                    this.remover_examen(id_examen);
                    tarjeta.classList.remove('seleccionada');
                }
            }
        });

        window.addEventListener('scroll', () => {
            if (!this.barra_flotante || this.examenes_seleccionados.size === 0) return;
            
            const scroll_actual = window.scrollY;
            if (scroll_actual > this.ultimo_scroll && scroll_actual > 100) {
                this.barra_flotante.classList.add('oculta');
            } else {
                this.barra_flotante.classList.remove('oculta');
            }
            this.ultimo_scroll = scroll_actual;
        });
    },

    esta_seleccionado(id_examen) {
        return this.examenes_seleccionados.has(id_examen);
    },

    agregar_examen(examen) {
        if (!this.examenes_seleccionados.has(examen.id)) {
            this.examenes_seleccionados.set(examen.id, examen);
            this.actualizar_ui();
            window.Toast.mostrar('Examen añadido', examen.nombre_materia, 'success');
        }
    },

    remover_examen(id_examen) {
        if (this.examenes_seleccionados.has(id_examen)) {
            this.examenes_seleccionados.delete(id_examen);
            this.actualizar_ui();
            
            const checkbox = document.querySelector(`.chk_seleccionar_examen[data-id="${id_examen}"]`);
            if (checkbox) {
                checkbox.checked = false;
                checkbox.closest('.tarjeta_materia_ets_nueva').classList.remove('seleccionada');
            }
        }
    },

    actualizar_ui() {
        const cantidad = this.examenes_seleccionados.size;
        
        if (cantidad > 0) {
            this.badge.style.display = 'flex';
            this.badge.textContent = cantidad;
            this.badge.classList.remove('animar_pop');
            void this.badge.offsetWidth;
            this.badge.classList.add('animar_pop');
            
            if (this.barra_flotante) {
                this.badge_flotante.textContent = cantidad;
                this.cantidad_flotante.textContent = cantidad;
                this.barra_flotante.classList.add('activa');
            }
        } else {
            this.badge.style.display = 'none';
            if (this.barra_flotante) {
                this.barra_flotante.classList.remove('activa');
            }
        }

        const deshabilitado = cantidad === 0;
        this.btn_exportar_pdf.disabled = deshabilitado;
        this.btn_exportar_ics.disabled = deshabilitado;
        this.cuerpo.innerHTML = '';
        if (cantidad === 0) {
            this.cuerpo.innerHTML = `
                <div class="carrito_vacio">
                    <i class="fa-solid fa-folder-open"></i>
                    <p>No has seleccionado ningún examen.</p>
                </div>
            `;
            return;
        }

        this.examenes_seleccionados.forEach(examen => {
            const div = document.createElement('div');
            div.className = 'item_carrito';
            div.style.setProperty('--color_dinamico', obtener_color_carrera(examen.nombre_carrera));
            div.innerHTML = `
                <div class="info_item_carrito">
                    <span class="titulo_item_carrito">${examen.nombre_materia}</span>
                    <span class="detalles_item_carrito">${examen.nombre_carrera} | Sem. ${examen.semestre_materia}</span>
                </div>
                <button class="btn_eliminar_item_carrito" data-id="${examen.id}" title="Quitar">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            
            div.querySelector('.btn_eliminar_item_carrito').addEventListener('click', () => {
                this.remover_examen(examen.id);
            });
            
            this.cuerpo.appendChild(div);
        });
    },

    abrir_panel() {
        this.panel.classList.add('abierto');
        this.overlay.classList.add('activo');
        document.body.style.overflow = 'hidden';
    },

    cerrar_panel() {
        this.panel.classList.remove('abierto');
        this.overlay.classList.remove('activo');
        document.body.style.overflow = '';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    carrito_examenes.inicializar();
});
