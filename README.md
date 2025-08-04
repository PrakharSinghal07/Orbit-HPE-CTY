# Orbit - Chatbot Project

Orbit is a chatbot application built using **FastAPI** for the backend and **React** for the frontend. The project aims to assist service engineers with debugging issues through an interactive chatbot. 

# Live Link

[Orbit : https://orbit-lcm-hpe.netlify.app/](https://orbit-lcm-hpe.netlify.app/)

## Prerequisites

Before starting, make sure you have the following installed:

- **Python 3.7+**
- **Node.js** (for frontend development)
- **Docker** (for running PostgreSQL in a container)
- **Docker Compose** (for managing multiple containers)
- **PostgreSQL** (if not using Docker for database)
- **Git** (to clone the repository)

## Backend Setup (FastAPI)

1. **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd backend
    ```

2. **Install Python dependencies**:
    Create a virtual environment and install the required libraries:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use: venv\Scripts\activate  # On bash (windows) use: source venv/Scripts/activate
    pip install -r requirements.txt
    ```

3. **Set up environment variables**:
    Create a `.env` file at the root of the backend project and add the following:
    ```bash
    DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database-name>
    FRONTEND_URL=<frontend-url>
    ```

4. **Start PostgreSQL with Docker**:
    If you're using Docker for the database, run:
    ```bash
    docker-compose up -d
    ```

    Ensure your `.env` file has the correct PostgreSQL credentials.

5. **Run the backend**:
    After setting up everything, start the backend server:
    ```bash
    uvicorn main:app --reload
    ```

6. **Database Migration**:
    The database tables are automatically created on server start-up (using SQLAlchemy). If you need to run migrations manually, you can use Alembic (for future schema changes).

## Frontend Setup (React)

1. **Navigate to the frontend folder**:
    ```bash
    cd frontend
    ```

2. **Install Node.js dependencies**:
    Make sure you have the necessary frontend dependencies installed:
    ```bash
    npm install
    ```

3. **Start the frontend**:
    Run the frontend server:
    ```bash
    npm start
    ```

4. **Configure API URLs**:
    Ensure that the frontend is set up to connect to the backend by configuring the API endpoint in the frontend code (`api.js` or any equivalent file).

5. **Add authentication**:
    The frontend will need to be updated to support login/signup, including token handling (JWT) and authenticated routes.

## Database Setup (PostgreSQL with Docker)

If you're using Docker to run PostgreSQL, follow these steps to set up the database container:

1. **Create a `docker-compose.yml` file**:
    ```yaml
    version: '3.8'
    services:
      postgres:
        image: postgres:latest
        environment:
          POSTGRES_USER: <username>
          POSTGRES_PASSWORD: <password>
          POSTGRES_DB: <database-name>
        ports:
          - "5432:5432"
        volumes:
          - postgres-data:/var/lib/postgresql/data
    volumes:
      postgres-data:
    ```

2. **Run Docker container**:
    Start the PostgreSQL container by running:
    ```bash
    docker-compose up -d
    ```

3. **Check database connection**:
    Verify the connection details are correctly set up in both backend and frontend.

## Authentication (To be implemented)

### Backend

1. **Create User Model**:
    Implement the `User` model in SQLAlchemy.
  
2. **JWT Authentication**:
    - Implement login and signup functionality using **JWT**.
    - Add password hashing with **Passlib**.

3. **Protect Routes**:
    Add security to routes so that users can only access their own data (conversations).

### Frontend

1. **Login/Signup UI**:
    Implement the frontend UI for login and signup forms.

2. **Store JWT Token**:
    Store the JWT token in **localStorage** or **sessionStorage** for user authentication state.

3. **Protected Routes**:
    Implement route protection to ensure that authenticated users can access their data.

4. **Handle Auth State**:
    Use **React Context** or **Redux** to manage authentication state across the app.

## How to Contribute

If you want to contribute to this project:

1. **Fork** the repository.
2. **Clone** your fork to your local machine.
3. **Create a new branch**:
    ```bash
    git checkout -b <branch-name>
    ```
4. **Make your changes** and **commit** them.
    ```bash
    git add .
    git commit -m "Your commit message"
    ```
5. **Push your branch** to your fork:
    ```bash
    git push origin <branch-name>
    ```
6. **Open a Pull Request** to merge your changes into the main repository.

