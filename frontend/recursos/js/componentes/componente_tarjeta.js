/**
 * Componente funcional para renderizar las tarjetas de los examenes ETS.
 * Modificado: Se eliminaron los emojis temporales para dejar los contenedores listos para iconos.
 */
export const componente_tarjeta = {
    crear_bloque_examen(datos_examen) {
        // Formateamos la fecha de YYYY-MM-DD a un formato legible en español
        const opciones_fecha = { year: 'numeric', month: 'long', day: 'numeric' };
        const fecha_legible = new Date(datos_examen.fecha_examen + 'T00:00:00').toLocaleDateString('es-MX', opciones_fecha);

        return `
            <div class="tarjeta_materia_ets">
                <div class="tarjeta_encabezado">
                    <span class="etiqueta_semestre">${datos_examen.semestre_materia}° Semestre</span>
                    <h3 class="titulo_materia">${datos_examen.nombre_materia}</h3>
                    <p class="nombre_carrera">${datos_examen.nombre_carrera}</p>
                </div>
                <div class="tarjeta_cuerpo">
                    <div class="dato_renglon">
                        <span class="icono_detalle de_fecha"></span>
                        <p><strong>Fecha:</strong> ${fecha_legible}</p>
                    </div>
                    <div class="dato_renglon">
                        <span class="icono_detalle de_turno"></span>
                        <p><strong>Turno:</strong> ${datos_examen.turno_examen}</p>
                    </div>
                    <div class="dato_renglon">
                        <span class="icono_detalle de_ubicacion"></span>
                        <p><strong>Ubicación:</strong> ${datos_examen.nombre_edificio} - ${datos_examen.nombre_salon}</p>
                    </div>
                    <div class="dato_renglon">
                        <span class="icono_detalle de_profesor"></span>
                        <p><strong>Evaluador:</strong> ${datos_examen.nombre_profesor}</p>
                    </div>
                </div>
            </div>
        `;
    }
};