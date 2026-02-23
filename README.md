# Task Manager — DevOps Lab #1

Full-stack Task Manager: **Spring Boot** REST API, React client, **PostgreSQL**, CI/CD.

## Architecture

```
devops/
├── server/          # Spring Boot REST API + PostgreSQL (JPA)
├── client/          # React (Vite) frontend
└── .github/
    └── workflows/
        └── ci.yml   # GitHub Actions CI (4 jobs)
```

## Server (REST API)

**Tech stack:** Java 21, Spring Boot 3, Spring Data JPA, PostgreSQL

### Endpoints

| Method | URL              | Description       |
|--------|------------------|-------------------|
| GET    | /api/tasks       | Get all tasks     |
| GET    | /api/tasks/:id   | Get task by ID    |
| POST   | /api/tasks       | Create a task     |
| PUT    | /api/tasks/:id   | Update a task     |
| DELETE | /api/tasks/:id   | Delete a task     |

### Run server

**Требования:** Java 21, Maven, запущенный PostgreSQL.

По умолчанию подключается к `localhost:5432`, БД `taskmanager`, пользователь — текущий пользователь ОС, пароль пустой. Создайте БД один раз, если нет: `CREATE DATABASE taskmanager;`

При необходимости задайте переменные: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`.

```bash
cd server
mvn spring-boot:run   # http://localhost:3001
```

### Run server tests

```bash
cd server
mvn test
```

## Client (React)

**Tech stack:** React 19, Vite, CSS

### Run client

```bash
cd client
npm install
npm run dev      # starts on http://localhost:5173
```

### Run client tests

```bash
cd client
npm test
```

## CI/CD

GitHub Actions pipeline with **4 jobs**:

1. **server-build** — Java 21, Maven compile
2. **server-test** — Maven test (JUnit 5, MockMvc)
3. **client-build** — npm install, vite build
4. **client-test** — npm test (Vitest)

Pipeline runs on push/PR to `main`.
