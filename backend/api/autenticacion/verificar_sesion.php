<?php
/**
 * Endpoint de la API para verificar si el usuario tiene una sesion activa y valida.
 */
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);

header("Content-Type: application/json; charset=UTF-8");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (isset($_SESSION['esta_autenticado']) && $_SESSION['esta_autenticado'] === true) {
    http_response_code(200);
    echo json_encode([
        "estado" => "autenticado",
        "mensaje" => "Sesión activa.",
        "usuario" => [
            "correo_electronico" => $_SESSION['correo_usuario']
        ]
    ], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(401);
    echo json_encode([
        "estado" => "no_autenticado",
        "mensaje" => "Acceso denegado. No existe una sesión activa."
    ], JSON_UNESCAPED_UNICODE);
}