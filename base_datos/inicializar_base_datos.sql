CREATE DATABASE IF NOT EXISTS sistema_ets;
USE sistema_ets;

-- Tabla Usuario
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    contrasena_encriptada VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla Carrera
CREATE TABLE IF NOT EXISTS carrera (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_carrera VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla Edificio
CREATE TABLE IF NOT EXISTS edificio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_edificio VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla Salon
CREATE TABLE IF NOT EXISTS salon (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_salon VARCHAR(20) NOT NULL,
    id_edificio INT NOT NULL,
    FOREIGN KEY (id_edificio) REFERENCES edificio(id) ON DELETE CASCADE,
    UNIQUE(nombre_salon, id_edificio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla Profesor
CREATE TABLE IF NOT EXISTS profesor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_profesor VARCHAR(150) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla Materia
CREATE TABLE IF NOT EXISTS materia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_materia VARCHAR(120) NOT NULL,
    semestre_materia INT NOT NULL,
    id_carrera INT NOT NULL,
    FOREIGN KEY (id_carrera) REFERENCES carrera(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla Examen
CREATE TABLE IF NOT EXISTS examen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_materia INT NOT NULL,
    fecha_examen DATE NOT NULL,
    turno_examen ENUM('Matutino', 'Vespertino') NOT NULL,
    id_salon INT NOT NULL,
    id_profesor INT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_materia) REFERENCES materia(id) ON DELETE CASCADE,
    FOREIGN KEY (id_salon) REFERENCES salon(id) ON DELETE RESTRICT,
    FOREIGN KEY (id_profesor) REFERENCES profesor(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Administrador de pruebas (Contraseña temporal hash: 'admin123')
INSERT INTO usuario (correo_electronico, contrasena_encriptada) VALUES 
('admin@escom.ipn.mx', '$2y$10$oR6g87k3f8b9X7mFghRTe.y89Yp7FvR0HwK7UvNnZyMeM62/CgD6G');