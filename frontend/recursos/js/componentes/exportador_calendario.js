/**
 * Componente encargado de procesar la lógica de exportación de datos.
 * Genera archivos estructurados nativos sin dependencias externas.
 */
export const exportador_calendario = {
    

    exportar_a_pdf(lista_examenes = null) {
        if (!lista_examenes) {
            window.print();
            return;
        }

        document.body.classList.add('imprimiendo_seleccionados');
        
        void document.body.offsetWidth;
        
        window.print();
        
        document.body.classList.remove('imprimiendo_seleccionados');
    },
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
            const fecha_valida = examen.fecha_examen || new Date().toISOString().split('T')[0];
            const fecha_limpia = fecha_valida.replace(/-/g, "");
            
            const hora_m = examen.hora_manana || '00:00:00';
            const h_manana_ini = parseInt(hora_m.split(':')[0]) || 0; 
            const hora_manana_inicio_str = String(h_manana_ini).padStart(2, '0') + "0000";
            const hora_manana_fin_str = String(h_manana_ini + 2).padStart(2, '0') + "0000";

            contenido_ics += [
                "BEGIN:VEVENT",
                `UID:ets_${fecha_limpia}_${indice}_M@escom.ipn.mx`,
                `DTSTAMP:${fecha_limpia}T000000Z`,
                `DTSTART:${fecha_limpia}T${hora_manana_inicio_str}`,
                `DTEND:${fecha_limpia}T${hora_manana_fin_str}`,
                `SUMMARY:ETS (M) - ${examen.nombre_materia}`,
                `LOCATION:${examen.nombre_edificio || 'Por asignar'} - ${examen.nombre_salon || 'Por asignar'}`,
                `DESCRIPTION:Carrera: ${examen.nombre_carrera}\\nCoordinador: ${examen.nombre_profesor}\\nHorario: ${h_manana_ini}:00 a ${h_manana_ini + 2}:00 hrs.`,
                "END:VEVENT"
            ].join("\r\n") + "\r\n";

            const hora_t = examen.hora_tarde || '00:00:00';
            const h_tarde_ini = parseInt(hora_t.split(':')[0]) || 0;  
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

    descargar_archivo(contenido_blob, nombre_archivo) {
        const enlace_descarga = document.createElement("a");
        enlace_descarga.href = URL.createObjectURL(contenido_blob);
        enlace_descarga.download = nombre_archivo;
        
        document.body.appendChild(enlace_descarga);
        enlace_descarga.click();
        document.body.removeChild(enlace_descarga);
    }
};