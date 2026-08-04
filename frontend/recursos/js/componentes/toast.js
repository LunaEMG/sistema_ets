/**
 * Componente global para renderizar notificaciones flotantes (toasts) en la interfaz.
 */
window.Toast = {
    mostrar(titulo, mensaje, tipo = 'success') {
        let contenedor = document.querySelector('.toast_container');
        if (!contenedor) {
            contenedor = document.createElement('div');
            contenedor.className = 'toast_container';
            document.body.appendChild(contenedor);
        }

        const toast = document.createElement('div');
        toast.className = 'toast_notification';
        

        let icono_class = 'fa-circle-check';
        let icono_color = 'var(--color_blue_600)';
        
        if (tipo === 'error') {
            icono_class = 'fa-circle-xmark';
            icono_color = '#ef4444'; // Red
        } else if (tipo === 'info' || tipo === 'warning') {
            icono_class = 'fa-circle-info';
            icono_color = '#f59e0b'; // Amber
        }

        toast.innerHTML = `
            <i class="fa-solid ${icono_class} toast_icono" style="color: ${icono_color}"></i>
            <div class="toast_contenido">
                <p class="toast_titulo">${titulo}</p>
                <p class="toast_mensaje">${mensaje}</p>
            </div>
        `;

        contenedor.appendChild(toast);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.add('mostrar');
            });
        });

        setTimeout(() => {
            toast.classList.remove('mostrar');
            toast.classList.add('saliendo');
            toast.addEventListener('transitionend', () => {
                toast.remove();
            });
        }, 3500);
    }
};
