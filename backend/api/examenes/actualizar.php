<?php
/**
 * Endpoint de la API para actualizar de forma segura un examen ETS existente con doble horario.
 */
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);

header("Content-Type: application/json; charset=UTF-8");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['esta_autenticado']) || $_SESSION['esta_autenticado'] !== true) {
    http_response_code(401);
    echo json_encode(["estado" => "error", "mensaje" => "Operación denegada. Inicie sesión."], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["estado" => "error", "mensaje" => "Método no permitido. Utilice POST."], JSON_UNESCAPED_UNICODE);
    exit();
}

if (!isset($_SERVER['HTTP_X_CSRF_TOKEN']) || !isset($_SESSION['token_csrf']) || $_SERVER['HTTP_X_CSRF_TOKEN'] !== $_SESSION['token_csrf']) {
    http_response_code(403);
    echo json_encode(["estado" => "error", "mensaje" => "Error de validación CSRF. Petición rechazada por seguridad."], JSON_UNESCAPED_UNICODE);
    exit();
}

$datos_recibidos = json_decode(file_get_contents("php://input"), true);
if (!$datos_recibidos) {
    http_response_code(400);
    echo json_encode(["estado" => "error", "mensaje" => "Formato de datos inválido."], JSON_UNESCAPED_UNICODE);
    exit();
}

try {
    $id_examen = isset($datos_recibidos['id_examen']) ? intval($datos_recibidos['id_examen']) : 0;
    $id_materia = isset($datos_recibidos['id_materia']) ? intval($datos_recibidos['id_materia']) : 0;
    $fecha_examen = isset($datos_recibidos['fecha_examen']) ? trim($datos_recibidos['fecha_examen']) : '';
    $hora_manana = isset($datos_recibidos['hora_manana']) ? trim($datos_recibidos['hora_manana']) : '';
    $hora_tarde = isset($datos_recibidos['hora_tarde']) ? trim($datos_recibidos['hora_tarde']) : '';
    $id_salon = isset($datos_recibidos['id_salon']) ? intval($datos_recibidos['id_salon']) : 0;
    $id_profesor = isset($datos_recibidos['id_profesor']) ? intval($datos_recibidos['id_profesor']) : 0;

    if ($id_examen === 0 || $id_materia === 0 || empty($fecha_examen) || empty($hora_manana) || empty($hora_tarde) || $id_salon === 0 || $id_profesor === 0) {
        http_response_code(400);
        echo json_encode(["estado" => "error", "mensaje" => "Todos los campos son obligatorios."], JSON_UNESCAPED_UNICODE);
        exit();
    }


    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha_examen) || !strtotime($fecha_examen)) {
        http_response_code(400);
        echo json_encode(["estado" => "error", "mensaje" => "Formato de fecha inválido. Use AAAA-MM-DD."], JSON_UNESCAPED_UNICODE);
        exit();
    }
    if (!preg_match('/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/', $hora_manana) || !preg_match('/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/', $hora_tarde)) {
        http_response_code(400);
        echo json_encode(["estado" => "error", "mensaje" => "Formato de hora inválido. Use HH:MM:SS."], JSON_UNESCAPED_UNICODE);
        exit();
    }

    if ($hora_manana < '08:00:00' || $hora_tarde > '17:00:00' || $hora_manana >= $hora_tarde) {
        http_response_code(400);
        echo json_encode([
            "estado" => "error", 
            "mensaje" => "Los rangos de horarios seleccionados rompen las reglas operativas de la escuela (Mínimo inicio 08:00 hrs, Máximo inicio 17:00 hrs)."
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    require_once __DIR__ . '/../../modelos/modelo_examen.php';
    $modelo_examen = new ModeloExamen();

    if ($modelo_examen->verificar_conflicto_salon($id_salon, $fecha_examen, $hora_manana, $hora_tarde, $id_examen)) {
        http_response_code(409);
        echo json_encode(["estado" => "error", "mensaje" => "No se puede actualizar: El salón seleccionado se encuentra ocupado por otra evaluación en esa fecha y horarios."], JSON_UNESCAPED_UNICODE);
        exit();
    }

    if ($modelo_examen->verificar_conflicto_profesor($id_profesor, $fecha_examen, $hora_manana, $hora_tarde, $id_examen)) {
        http_response_code(409);
        echo json_encode(["estado" => "error", "mensaje" => "No se puede actualizar: El profesor coordinador ya tiene otra evaluación asignada en esa fecha y horarios."], JSON_UNESCAPED_UNICODE);
        exit();
    }

    if ($modelo_examen->actualizar_examen($id_examen, $id_materia, $fecha_examen, $hora_manana, $hora_tarde, $id_salon, $id_profesor)) {
        http_response_code(200);
        echo json_encode(["estado" => "exito", "mensaje" => "Examen ETS actualizado correctamente."], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode(["estado" => "error", "mensaje" => "No se pudo actualizar el registro debido a un problema interno."], JSON_UNESCAPED_UNICODE);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "estado" => "error",
        "mensaje" => "Ocurrió un error interno crítico en el servidor.",
        "detalle" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}