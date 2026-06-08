<?php
/**
 * Endpoint de la API para procesar la autenticacion de administradores.
 * Recibe datos por POST (JSON) y maneja sesiones seguras nativas.
 */

ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../../modelos/modelo_usuario.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["estado" => "error", "mensaje" => "Metodo no permitido. Utilice POST."], JSON_UNESCAPED_UNICODE);
    exit();
}

$datos_recibidos = json_decode(file_get_contents("php://input"), true);

$correo_electronico = isset($datos_recibidos['correo_electronico']) ? trim($datos_recibidos['correo_electronico']) : '';
$contrasena_recibida = isset($datos_recibidos['contrasena_recibida']) ? $datos_recibidos['contrasena_recibida'] : '';

if (empty($correo_electronico) || empty($contrasena_recibida)) {
    http_response_code(400);
    echo json_encode(["estado" => "error", "mensaje" => "Todos los campos son obligatorios."], JSON_UNESCAPED_UNICODE);
    exit();
}

if (!filter_var($correo_electronico, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["estado" => "error", "mensaje" => "El formato del correo electronico no es valido."], JSON_UNESCAPED_UNICODE);
    exit();
}

$modelo_usuario = new ModeloUsuario();
$usuario_encontrado = $modelo_usuario->obtener_usuario_por_correo($correo_electronico);

if ($usuario_encontrado && password_verify($contrasena_recibida, $usuario_encontrado['contrasena_encriptada'])) {
    
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    session_regenerate_id(true);

    $_SESSION['id_usuario'] = $usuario_encontrado['id'];
    $_SESSION['correo_usuario'] = $usuario_encontrado['correo_electronico'];
    $_SESSION['esta_autenticado'] = true;

    http_response_code(200);
    echo json_encode([
        "estado" => "exito",
        "mensaje" => "Autenticacion exitosa. Bienvenido al panel de control.",
        "usuario" => [
            "id" => $usuario_encontrado['id'],
            "correo_electronico" => $usuario_encontrado['correo_electronico']
        ]
    ], JSON_UNESCAPED_UNICODE);

} else {
    http_response_code(401);
    echo json_encode(["estado" => "error", "mensaje" => "El correo electronico o la contraseña son incorrectos."], JSON_UNESCAPED_UNICODE);
}