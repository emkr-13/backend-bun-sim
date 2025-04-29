# Backend Bun Sistem Informasi Manajemen Inventory (SIM)

This project is a backend application built using Bun, Express, and Drizzle ORM. It uses PostgreSQL as the database and supports JWT-based authentication.

## Installation

To install dependencies, run:

```bash
bun install
```

## Running Migrations and Seeders

To run database migration :

```bash
bun run drizzle-kit migrate
```

```bash
bun run drizzle-kit push
```

To run seeders (if applicable):

```bash
bun run src/seeders/userSeeder.ts
```

## Running the Application

To start the application in development mode:

```bash
bun run dev
```

This project was created using `bun init` in bun v1.2.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
