# 🚀 Backend Setup - FastAPI Application

This is the backend for the ESL Management Platform, built with **FastAPI**. Follow the steps below to set up the backend on your local machine.

## 📁 Folder Structure

```

project-root/
│
├── backend/
│ ├── app/
│ ├── .env ← Environment variables
│ ├── requirements.txt
│ └── ...

```

---

## ✅ Prerequisites

- Python 3.10+ installed
- `pip` and `venv` available

---

## ⚙️ Setup Instructions

### 1. Navigate to the backend folder

```bash
cd backend
```

### 2. Create and activate virtual environment

**Windows**:

```bash
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**macOS/Linux**:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

---

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Create your `.env` file

You can create a `.env` file in the `backend/` directory by copying the sample below:

#### 🧪 Sample `.env`

```env
MONGO_URI=mongodb_url
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
```

> ⚠️ Replace `mongodb_url` with your mongodb url.

> ⚠️ Replace `your-secret-key` with a secure random string.

---

### 5. Run the FastAPI Server

Use `uvicorn` to start the development server:

```bash
uvicorn app.main:app --reload
```

- `--reload` enables auto-reloading on code changes.
- `app.main:app` means:

  - `app/` is the folder
  - `main.py` is the file
  - `app` is the FastAPI instance inside `main.py`

---

### 6. Test the API

Once the server is running, go to:

```
http://localhost:8000/docs
```

This opens the **interactive Swagger UI** where you can test all API endpoints.

---

## 🧩 Useful Commands

- Freeze dependencies:

  ```bash
  pip freeze > requirements.txt
  ```

- Deactivate virtual environment:

  ```bash
  deactivate
  ```

---

## 📌 Notes

- Ensure MongoDB is running before starting the server.
- Environment variables are loaded from `.env` using `python-dotenv` or `pydantic`.

---
