/**
 * Componente encargado de procesar la lógica de exportación de datos.
 * Genera archivos estructurados nativos sin dependencias externas.
 */
export const exportador_calendario = {
    
    /**
     * Lanza la ventana de impresión del navegador optimizada por CSS
     */
    exportar_a_pdf() {
        window.print();
    },

    /**
     * Genera y descarga el archivo con el estándar internacional .ics (iCalendar)
     */
    exportar_a_ics(lista_examenes) {
        if (!lista_examenes || lista_examenes.length === 0) return;

        Swal.fire({
            icon: 'success',
            title: '¡Calendario Generado!',
            text: 'Tu archivo .ics se ha generado y descargado con éxito.',
            showConfirmButton: false,
            timer: 2000
        });

        let contenido_ics = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//ESCOM IPN//Sistema Gestion ETS//ES",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH"
        ].join("\r\n") + "\r\n";

        lista_examenes.forEach((examen, indice) => {
            const fecha_limpia = examen.fecha_examen.replace(/-/g, "");
            const h_manana_ini = parseInt(examen.hora_manana.split(':')[0]); 
            const hora_manana_inicio_str = String(h_manana_ini).padStart(2, '0') + "0000";
            const hora_manana_fin_str = String(h_manana_ini + 2).padStart(2, '0') + "0000";

            contenido_ics += [
                "BEGIN:VEVENT",
                `UID:ets_${fecha_limpia}_${indice}_M@escom.ipn.mx`,
                `DTSTAMP:${fecha_limpia}T000000Z`,
                `DTSTART:${fecha_limpia}T${hora_manana_inicio_str}`,
                `DTEND:${fecha_limpia}T${hora_manana_fin_str}`,
                `SUMMARY:ETS (M) - ${examen.nombre_materia}`,
                `LOCATION:${examen.nombre_edificio} - ${examen.nombre_salon}`,
                `DESCRIPTION:Carrera: ${examen.nombre_carrera}\\nCoordinador: ${examen.nombre_profesor}\\nHorario: ${h_manana_ini}:00 a ${h_manana_ini + 2}:00 hrs.`,
                "END:VEVENT"
            ].join("\r\n") + "\r\n";

            const h_tarde_ini = parseInt(examen.hora_tarde.split(':')[0]);  
            const hora_tarde_inicio_str = String(h_tarde_ini).padStart(2, '0') + "0000";
            const hora_tarde_fin_str = String(h_tarde_ini + 2).padStart(2, '0') + "0000";   

            contenido_ics += [
                "BEGIN:VEVENT",
                `UID:ets_${fecha_limpia}_${indice}_V@escom.ipn.mx`, 
                `DTSTAMP:${fecha_limpia}T000000Z`,
                `DTSTART:${fecha_limpia}T${hora_tarde_inicio_str}`,
                `DTEND:${fecha_limpia}T${hora_tarde_fin_str}`,
                `SUMMARY:ETS (V) - ${examen.nombre_materia}`,
                `LOCATION:${examen.nombre_edificio} - ${examen.nombre_salon}`,
                `DESCRIPTION:Carrera: ${examen.nombre_carrera}\\nCoordinador: ${examen.nombre_profesor}\\nHorario: ${h_tarde_ini}:00 a ${h_tarde_ini + 2}:00 hrs.`,
                "END:VEVENT"
            ].join("\r\n") + "\r\n";
        });

        contenido_ics += "END:VCALENDAR";

        const contenedor_datos = new Blob([contenido_ics], { type: "text/calendar;charset=utf-8" });
        this.descargar_archivo(contenedor_datos, "calendario_examenes_ets.ics");
    },

    /**
     * Método utilitario privado para forzar la descarga de archivos en el navegador
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