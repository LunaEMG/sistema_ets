<?php
/**
 * Clase para la gestion de la conexion segura a la base de datos mediante PDO.
 */

class ConexionBaseDatos {
    private $host_bd;
    private $nombre_bd;
    private $usuario_bd;
    private $contrasena_bd;
    private $conexion_pdo;

    public function __construct() {
        $this->host_bd = getenv('host_base_datos');
        $this->nombre_bd = getenv('nombre_base_datos');
        $this->usuario_bd = getenv('usuario_base_datos');
        $this->contrasena_bd = getenv('contrasena_base_datos');
    }

    public function obtener_conexion() {
        $this->conexion_pdo = null;

        try {
            $cadena_conexion = "mysql:host=" . $this->host_bd . ";dbname=" . $this->nombre_bd . ";charset=utf8mb4";
            
            $opciones_pdo = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ];

            $this->conexion_pdo = new PDO($cadena_conexion, $this->usuario_bd, $this->contrasena_bd, $opciones_pdo);
            
        } catch (PDOException $error_conexion) {
            $ruta_registro_error = __DIR__ . '/../registros_error/errores_sistema.log';
            $mensaje_error_log = "[" . date('Y-m-d H:i:s') . "] Error de conexion BD: " . $error_conexion->getMessage() . "\n";
            
            error_log($mensaje_error_log, 3, $ruta_registro_error);

            http_response_code(500);
            echo json_encode([
                "estado" => "error",
                "mensaje" => "En este momento no es posible conectar con el servicio de base de datos. Por favor, intente mas tarde."
            ]);
            exit();
        }

        return $this->conexion_pdo;
    }
}