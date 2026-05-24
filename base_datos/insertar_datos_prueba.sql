USE sistema_ets;

-- Insertar Carreras de la ESCOM
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

-- Insertar Edificios
INSERT INTO
    edificio (nombre_edificio)
VALUES ('Edificio 1'),
    ('Edificio 2'),
    ('Edificio Central');

-- Insertar Salones asociados a Edificios
-- (id 1 = Edificio 1, id 2 = Edificio 2)
INSERT INTO
    salon (nombre_salon, id_edificio)
VALUES ('Aula 1101', 1),
    ('Aula 1102', 1),
    ('Aula 2201', 2),
    ('Aula 2202', 2),
    ('Laboratorio 4', 3);

-- Insertar Profesores
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

-- Insertar Materias (Unidades de Aprendizaje)
-- Vinculadas a Ingenieria en Sistemas Computacionales (id = 1)
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

-- Vinculadas a Ingenieria en Inteligencia Artificial (id = 2)
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

-- Insertar Exámenes de ETS de Prueba
-- Examen 1: DAW, Turno Vespertino, Aula 1101, Prof. Ortiz
INSERT INTO
    examen (
        id_materia,
        fecha_examen,
        turno_examen,
        id_salon,
        id_profesor
    )
VALUES (
        1,
        '2026-06-15',
        'Vespertino',
        1,
        1
    ),
    -- Examen 2: Bases de Datos, Turno Matutino, Aula 2201, Prof. Axel
    (
        2,
        '2026-06-16',
        'Matutino',
        3,
        2
    ),
    -- Examen 3: IA, Turno Matutino, Laboratorio 4, Prof. Chadia
    (
        6,
        '2026-06-17',
        'Matutino',
        5,
        3
    );