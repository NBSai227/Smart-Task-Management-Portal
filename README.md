# Taskflow. — Secure Mini Project Management Portal

Taskflow is a production-ready, full-stack Project Management Portal built using the MERN (MongoDB, Express, React, Node.js) stack. It incorporates JWT-based user authentication, MVC architecture, custom schema validations, responsive design with light/dark theme toggles, dashboard metrics, search/filtering, and server-side pagination.

---

## 🚀 Tech Stack

### Frontend
- **React.js** (Vite wrapper)
- **Tailwind CSS v3** (Utility-first styling with custom glassmorphism)
- **React Router DOM v6** (App routing and protected paths)
- **Axios** (API requests with automatic token insertion via interceptors)
- **Lucide React** (Vector icons)
- **Context API** (Global state management for session persistence)

### Backend
- **Node.js** & **Express.js** (Server-side runtime and REST architecture)
- **MongoDB** & **Mongoose** (Database modeling and validations)
- **JSON Web Tokens (JWT)** (Secure token-based auth)
- **Bcryptjs** (Salted password hashing)
- **Cors** & **Dotenv** (Cross-origin resource sharing and environment management)

---

## 🛠️ Key Features

1. **User Authentication & Session Security**:
   - Form-based registration and logins.
   - Salted password encryption using `bcryptjs` (pre-save database hook).
   - Private route protection utilizing custom Express token authentication middleware.
   - Authorization token caching in browser `localStorage`.
2. **Interactive Workspace Dashboard**:
   - Overall stats widget tracking: **Total**, **Pending**, **In Progress**, and **Completed** tasks.
   - Live query options: search input (by title), status tag filter, priority level filter, and sorting orders.
   - Grid layout of responsive task cards featuring priority indicators and overdue alerts.
3. **Task CRUD Operations**:
   - Add new tasks with title, description, priority, due date, and status.
   - Real-time client form validation (descriptions must be $\ge$ 20 chars; due dates cannot be in the past).
   - Dynamic update page sharing identical validation structures.
   - Status checklist shortcuts directly on cards.
   - Destructive actions guarded by custom confirmation modal popups.
4. **Server-side Pagination**:
   - Controls pages via limit queries.
   - Dynamic page lists with Back/Forward action hooks.
5. **Light / Dark Theme Support**:
   - Dark mode toggle that persists across page loads in `localStorage`.

---

## 📂 Project Structure

```
project-root/
├── package.json (Root concurrent runner configurations)
├── README.md (Setup & installation guide)
├── taskflow.postman_collection.json (Pre-configured API requests)
├── backend/
│   ├── config/db.js (Mongoose helper)
│   ├── controllers/ (authController, taskController)
│   ├── models/ (User schema, Task schema)
│   ├── middleware/ (authMiddleware, errorMiddleware)
│   ├── routes/ (authRoutes, taskRoutes)
│   ├── .env (Config parameters)
│   └── server.js (Express server bootstrap)
└── frontend/
    ├── src/
    │   ├── components/ (Header, ProtectedRoute, Spinner, Toast, TaskCard, ConfirmModal)
    │   ├── context/ (AuthContext)
    │   ├── pages/ (Login, Register, Dashboard, TaskForm)
    │   ├── services/ (api wrapper)
    │   ├── App.jsx (Route registry)
    │   ├── index.css (Tailwind layers & presets)
    │   └── main.jsx
    ├── tailwind.config.js
    └── package.json (Vite React app setup)
```

---

## ⚙️ Installation & Running the Application

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) running locally on port `27017`

### Step 1: Install Dependencies
From the root folder, you can run a single command to install both backend and frontend dependencies:
```bash
npm install
```
*(This automatically triggers `postinstall` scripts to run `npm install` inside both directories).*

### Step 2: Configure Environment Variables
Verify configurations inside `backend/.env`:
```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/project_portal_secure
JWT_SECRET=assessment_secret_key_123
```

### Step 3: Run the Application
Start both the backend server and frontend client concurrently:
```bash
npm start
```
- **Backend API Server**: http://localhost:5000
- **Frontend Client App**: http://localhost:3000

---

## 🧪 Postman API Documentation & Testing

A pre-configured Postman Collection is located in the root directory: `taskflow.postman_collection.json`.

### How to use the Postman Collection:
1. **Import the collection**:
   - Open Postman, click on **Import** in the top-left corner.
   - Choose the file `taskflow.postman_collection.json` and select import.
2. **Environment Variables**:
   - The collection uses local environment parameters:
     - `base_url`: `http://localhost:5000`
     - `token`: Autopopulates upon successful Login requests.
     - `task_id`: Populate this variable with the `id` of a created task to run PUT, PATCH, or DELETE operations.
3. **Run Requests in Order**:
   - **Register User**: Registers a new credential block (e.g. `john@example.com`).
   - **Login User**: Authenticates the credential block and automatically updates the session token variable.
   - **Get User Profile**: Verifies JWT validation headers.
   - **Create Task**: Adds a new task card with date bounds.
   - **Get All Tasks**: Retrieves list data with pagination queries (page/limit) and search flags.
   - **Update Task**: Modifies task details.
   - **Update Task Status**: Performs a PATCH request changing status tags.
   - **Delete Task**: Removes the task.
