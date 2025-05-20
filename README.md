# Warehouse and Store Inventory Management System Backend

A robust backend system built with modern technologies for managing inventory between warehouses and stores.

## Tech Stack

- **Runtime**: Bun v1.2.4+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: JWT
- **Dokumentasi**: Swangger

## Prerequisites

- Bun 1.2.4 or higher
- PostgreSQL 12 or higher
- Node.js 16 or higher

## Project Setup

1. Clone the repository
2. Create environment file:

```bash
cp .env.example .env
```

3. Configure environment variables:

```env
PORT=3000                    # Application port
DATABASE_URL=postgres://username:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret_key
```

4. Install dependencies:

```bash
bun install
```

## Setup the Application

1. Generate migration files:

```bash
bun run drizzle-kit generate
```

2. Apply migrations:

```bash
bun run drizzle-kit push
```

3. (Optional) Run seeders:

```bash
bun run src/seeders/userSeeder.ts
```

## Running the Application

Development mode:

```bash
bun run dev
```

Production mode:

```bash
bun run start
```

## Swanger
Untuk Dokumentasi Api 

```bash
http://localhost:${PORT}/api-docs
```


## License

MIT License
