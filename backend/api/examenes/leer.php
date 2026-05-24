<?php
/**
 * Endpoint de la API para la busqueda y filtrado de examenes ETS.
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

require_once __DIR__ . '/../../modelos/modelo_examen.php';

$modelo_examen = new ModeloExamen();

// Sanitizamos y recuperamos los filtros opcionales enviados por GET
$id_carrera = isset($_GET['id_carrera']) ? intval($_GET['id_carrera']) : 0;
$semestre_materia = isset($_GET['semestre_materia']) ? intval($_GET['semestre_materia']) : 0;
$id_materia = isset($_GET['id_materia']) ? intval($_GET['id_materia']) : 0;

// Consultamos los examenes correspondientes
$resultado_examenes = $modelo_examen->buscar_examenes($id_carrera, $semestre_materia, $id_materia);

http_response_code(200);
echo json_encode([
    "estado" => "exito",
    "resultados_encontrados" => count($resultado_examenes),
    "datos" => $resultado_examenes
], JSON_UNESCAPED_UNICODE);