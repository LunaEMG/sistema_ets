<?php
/**
 * Modelo para la gestion y verificacion de usuarios administradores.
 */

require_once __DIR__ . '/../configuracion/conexion_base_datos.php';

class ModeloUsuario {
    private $conexion_bd;

    public function __construct() {
        $objeto_conexion = new ConexionBaseDatos();
        $this->conexion_bd = $objeto_conexion->obtener_conexion();
    }

    /**
     * Busca un usuario administrador en la base de datos por su correo electronico.
     */
    public function obtener_usuario_por_correo($correo_electronico) {
        try {
            $consulta_sql = "SELECT id, correo_electronico, contrasena_encriptada 
                             FROM usuario 
                             WHERE correo_electronico = :correo_electronico 
                             LIMIT 1";

            $sentencia = $this->conexion_bd->prepare($consulta_sql);
            
            $sentencia->bindParam(':correo_electronico', $correo_electronico, PDO::PARAM_STR);
            $sentencia->execute();

            return $sentencia->fetch();
        } catch (PDOException $error_sql) {
            $this->registrar_error_usuario("obtener_usuario_por_correo", $error_sql->getMessage());
            return false;
        }
    }

    /**
     * Registra de forma silenciosa cualquier fallo de base de datos en el log del sistema.
     */
    private function registrar_error_usuario($metodo, $mensaje_error) {
        $ruta_log = __DIR__ . '/../registros_error/errores_sistema.log';
        $mensaje_completo = "[" . date('Y-m-d H:i:s') . "] [ModeloUsuario::$metodo] -> " . $mensaje_error . "\n";
        error_log($mensaje_completo, 3, $ruta_log);
    }
}