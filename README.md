# Movie Selector App

A full-stack MERN application for selecting and exploring movies.

---

## 📂 Project Structure

- `backend/` – Node.js + Express backend
- `frontend/` – React frontend(React + React-router)

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Mohit-Gajjar1403/Movie-Selector.git
cd Movie-Selector
````

### 2. Install dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

---

## 🌱 Environment Setup

1. Create a `.env` file in the backend folder (and frontend if needed).
2. Use `.env.example` as reference.

**Backend `.env` example:**

```
PORT=5000
MONGODB_URI=<Your MongoDB connection string>
OMDB_API_KEY=<Your OMDB API Key>
```

**Frontend `.env` example:**

```
REACT_APP_API_URL=http://localhost:5000
```

> Replace `<Your MongoDB connection string>` and `<Your OMDB API Key>` with your actual credentials.

---

## 🗄️ Database Setup

There are two ways to set up the database:

1. **Restore from dump**

```bash
mongorestore --uri="<Your MongoDB URI>" <path-to-dump-folder>
```

2. **Run seed script** (if provided in backend)

```bash
cd backend
node seed.js
```

---

## 🚀 Running the Project

### Backend

```bash
cd backend
node server.js
```

### Frontend

```bash
cd frontend
npm start
```

* Backend runs on `http://localhost:5000` (or your configured PORT)
* Frontend runs on `http://localhost:3000`

---

## 💡 Notes

* Make sure the `.env` files contain the correct API key for OMDB and MongoDB URL.
* All required packages are in each folder’s `package.json`. Run `npm install` before starting.
* Follow `.env.example` for proper environment variable setup.

---
