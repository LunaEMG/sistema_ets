<?php
/**
 * Endpoint de la API para consultar la programacion de examenes ETS.
 * Soporta filtros dinamicos y busqueda global (cuando los parametros son 0).
 */

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../../modelos/modelo_examen.php';

$modelo_examen = new ModeloExamen();

// Capturamos los parametros de la URL de forma segura
$id_carrera = isset($_GET['id_carrera']) ? intval($_GET['id_carrera']) : 0;
$semestre_materia = isset($_GET['semestre_materia']) ? intval($_GET['semestre_materia']) : 0;
$id_materia = isset($_GET['id_materia']) ? intval($_GET['id_materia']) : 0;

// REVISIÓN DE INGENIERÍA: Si todos los filtros son 0, ejecutamos busqueda global
// De lo contrario, aplicamos los filtros seleccionados por el usuario
if ($id_carrera === 0 && $semestre_materia === 0 && $id_materia === 0) {
    // LLamamos a un metodo global del modelo (o al mismo si tu logica interna ya maneja los ceros)
    $resultado_examenes = $modelo_examen->obtener_todos_los_examenes_completo();
} else {
    // Filtramos segun lo solicitado
    $resultado_examenes = $modelo_examen->buscar_examenes_con_filtros($id_carrera, $semestre_materia, $id_materia);
}

// Validamos la respuesta del modelo
if ($resultado_examenes !== false) {
    http_response_code(200);
    echo json_encode([
        "estado" => "exito",
        "datos" => $resultado_examenes
    ], JSON_UNESCAPED_UNICODE);
} else {
    // Si hubo un fallo en la consulta SQL, respondemos con un error controlado, no un 404 plano
    http_response_code(500);
    echo json_encode([
        "estado" => "error",
        "mensaje" => "No se pudo procesar la consulta en la base de datos."
    ], JSON_UNESCAPED_UNICODE);
}