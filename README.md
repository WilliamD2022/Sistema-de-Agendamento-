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
