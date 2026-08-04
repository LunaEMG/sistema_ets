<?php
/**
 * Endpoint para eliminar registros específicos del catálogo.
 */
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../../modelos/modelo_catalogo.php';

ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['esta_autenticado']) || $_SESSION['esta_autenticado'] !== true) {
    http_response_code(401);
    echo json_encode(["estado" => "error", "mensaje" => "Operación denegada. Se requiere sesión administrativa."], JSON_UNESCAPED_UNICODE);
    exit();
}

if (!isset($_SERVER['HTTP_X_CSRF_TOKEN']) || !isset($_SESSION['token_csrf']) || $_SERVER['HTTP_X_CSRF_TOKEN'] !== $_SESSION['token_csrf']) {
    http_response_code(403);
    echo json_encode(["estado" => "error", "mensaje" => "Error de validación CSRF. Petición rechazada por seguridad."], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["estado" => "error", "mensaje" => "Método no permitido."]);
    exit();
}

$datos = json_decode(file_get_contents("php://input"), true);
if (!$datos || !isset($datos['accion']) || !isset($datos['id'])) {
    http_response_code(400);
    echo json_encode(["estado" => "error", "mensaje" => "Datos inválidos."]);
    exit();
}

$modelo = new ModeloCatalogo();
$accion = $datos['accion'];
$id = intval($datos['id']);
$resultado = false;

switch ($accion) {
    case 'carrera':
        $resultado = $modelo->eliminar_carrera($id);
        break;
    case 'materia':
        $resultado = $modelo->eliminar_materia($id);
        break;
    case 'profesor':
        $resultado = $modelo->eliminar_profesor($id);
        break;
    default:
        http_response_code(400);
        echo json_encode(["estado" => "error", "mensaje" => "Acción no válida."]);
        exit();
}

if ($resultado === true) {
    http_response_code(200);
    echo json_encode(["estado" => "exito", "mensaje" => "Registro eliminado correctamente."]);
} else if ($resultado === "constraint") {
    http_response_code(409);
    echo json_encode(["estado" => "error", "mensaje" => "No se puede eliminar porque existen registros (como materias o exámenes) que dependen de este elemento."]);
} else {
    http_response_code(500);
    echo json_encode(["estado" => "error", "mensaje" => "Error interno al intentar eliminar el registro."]);
}
