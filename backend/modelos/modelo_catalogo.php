<?php
/**
 * Modelo para la gestion de catalogos (Carreras, Materias, Edificios, Salones).
 * Ejecuta consultas seguras mediante sentencias preparadas con PDO.
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
            
            // Vinculacion estricta de parametros (Mitigacion de Inyeccion SQL)
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
    private function registrar_error_modelo($metodo, $mensaje_error) {
        $ruta_log = __DIR__ . '/../registros_error/errores_sistema.log';
        $mensaje_completo = "[" . date('Y-m-d H:i:s') . "] [ModeloCatalogo::$metodo] -> " . $mensaje_error . "\n";
        error_log($mensaje_completo, 3, $ruta_log);
    }
    /**
     * Obtiene el listado de profesores registrados.
     */
    public function obtener_profesores() {
        try {
            $consulta_sql = "SELECT id, nombre_profesor FROM profesor ORDER BY nombre_profesor ASC";
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->execute();
            return $sentencia->fetchAll();
        } catch (PDOException $error_sql) {
            $this->registrar_error_modelo("obtener_profesores", $error_sql->getMessage());
            return [];
        }
    }

    /**
     * Obtiene los salones junto con el nombre de su edificio correspondiente.
     */
    public function obtener_salones() {
        try {
            $consulta_sql = "SELECT s.id, CONCAT(e.nombre_edificio, ' - ', s.nombre_salon) AS ubicacion_completa 
                             FROM salon s 
                             INNER JOIN edificio e ON s.id_edificio = e.id 
                             ORDER BY e.nombre_edificio ASC, s.nombre_salon ASC";
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->execute();
            return $sentencia->fetchAll();
        } catch (PDOException $error_sql) {
            $this->registrar_error_modelo("obtener_salones", $error_sql->getMessage());
            return [];
        }
    }
}

