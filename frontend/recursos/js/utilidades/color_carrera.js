/**
 * Utilidad para asignar colores institucionales a las carreras de ESCOM.
 * Retorna la variable CSS correspondiente basada en palabras clave del nombre.
 * 
 * @param {string} nombre_carrera El nombre de la carrera
 * @returns {string} El valor CSS `var(--color_carrera_...)` 
 */
export function obtener_color_carrera(nombre_carrera) {
    if (!nombre_carrera) return 'var(--color_carrera_default)';

    const nombre_normalizado = nombre_carrera.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (nombre_normalizado.includes("sistemas")) {
        return 'var(--color_carrera_isc)';
    } else if (nombre_normalizado.includes("artificial")) {
        return 'var(--color_carrera_iia)';
    } else if (nombre_normalizado.includes("datos")) {
        return 'var(--color_carrera_lcd)';
    }

    return 'var(--color_carrera_default)';
}
