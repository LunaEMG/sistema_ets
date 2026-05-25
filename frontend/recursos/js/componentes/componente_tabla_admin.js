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
                        <button class="boton_exportar de_pdf btn_eliminar_examen" data-id="${examen.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; margin: 0;">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });

        return `
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
                <thead>
                    <tr style="background-color: #006293; color: #ffffff;">
                        <th style="padding: 0.75rem;">Materia</th>
                        <th style="padding: 0.75rem;">Carrera</th>
                        <th style="padding: 0.75rem; text-align: center;">Semestre</th>
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