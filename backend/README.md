# FastAPI Chat Application

This is a FastAPI-based chat application that provides user authentication, chat management, and message handling. The application uses SQLite as the database and supports JWT-based authentication.

---

## Features

- User authentication (signup/login) with JWT tokens.
- Chat creation, listing, retrieval, and deletion.
- Message handling within chats.
- Integration with an LLM service for chat suggestions.

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate the virtual environment:

- **Windows**:
  ```bash
  venv\Scripts\activate
  ```
- **Mac/Linux**:
  ```bash
  source venv/bin/activate
  ```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration (e.g., `DATABASE_URL`, `SECRET_KEY`, etc.).

---

## Running the Application

### Local Development

Run the application using `fastapi`:

```bash
fastapi dev main.py
```

The application will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000).

### Production

Use a production-grade ASGI server like `gunicorn` with `uvicorn` workers:

```bash
gunicorn -k uvicorn.workers.UvicornWorker main:app
```

---

## API Documentation

FastAPI automatically generates interactive API documentation:

- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## Directory Structure

```
.
├── .env                # Environment variables for local development
├── .env.example        # Example environment file
├── .gitignore          # Git ignore file
├── database.py         # Database configuration and session management
├── main.py             # FastAPI application entry point
├── models.py           # SQLAlchemy models for database tables
├── requirements.txt    # Python dependencies
├── routers/            # API route handlers
│   ├── auth.py         # Authentication routes
│   └── user.py         # User and chat-related routes
├── schemas.py          # Pydantic models for request/response validation
├── services/           # Business logic and utility functions
│   ├── auth.py         # Authentication-related services
│   └── llm.py          # LLM-related services (e.g., chat suggestions)
└── test.db             # SQLite database file (for local development)
```

---

## Conventions

- **Models**: Defined in `models.py` using SQLAlchemy.
- **Schemas**: Defined in `schemas.py` using Pydantic for request/response validation.
- **Routers**: API endpoints are organized in the `routers/` directory.
- **Services**: Business logic is encapsulated in the `services/` directory.

---