import { escaparHTML } from '../utilidades/escape.js';

/**
 * Componente funcional para estructurar la tabla de gestión de exámenes en el panel.
 */
export const componente_tabla_admin = {
    crear_tabla(lista_examenes) {
        if (lista_examenes.length === 0) {
            return '<p class="mensaje_alerta">No hay exámenes registrados en este momento.</p>';
        }

        let filas_html = '';

        lista_examenes.forEach(examen => {
            const opciones_fecha = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const fecha_corta = new Date(examen.fecha_examen + 'T00:00:00').toLocaleDateString('es-MX', opciones_fecha);

            const h_manana = parseInt(examen.hora_manana.split(':')[0]);
            const h_tarde = parseInt(examen.hora_tarde.split(':')[0]);
            const horario_corto = `${h_manana}:00-${h_manana+2}:00 / ${h_tarde}:00-${h_tarde+2}:00`;

            filas_html += `
                <tr class="fila_tabla_nueva">
                    <td class="celda_principal_nueva">${escaparHTML(examen.nombre_materia)}</td>
                    <td class="celda_secundaria_nueva">${escaparHTML(examen.nombre_carrera)}</td>
                    <td class="celda_secundaria_nueva" style="text-align: center;">
                        <span class="badge_semestre_nuevo">${escaparHTML(String(examen.semestre_materia))}°</span>
                    </td>
                    <td class="celda_secundaria_nueva">${fecha_corta}</td>
                    <td class="celda_secundaria_nueva">
                        <span class="badge_horario_nuevo">${horario_corto}</span>
                    </td>
                    <td class="celda_secundaria_nueva">${escaparHTML(examen.nombre_salon)}</td>
                    <td class="celda_secundaria_nueva">${escaparHTML(examen.nombre_profesor)}</td>
                    <td class="celda_acciones_nueva">
                        <div class="contenedor_acciones_nuevo">
                            <button class="btn_accion_nuevo editar btn_editar_examen" data-id="${escaparHTML(String(examen.id))}" title="Editar">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn_accion_nuevo eliminar btn_eliminar_examen" data-id="${escaparHTML(String(examen.id))}" title="Eliminar">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        return `
            <div class="contenedor_tabla_nuevo">
                <table class="tabla_nueva">
                    <thead class="encabezado_tabla_nuevo">
                        <tr>
                            <th>Materia</th>
                            <th>Carrera</th>
                            <th style="text-align: center;">Semestre</th>
                            <th>Fecha</th>
                            <th>Horarios</th>
                            <th>Ubicación</th>
                            <th>Coordinador</th>
                            <th style="text-align: right;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="cuerpo_tabla_nuevo">
                        ${filas_html}
                    </tbody>
                </table>
            </div>
        `;
    }
};