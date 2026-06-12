import { escaparHTML } from '../utilidades/escape.js';

/**
 * Componente funcional para renderizar las tarjetas de los exámenes ETS.
 */
export const componente_tarjeta = {
    crear_bloque_examen(datos_examen) {
        const opciones_fecha = { year: 'numeric', month: 'long', day: 'numeric' };
        const fecha_legible = new Date(datos_examen.fecha_examen + 'T00:00:00').toLocaleDateString('es-MX', opciones_fecha);

        const calcularBloque = (horaInicio) => {
            const hora = parseInt(horaInicio.split(':')[0]);
            return `${hora}:00 a ${hora + 2}:00`;
        };

        const horario_completo = `${calcularBloque(datos_examen.hora_manana)} y ${calcularBloque(datos_examen.hora_tarde)}`;

        return `
            <div class="tarjeta_materia_ets_nueva">
                <img src="recursos/imagenes/tiburon.svg" class="marca_agua_tiburon" alt="Tiburón ESCOM">
                <!-- Header Tarjeta -->
                <div class="tarjeta_encabezado_nuevo" style="position: relative; z-index: 1;">
                    <div class="tarjeta_encabezado_top">
                        <span class="badge_carrera">
                            ${escaparHTML(datos_examen.nombre_carrera)}
                        </span>
                        <span class="id_examen_badge">
                            ID: ${datos_examen.id}
                        </span>
                    </div>
                    <h4 class="titulo_materia_nuevo">
                        ${escaparHTML(datos_examen.nombre_materia)}
                    </h4>
                    <div class="info_semestre_nuevo">
                        <i class="fa-solid fa-book-open" style="margin-right: 0.375rem;"></i>
                        Semestre ${escaparHTML(String(datos_examen.semestre_materia))}
                    </div>
                </div>

                <!-- Cuerpo Tarjeta -->
                <div class="tarjeta_cuerpo_nuevo" style="position: relative; z-index: 1;">
                    <div class="dato_fila_nueva">
                        <div class="icono_dato_nuevo">
                            <i class="fa-solid fa-user-tie"></i>
                        </div>
                        <div class="texto_dato_nuevo">
                            <span class="etiqueta_dato_nuevo">Profesor Titular</span>
                            <span class="valor_dato_nuevo">${escaparHTML(datos_examen.nombre_profesor)}</span>
                        </div>
                    </div>

                    <div class="dato_fila_nueva">
                        <div class="icono_dato_nuevo">
                            <i class="fa-solid fa-calendar"></i>
                        </div>
                        <div class="texto_dato_nuevo">
                            <span class="etiqueta_dato_nuevo">Fecha</span>
                            <span class="valor_dato_nuevo" style="text-transform: capitalize;">${fecha_legible.split(',')[0]}</span>
                        </div>
                    </div>
                    
                    <div class="dato_fila_nueva">
                        <div class="icono_dato_nuevo">
                            <i class="fa-solid fa-clock"></i>
                        </div>
                        <div class="texto_dato_nuevo">
                            <span class="etiqueta_dato_nuevo">Hora</span>
                            <span class="valor_dato_nuevo">${horario_completo}</span>
                        </div>
                    </div>

                    <div class="dato_fila_nueva">
                        <div class="icono_dato_nuevo">
                            <i class="fa-solid fa-location-dot"></i>
                        </div>
                        <div class="texto_dato_nuevo">
                            <span class="etiqueta_dato_nuevo">Ubicación</span>
                            <span class="valor_dato_nuevo">${escaparHTML(datos_examen.nombre_salon)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};