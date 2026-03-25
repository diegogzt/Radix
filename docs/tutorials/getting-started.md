# Getting Started with Radix Medical Dashboard

Welcome to the Radix Medical Dashboard project! This tutorial will guide you through the initial setup process to get the application running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A [Supabase](https://supabase.com/) account and project

## 1. Clone the Repository

If you haven't already, clone the repository to your local machine:

```bash
git clone <repository-url>
cd radix-project-full-stack-web
```

## 2. Install Dependencies

You can use either npm or bun to install the necessary packages.

Using npm:
```bash
npm install
```

Using bun:
```bash
bun install
```

## 3. Configure Environment Variables

Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Open the `.env` file and fill in your Supabase credentials:

```env
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
```

> [!NOTE]
> You can find these values in your Supabase Project Settings under **API**.

## 4. Run the Development Server

Start the Astro development server to see the application in action.

Using npm:
```bash
npm run dev
```

Using bun:
```bash
bun run dev
```

The application should now be running at [http://localhost:4321/](http://localhost:4321/) (or the port specified in your terminal).

## Next Steps

Now that you have the project running locally, you can explore the following:
- Check out the [Architecture Overview](../explanation/architecture-overview.md) to understand the project structure.
- Learn how to [configure Supabase](../how-to/supabase-configuration.md) in detail.
