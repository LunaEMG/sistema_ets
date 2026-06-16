<?php
/**
 * Endpoint para crear catálogos in-line (Carreras, Materias, Profesores).
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

$json_recibido = file_get_contents("php://input");
$datos_recibidos = json_decode($json_recibido, true);

if (!$datos_recibidos || !isset($datos_recibidos['accion'])) {
    http_response_code(400);
    echo json_encode(["estado" => "error", "mensaje" => "Datos JSON inválidos o acción no especificada."]);
    exit();
}

$modelo_catalogo = new ModeloCatalogo();
$accion = $datos_recibidos['accion'];

switch ($accion) {
    case 'carrera':
        $nombre_carrera = isset($datos_recibidos['nombre_carrera']) ? trim($datos_recibidos['nombre_carrera']) : '';
        if (empty($nombre_carrera)) {
            http_response_code(400);
            echo json_encode(["estado" => "error", "mensaje" => "Nombre de carrera requerido."]);
            exit();
        }
        $id_nuevo = $modelo_catalogo->crear_carrera($nombre_carrera);
        if ($id_nuevo) {
            http_response_code(201);
            echo json_encode(["estado" => "exito", "mensaje" => "Carrera creada", "id" => $id_nuevo]);
        } else {
            http_response_code(500);
            echo json_encode(["estado" => "error", "mensaje" => "Error al crear carrera. Posible duplicado."]);
        }
        break;

    case 'materia':
        $nombre_materia = isset($datos_recibidos['nombre_materia']) ? trim($datos_recibidos['nombre_materia']) : '';
        $semestre = isset($datos_recibidos['semestre_materia']) ? intval($datos_recibidos['semestre_materia']) : 0;
        $id_carrera = isset($datos_recibidos['id_carrera']) ? intval($datos_recibidos['id_carrera']) : 0;
        
        if (empty($nombre_materia) || $semestre <= 0 || $id_carrera <= 0) {
            http_response_code(400);
            echo json_encode(["estado" => "error", "mensaje" => "Faltan datos de la materia."]);
            exit();
        }
        $id_nuevo = $modelo_catalogo->crear_materia($nombre_materia, $semestre, $id_carrera);
        if ($id_nuevo) {
            http_response_code(201);
            echo json_encode(["estado" => "exito", "mensaje" => "Materia creada", "id" => $id_nuevo]);
        } else {
            http_response_code(500);
            echo json_encode(["estado" => "error", "mensaje" => "Error al crear materia."]);
        }
        break;

    case 'profesor':
        $nombre_profesor = isset($datos_recibidos['nombre_profesor']) ? trim($datos_recibidos['nombre_profesor']) : '';
        $correo = isset($datos_recibidos['correo_electronico']) ? trim($datos_recibidos['correo_electronico']) : '';
        
        if (empty($nombre_profesor) || empty($correo)) {
            http_response_code(400);
            echo json_encode(["estado" => "error", "mensaje" => "Faltan datos del profesor."]);
            exit();
        }
        $id_nuevo = $modelo_catalogo->crear_profesor($nombre_profesor, $correo);
        if ($id_nuevo) {
            http_response_code(201);
            echo json_encode(["estado" => "exito", "mensaje" => "Profesor creado", "id" => $id_nuevo]);
        } else {
            http_response_code(500);
            echo json_encode(["estado" => "error", "mensaje" => "Error al crear profesor. Correo duplicado."]);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(["estado" => "error", "mensaje" => "Acción no válida."]);
        break;
}
