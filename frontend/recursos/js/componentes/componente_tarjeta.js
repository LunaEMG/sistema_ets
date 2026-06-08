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
            <div class="tarjeta_materia_ets">
                <div class="tarjeta_encabezado">
                    <span class="etiqueta_semestre">${escaparHTML(String(datos_examen.semestre_materia))}° Semestre</span>
                    <h3 class="titulo_materia">${escaparHTML(datos_examen.nombre_materia)}</h3>
                    <p class="nombre_carrera">${escaparHTML(datos_examen.nombre_carrera)}</p>
                </div>
                <div class="tarjeta_cuerpo">
                    <div class="dato_renglon">
                        <div class="contenedor_icono">
                            <i class="fa-solid fa-calendar-day"></i>
                        </div>
                        <div class="info_dato">
                            <span class="etiqueta_dato">Fecha</span>
                            <p class="valor_dato">${fecha_legible}</p>
                        </div>
                    </div>
                    <div class="dato_renglon">
                        <div class="contenedor_icono">
                            <i class="fa-solid fa-clock"></i>
                        </div>
                        <div class="info_dato">
                            <span class="etiqueta_dato">Horario</span>
                            <p class="valor_dato">${horario_completo}</p>
                        </div>
                    </div>
                    <div class="dato_renglon">
                        <div class="contenedor_icono">
                            <i class="fa-solid fa-location-dot"></i>
                        </div>
                        <div class="info_dato">
                            <span class="etiqueta_dato">Salón / Laboratorio</span>
                            <p class="valor_dato">${escaparHTML(datos_examen.nombre_salon)}</p>
                        </div>
                    </div>
                    <div class="dato_renglon">
                        <div class="contenedor_icono">
                            <i class="fa-solid fa-chalkboard-user"></i>
                        </div>
                        <div class="info_dato">
                            <span class="etiqueta_dato">Coordinador</span>
                            <p class="valor_dato">${escaparHTML(datos_examen.nombre_profesor)}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};