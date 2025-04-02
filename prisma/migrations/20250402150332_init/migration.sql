-- CreateTable
CREATE TABLE `coordenadores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NULL,
    `telefone` VARCHAR(20) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `docentes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `area` VARCHAR(50) NULL,
    `email` VARCHAR(100) NULL,
    `telefone` VARCHAR(20) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `horarios_docentes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `docente_id` INTEGER NULL,
    `turma_id` INTEGER NULL,
    `dia_semana` ENUM('Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo') NULL,
    `hora_inicio` TIME(0) NULL,
    `hora_fim` TIME(0) NULL,

    INDEX `docente_id`(`docente_id`),
    INDEX `turma_id`(`turma_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `turmas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(50) NOT NULL,
    `curso` VARCHAR(100) NULL,
    `periodo` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario` VARCHAR(50) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `nivel_acesso` ENUM('coordenador', 'professor') NOT NULL,
    `docente_id` INTEGER NULL,
    `coordenador_id` INTEGER NULL,

    UNIQUE INDEX `usuario`(`usuario`),
    INDEX `coordenador_id`(`coordenador_id`),
    INDEX `docente_id`(`docente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `horarios_docentes` ADD CONSTRAINT `horarios_docentes_ibfk_1` FOREIGN KEY (`docente_id`) REFERENCES `docentes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `horarios_docentes` ADD CONSTRAINT `horarios_docentes_ibfk_2` FOREIGN KEY (`turma_id`) REFERENCES `turmas`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`docente_id`) REFERENCES `docentes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`coordenador_id`) REFERENCES `coordenadores`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
