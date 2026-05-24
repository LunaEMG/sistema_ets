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
    }
};