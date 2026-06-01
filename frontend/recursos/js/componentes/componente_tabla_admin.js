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
            const hora_inicio_manana = parseInt(examen.hora_manana.split(':')[0]); 
            const hora_inicio_tarde = parseInt(examen.hora_tarde.split(':')[0]);   

            const hora_fin_manana = hora_inicio_manana + 2; 
            const hora_fin_tarde = hora_inicio_tarde + 2;   

            const horario_formateado = `
                <div style="font-size: 0.8rem; font-weight: 600; color: #006293;">
                    ${String(hora_inicio_manana).padStart(2, '0')}:00 - ${String(hora_fin_manana).padStart(2, '0')}:00
                </div>
                <div style="font-size: 0.8rem; color: #7f8c8d; margin-top: 2px;">
                    ${String(hora_inicio_tarde).padStart(2, '0')}:00 - ${String(hora_fin_tarde).padStart(2, '0')}:00
                </div>
            `;

            filas_html += `
                <tr>
                    <td style="padding: 0.75rem; border-bottom: 1px solid #e9ecef; font-weight: 600;">${examen.nombre_materia}</td>
                    <td style="padding: 0.75rem; border-bottom: 1px solid #e9ecef;">${examen.nombre_carrera}</td>
                    <td style="padding: 0.75rem; border-bottom: 1px solid #e9ecef; text-align: center;">${examen.semestre_materia}°</td>
                    <td style="padding: 0.75rem; border-bottom: 1px solid #e9ecef;">${fecha_corta}</td>
                    <td style="padding: 0.75rem; border-bottom: 1px solid #e9ecef; white-space: nowrap;">${horario_formateado}</td>
                    <td style="padding: 0.75rem; border-bottom: 1px solid #e9ecef;">${examen.nombre_edificio} - ${examen.nombre_salon}</td>
                    <td style="padding: 0.75rem; border-bottom: 1px solid #e9ecef;">${examen.nombre_profesor}</td>
                    <td style="padding: 0.75rem; border-bottom: 1px solid #e9ecef; text-align: center;">
                        <div style="display: flex; gap: 6px; justify-content: center;">
                            <button class="btn_editar_examen" data-id="${examen.id}" 
                                style="background-color: #f39c12; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
                                <i class="fa-solid fa-pen-to-square"></i> Editar
                            </button>
                            <button class="btn_eliminar_examen" data-id="${examen.id}" 
                                style="background-color: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
                                <i class="fa-solid fa-trash"></i> Eliminar
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
                        <th style="padding: 0.75rem;">Horarios (M / V)</th>
                        <th style="padding: 0.75rem;">Ubicación</th>
                        <th style="padding: 0.75rem;">Coordinador</th>
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