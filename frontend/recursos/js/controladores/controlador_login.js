/**
 * Controlador que procesa el formulario de inicio de sesión y comunicación con la API.
 */
import { servicio_api } from '../servicios/servicio_api.js';

const formulario_login = document.getElementById('formulario_login');
const input_correo = document.getElementById('input_correo');
const input_contrasena = document.getElementById('input_contrasena');
const toggle_contrasena = document.getElementById('toggle_contrasena');
const btn_entrar = document.getElementById('btn_entrar');
const error_correo = document.getElementById('error_correo');
const error_contrasena = document.getElementById('error_contrasena');

function inicializar_login() {
    formulario_login.addEventListener('submit', procesar_intento_acceso);

    if (toggle_contrasena) {
        toggle_contrasena.addEventListener('click', () => {
            const tipo = input_contrasena.getAttribute('type') === 'password' ? 'text' : 'password';
            input_contrasena.setAttribute('type', tipo);
            toggle_contrasena.classList.toggle('fa-eye');
            toggle_contrasena.classList.toggle('fa-eye-slash');
        });
    }

    input_correo.addEventListener('blur', () => validar_campo(input_correo, error_correo, 'El correo electrónico es requerido.'));
    input_contrasena.addEventListener('blur', () => validar_campo(input_contrasena, error_contrasena, 'La contraseña es requerida.'));
}

function mostrar_error_inline(input, span_error, mensaje) {
    span_error.textContent = mensaje;
    span_error.classList.remove('oculta_mensaje');
    input.classList.add('input_invalido');
}

function limpiar_error_inline(input, span_error) {
    span_error.classList.add('oculta_mensaje');
    input.classList.remove('input_invalido');
}

function validar_campo(input, span_error, mensaje_vacio) {
    if (input.value.trim() === '') {
        mostrar_error_inline(input, span_error, mensaje_vacio);
        return false;
    }
    limpiar_error_inline(input, span_error);
    return true;
}

async function procesar_intento_acceso(evento) {
    evento.preventDefault();

    const correo_valido = validar_campo(input_correo, error_correo, 'El correo electrónico es requerido.');
    const contrasena_valida = validar_campo(input_contrasena, error_contrasena, 'La contraseña es requerida.');

    if (!correo_valido || !contrasena_valida) {
        if (!correo_valido) {
            input_correo.focus();
        } else {
            input_contrasena.focus();
        }
        return;
    }

    const correo = input_correo.value.trim();
    const contrasena = input_contrasena.value;

    const contenido_original_boton = btn_entrar.innerHTML;
    btn_entrar.disabled = true;
    btn_entrar.innerHTML = 'Verificando... <i class="fa-solid fa-spinner fa-spin"></i>';

    const respuesta_servidor = await servicio_api.iniciar_sesion(correo, contrasena);

    btn_entrar.disabled = false;
    btn_entrar.innerHTML = contenido_original_boton;

    if (respuesta_servidor.estado === 'exito') {
        Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: respuesta_servidor.mensaje,
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.replace('vistas/administracion/dashboard.html');
        });
    } else {
        mostrar_error_inline(input_contrasena, error_contrasena, respuesta_servidor.mensaje);
        input_contrasena.focus();
    }
}



document.addEventListener('DOMContentLoaded', inicializar_login);