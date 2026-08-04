<?php
/**
 * Endpoint para consultar todos los elementos de los distintos catálogos.
 */

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../../modelos/modelo_catalogo.php';

$modelo_catalogo = new ModeloCatalogo();

$accion = isset($_GET['accion']) ? $_GET['accion'] : '';

switch ($accion) {
    case 'carreras':
        $resultado = $modelo_catalogo->obtener_carreras();
        http_response_code(200);
        echo json_encode([
            "estado" => "exito",
            "datos" => $resultado
        ], JSON_UNESCAPED_UNICODE);
        break;

    case 'materias':
        $id_carrera = isset($_GET['id_carrera']) ? intval($_GET['id_carrera']) : 0;
        
        if ($id_carrera > 0) {
            $resultado = $modelo_catalogo->obtener_materias_por_carrera($id_carrera);
            http_response_code(200);
            echo json_encode([
                "estado" => "exito",
                "datos" => $resultado
            ], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(400);
            echo json_encode([
                "estado" => "error",
                "mensaje" => "El parametro id_carrera es requerido y debe ser valido."
            ], JSON_UNESCAPED_UNICODE);
        }
        break;

    case 'todas_materias':
        $resultado = $modelo_catalogo->obtener_todas_materias();
        http_response_code(200);
        echo json_encode(["estado" => "exito", "datos" => $resultado], JSON_UNESCAPED_UNICODE);
        break;

    case 'profesores':
        $resultado = $modelo_catalogo->obtener_profesores();
        http_response_code(200);
        echo json_encode(["estado" => "exito", "datos" => $resultado], JSON_UNESCAPED_UNICODE);
        break;

    case 'salones':
        $resultado = $modelo_catalogo->obtener_salones();
        http_response_code(200);
        echo json_encode(["estado" => "exito", "datos" => $resultado], JSON_UNESCAPED_UNICODE);
        break;

    default:
        http_response_code(400);
        echo json_encode([
            "estado" => "error",
            "mensaje" => "Accion no valida o no especificada."
        ], JSON_UNESCAPED_UNICODE);
        break;
}