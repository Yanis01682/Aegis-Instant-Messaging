# Aegis Instant Messaging

Aegis is a PC web instant messaging system built as the final project for **Software Engineering**, Tsinghua University, Spring 2026.

The project implements a full-stack chat application with account management, friend relationships, private chats, group chats, real-time notifications, group administration, an echo-yard feed, personal notes, message translation, a group bot, and tic-tac-toe invitations.

## Demo

Frontend: [frontend-dyno-whatthedogdoing.app.spring26b.secoder.net](https://frontend-dyno-whatthedogdoing.app.spring26b.secoder.net/)

## Screenshots

### Chat Overview

![Aegis chat overview](docs/screenshots/overview.png)

### Group Detail and Member Management

![Aegis group detail](docs/screenshots/group-detail.png)

### Tic-Tac-Toe in Chat

![Aegis tic-tac-toe game](docs/screenshots/tic-tac-toe-game.png)

### Echo Yard

![Aegis echo yard](docs/screenshots/echo-yard.png)

### Personal Notes

![Aegis personal notes](docs/screenshots/notes.png)

### Profile Settings

![Aegis profile settings](docs/screenshots/profile-settings.png)

## Course Result

This project won **First Prize in the Excellent Course Project Evaluation**.

## Features

- User accounts: registration, login, JWT authentication, profile editing, password updates, and account deletion.
- Friend system: user search, friend requests, request handling, remarks, grouping, and deletion.
- Messaging: private chats, group chats, text and media messages, replies, recalls, unread counts, pinned chats, and mute settings.
- Group management: group creation, member invitations, join approvals, announcements, nicknames, administrators, ownership transfer, member removal, exit, and dissolution.
- Real-time delivery: WebSocket notifications with HTTP long-polling as a fallback.
- Extended experiences: echo-yard posts, personal notes, message translation, a group bot, and tic-tac-toe invitations.

## Tech Stack

| Layer | Tech |
| --- | --- |
| Frontend | React, Vite, Axios, Zustand, Ant Design Icons |
| Backend | FastAPI, Pydantic, SQLAlchemy |
| Database | SQLite / MySQL |
| Deployment | Docker, Nginx |
| Quality | pytest, pytest-cov, ESLint |

## Repository Structure

```text
backend/           FastAPI backend service
frontend/          React + Vite frontend application
database/          Database container configuration
docs/screenshots/  README screenshots
PROJECT_REPORT.md  Final course project report
```

## Local Development

Backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Windows PowerShell:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend development server is usually available at `http://localhost:5173`, with API requests proxied to the backend configured by `VITE_BACKEND_TARGET`.

Common environment variables:

```text
DATABASE_URL=sqlite:///./whatthedogdoing.db
SECRET_KEY=replace-with-a-random-secret
VITE_BACKEND_TARGET=http://localhost:8000
SILICONFLOW_API_KEY=optional-ai-service-key
```

## Testing

Recommended checks before submission:

```bash
pytest backend/tests --cov=backend/app --cov-report=term-missing -q
cd frontend && npm run lint && npm run build
```

Backend tests cover authentication, friend relationships, group management, announcements, message notifications, database initialization and migration, and AI gateway failure handling. Frontend checks rely on linting and production builds.
