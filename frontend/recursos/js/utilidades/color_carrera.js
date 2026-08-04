/**
 * Función auxiliar para asignar colores dinámicos a las distintas carreras en la UI.
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
