# ORA Web

Web interface for ORA - Decision Intelligence through Tarot.

## Features

- **App Interface**: Login, readings (5 types), history, profile
- **Admin Dashboard**: User management, analytics, export data
- **Feedback System**: Tester feedback collection

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router

## Development

```bash
# Install dependencies
npm install

# Create env file
cp .env.example .env

# Start dev server
npm run dev
```

## Deployment (Vercel)

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variable: `VITE_API_URL`

## Project Structure

```
src/
  api/          # API client
  components/   # Shared components
  contexts/     # React contexts (Auth)
  pages/        # Route pages
```

## API

Consumes ORA backend API at `https://ora-production-0850.up.railway.app`
