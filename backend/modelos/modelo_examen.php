<?php
/**
 * Modelo para la gestion y busqueda avanzada de examenes ETS.
 * Realiza un cruce de tablas optimizado mediante INNER JOIN.
 */

require_once __DIR__ . '/../configuracion/conexion_base_datos.php';

class ModeloExamen {
    private $conexion_bd;

    public function __construct() {
        $objeto_conexion = new ConexionBaseDatos();
        $this->conexion_bd = $objeto_conexion->obtener_conexion();
    }

    /**
     * Busca examenes aplicando filtros dinamicos (Carrera, Semestre, Materia).
     */
    public function buscar_examenes($id_carrera, $semestre_materia, $id_materia) {
        try {
            // Consulta base uniendo los catalogos para traer los nombres legibles
            $consulta_sql = "SELECT 
                                m.nombre_materia, 
                                m.semestre_materia,
                                c.nombre_carrera,
                                e.fecha_examen, 
                                e.turno_examen, 
                                ed.nombre_edificio,
                                s.nombre_salon, 
                                p.nombre_profesor
                             FROM examen e
                             INNER JOIN materia m ON e.id_materia = m.id
                             INNER JOIN carrera c ON m.id_carrera = c.id
                             INNER JOIN salon s ON e.id_salon = s.id
                             INNER JOIN edificio ed ON s.id_edificio = ed.id
                             INNER JOIN profesor p ON e.id_profesor = p.id
                             WHERE 1=1";

            $parametros = [];

            if ($id_carrera > 0) {
                $consulta_sql .= " AND m.id_carrera = :id_carrera";
                $parametros[':id_carrera'] = $id_carrera;
            }
            if ($semestre_materia > 0) {
                $consulta_sql .= " AND m.semestre_materia = :semestre_materia";
                $parametros[':semestre_materia'] = $semestre_materia;
            }
            if ($id_materia > 0) {
                $consulta_sql .= " AND e.id_materia = :id_materia";
                $parametros[':id_materia'] = $id_materia;
            }

            $consulta_sql .= " ORDER BY e.fecha_examen ASC, e.turno_examen ASC";

            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->execute($parametros);

            return $sentencia->fetchAll();
        } catch (PDOException $error_sql) {
            $this->registrar_error_examen("buscar_examenes", $error_sql->getMessage());
            return [];
        }
    }

    private function registrar_error_examen($metodo, $mensaje_error) {
        $ruta_log = __DIR__ . '/../registros_error/errores_sistema.log';
        $mensaje_completo = "[" . date('Y-m-d H:i:s') . "] [ModeloExamen::$metodo] -> " . $mensaje_error . "\n";
        error_log($mensaje_completo, 3, $ruta_log);
    }
}