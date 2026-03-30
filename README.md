# 📋 Task Manager Backend - Revelatio Studio

Este repositório contém a API RESTful desenvolvida para o processo seletivo da Revelatio Studio. O sistema fornece rotas seguras para gerenciamento de Tarefas (Tasks), Usuários com diferentes níveis de acesso (Role-based) e gestão de uploads de anexos, construída baseada nos princípios de Clean Architecture.

## 🚀 Tecnologias Utilizadas
- **Node.js** com **TypeScript**
- **Express** (Framework Web)
- **Prisma ORM** (Modelagem de Dados e Consultas)
- **PostgreSQL** (Banco de Dados em Docker)
- **JWT (JSON Web Token)** e **Bcrypt** (Autenticação e Criptografia)
- **Zod** (Validação e tipagem de DTOs)
- **Multer** (Gestão e Upload de arquivos locais)

---

## 🏗️ Arquitetura e Regras de Negócio Implementadas

A aplicação foi estruturada separando as responsabilidades em `Controllers`, `Repositories`, `DTOs` e `Middlewares`.

### Permissões e Segurança de Dados (Role-Based Access)
Todos os acessos são decodificados via interceptadores (`auth middlewares`). O `ID` do criador de uma tarefa é colhido de forma invisível via `req.user`, impedindo falsificações de payload.
- As Roles são divididas entre **USER** e **ADMIN**.
- Um **USER** tem seu escopo de banco de dados restrito (ele só consegue buscar, modificar ou apagar as rotas atreladas à sua própria autorização JWT).
- Um **ADMIN** possui `by-pass` irrestrito no Repositório, permitindo visão geral de gerenciamento de todas as tabelas.

---

## ⚙️ Como executar o projeto localmente

### 1. Pré-requisitos
Você precisará ter instalado em sua máquina:
- Node.js (Recomendado v18 ou v20+)
- Docker e Docker Compose

### 2. Configurar Variáveis de Ambiente
Na raiz do projeto, crie um arquivo chamado `.env` copiando o modelo `.env.example` interno ou cole esta estrutura básica:
```env
PROJECT_NAME=task-manager
SERVER_PORT=3001
NODE_ENV=development

DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=docker
DATABASE_DB=task-manager

DATABASE_URL="postgresql://postgres:docker@localhost:5432/task-manager"

JWT_ACCESS_SECRET=minhasenha_supersegura321
JWT_REFRESH_SECRET=minhasenha_refresh12345
```

### 3. Subir o Banco de Dados
A aplicação traz um container PostgreSQL pré-configurado.
```bash
docker-compose up -d
```

### 4. Instalar as dependências e preparar o DB
Instale os módulos do projeto e, em seguida, empurre as tabelas do Prisma para o Banco (Sync):
```bash
npm install
npm run push
```

### 5. Iniciar a Aplicação
Execute o servidor em ambiente de desenvolvimento interativo:
```bash
npm run dev
```
A API estará operando em `http://localhost:3001`.

*(Dica: Caso deseje inspecionar as tabelas visualmente no navegador, mantenha o servidor ligado em um terminal e em outro rode `npm run studio`)*.

---

## 📚 Endpoints Principais da API

Aqui estão os domínios mapeados pelo Express Router:

### Autenticação e Usuários (`/user` e `/sessions`)
- `POST /user` : Registra um usuário (envie os campos `name`, `email`, `password` e opcionalmente `role`).
- `POST /sessions` : Realiza o Login devolvendo um `accessToken` válido.

### Tarefas (`/tasks`) - *Adicione Header: Authorization Bearer*
- `POST /tasks` : Cria uma nova task para o usuário logado (Body: `title`, `description`, `status`).
- `GET /tasks` : Retorna as tasks (todas, se for ADMIN; ou apenas as suas, se for USER).
- `GET /tasks/:taskId` : Busca os detalhes de uma tarefa restrita.
- `PATCH /tasks/:taskId` : Atualiza o status ou descrição de uma tarefa restrita.
- `DELETE /tasks/:taskId` : Deleta a task do banco.

### Anexos Físicos (`/file`) - *Adicione Header: Authorization Bearer*
*(Os arquivos são guardados fisicamente dentro do ambiente na path gerada em uploads)*
- `POST /file/task/:taskId` : Recebe o upload (Multipart-Form / Campo: `file`) ligando a imagem/anexo à tarefa solicitada. E devolve as URLs processadas.
- `DELETE /file/attachment/:attachmentId` : Apaga inteiramente do disco o arquivo validando as regras do usuário logado e rompe os links estáticos.

---
