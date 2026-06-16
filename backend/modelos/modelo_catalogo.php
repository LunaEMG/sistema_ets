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

    /**
     * Crea una nueva carrera y retorna su ID.
     */
    public function crear_carrera($nombre_carrera) {
        try {
            $consulta_sql = "INSERT INTO carrera (nombre_carrera) VALUES (:nombre_carrera)";
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->bindParam(':nombre_carrera', $nombre_carrera, PDO::PARAM_STR);
            $sentencia->execute();
            return $this->conexion_bd->lastInsertId();
        } catch (PDOException $error_sql) {
            $this->registrar_error_modelo("crear_carrera", $error_sql->getMessage());
            return false;
        }
    }

    /**
     * Crea una nueva materia y retorna su ID.
     */
    public function crear_materia($nombre_materia, $semestre_materia, $id_carrera) {
        try {
            $consulta_sql = "INSERT INTO materia (nombre_materia, semestre_materia, id_carrera) 
                             VALUES (:nombre_materia, :semestre_materia, :id_carrera)";
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->bindParam(':nombre_materia', $nombre_materia, PDO::PARAM_STR);
            $sentencia->bindParam(':semestre_materia', $semestre_materia, PDO::PARAM_INT);
            $sentencia->bindParam(':id_carrera', $id_carrera, PDO::PARAM_INT);
            $sentencia->execute();
            return $this->conexion_bd->lastInsertId();
        } catch (PDOException $error_sql) {
            $this->registrar_error_modelo("crear_materia", $error_sql->getMessage());
            return false;
        }
    }

    /**
     * Crea un nuevo profesor y retorna su ID.
     */
    public function crear_profesor($nombre_profesor, $correo_electronico) {
        try {
            $consulta_sql = "INSERT INTO profesor (nombre_profesor, correo_electronico) 
                             VALUES (:nombre_profesor, :correo_electronico)";
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->bindParam(':nombre_profesor', $nombre_profesor, PDO::PARAM_STR);
            $sentencia->bindParam(':correo_electronico', $correo_electronico, PDO::PARAM_STR);
            $sentencia->execute();
            return $this->conexion_bd->lastInsertId();
        } catch (PDOException $error_sql) {
            $this->registrar_error_modelo("crear_profesor", $error_sql->getMessage());
            return false;
        }
    }
    /**
     * Obtiene todas las materias junto con el nombre de su carrera.
     */
    public function obtener_todas_materias() {
        try {
            $consulta_sql = "SELECT m.id, m.nombre_materia, m.semestre_materia, m.id_carrera, c.nombre_carrera 
                             FROM materia m
                             INNER JOIN carrera c ON m.id_carrera = c.id
                             ORDER BY c.nombre_carrera ASC, m.semestre_materia ASC, m.nombre_materia ASC";
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->execute();
            return $sentencia->fetchAll();
        } catch (PDOException $error_sql) {
            $this->registrar_error_modelo("obtener_todas_materias", $error_sql->getMessage());
            return [];
        }
    }

    public function actualizar_carrera($id, $nombre_carrera) {
        try {
            $consulta_sql = "UPDATE carrera SET nombre_carrera = :nombre WHERE id = :id";
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->bindParam(':nombre', $nombre_carrera, PDO::PARAM_STR);
            $sentencia->bindParam(':id', $id, PDO::PARAM_INT);
            return $sentencia->execute();
        } catch (PDOException $error_sql) {
            $this->registrar_error_modelo("actualizar_carrera", $error_sql->getMessage());
            return false;
        }
    }

    public function actualizar_materia($id, $nombre_materia, $semestre, $id_carrera) {
        try {
            $consulta_sql = "UPDATE materia SET nombre_materia = :nombre, semestre_materia = :semestre, id_carrera = :id_carrera WHERE id = :id";
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->bindParam(':nombre', $nombre_materia, PDO::PARAM_STR);
            $sentencia->bindParam(':semestre', $semestre, PDO::PARAM_INT);
            $sentencia->bindParam(':id_carrera', $id_carrera, PDO::PARAM_INT);
            $sentencia->bindParam(':id', $id, PDO::PARAM_INT);
            return $sentencia->execute();
        } catch (PDOException $error_sql) {
            $this->registrar_error_modelo("actualizar_materia", $error_sql->getMessage());
            return false;
        }
    }

    public function actualizar_profesor($id, $nombre_profesor, $correo) {
        try {
            $consulta_sql = "UPDATE profesor SET nombre_profesor = :nombre, correo_electronico = :correo WHERE id = :id";
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->bindParam(':nombre', $nombre_profesor, PDO::PARAM_STR);
            $sentencia->bindParam(':correo', $correo, PDO::PARAM_STR);
            $sentencia->bindParam(':id', $id, PDO::PARAM_INT);
            return $sentencia->execute();
        } catch (PDOException $error_sql) {
            $this->registrar_error_modelo("actualizar_profesor", $error_sql->getMessage());
            return false;
        }
    }


    public function eliminar_carrera($id) {
        try {
            $consulta_sql = "DELETE FROM carrera WHERE id = :id";
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->bindParam(':id', $id, PDO::PARAM_INT);
            $sentencia->execute();
            return true;
        } catch (PDOException $error_sql) {
            if ($error_sql->getCode() == 23000) return "constraint";
            $this->registrar_error_modelo("eliminar_carrera", $error_sql->getMessage());
            return false;
        }
    }

    public function eliminar_materia($id) {
        try {
            $consulta_sql = "DELETE FROM materia WHERE id = :id";
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->bindParam(':id', $id, PDO::PARAM_INT);
            $sentencia->execute();
            return true;
        } catch (PDOException $error_sql) {
            if ($error_sql->getCode() == 23000) return "constraint";
            $this->registrar_error_modelo("eliminar_materia", $error_sql->getMessage());
            return false;
        }
    }

    public function eliminar_profesor($id) {
        try {
            $consulta_sql = "DELETE FROM profesor WHERE id = :id";
            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            $sentencia->bindParam(':id', $id, PDO::PARAM_INT);
            $sentencia->execute();
            return true;
        } catch (PDOException $error_sql) {
            if ($error_sql->getCode() == 23000) return "constraint";
            $this->registrar_error_modelo("eliminar_profesor", $error_sql->getMessage());
            return false;
        }
    }
}

