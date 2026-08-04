<?php
/**
 * Endpoint para consultar la programación de exámenes ETS con soporte para filtros dinámicos.
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["estado" => "error", "mensaje" => "Metodo no permitido. Use GET."], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once __DIR__ . '/../../modelos/modelo_examen.php';

try {
    $modelo_examen = new ModeloExamen();


    $id_carrera = isset($_GET['id_carrera']) ? intval($_GET['id_carrera']) : 0;
    $semestre_materia = isset($_GET['semestre_materia']) ? intval($_GET['semestre_materia']) : 0;
    $id_materia = isset($_GET['id_materia']) ? intval($_GET['id_materia']) : 0;


    $id_carrera = max(0, $id_carrera);
    $semestre_materia = max(0, $semestre_materia);
    $id_materia = max(0, $id_materia);


    if ($id_carrera === 0 && $semestre_materia === 0 && $id_materia === 0) {
        $resultado_examenes = $modelo_examen->obtener_todos_los_examenes_completo();
    } else {
        $resultado_examenes = $modelo_examen->buscar_examenes_con_filtros($id_carrera, $semestre_materia, $id_materia);
    }


    if ($resultado_examenes !== false) {
        http_response_code(200);
        echo json_encode([
            "estado" => "exito",
            "datos" => $resultado_examenes
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode([
            "estado" => "error",
            "mensaje" => "No se pudo procesar la consulta en la base de datos."
        ], JSON_UNESCAPED_UNICODE);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "estado" => "error",
        "mensaje" => "Ocurrió un error interno del servidor.",
        "detalle" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}