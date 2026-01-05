# Sistema de Agendamento Online

Projeto full-stack para agendamentos, com backend em Spring Boot e frontend em Angular.

## Visao geral

- Backend: Spring Boot 3 (Java 21), JPA, Flyway, PostgreSQL.
- Frontend: Angular 17 + Angular Material.
- Banco local via Docker Compose.

## Requisitos

- Java 21
- Maven 3.9+
- Node.js 20+ e npm
- Docker e Docker Compose (para o Postgres)

## Configuracao do banco (PostgreSQL)

O projeto ja inclui um `docker-compose.yml` com os dados padrao:

- Banco: `agenda`
- Usuario: `agenda`
- Senha: `agenda`

Suba o Postgres:

```bash
docker compose up -d
```

## Backend (Spring Boot)

O backend roda na porta `8081` (configurado em `src/main/resources/application.yml`).

```bash
./mvnw spring-boot:run
```

## Frontend (Angular)

O frontend usa proxy para chamar o backend via `/api` (arquivo `proxy.conf.json`).

```bash
npm install
npm run start
```

Acesse:

- Frontend: `http://localhost:4200`
- API (backend): `http://localhost:8081`

## API (endpoints)

Base URL do backend: `http://localhost:8081`
No frontend, use `/api` que o proxy redireciona para o backend.

Clientes:

- `POST /customers` cria um cliente
- `GET /customers` lista clientes
- `GET /customers/{id}` busca cliente por id
- `PUT /customers/{id}` atualiza cliente
- `DELETE /customers/{id}` remove cliente

Exemplo de payload (create/update):

```json
{
  "name": "Joao da Silva",
  "phone": "11999990000",
  "email": "joao@exemplo.com",
  "appointment": {
    "startsAt": "2024-12-01T10:00:00",
    "status": "SCHEDULED",
    "notes": "Primeira consulta"
  }
}
```

Status de agendamento aceitos:

- `SCHEDULED`
- `COMPLETED`
- `NO_SHOW`

## Validacoes e codigos HTTP

Codigos HTTP mais comuns:

- `201 Created` ao criar um cliente
- `200 OK` em listagem e busca
- `204 No Content` ao remover um cliente

Validacoes (HTTP `400 Bad Request`):

- `name` obrigatorio, maximo 120 caracteres
- `phone` maximo 30 caracteres
- `email` maximo 160 caracteres
- `appointment.startsAt` obrigatorio
- `appointment.notes` maximo 500 caracteres

Erros (padrao de resposta pode variar conforme configuracao do Spring):

- `404 Not Found` quando o cliente nao existe

Exemplo de erro de validacao (HTTP 400):

```json
{
  "timestamp": "2024-12-01T13:45:10Z",
  "status": 400,
  "error": "Bad Request",
  "message": "name: must not be blank",
  "path": "/customers"
}
```

Exemplo de recurso nao encontrado (HTTP 404):

```json
{
  "timestamp": "2024-12-01T13:46:30Z",
  "status": 404,
  "error": "Not Found",
  "message": "Customer not found",
  "path": "/customers/00000000-0000-0000-0000-000000000000"
}
```

## Migracoes do banco

As migracoes do Flyway ficam em `src/main/resources/db/migration`.
Ao iniciar o backend, o Flyway aplica automaticamente as migracoes pendentes.

## Scripts uteis

- `npm run start`: inicia o Angular com proxy
- `npm run build`: build do frontend
- `./mvnw test`: executa testes do backend

## Estrutura do projeto

- `src/main/java`: codigo Java do backend
- `src/main/resources`: configuracoes e migracoes
- `src/app`: codigo do frontend Angular
