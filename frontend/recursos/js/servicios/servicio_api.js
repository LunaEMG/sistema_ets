/**
 * Plataforma ETS - ESCOM IPN
 * Servicio Centralizado de API (Frontend) - VERSIÓN COMPLETA INTEGRADA
 */

const URL_BASE = 'http://localhost:8080/api';

let token_csrf_actual = null;

export const servicio_api = {

    /**
     * ==========================================
     * MÓDULO PÚBLICO / CONSULTAS Y FILTROS
     * ==========================================
     */

    async obtener_carreras() {
        try {
            const respuesta = await fetch(`${URL_BASE}/catalogos/leer.php?accion=carreras`);
            if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
            const datos = await respuesta.json();
            return datos.datos || [];
        } catch (error) {
            console.error("error_servicio_api::obtener_carreras ->", error);
            return [];
        }
    },

    async obtener_materias_por_carrera(id_carrera) {
        try {
            const respuesta = await fetch(`${URL_BASE}/catalogos/leer.php?accion=materias&id_carrera=${parseInt(id_carrera)}`);
            if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
            const datos = await respuesta.json();
            return datos.datos || [];
        } catch (error) {
            console.error("error_servicio_api::obtener_materias_por_carrera ->", error);
            return [];
        }
    },

    async obtener_salones() {
        try {
            const respuesta = await fetch(`${URL_BASE}/catalogos/leer.php?accion=salones`);
            if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
            const datos = await respuesta.json();
            return datos.datos || [];
        } catch (error) {
            console.error("error_servicio_api::obtener_salones ->", error);
            return [];
        }
    },

    async obtener_profesores() {
        try {
            const respuesta = await fetch(`${URL_BASE}/catalogos/leer.php?accion=profesores`);
            if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
            const datos = await respuesta.json();
            return datos.datos || [];
        } catch (error) {
            console.error("error_servicio_api::obtener_profesores ->", error);
            return [];
        }
    },

    async buscar_examenes(id_carrera, semestre_materia, id_materia) {
        try {
            const carrera_id = parseInt(id_carrera) || 0;
            const semestre_num = parseInt(semestre_materia) || 0;
            const materia_id = parseInt(id_materia) || 0;

            const url_filtros = `${URL_BASE}/examenes/leer.php?id_carrera=${carrera_id}&semestre_materia=${semestre_num}&id_materia=${materia_id}`;
            const respuesta = await fetch(url_filtros, { method: 'GET' });
            if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
            
            const datos = await respuesta.json();
            return datos.datos || [];
        } catch (error) {
            console.error("error_servicio_api::buscar_examenes ->", error);
            return [];
        }
    },

    /**
     * ==========================================
     * MÓDULO DE AUTENTICACIÓN / SESIONES
     * ==========================================
     */

    async iniciar_sesion(correo, contrasena) {
        try {
            const respuesta = await fetch(`${URL_BASE}/autenticacion/iniciar_sesion.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    correo_electronico: correo.trim(), 
                    contrasena_recibida: contrasena 
                })
            });
            const datos = await respuesta.json();
            if (datos.estado === 'exito' && datos.token_csrf) {
                token_csrf_actual = datos.token_csrf;
            }
            return datos;
        } catch (error) {
            console.error("error_servicio_api::iniciar_sesion ->", error);
            return { estado: 'error', mensaje: 'No se pudo conectar con el servidor.' };
        }
    },

    async verificar_sesion() {
        try {
            const respuesta = await fetch(`${URL_BASE}/autenticacion/verificar_sesion.php`, {
                method: 'GET'
            });
            if (!respuesta.ok) return { estado: 'no_autenticado' };
            const datos = await respuesta.json();
            if (datos.estado === 'autenticado' && datos.token_csrf) {
                token_csrf_actual = datos.token_csrf;
            }
            return datos;
        } catch (error) {
            console.error("error_servicio_api::verificar_sesion ->", error);
            return { estado: 'error' };
        }
    },

    async cerrar_sesion() {
        try {
            const respuesta = await fetch(`${URL_BASE}/autenticacion/cerrar_sesion.php`, {
                method: 'GET'
            });
            if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
            token_csrf_actual = null;
            return await respuesta.json();
        } catch (error) {
            console.error("error_servicio_api::cerrar_sesion ->", error);
            return { estado: 'error', mensaje: 'Fallo al cerrar sesión.' };
        }
    },

    /**
     * ==========================================
     * MÓDULO ADMINISTRATIVO (CRUD & MÉTRICAS)
     * ==========================================
     */

    async obtener_estadisticas() {
        try {
            const respuesta = await fetch(`${URL_BASE}/examenes/estadisticas.php`, {
                method: 'GET'
            });
            if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
            const datos = await respuesta.json();
            return datos.datos || [];
        } catch (error) {
            console.error("error_servicio_api::obtener_estadisticas ->", error);
            return [];
        }
    },

    async crear_examen(datos_examen) {
        try {
            const respuesta = await fetch(`${URL_BASE}/examenes/crear.php`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token_csrf_actual || ''
                },
                body: JSON.stringify(datos_examen)
            });
            if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
            return await respuesta.json();
        } catch (error) {
            console.error("error_servicio_api::crear_examen ->", error);
            return { estado: 'error', mensaje: 'Error interno al guardar.' };
        }
    },

    async actualizar_examen(datos_examen) {
        try {
            const respuesta = await fetch(`${URL_BASE}/examenes/actualizar.php`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token_csrf_actual || ''
                },
                body: JSON.stringify(datos_examen)
            });
            if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
            return await respuesta.json();
        } catch (error) {
            console.error("error_servicio_api::actualizar_examen ->", error);
            return { estado: 'error', mensaje: 'Error interno al actualizar.' };
        }
    },

    async eliminar_examen(id_examen) {
        try {
            const respuesta = await fetch(`${URL_BASE}/examenes/eliminar.php`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token_csrf_actual || ''
                },
                body: JSON.stringify({ id_examen: parseInt(id_examen) })
            });
            if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
            return await respuesta.json();
        } catch (error) {
            console.error("error_servicio_api::eliminar_examen ->", error);
            return { estado: 'error', mensaje: 'Error al eliminar.' };
        }
    }
};