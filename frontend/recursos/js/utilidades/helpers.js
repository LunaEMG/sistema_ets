/**
 * Colección de funciones de utilidad general, como el control de retrasos (anti-rebote o debounce).
 */
export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const contexto = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(contexto, args);
        }, wait);
    };
}
