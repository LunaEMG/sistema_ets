<?php
/**
 * Endpoint de la API para la eliminacion segura de examenes ETS.
 * Requiere verificacion obligatoria de sesion activa.
 */
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);

header("Content-Type: application/json; charset=UTF-8");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['esta_autenticado']) || $_SESSION['esta_autenticado'] !== true) {
    http_response_code(401);
    echo json_encode(["estado" => "error", "mensaje" => "Operación denegada. Se requiere sesión."], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["estado" => "error", "mensaje" => "Método no permitido. Utilice POST."], JSON_UNESCAPED_UNICODE);
    exit();
}

$datos_recibidos = json_decode(file_get_contents("php://input"), true);
$id_examen = isset($datos_recibidos['id_examen']) ? intval($datos_recibidos['id_examen']) : 0;

if ($id_examen === 0) {
    http_response_code(400);
    echo json_encode(["estado" => "error", "mensaje" => "ID de examen no válido o ausente."], JSON_UNESCAPED_UNICODE);
    exit();
}

require_once __DIR__ . '/../../modelos/modelo_examen.php';
$modelo_examen = new ModeloExamen();

if ($modelo_examen->eliminar_examen($id_examen)) {
    http_response_code(200);
    echo json_encode(["estado" => "exito", "mensaje" => "Examen ETS eliminado correctamente del sistema."], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode(["estado" => "error", "mensaje" => "No se pudo eliminar el registro debido a un problema interno."], JSON_UNESCAPED_UNICODE);
}