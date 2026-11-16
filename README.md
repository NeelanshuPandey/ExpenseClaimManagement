# Expense Claim Management

Full-stack expense claim app with a Spring Boot 3 / Java 17 API, Angular 20 frontend, and PostgreSQL database.

## Run the full stack with Docker Compose

Prerequisites: Docker Desktop with its engine running.

Create the local environment config before starting the app:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and set a unique manager password and a cryptographically random `JWT_SECRET` of at least 32 bytes. Keep `.env` private and out of version control. The seeded manager password is BCrypt-hashed in the database; JWTs are signed with the configured secret.

From this folder (`ExpenseClaimManagement`):

```powershell
docker compose up --build -d
```

- Frontend: http://localhost:4200
- Backend API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- PostgreSQL: `localhost:5432`, database `expense_claims`, user `postgres`, password `localhost`

Docker Compose reads manager credentials and the JWT signing secret from `.env`. Changing `MANAGER_PASSWORD` affects a manager only when that account is first seeded into a new database; changing it later does not reset the existing database password. Docker Compose preserves database and receipt data in named volumes.

If PostgreSQL is already using port 5432, change the host-side mapping in `docker-compose.yml`. Likewise, stop other services using ports 4200 or 8080 before starting the complete stack.

## Run frontend and backend locally

If you have not already created it, copy `.env.example` to `.env` in the project root and replace its placeholders. The backend loads this file when you run Maven from the `backend` folder.

Start PostgreSQL first. You can start only the Compose database with:

```powershell
docker compose up -d postgres
```

For an existing local PostgreSQL server, create the database once in pgAdmin Query Tool while connected to the maintenance database `postgres`:

```sql
CREATE DATABASE expense_claims;
```

The configured local database credentials are user `postgres`, password `localhost`. Set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` if your local server uses different values.

In one terminal:

```powershell
cd backend
mvn spring-boot:run
```

In another terminal:

```powershell
cd frontend
npm install
npm start
```

The Angular development server proxies `/api` to `http://localhost:8080`.

## Swagger / OpenAPI

Swagger UI documents authentication, claims, manager review, receipt, CSV export, and user administration endpoints. Select **Authorize** and enter the access token from `/api/auth/login` to call protected endpoints.

- UI: `/swagger-ui/index.html`
- OpenAPI JSON: `/v3/api-docs`

## CSV export

Managers can export all claims assigned to them from the **Export CSV** button on the claims page. The export respects the selected status, employee search, and date range filters. It is also available as:

```text
GET /api/manager/claims/export.csv?status=PENDING&employee=alice&from=2026-01-01&to=2026-12-31
```

Include the manager's Bearer access token. All query parameters are optional. The CSV output is protected against spreadsheet formula injection.

## Main API routes

- `POST /api/auth/register` — create an employee account
- `POST /api/auth/login` — sign in and receive access and refresh tokens
- `POST /api/auth/refresh` — rotate the token pair
- `GET /api/claims/managers` — list active managers available for routing
- `GET /api/claims/mine` — list the signed-in employee's claims
- `POST /api/claims` — create a claim and assign it to a manager
- `PUT /api/claims/{id}` / `DELETE /api/claims/{id}` — change an owned pending claim
- `POST /api/claims/{id}/receipt` / `GET /api/claims/{id}/receipt` — upload and access a receipt
- `GET /api/claims/{id}/timeline` — view claim audit history
- `GET /api/manager/claims` — list claims assigned to the signed-in manager with status, employee, and date filters
- `PATCH /api/manager/claims/{id}/review` — approve or reject an assigned claim
- `GET /api/manager/claims/export.csv` — export filtered assigned claims
- `GET /api/manager/users` / `PATCH /api/manager/users/{id}/active` — manage employee access

Employees can only view, edit, and delete their own claims; edits and deletes are limited to pending claims. Only the manager selected by the employee can view and review that claim. Receipt uploads accept PDF, PNG, JPEG, or WebP files up to 5 MB. Uploaded files are stored in the `UPLOAD_DIR` volume.

## Tests

Run backend tests from `backend`:

```powershell
mvn test
```
