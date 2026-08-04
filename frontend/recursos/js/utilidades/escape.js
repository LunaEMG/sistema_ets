/**
 * Función auxiliar para escapar texto y prevenir ataques XSS al renderizar contenido dinámico.
 */
export function escaparHTML(cadena) {
    if (typeof cadena !== 'string') return cadena;
    return cadena.replace(/[&<>"']/g, function(caracter) {
        const mapa = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return mapa[caracter];
    });
}
