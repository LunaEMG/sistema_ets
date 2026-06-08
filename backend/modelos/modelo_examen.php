<?php
/**
 * Modelo para la gestión de exámenes ETS en la base de datos.
 */

require_once __DIR__ . '/../configuracion/conexion_base_datos.php';

class ModeloExamen {
    private $conexion_bd;

    public function __construct() {
        $objeto_conexion = new ConexionBaseDatos();
        $this->conexion_bd = $objeto_conexion->obtener_conexion();
    }

    public function crear_examen($id_materia, $fecha_examen, $hora_manana, $hora_tarde, $id_salon, $id_profesor) {
        try {
            $consulta_sql = "INSERT INTO examen (id_materia, fecha_examen, hora_manana, hora_tarde, id_salon, id_profesor) 
                             VALUES (:id_materia, :fecha_examen, :hora_manana, :hora_tarde, :id_salon, :id_profesor)";
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            return $sentencia->execute([
                ':id_materia' => $id_materia,
                ':fecha_examen' => $fecha_examen,
                ':hora_manana' => $hora_manana,
                ':hora_tarde' => $hora_tarde,
                ':id_salon' => $id_salon,
                ':id_profesor' => $id_profesor
            ]);
        } catch (PDOException $error_sql) {
            $this->registrar_error_examen("crear_examen", $error_sql->getMessage());
            return false;
        }
    }

    public function eliminar_examen($id_examen) {
        try {
            $consulta_sql = "DELETE FROM examen WHERE id = :id_examen";
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->bindParam(':id_examen', $id_examen, PDO::PARAM_INT);
            return $sentencia->execute();
        } catch (PDOException $error_sql) {
            $this->registrar_error_examen("eliminar_examen", $error_sql->getMessage());
            return false;
        }
    }

    public function obtener_todos_los_examenes_completo() {
        try {
            $consulta_sql = "SELECT e.id, m.nombre_materia, m.semestre_materia, c.nombre_carrera, 
                                    e.fecha_examen, e.hora_manana, e.hora_tarde, ed.nombre_edificio, s.nombre_salon, p.nombre_profesor
                             FROM examen e
                             INNER JOIN materia m ON e.id_materia = m.id
                             INNER JOIN carrera c ON m.id_carrera = c.id
                             INNER JOIN salon s ON e.id_salon = s.id
                             INNER JOIN edificio ed ON s.id_edificio = ed.id
                             INNER JOIN profesor p ON e.id_profesor = p.id
                             ORDER BY e.fecha_examen ASC, e.hora_manana ASC";

            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->execute();
            return $sentencia->fetchAll();
        } catch (PDOException $error_sql) {
            $this->registrar_error_examen("obtener_todos_los_examenes_completo", $error_sql->getMessage());
            return false;
        }
    }

    public function buscar_examenes_con_filtros($id_carrera, $semestre_materia, $id_materia) {
        try {
            $consulta_sql = "SELECT e.id, m.nombre_materia, m.semestre_materia, c.nombre_carrera, 
                                    e.fecha_examen, e.hora_manana, e.hora_tarde, ed.nombre_edificio, s.nombre_salon, p.nombre_profesor
                             FROM examen e
                             INNER JOIN materia m ON e.id_materia = m.id
                             INNER JOIN carrera c ON m.id_carrera = c.id
                             INNER JOIN salon s ON e.id_salon = s.id
                             INNER JOIN edificio ed ON s.id_edificio = ed.id
                             INNER JOIN profesor p ON e.id_profesor = p.id
                             WHERE 1=1";

            $parametros = [];

            if ($id_carrera > 0) {
                $consulta_sql .= " AND c.id = :id_carrera";
                $parametros[':id_carrera'] = $id_carrera;
            }
            if ($semestre_materia > 0) {
                $consulta_sql .= " AND m.semestre_materia = :semestre_materia";
                $parametros[':semestre_materia'] = $semestre_materia;
            }
            if ($id_materia > 0) {
                $consulta_sql .= " AND m.id = :id_materia";
                $parametros[':id_materia'] = $id_materia;
            }

            $consulta_sql .= " ORDER BY e.fecha_examen ASC, e.hora_manana ASC";

            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->execute($parametros);
            return $sentencia->fetchAll();
        } catch (PDOException $error_sql) {
            $this->registrar_error_examen("buscar_examenes_con_filtros", $error_sql->getMessage());
            return false;
        }
    }

    public function obtener_examen_por_id($id_examen) {
        try {
            $consulta_sql = "SELECT id, id_materia, fecha_examen, hora_manana, hora_tarde, id_salon, id_profesor 
                             FROM examen 
                             WHERE id = :id_examen 
                             LIMIT 1";
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->bindParam(':id_examen', $id_examen, PDO::PARAM_INT);
            $sentencia->execute();
            return $sentencia->fetch();
        } catch (PDOException $error_sql) {
            $this->registrar_error_examen("obtener_examen_por_id", $error_sql->getMessage());
            return false;
        }
    }

