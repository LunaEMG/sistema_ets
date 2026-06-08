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
                <tr>
                    <td><span class="destacado_primario">${escaparHTML(examen.nombre_materia)}</span></td>
                    <td>${escaparHTML(examen.nombre_carrera)}</td>
                    <td style="text-align: center;">${escaparHTML(String(examen.semestre_materia))}°</td>
                    <td>${fecha_corta}</td>
                    <td style="white-space: nowrap;">
                        <span class="destacado_secundario">${horario_corto}</span>
                    </td>
                    <td class="destacado_primario">${escaparHTML(examen.nombre_salon)}</td>
                    <td>${escaparHTML(examen.nombre_profesor)}</td>
                    <td>
                        <div class="acciones_fila">
                            <button class="btn_icono_accion editar btn_editar_examen" data-id="${escaparHTML(String(examen.id))}" title="Editar Examen">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="btn_icono_accion eliminar btn_eliminar_examen" data-id="${escaparHTML(String(examen.id))}" title="Eliminar Examen">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        return `
            <div class="contenedor_tabla_admin">
                <table class="tabla_admin">
                    <thead>
                        <tr>
                            <th>Materia</th>
                            <th>Carrera</th>
                            <th style="text-align: center;">Sem.</th>
                            <th>Fecha</th>
                            <th>Horarios (M / V)</th>
                            <th>Ubicación (Aula)</th>
                            <th>Coordinador</th>
                            <th style="text-align: center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filas_html}
                    </tbody>
                </table>
            </div>
        `;
    }
};