/**
 * Componente funcional para estructurar la tabla de gestion de examenes en el panel.
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

            filas_html += `
                <tr>
                    <td style="padding: 0.75rem; border-bottom: 1px solid #e9ecef; font-weight: 600;">${examen.nombre_materia}</td>
                    <td style="padding: 0.75rem; border-bottom: 1px solid #e9ecef;">${examen.nombre_carrera}</td>
                    <td style="padding: 0.75rem; border-bottom: 1px solid #e9ecef; text-align: center;">${examen.semestre_materia}°</td>
                    <td style="padding: 0.75rem; border-bottom: 1px solid #e9ecef;">${fecha_corta}</td>
                    <td style="padding: 0.75rem; border-bottom: 1px solid #e9ecef;">${examen.turno_examen}</td>
                    <td style="padding: 0.75rem; border-bottom: 1px solid #e9ecef;">${examen.nombre_edificio} - ${examen.nombre_salon}</td>
                    <td style="padding: 0.75rem; border-bottom: 1px solid #e9ecef;">${examen.nombre_profesor}</td>
                    <td style="padding: 0.75rem; border-bottom: 1px solid #e9ecef; text-align: center;">
                        <div style="display: flex; gap: 4px; justify-content: center;">
                            <button class="btn_editar_examen" data-id="${examen.id}" 
                                style="background-color: #f39c12; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600;">
                                Editar
                            </button>
                            <button class="btn_eliminar_examen" data-id="${examen.id}" 
                                style="background-color: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600;">
                                Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        return `
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
                <thead>
                    <tr style="background-color: #006293; color: #ffffff;">
                        <th style="padding: 0.75rem;">Materia</th>
                        <th style="padding: 0.75rem;">Carrera</th>
                        <th style="padding: 0.75rem; text-align: center;">Sem.</th>
                        <th style="padding: 0.75rem;">Fecha</th>
                        <th style="padding: 0.75rem;">Turno</th>
                        <th style="padding: 0.75rem;">Ubicación</th>
                        <th style="padding: 0.75rem;">Evaluador</th>
                        <th style="padding: 0.75rem; text-align: center;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas_html}
                </tbody>
            </table>
        `;
    }
};