    public function actualizar_examen($id_examen, $id_materia, $fecha_examen, $hora_manana, $hora_tarde, $id_salon, $id_profesor) {
        try {
            $consulta_sql = "UPDATE examen 
                             SET id_materia = :id_materia, 
                                 fecha_examen = :fecha_examen, 
                                 hora_manana = :hora_manana, 
                                 hora_tarde = :hora_tarde, 
                                 id_salon = :id_salon, 
                                 id_profesor = :id_profesor 
                             WHERE id = :id_examen";
                             
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            return $sentencia->execute([
                ':id_examen' => $id_examen,
                ':id_materia' => $id_materia,
                ':fecha_examen' => $fecha_examen,
                ':hora_manana' => $hora_manana,
                ':hora_tarde' => $hora_tarde,
                ':id_salon' => $id_salon,
                ':id_profesor' => $id_profesor
            ]);
        } catch (PDOException $error_sql) {
            $this->registrar_error_examen("actualizar_examen", $error_sql->getMessage());
            return false;
        }
    }

    public function obtener_estadisticas_por_carrera() {
        try {
            $consulta_sql = "SELECT c.nombre_carrera, COUNT(e.id) AS total_examenes 
                             FROM carrera c 
                             LEFT JOIN materia m ON m.id_carrera = c.id 
                             LEFT JOIN examen e ON e.id_materia = m.id 
                             GROUP BY c.id, c.nombre_carrera 
                             ORDER BY c.nombre_carrera ASC";

            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->execute();
            return $sentencia->fetchAll();
        } catch (PDOException $error_sql) {
            $this->registrar_error_examen("obtener_estadisticas_por_carrera", $error_sql->getMessage());
            return false;
        }
    }


    public function verificar_conflicto_salon($id_salon, $fecha_examen, $hora_manana, $hora_tarde, $id_examen_ignorar = 0) {
        try {
            $consulta_sql = "SELECT COUNT(*) FROM examen 
                             WHERE id_salon = :id_salon 
                               AND fecha_examen = :fecha_examen 
                               AND (
                                   (:hora_manana < ADDTIME(hora_manana, '02:00:00') AND hora_manana < ADDTIME(:hora_manana, '02:00:00'))
                                   OR 
                                   (:hora_tarde < ADDTIME(hora_tarde, '02:00:00') AND hora_tarde < ADDTIME(:hora_tarde, '02:00:00'))
                               )";
            if ($id_examen_ignorar > 0) $consulta_sql .= " AND id != :id_examen_ignorar";

            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->bindParam(':id_salon', $id_salon, PDO::PARAM_INT);
            $sentencia->bindParam(':fecha_examen', $fecha_examen, PDO::PARAM_STR);
            $sentencia->bindParam(':hora_manana', $hora_manana, PDO::PARAM_STR);
            $sentencia->bindParam(':hora_tarde', $hora_tarde, PDO::PARAM_STR);
            if ($id_examen_ignorar > 0) $sentencia->bindParam(':id_examen_ignorar', $id_examen_ignorar, PDO::PARAM_INT);

            $sentencia->execute();
            return $sentencia->fetchColumn() > 0;
        } catch (PDOException $error_sql) {
            $this->registrar_error_examen("verificar_conflicto_salon", $error_sql->getMessage());
            return true;
        }
    }

    public function verificar_conflicto_profesor($id_profesor, $fecha_examen, $hora_manana, $hora_tarde, $id_examen_ignorar = 0) {
        try {
            $consulta_sql = "SELECT COUNT(*) FROM examen 
                             WHERE id_profesor = :id_profesor 
                               AND fecha_examen = :fecha_examen 
                               AND (
                                   (:hora_manana < ADDTIME(hora_manana, '02:00:00') AND hora_manana < ADDTIME(:hora_manana, '02:00:00'))
                                   OR 
                                   (:hora_tarde < ADDTIME(hora_tarde, '02:00:00') AND hora_tarde < ADDTIME(:hora_tarde, '02:00:00'))
                               )";
            if ($id_examen_ignorar > 0) $consulta_sql .= " AND id != :id_examen_ignorar";

            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->bindParam(':id_profesor', $id_profesor, PDO::PARAM_INT);
            $sentencia->bindParam(':fecha_examen', $fecha_examen, PDO::PARAM_STR);
            $sentencia->bindParam(':hora_manana', $hora_manana, PDO::PARAM_STR);
            $sentencia->bindParam(':hora_tarde', $hora_tarde, PDO::PARAM_STR);
            if ($id_examen_ignorar > 0) $sentencia->bindParam(':id_examen_ignorar', $id_examen_ignorar, PDO::PARAM_INT);

            $sentencia->execute();
            return $sentencia->fetchColumn() > 0;
        } catch (PDOException $error_sql) {
            $this->registrar_error_examen("verificar_conflicto_profesor", $error_sql->getMessage());
            return true;
        }
    }

    private function registrar_error_examen($metodo, $mensaje_error) {
        $ruta_log = __DIR__ . '/../registros_error/errores_sistema.log';
        $mensaje_completo = "[" . date('Y-m-d H:i:s') . "] [ModeloExamen::$metodo] -> " . $mensaje_error . "\n";
        error_log($mensaje_completo, 3, $ruta_log);
    }
}