<?php
/**
 * Endpoint para destruir la sesión activa y desloguear al administrador.
 */
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);

header("Content-Type: application/json; charset=UTF-8");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$_SESSION = array();

if (ini_get("session.use_cookies")) {
    $parametros_cookie = session_get_cookie_params();
    setcookie(
        session_name(), 
        '', 
        time() - 42000,
        $parametros_cookie["path"], 
        $parametros_cookie["domain"],
        $parametros_cookie["secure"], 
        $parametros_cookie["httponly"]
    );
}

session_destroy();

http_response_code(200);
echo json_encode([
    "estado" => "exito",
    "mensaje" => "Sesion finalizada correctamente. Redirigiendo..."
], JSON_UNESCAPED_UNICODE);