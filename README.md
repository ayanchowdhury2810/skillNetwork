# Skill Network

A graph-based developer recommendation platform powered by **FalkorDB**. Users create profiles with skills, and the system recommends other users with similar skill sets using graph traversal queries. Includes a **GraphRAG**-powered natural language search using Google Gemini for querying the skill network.

## Tech Stack

| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Frontend  | Next.js 16.3.3, React 19.2.8, Tailwind CSS 4 |
| Backend   | Express 5.2.1, TypeScript 7                   |
| Database  | FalkorDB 6.8.0 (Graph Database)               |
| AI        | Google Gemini (@google/generative-ai 0.21.0)  |
| Auth      | JSON Web Tokens (jsonwebtoken 9)              |

## Features

- **User Profiles** — Create users with multiple skills, manage skills per user
- **Skill Recommendations** — Graph-based algorithm finds users with the most shared skills
- **Domain Management** — Organize skills into domains (Frontend, Backend, Mobile, etc.)
- **Skill Relations** — Model bidirectional relationships between related skills
- **Domain Interests** — Users can express interest in skill domains
- **AI Search (GraphRAG)** — Natural language queries against the skill network using Google Gemini

## Prerequisites

- Node.js v18+
- A running FalkorDB instance (local or cloud)
- Google Gemini API key (for AI search)

## Setup

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd skillNetwork

# Backend
cd backend
npm install

# Frontend
cd ../skill_network_frontend
npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
FALKORDB_HOST=localhost:6379
FALKORDB_PORT=6379
FALKORDB_USERNAME=
FALKORDB_PASSWORD=
FALKORDB_GRAPH=skill_network
PORT=5000
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
LLM_MODEL=gemini-1.5-flash
```

### 3. Seed the graph database

```bash
cd backend
npx tsx src/scripts/seedGraph.ts
```

Creates 5 domains, 20 skills, 20 `CONTAINS` relationships, and 16 `RELATED_TO` relationships.

### 4. Start the servers

```bash
# Backend (port 5000)
cd backend
npm run dev

# Frontend (port 3000)
cd skill_network_frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Endpoints

| Method | Endpoint                          | Description                                    |
|--------|-----------------------------------|------------------------------------------------|
| `GET`  | `/health`                         | Health check                                    |
| `POST` | `/users`                          | Create user with skills                         |
| `GET`  | `/users`                          | List all users                                  |
| `DELETE`| `/users`                         | Delete all users                                |
| `GET`  | `/users/:id`                      | Get user by ID                                  |
| `DELETE`| `/users/:id`                     | Delete user by ID                               |
| `POST` | `/users/:id/skills`               | Add skill to user                               |
| `GET`  | `/users/:id/skills`               | Get user skills                                 |
| `POST` | `/users/:id/interests`            | Add domain interest                             |
| `GET`  | `/users/:id/interests`            | Get user interests                              |
| `GET`  | `/users/:id/recommendations`      | Get recommended users (top 10 by shared skills) |
| `POST` | `/domains`                        | Create domain                                   |
| `GET`  | `/domains`                        | List all domains                                |
| `POST` | `/domains/:domainName/skills`     | Add skill to domain                             |
| `GET`  | `/domains/:domainName/skills`     | Get skills in domain                            |
| `POST` | `/skills/related`                 | Create bidirectional skill relation             |
| `GET`  | `/skills/:skillName/related`      | Get related skills                              |
| `POST` | `/ai/search`                      | Natural language search via GraphRAG            |

## Project Structure

```
skillNetwork/
├── backend/
│   └── src/
│       ├── app.ts                    # Express app & route mounting
│       ├── config/falkordb.ts        # FalkorDB client
│       ├── middleware/auth.middleware.ts
│       └── modules/
│           ├── users/                # User CRUD + interests
│           ├── skills/               # Per-user skill management
│           ├── recommendations/      # Graph-based recommendations
│           ├── domains/              # Domain management
│           ├── skill-relations/      # Skill-to-skill relations
│           └── ai-search/            # GraphRAG natural language search
└── skill_network_frontend/
    ├── app/                          # Next.js pages
    ├── components/                   # UI components
    └── lib/                          # API client, types, toast
```

## Data Model

| Node       | Properties   | Description                   |
|------------|-------------|-------------------------------|
| `:User`    | `id`, `name`| A developer in the system     |
| `:Skill`   | `name`      | A technology (e.g. "React")   |
| `:Domain`  | `name`      | A skill category              |

| Relationship     | From       | To         | Description                 |
|------------------|------------|------------|-----------------------------|
| `[:HAS_SKILL]`   | `:User`    | `:Skill`   | User knows this skill       |
| `[:CONTAINS]`    | `:Domain`  | `:Skill`   | Domain contains this skill  |
| `[:RELATED_TO]`  | `:Skill`   | `:Skill`   | Bidirectional skill relation|
| `[:INTERESTED_IN]`| `:User`   | `:Domain`  | User interest in domain     |

