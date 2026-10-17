# TaskFlow

TaskFlow is a full-stack task and project management application built with Next.js. It provides an authenticated dashboard for organizing projects and tracking tasks, priorities, due dates, and completion status.

## Features

- **Authentication** with Better Auth (email and password).
- **Dashboard** with project progress and a list of recent tasks.
- **Project management** to create and delete projects.
- **Task management** to create, edit, delete, and mark tasks as complete.
- **Task organization** by status, priority, project, and due date.
- **Workspace membership checks** so server-side data operations verify the signed-in user's access.
- **Persistent storage** using PostgreSQL and Prisma ORM.
- **Responsive interface** built with Tailwind CSS.

## Tech stack

- [Next.js](https://nextjs.org/) — App Router and server-side rendering
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Better Auth](https://www.better-auth.com/) — authentication
- [Prisma](https://www.prisma.io/) — database ORM
- [PostgreSQL](https://www.postgresql.org/) — database
- [Supabase](https://supabase.com/) — hosted PostgreSQL for deployment
- [Vercel](https://vercel.com/) — deployment platform

## Getting started

### Prerequisites

Install the following before running the project locally:

- Node.js (use a version compatible with the project's installed Next.js version)
- npm
- PostgreSQL, either locally or through a development database provider

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd taskflow
```

Replace `<your-repository-url>` with your Git repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root. Add the required values for your local database and Better Auth:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/taskflow_dev"
DIRECT_URL="postgresql://USER:PASSWORD@localhost:5432/taskflow_dev"
BETTER_AUTH_SECRET="replace-with-a-long-random-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

Update the database username, password, host, port, and database name to match your setup. `DATABASE_URL` is used by the application at runtime; `DIRECT_URL` is configured for Prisma CLI database operations in `prisma7.config.ts`.

For production, set the corresponding environment variables in Vercel and use the correct Supabase PostgreSQL connection string for each variable. Do not commit `.env` or expose database credentials or authentication secrets.

### 4. Apply database migrations

Make sure the database exists and is reachable, then apply the migrations:

```bash
npx prisma migrate deploy --config prisma7.config.ts
```

If you are developing a new schema change locally, use Prisma's development migration workflow:

```bash
npx prisma migrate dev --name your_migration_name --config prisma7.config.ts
```

### 5. Generate the Prisma client

```bash
npx prisma generate --config prisma7.config.ts
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Build the application for production. |
| `npm run start` | Start the production server after building. |
| `npm run lint` | Run ESLint. |

Prisma commands used by the project:

```bash
npx prisma generate --config prisma7.config.ts
npx prisma migrate deploy --config prisma7.config.ts
npx prisma migrate status --config prisma7.config.ts
```

## Project structure

```text
taskflow/
├── prisma/
│   ├── migrations/          # Database migration history
│   └── schema.prisma        # Prisma data model
├── src/
│   ├── app/                 # App Router pages, layouts, and server actions
│   ├── components/          # Dashboard and UI components
│   ├── lib/                 # Authentication, Prisma, and dashboard data logic
│   └── generated/prisma/    # Generated Prisma client (do not edit manually)
├── prisma7.config.ts        # Prisma CLI configuration
├── .env                     # Local environment variables (do not commit)
└── package.json
```

Some filenames or folders may differ as the project evolves.

## Data model overview

The Prisma schema includes the core entities used by the application:

- **User** — authenticated account.
- **Workspace** — a shared space for organizing work.
- **Membership** — associates a user with a workspace and their role.
- **Project** — a project within a workspace.
- **Task** — a task with status, priority, due date, and optional project/workspace associations.
- **Session, Account, Verification** — authentication-related records used by Better Auth.

Task statuses are represented in the database as `TODO`, `IN_PROGRESS`, and `COMPLETED`. Priorities are `LOW`, `MEDIUM`, and `HIGH`.

## Deployment

TaskFlow is intended to run on Vercel with PostgreSQL hosted by Supabase.

1. Push the project to your Git provider and import the repository into Vercel.
2. Configure `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` in the Vercel project settings for the relevant environments.
3. Set `BETTER_AUTH_URL` to the deployed application's canonical URL.
4. Ensure the database URLs point to the intended Supabase project and use the appropriate connection method for runtime traffic and migrations.
5. Apply production migrations before using the deployed app:

   ```bash
   npx prisma migrate deploy --config prisma7.config.ts
   ```

6. Deploy the application. Ensure Prisma Client generation runs as part of the build/deployment workflow.

Never use a local `localhost` database URL in Vercel environment variables. Keep secrets out of source control and logs.

## Security notes

- Authentication and authorization checks should remain on the server.
- Validate user input in server actions before writing to the database.
- Check workspace membership before reading or modifying workspace-owned records.
- Do not expose `BETTER_AUTH_SECRET`, database credentials, or other private environment variables in client-side code.

## Development notes

- The project uses the Next.js App Router.
- Database access is handled through Prisma on the server.
- The generated Prisma client lives under `src/generated/prisma`; regenerate it after schema changes.
- Keep migrations committed so local and production databases can be updated consistently.

## License

No license has been specified yet. Add a `LICENSE` file if you intend to distribute the project under an open-source license.
