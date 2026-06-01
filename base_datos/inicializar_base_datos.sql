CREATE DATABASE IF NOT EXISTS sistema_ets;

USE sistema_ets;

-- TABLA: USUARIO
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    contrasena_encriptada VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- TABLA: CARRERA
CREATE TABLE IF NOT EXISTS carrera (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_carrera VARCHAR(100) NOT NULL UNIQUE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- TABLA: EDIFICIO
CREATE TABLE IF NOT EXISTS edificio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_edificio VARCHAR(50) NOT NULL UNIQUE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- TABLA: SALON
CREATE TABLE IF NOT EXISTS salon (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_salon VARCHAR(20) NOT NULL,
    id_edificio INT NOT NULL,
    FOREIGN KEY (id_edificio) REFERENCES edificio (id) ON DELETE CASCADE,
    UNIQUE (nombre_salon, id_edificio)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- TABLA: PROFESOR
CREATE TABLE IF NOT EXISTS profesor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_profesor VARCHAR(150) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- TABLA: MATERIA
CREATE TABLE IF NOT EXISTS materia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_materia VARCHAR(120) NOT NULL,
    semestre_materia INT NOT NULL,
    id_carrera INT NOT NULL,
    FOREIGN KEY (id_carrera) REFERENCES carrera (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- TABLA: EXAMEN
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

-- Semilla: Administrador (Contraseña: admin123)
INSERT INTO
    usuario (
        correo_electronico,
        contrasena_encriptada
    )
VALUES (
        'admin@escom.ipn.mx',
        '$2y$10$EixVaat1Yi9wUTSTjM9vku1zcCwUNQtzsLfYwgVf0MLzAdqIPph5C'
    );

-- Semilla: Carreras
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

-- Semilla: Edificios
INSERT INTO
    edificio (nombre_edificio)
VALUES ('Edificio 1'),
    ('Edificio 2'),
    ('Edificio 3'),
    ('Edificio 4');

-- Semilla: Profesores Coordinadores
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

-- Semilla: Materias base
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
    ('Estructuras de Datos', 2, 1),
    (
        'Programacion Orientada a Objetos',
        2,
        2
    ),
    (
        'Fundamentos de Inteligencia Artificial',
        3,
        2
    );

-- Edificio 1
INSERT INTO
    salon (nombre_salon, id_edificio)
VALUES ('1002', 1),
    ('1003', 1),
    ('1004', 1),
    ('1005', 1),
    ('1006', 1),
    ('1007', 1),
    ('1008', 1),
    ('1009', 1),
    ('1010', 1),
    ('1102', 1),
    ('1103', 1),
    ('1104', 1),
    ('1105', 1),
    ('1106', 1),
    ('1107', 1),
    ('1108', 1),
    ('1109', 1),
    ('1110', 1),
    ('1202', 1),
    ('1203', 1),
    ('1204', 1),
    ('1205', 1),
    ('1206', 1),
    ('1207', 1),
    ('1208', 1),
    ('1209', 1),
    ('1210', 1);

-- Edificio 2
INSERT INTO
    salon (nombre_salon, id_edificio)
VALUES ('2002', 2),
    ('2003', 2),
    ('2004', 2),
    ('2005', 2),
    ('2006', 2),
    ('2007', 2),
    ('2008', 2),
    ('2009', 2),
    ('2010', 2),
    ('2102', 2),
    ('2103', 2),
    ('2104', 2),
    ('2105', 2),
    ('2106', 2),
    ('2107', 2),
    ('2108', 2),
    ('2109', 2),
    ('2110', 2),
    ('2202', 2),
    ('2203', 2),
    ('2204', 2),
    ('2205', 2),
    ('2206', 2),
    ('2207', 2),
    ('2208', 2),
    ('2209', 2),
    ('2210', 2);

-- Edificio 3
INSERT INTO
    salon (nombre_salon, id_edificio)
VALUES ('3002', 3),
    ('3003', 3),
    ('3004', 3),
    ('3005', 3),
    ('3006', 3),
    ('3007', 3),
    ('3008', 3),
    ('3009', 3),
    ('3010', 3),
    ('3102', 3),
    ('3103', 3),
    ('3104', 3),
    ('3105', 3),
    ('3106', 3),
    ('3107', 3),
    ('3108', 3),
    ('3109', 3),
    ('3110', 3),
    ('3202', 3),
    ('3203', 3),
    ('3204', 3),
    ('3205', 3),
    ('3206', 3),
    ('3207', 3),
    ('3208', 3),
    ('3209', 3),
    ('3210', 3);

-- Edificio 4
INSERT INTO
    salon (nombre_salon, id_edificio)
VALUES ('4002', 4),
    ('4003', 4),
    ('4004', 4),
    ('4005', 4),
    ('4006', 4),
    ('4007', 4),
    ('4008', 4),
    ('4009', 4),
    ('4010', 4),
    ('4102', 4),
    ('4103', 4),
    ('4104', 4),
    ('4105', 4),
    ('4106', 4),
    ('4107', 4),
    ('4108', 4),
    ('4109', 4),
    ('4110', 4),
    ('4202', 4),
    ('4203', 4),
    ('4204', 4),
    ('4205', 4),
    ('4206', 4),
    ('4207', 4),
    ('4208', 4),
    ('4209', 4),
    ('4210', 4);

-- Exámenes de Prueba asignados a la nueva infraestructura
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
        (
            SELECT id
            FROM salon
            WHERE
                nombre_salon = '1209'
            LIMIT 1
        ),
        1
    ),
    (
        2,
        '2026-06-16',
        '08:00:00',
        '14:00:00',
        (
            SELECT id
            FROM salon
            WHERE
                nombre_salon = '2105'
            LIMIT 1
        ),
        2
    ),
    (
        6,
        '2026-06-17',
        '10:00:00',
        '16:00:00',
        (
            SELECT id
            FROM salon
            WHERE
                nombre_salon = '3002'
            LIMIT 1
        ),
        3
    );