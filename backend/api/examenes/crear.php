<?php
/**
 * Endpoint de la API para el registro seguro de nuevos examenes ETS.
 * Requiere verificacion obligatoria de sesion activa en el servidor.
 */
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['esta_autenticado']) || $_SESSION['esta_autenticado'] !== true) {
    http_response_code(401);
    echo json_encode(["estado" => "error", "mensaje" => "Operación denegada. Se requiere sesión administrativa."], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["estado" => "error", "mensaje" => "Método no permitido. Utilice POST."], JSON_UNESCAPED_UNICODE);
    exit();
}

$datos_recibidos = json_decode(file_get_contents("php://input"), true);

$id_materia = isset($datos_recibidos['id_materia']) ? intval($datos_recibidos['id_materia']) : 0;
$fecha_examen = isset($datos_recibidos['fecha_examen']) ? trim($datos_recibidos['fecha_examen']) : '';
$turno_examen = isset($datos_recibidos['turno_examen']) ? trim($datos_recibidos['turno_examen']) : '';
$id_salon = isset($datos_recibidos['id_salon']) ? intval($datos_recibidos['id_salon']) : 0;
$id_profesor = isset($datos_recibidos['id_profesor']) ? intval($datos_recibidos['id_profesor']) : 0;

if ($id_materia === 0 || empty($fecha_examen) || empty($turno_examen) || $id_salon === 0 || $id_profesor === 0) {
    http_response_code(400);
    echo json_encode(["estado" => "error", "mensaje" => "Todos los campos son obligatorios y deben ser válidos."], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($turno_examen !== 'Matutino' && $turno_examen !== 'Vespertino') {
    http_response_code(400);
    echo json_encode(["estado" => "error", "mensaje" => "El turno seleccionado no es válido."], JSON_UNESCAPED_UNICODE);
    exit();
}

require_once __DIR__ . '/../../modelos/modelo_examen.php';
$modelo_examen = new ModeloExamen();

$exito = $modelo_examen->crear_examen($id_materia, $fecha_examen, $turno_examen, $id_salon, $id_profesor);

if ($exito) {
    http_response_code(201);
    echo json_encode(["estado" => "exito", "mensaje" => "Examen ETS registrado correctamente en la programación oficial."], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode(["estado" => "error", "mensaje" => "No se pudo guardar el registro debido a un problema interno en el servidor."], JSON_UNESCAPED_UNICODE);
}