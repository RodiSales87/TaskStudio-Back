# node-boilerplate

## Running the project

1. Assegure-se de ter o **docker/docker-compose**, bem como o gerenciador de pacotes **pnpm** instalados em sua máquina.

2. Clone o repositório:

```bash
git clone https://github.com/CITi-UFPE/node-boilerplate.git
```

3. Instale as dependências:

```bash
pnpm install
```

4. Crie um arquivo **.env** na raiz do projeto, com as seguintes variáveis de ambiente:

```dotenv
# ###### GENERAL SETTINGS #######
PROJECT_NAME=boilerplate

# ###### SERVER SETTINGS #######
SERVER_PORT=3001
NODE_ENV=development

# ###### DATABASE SETTINGS #######
DATABASE_TYPE=postgres
DATABASE_HOST=${PROJECT_NAME}-db
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=docker
DATABASE_DB=${PROJECT_NAME}

# ###### TEST DATABASE SETTINGS #######
DATABASE_TEST_HOST=localhost
DATABASE_TEST_PORT=5433
DATABASE_TEST_USER=postgres
DATABASE_TEST_PASSWORD=docker
DATABASE_TEST_DB=boilerplate-test

DATABASE_URL=${DATABASE_TYPE}://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_DB}

# ###### JWT SETTINGS FOR AUTHENTICATION #######
JWT_ACCESS_SECRET=0551c0ed-6389-46b1-839e-2e28fc191c89 # token for 30sec
JWT_REFRESH_SECRET=92fba49f6912d14733332bb9ebaac1562f51ee685594acf103d71f685f70868b # token for 7 days

# ###### S3 SETTINGS FOR FILE UPLOADS #######
S3_ENDPOINT=XXXXXX.digitaloceanspaces.com
S3_BUCKET=exemplo-bucket
S3_KEY=
S3_SECRET=
```

5. Para rodar o servidor, execute:

```bash
docker-compose up
```

_**NOTE**: existem diversas variações do comando docker-compose. Algumas usam hífen, algumas não. Alguma precisam de sudo, outras não. Verifique o que funciona no seu caso e tome de exemplo para as demais instruções._

6. Para rodar as migrations, execute com o servidor rodando em outro terminal:

```bash
pnpm migration
```

7. Voilá! O servidor está rodando.

## Funcionalidades pré-implementadas:

- Autenticação com JWT;
- Upload de arquivos para o S3;
- Testes de integração com Jest e Supertest;
- Linting com Eslint, para garantir boas práticas;
- Formatação de código com Prettier;
- Documentação com Swagger em _`src/docs`_

## Workflows:

### `cd_main.yml`:

- Faz o deploy da branch `main` no Dokku a cada push;
- Requer duas variáveis de ambiente _no repositório_: `PRIVATE_KEY` e `HOST`.
- Para configurar o Dokku na Digital Ocean, siga [este tutorial](https://www.notion.so/citiufpe/Treinamento-Deploy-com-Dokku-9d65f4bd964149168875e77cf478a4cd).;

### `lint.yml`:

- Roda o ESLint, Typescript e o builder em todos os pull requests e em pushes na develop;

### `test.yml`:

- Roda os testes de integração em todos os pull requests e em pushes na develop;

## Erros comuns:

### Erro ao rodar `docker-compose up`:

- _Bind for 0.0.0.0:3001 failed: port is already allocated_:

  Você provavelmente já tem um servidor rodando na porta 3001. Pare a execução do outro servidor e tente novamente.

  ```bash
  # Para listar os containers rodando, bem como as portas em uso
  docker ps

  # Para parar a execução de um container
  docker stop ID_DO_CONTAINER
  ```

- _Cannot find module XXXXXXXXX_:

  Isso acontece porque o modo em que o docker-compose.yml está configurado monta um volume anônimo para impedir que a node_modules do seu computador sobrescreva a do container. Em outras palavras, o Docker não é capaz de entender que você adicionou uma dependência nova. Portanto, sempre que dependências novas forem instaladas, é necessário rodar:

  ```bash
      # Para parar o container e remover os volumes
      docker-compose down --volumes

      # Para subir o container novamente e reinstalar as dependências
      docker-compose up --build
  ```

  _PS: esse comando não é uma bala de prata, mas bem que poderia ser. Se você empacar com qualquer coisa no Docker, é altamente provável que ele resolva seu problema._

### Erro ao rodar `pnpm migration`:

Em caso de erros ao rodar pnpm migrations, siga o seguinte modelo mental:

1. **Verifique se o container está rodando.** Se não estiver, rode `docker-compose up` e tente novamente em outro terminal.
2. **Delete a pasta de migrations e tente novamente.** Isso é uma medida aparentemente extrema, mas não há nada de errado nela a não ser que o projeto já tenha sido deployado em produção. Nesse caso, siga as instruções um pouco mais avançadas [neste link](https://www.prisma.io/docs/guides/migrate/production-troubleshooting), preferencialmente acompanhado de alguém com um pouco mais de conhecimento em SQL.

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
