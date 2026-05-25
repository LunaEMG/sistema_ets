/**
 * Componente encargado de procesar la logica de exportacion de datos.
 * Genera archivos estructurados nativos sin dependencias externas.
 */
export const exportador_calendario = {
    
    /**
     * Lanza la ventana de impresion del navegador optimizada por CSS
     */
    exportar_a_pdf() {
        window.print();
    },

    /**
     * Genera y descarga el archivo con el estandar internacional .ics (iCalendar)
     */
    exportar_a_ics(lista_examenes) {
        if (!lista_examenes || lista_examenes.length === 0) return;

        let contenido_ics = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//ESCOM IPN//Sistema Gestion ETS//ES",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH"
        ].join("\r\n") + "\r\n";

        lista_examenes.forEach((examen, indice) => {
            const fecha_limpia = examen.fecha_examen.replace(/-/g, "");
            
            const hora_inicio = examen.turno_examen === "Matutino" ? "090000" : "140000";
            const hora_fin = examen.turno_examen === "Matutino" ? "110000" : "160000";

            contenido_ics += [
                "BEGIN:VEVENT",
                `UID:ets_${fecha_limpia}_${indice}@escom.ipn.mx`,
                `DTSTAMP:${fecha_limpia}T000000Z`,
                `DTSTART:${fecha_limpia}T${hora_inicio}`,
                `DTEND:${fecha_limpia}T${hora_fin}`,
                `SUMMARY:ETS - ${examen.nombre_materia}`,
                `LOCATION:${examen.nombre_edificio} - ${examen.nombre_salon}`,
                `DESCRIPTION:Carrera: ${examen.nombre_carrera}\\nEvaluador: ${examen.nombre_profesor}\\nTurno: ${examen.turno_examen}`,
                "END:VEVENT"
            ].join("\r\n") + "\r\n";
        });

        contenido_ics += "END:VCALENDAR";

        const contenedor_datos = new Blob([contenido_ics], { type: "text/calendar;charset=utf-8" });
        this.descargar_archivo(contenedor_datos, "calendario_examenes_ets.ics");
    },

    /**
     * Metodo utilitario privado para forzar la descarga de archivos en el navegador
     */
    descargar_archivo(contenido_blob, nombre_archivo) {
        const enlace_descarga = document.createElement("a");
        enlace_descarga.href = URL.createObjectURL(contenido_blob);
        enlace_descarga.download = nombre_archivo;
        
        document.body.appendChild(enlace_descarga);
        enlace_descarga.click();
        document.body.removeChild(enlace_descarga);
    }
};