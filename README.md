# Task Manager — DevOps Lab #1

Full-stack Task Manager application with REST API, React client, SQLite database, and CI/CD pipeline.

## Architecture

```
devops/
├── server/          # Express.js REST API + SQLite
├── client/          # React (Vite) frontend
└── .github/
    └── workflows/
        └── ci.yml   # GitHub Actions CI (4 jobs)
```

## Server (REST API)

**Tech stack:** Node.js, Express, better-sqlite3, CORS

### Endpoints

| Method | URL              | Description       |
|--------|------------------|-------------------|
| GET    | /api/tasks       | Get all tasks     |
| GET    | /api/tasks/:id   | Get task by ID    |
| POST   | /api/tasks       | Create a task     |
| PUT    | /api/tasks/:id   | Update a task     |
| DELETE | /api/tasks/:id   | Delete a task     |

### Run server

```bash
cd server
npm install
npm start        # starts on http://localhost:3001
```

### Run server tests

```bash
cd server
npm test
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

1. **server-build** — installs dependencies and validates server build
2. **server-test** — runs Jest unit tests (19 tests)
3. **client-build** — installs dependencies and builds production bundle
4. **client-test** — runs Vitest unit tests (12 tests)

Pipeline triggers on push/PR to `main` branch.
