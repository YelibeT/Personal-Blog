# ✍️ Personal Blog

> A full-stack personal blogging platform built with a React frontend and a Node.js backend.

🌐 **Live Website:** [Visit the blog](https://biniyam-personalblog.vercel.app)

---

## 📸 Overview

A modern personal blog where visitors can discover and read published articles, while the administrator has a private dashboard for creating, editing, publishing, and managing posts.

The project was built to practice **full-stack development**, including REST APIs, authentication, database design, authorization, deployment, and frontend-backend communication.

---

## ✨ Features

### 📖 Public Blog

* Browse published articles
* View individual articles
* Read article excerpts from the homepage
* Browse posts by category
* Responsive reading experience
* Clean, minimal interface

### 🔐 Admin Dashboard

* Secure admin login
* JWT-based authentication
* Access and refresh tokens
* HTTP-only cookies for refresh tokens
* Protected admin routes
* Admin-only post management

### 📝 Post Management

* Create posts
* Edit posts
* Delete posts
* Save drafts
* Publish and unpublish posts
* Add categories
* Add excerpts
* Add cover images
  
---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose                     |
| ---------- | --------------------------- |
| ⚛️ React   | User interface              |
| ⚡ Vite     | Development & build tooling |
| 🎨 CSS     | Styling                     |

### Backend

| Technology    | Purpose               |
| ------------- | --------------------- |
| 🟢 Node.js    | Runtime               |
| 🚂 Express    | REST API              |
| 🔷 Prisma     | Database ORM          |
| 🐘 PostgreSQL | Database              |
| 🔑 JWT        | Authentication        |
| 🍪 Cookies    | Refresh-token storage |
| 🔒 bcrypt     | Password hashing      |

### Deployment

| Service  | Purpose                       |
| -------- | ----------------------------- |
| ▲ Vercel | Frontend & backend deployment |
| 🐘 Neon  | PostgreSQL database           |

---

## 📂 Project Structure

```text
Personal-Blog/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── Admin.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── DraftsPage.jsx
│   │   ├── PostPage.jsx
│   │   └── ...
│   │
│   ├── public/
│   ├── index.html
│   └── package.json
│
├── backend/
│   ├── api/
│   │   └── index.js
│   │
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── postController.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── postRoutes.js
│   │   │   └── adminPostRoutes.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authenticate.js
│   │   │   └── authorizeAdmin.js
│   │   │
│   │   ├── lib/
│   │   │   └── prisma.js
│   │   │
│   │   └── server.js
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── package.json
│
└── README.md
```

---

## 🔐 Authentication Flow

The application uses access and refresh tokens to maintain authenticated admin sessions.

```text
Admin
  │
  ▼
Login
  │
  ▼
Express API
  │
  ├── Verify email
  ├── Verify password
  └── Generate tokens
          │
          ├──────────────► Access Token
          │
          └──────────────► Refresh Token
                                  │
                                  ▼
                         HTTP-only Cookie
```

When the access token expires:

```text
Frontend
   │
   ▼
API request
   │
   ▼
401 Unauthorized
   │
   ▼
Refresh Token
   │
   ▼
New Access Token
   │
   ▼
Retry original request
```


## 🔌 API

### Authentication

```text
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
```

### Public Posts

```text
GET    /api/posts
GET    /api/posts/:id
```

### Admin Posts

```text
POST   /api/admin/posts
GET    /api/admin/posts
PUT    /api/admin/posts/:id
DELETE /api/admin/posts/:id
```

### Health Check

```text
GET    /api/health
```

Response:

```json
{
  "message": "API is working"
}
```

---

## 🚀 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/YelibeT/Personal-Blog.git

cd Personal-Blog
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

### 4. Configure environment variables

Create the required `.env` files for the frontend and backend.

Example frontend configuration:

```env
VITE_API_URL=http://localhost:8800/api
```

Example backend configuration:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### 5. Start the backend

```bash
cd backend
npm start
```

### 6. Start the frontend

```bash
cd frontend
npm run dev
```

The application should now be available at:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:8800
```

---

## 🌍 Deployment

The project is deployed as separate frontend and backend applications.

```text
                 GitHub Repository
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
         frontend/            backend/
              │                   │
              ▼                   ▼
           Vercel               Vercel
              │                   │
              ▼                   ▼
        Blog Website          REST API
                                  │
                                  ▼
                                Neon
                              PostgreSQL
```

---

## 🧠 What I Learned

This project helped me understand how the pieces of a full-stack application actually connect:

* Building REST APIs with Express
* Designing relational database schemas
* Using Prisma with PostgreSQL
* Password hashing with bcrypt
* JWT authentication
* Access and refresh token flows
* HTTP-only cookies
* Authentication middleware
* Role-based authorization
* CRUD operations
* Connecting React to a REST API
* Handling CORS
* Environment variables
* Deploying frontend and backend separately
* Connecting a production API to a production database

---

## 👩‍💻 Author

**Yelibe Tsedeke**

Software Engineering Student | Full-Stack Development

GitHub: [@YelibeT](https://github.com/YelibeT)
