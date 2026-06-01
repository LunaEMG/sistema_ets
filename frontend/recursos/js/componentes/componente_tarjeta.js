/**
 * Componente funcional para renderizar las tarjetas de los examenes ETS.
 */
export const componente_tarjeta = {
    crear_bloque_examen(datos_examen) {
        const opciones_fecha = { year: 'numeric', month: 'long', day: 'numeric' };
        const fecha_legible = new Date(datos_examen.fecha_examen + 'T00:00:00').toLocaleDateString('es-MX', opciones_fecha);

        // Algoritmo dinámico para calcular el intervalo de 2 horas cerradas
        const calcularBloque = (horaInicio) => {
            const hora = parseInt(horaInicio.split(':')[0]);
            return `${hora}:00 a ${hora + 2}:00`;
        };

        const horario_completo = `${calcularBloque(datos_examen.hora_manana)} y ${calcularBloque(datos_examen.hora_tarde)}`;

        return `
            <div class="tarjeta_materia_ets">
                <div class="tarjeta_encabezado">
                    <span class="etiqueta_semestre">${datos_examen.semestre_materia}° Semestre</span>
                    <h3 class="titulo_materia">${datos_examen.nombre_materia}</h3>
                    <p class="nombre_carrera">${datos_examen.nombre_carrera}</p>
                </div>
                <div class="tarjeta_cuerpo">
                    <div class="dato_renglon" style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem;">
                        <i class="fa-solid fa-calendar-day" style="color: #006293; width: 16px; text-align: center;"></i>
                        <p style="margin: 0;"><strong>Fecha:</strong> ${fecha_legible}</p>
                    </div>
                    <div class="dato_renglon" style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem;">
                        <i class="fa-solid fa-clock" style="color: #006293; width: 16px; text-align: center;"></i>
                        <p style="margin: 0;"><strong>Horario:</strong> ${horario_completo}</p>
                    </div>
                    <div class="dato_renglon" style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem;">
                        <i class="fa-solid fa-location-dot" style="color: #006293; width: 16px; text-align: center;"></i>
                        <p style="margin: 0;"><strong>Ubicación:</strong> ${datos_examen.nombre_edificio} - ${datos_examen.nombre_salon}</p>
                    </div>
                    <div class="dato_renglon" style="display: flex; align-items: center; gap: 10px;">
                        <i class="fa-solid fa-chalkboard-user" style="color: #006293; width: 16px; text-align: center;"></i>
                        <p style="margin: 0;"><strong>Coordinador:</strong> ${datos_examen.nombre_profesor}</p>
                    </div>
                </div>
            </div>
        `;
    }
};