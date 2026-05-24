<?php
/**
 * Modelo para la gestion de catalogos (Carreras, Materias, Edificios, Salones).
 */

require_once __DIR__ . '/../configuracion/conexion_base_datos.php';

class ModeloCatalogo {
    private $conexion_bd;

    public function __construct() {
        $objeto_conexion = new ConexionBaseDatos();
        $this->conexion_bd = $objeto_conexion->obtener_conexion();
    }

    /**
     * Obtiene el listado completo de las carreras registradas.
     */
    public function obtener_carreras() {
        try {
            $consulta_sql = "SELECT id, nombre_carrera FROM carrera ORDER BY nombre_carrera ASC";
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->execute();
            
            return $sentencia->fetchAll();
        } catch (PDOException $error_sql) {
            $this->registrar_error_modelo("obtener_carreras", $error_sql->getMessage());
            return [];
        }
    }

    /**
     * Obtiene las materias filtradas por una carrera especifica.
     */
    public function obtener_materias_por_carrera($id_carrera) {
        try {
            $consulta_sql = "SELECT id, nombre_materia, semestre_materia 
                             FROM materia 
                             WHERE id_carrera = :id_carrera 
                             ORDER BY semestre_materia ASC, nombre_materia ASC";
                             
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->bindParam(':id_carrera', $id_carrera, PDO::PARAM_INT);
            $sentencia->execute();
            
            return $sentencia->fetchAll();
        } catch (PDOException $error_sql) {
            $this->registrar_error_modelo("obtener_materias_por_carrera", $error_sql->getMessage());
            return [];
        }
    }

    /**
     * Metodo interno para centralizar y registrar errores sin mostrarlos al usuario.
     */
    private $registrar_error_modelo($metodo, $mensaje_error) {
        $ruta_log = __DIR__ . '/../registros_error/errores_sistema.log';
        $mensaje_completo = "[" . date('Y-m-d H:i:s') . "] [ModeloCatalogo::$metodo] -> " . $mensaje_error . "\n";
        error_log($mensaje_completo, 3, $ruta_log);
    }
}