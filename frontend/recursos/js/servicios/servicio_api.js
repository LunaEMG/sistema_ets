/**
 * Servicio encargado de centralizar las peticiones HTTP (Fetch) hacia la API REST.
 */
const url_base = 'http://localhost:8080/api';

export const servicio_api = {
    // Obtiene el catalogo de carreras
    async obtener_carreras() {
        try {
            const respuesta = await fetch(`${url_base}/catalogos/leer.php?accion=carreras`);
            const json_resultado = await respuesta.json();
            return json_resultado.datos || [];
        } catch (error_peticion) {
            console.error('error_servicio_api::obtener_carreras ->', error_peticion);
            return [];
        }
    },

    // Obtiene las materias asociadas a una carrera
    async obtener_materias_por_carrera(id_carrera) {
        try {
            const respuesta = await fetch(`${url_base}/catalogos/leer.php?accion=materias&id_carrera=${id_carrera}`);
            const json_resultado = await respuesta.json();
            return json_resultado.datos || [];
        } catch (error_peticion) {
            console.error('error_servicio_api::obtener_materias ->', error_peticion);
            return [];
        }
    },

    // Busca los examenes aplicando los filtros dinamicos
    async buscar_examenes(id_carrera, semestre_materia, id_materia) {
        try {
            const url_filtros = `${url_base}/examenes/leer.php?id_carrera=${id_carrera}&semestre_materia=${semestre_materia}&id_materia=${id_materia}`;
            const respuesta = await fetch(url_filtros);
            const json_resultado = await respuesta.json();
            return json_resultado.datos || [];
        } catch (error_peticion) {
            console.error('error_servicio_api::buscar_examenes ->', error_peticion);
            return [];
        }
    },

    // Inicia sesión en el sistema como usuario administrador
    async iniciar_sesion(correo_electronico, contrasena_recibida) {
        try {
            const respuesta = await fetch(`${url_base}/autenticacion/iniciar_sesion.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    correo_electronico: correo_electronico,
                    contrasena_recibida: contrasena_recibida
                })
            });
            return await respuesta.json();
        } catch (error_peticion) {
            console.error('error_servicio_api::iniciar_sesion ->', error_peticion);
            return { estado: "error", mensaje: "No se pudo conectar con el servidor de autenticación." };
        }
    },

    // Verifica si existe una sesión administrativa activa
    async verificar_sesion() {
        try {
            const respuesta = await fetch(`${url_base}/autenticacion/verificar_sesion.php`);
            return await respuesta.json();
        } catch (error_peticion) {
            console.error('error_servicio_api::verificar_sesion ->', error_peticion);
            return { estado: "error", mensaje: "Error al validar la sesión." };
        }
    },
    // Cierra la sesión activa del usuario en el servidor
    async cerrar_sesion() {
        try {
            const respuesta = await fetch(`${url_base}/autenticacion/cerrar_sesion.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            return await respuesta.json();
        } catch (error_peticion) {
            console.error('error_servicio_api::cerrar_sesion ->', error_peticion);
            return { estado: "error", mensaje: "No se pudo cerrar la sesión en el servidor." };
        }
    },

    // Obtiene el catálogo completo de profesores
    async obtener_profesores() {
        try {
            const respuesta = await fetch(`${url_base}/catalogos/leer.php?accion=profesores`);
            const json_resultado = await respuesta.json();
            return json_resultado.datos || [];
        } catch (error_peticion) {
            console.error('error_servicio_api::obtener_profesores ->', error_peticion);
            return [];
        }
    },

    // Obtiene el catálogo completo de salones con su edificio
    async obtener_salones() {
        try {
            const respuesta = await fetch(`${url_base}/catalogos/leer.php?accion=salones`);
            const json_resultado = await respuesta.json();
            return json_resultado.datos || [];
        } catch (error_peticion) {
            console.error('error_servicio_api::obtener_salones ->', error_peticion);
            return [];
        }
    },

    // Envía los datos del nuevo examen mediante un POST seguro
    async crear_examen(datos_examen) {
        try {
            const respuesta = await fetch(`${url_base}/examenes/crear.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos_examen)
            });
            return await respuesta.json();
        } catch (error_peticion) {
            console.error('error_servicio_api::crear_examen ->', error_peticion);
            return { estado: "error", mensaje: "No se pudo conectar con el servidor para registrar el examen." };
        }
    }
}   

