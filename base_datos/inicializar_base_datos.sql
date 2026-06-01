CREATE DATABASE IF NOT EXISTS sistema_ets;

USE sistema_ets;

-- 1. TABLA: USUARIO
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    contrasena_encriptada VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 2. TABLA: CARRERA
CREATE TABLE IF NOT EXISTS carrera (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_carrera VARCHAR(100) NOT NULL UNIQUE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 3. TABLA: EDIFICIO
CREATE TABLE IF NOT EXISTS edificio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_edificio VARCHAR(50) NOT NULL UNIQUE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 4. TABLA: SALON
CREATE TABLE IF NOT EXISTS salon (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_salon VARCHAR(20) NOT NULL,
    id_edificio INT NOT NULL,
    FOREIGN KEY (id_edificio) REFERENCES edificio (id) ON DELETE CASCADE,
    UNIQUE (nombre_salon, id_edificio)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 5. TABLA: PROFESOR
CREATE TABLE IF NOT EXISTS profesor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_profesor VARCHAR(150) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 6. TABLA: MATERIA
CREATE TABLE IF NOT EXISTS materia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_materia VARCHAR(120) NOT NULL,
    semestre_materia INT NOT NULL,
    id_carrera INT NOT NULL,
    FOREIGN KEY (id_carrera) REFERENCES carrera (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 7. TABLA: EXAMEN
CREATE TABLE IF NOT EXISTS examen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_materia INT NOT NULL,
    fecha_examen DATE NOT NULL,
    hora_manana TIME NOT NULL,
    hora_tarde TIME NOT NULL,
    id_salon INT NOT NULL,
    id_profesor INT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_materia) REFERENCES materia (id) ON DELETE CASCADE,
    FOREIGN KEY (id_salon) REFERENCES salon (id) ON DELETE RESTRICT,
    FOREIGN KEY (id_profesor) REFERENCES profesor (id) ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ================
-- SEMILLA DE DATOS
-- ================

-- Administrador de pruebas (Contraseña encriptada segura: 'admin123')
INSERT INTO
    usuario (
        correo_electronico,
        contrasena_encriptada
    )
VALUES (
        'admin@escom.ipn.mx',
        '$2y$10$oR6g87k3f8b9X7mFghRTe.y89Yp7FvR0HwK7UvNnZyMeM62/CgD6G'
    );

-- Carreras
INSERT INTO
    carrera (nombre_carrera)
VALUES (
        'Ingenieria en Sistemas Computacionales'
    ),
    (
        'Ingenieria en Inteligencia Artificial'
    ),
    (
        'Licenciatura en Ciencia de Datos'
    );

-- Edificios
INSERT INTO
    edificio (nombre_edificio)
VALUES ('Edificio 1'),
    ('Edificio 2'),
    ('Edificio Central');

-- Salones asociados a Edificios
INSERT INTO
    salon (nombre_salon, id_edificio)
VALUES ('Aula 1101', 1),
    ('Aula 1102', 1),
    ('Aula 2201', 2),
    ('Aula 2202', 2),
    ('Laboratorio 4', 3);

-- Profesores Coordinadores
INSERT INTO
    profesor (
        nombre_profesor,
        correo_electronico
    )
VALUES (
        'Ing. Jose Antonio Ortiz Ramirez',
        'jortizr@ipn.mx'
    ),
    (
        'Dr. Axel Ernesto Moreno Cervantes',
        'amoreno@ipn.mx'
    ),
    (
        'M. en C. Chadia Frangie',
        'cfrangie@ipn.mx'
    );

-- Materias
-- Vinculadas a ISC (id = 1)
INSERT INTO
    materia (
        nombre_materia,
        semestre_materia,
        id_carrera
    )
VALUES (
        'Tecnologias para el Desarrollo de Aplicaciones Web',
        5,
        1
    ),
    ('Bases de Datos', 4, 1),
    (
        'Análisis y Diseño de Sistemas',
        4,
        1
    ),
    ('Estructuras de Datos', 2, 1);

-- Vinculadas a Inteligencia Artificial (id = 2)
INSERT INTO
    materia (
        nombre_materia,
        semestre_materia,
        id_carrera
    )
VALUES (
        'Programacion Orientada a Objetos',
        2,
        2
    ),
    (
        'Fundamentos de Inteligencia Artificial',
        3,
        2
    );

-- Exámenes de ETS de Prueba
INSERT INTO
    examen (
        id_materia,
        fecha_examen,
        hora_manana,
        hora_tarde,
        id_salon,
        id_profesor
    )
VALUES (
        1,
        '2026-06-15',
        '08:00:00',
        '14:00:00',
        1,
        1
    ),
    (
        2,
        '2026-06-16',
        '08:00:00',
        '14:00:00',
        3,
        2
    ),
    (
        6,
        '2026-06-17',
        '10:00:00',
        '16:00:00',
        5,
        3
    );