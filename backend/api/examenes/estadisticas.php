<?php
/**
 * Endpoint para calcular y obtener estadísticas generales de los exámenes por carrera.
 */
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);

header("Content-Type: application/json; charset=UTF-8");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


if (!isset($_SESSION['esta_autenticado']) || $_SESSION['esta_autenticado'] !== true) {
    http_response_code(401);
    echo json_encode(["estado" => "error", "mensaje" => "No autorizado."], JSON_UNESCAPED_UNICODE);
    exit();
}

require_once __DIR__ . '/../../modelos/modelo_examen.php';
$modelo_examen = new ModeloExamen();

$datos_estadisticos = $modelo_examen->obtener_estadisticas_por_carrera();

if ($datos_estadisticos !== false) {
    http_response_code(200);
    echo json_encode([
        "estado" => "exito",
        "datos" => $datos_estadisticos
    ], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode(["estado" => "error", "mensaje" => "Fallo interno al compilar estadísticas."], JSON_UNESCAPED_UNICODE);
}