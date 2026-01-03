# 🧠 Brain Tumor Detection and Classification System

A full-stack web application that uses an **ensemble deep learning approach* to detect and classify brain tumors from MRI scans.
This guide explains how to set up both the **backend (FastAPI + PostgreSQL)** and **frontend (React + Vite)** components.

---

## 📋 Table of Contents

* [Introduction](#introduction)
* [Tech Stack](#tech-stack)
* [Prerequisites](#prerequisites)
* [Setup Instructions](#setup-instructions)

  * [Database Setup](#database-setup)
  * [Backend Setup](#backend-setup)
  * [Frontend Setup](#frontend-setup)
* [Testing the Database Connection](#testing-the-database-connection)
* [Running the Project](#running-the-project)
* [Creating a New User](#creating-a-new-user)
* [Project Structure](#project-structure)
* [License](#license)

---

## 🧩 Introduction

This project provides an AI-powered diagnostic system that helps detect and classify brain tumors from MRI images using deep learning models.
It includes:

* A **FastAPI backend** for inference and database management.
* A **React frontend** for an interactive user interface.
* A **PostgreSQL database** to store user and result data.

---

## ⚙️ Tech Stack

| Layer           | Technology                       |
| --------------- | -------------------------------- |
| **Frontend**    | React + Vite                     |
| **Backend**     | FastAPI (Python 3.11)            |
| **Database**    | PostgreSQL                       |
| **Model**       | TensorFlow / Keras (`.h5` model) |
| **Environment** | VS Code                          |

---

## 🧰 Prerequisites

Ensure you have the following installed on your system:

* **Python 3.11**
* **Node.js** (v18+ recommended)
* **npm** (comes with Node)
* **PostgreSQL** and **pgAdmin**
* **Visual Studio Code**

---

## 🗃️ Database Setup

1. Open **pgAdmin**.
2. Create a new database named:

   ```
   brain_tumor
   ```

---

## 🖥️ Setup Instructions

### 🧠 Backend Setup

Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

1. Open VS Code and navigate to the backend folder:

   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:

   ```bash
   py -3.11 -m venv .venv
   .\.venv\Scripts\Activate
   ```
3. Upgrade core tools:

   ```bash
   python -m pip install --upgrade pip setuptools wheel
   ```
4. Install dependencies:

   ```bash
   pip install --no-cache-dir -r requirements.txt
   ```
5. Start the backend server:

   ```bash
   cd ..
   python -m uvicorn backend.main:app --reload --port 8000
   ```

---

### ⚛️ Frontend Setup

1. Open the frontend folder:

   ```bash
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the development server:

   ```bash
   npm run dev
   ```
4. The frontend will be available at the URL shown in the terminal (usually [http://localhost:5173](http://localhost:5173)).

---

## 🧪 Testing the Database Connection

Run this command inside the backend folder (with `.venv` activated):

```bash
python test_db.py
```

If the connection is successful, you’ll see confirmation in the terminal.

---

## 👤 Creating a New User

1. Run the backend server and open:
   [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
2. Use the **`/register`** or similar endpoint (based on your API) to create a new user.

---

## 🧱 Project Structure

```
Final project/
│
├── backend/
│   ├── core/               # Configuration & detection logic
│   ├── db/                 # Database connection
│   ├── models/             # ML model & ORM models
│   ├── routers/            # API routes
│   ├── schemas/            # Pydantic schemas
│   ├── uploads/            # Uploaded MRI images
│   ├── main.py             # FastAPI entry point
│   ├── requirements.txt
│   └── test_db.py
│
├── frontend/
│   ├── src/                # React source code
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Running the Project

1. **Start PostgreSQL** and ensure the `brain_tumor` database exists.
2. **Run the backend**:

   ```bash
   python -m uvicorn backend.main:app --reload --port 8000
   ```
3. **Run the frontend**:

   ```bash
   npm run dev
   ```
4. Access the app via the frontend URL and test API endpoints in:
   [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🪪 License

This project is for academic and research purposes.
Feel free to use and modify it for educational use cases.
