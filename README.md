# 🛠️ Admin Panel Backend (Node.js + TypeScript)

This is the backend service for an **Admin Panel Application**, built with **Node.js**, **Express**, and **TypeScript**. It provides secure APIs for managing users, authentication, and dashboard functionality. The architecture follows modular coding practices for scalability and maintainability.

---

## 🚀 Features

- 🔐 User Authentication with JWT
- 👤 Admin Role Management
- 📊 Dashboard APIs
- 🧱 Modular Project Structure
- 🛡️ Secure RESTful API Design
- 📦 Environment-based Configuration

---

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Auth**: JWT-based Authentication
- **Logging**: Morgan
- **Env Config**: dotenv
- **Linting**: ESLint + Prettier

---

## 📁 Folder Structure
nodejs-ts-adminPanel_backend/
├── src/
│   ├── config/         # DB and env config
│   ├── controllers/    # Route handlers
│   ├── middlewares/    # Auth, error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── index.ts        # App entry point
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md

---

## ⚙️ Setup & Run

### Prerequisites

- Node.js >= 16.x
- npm
- MongoDB URI (local or Atlas)

### Installation

```bash
git clone https://github.com/salmanshaikssk007/nodejs-ts-adminPanel_backend.git
cd nodejs-ts-adminPanel_backend
npm install
```
### .env file
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/adminpanel
JWT_SECRET=your_jwt_secret
```
- start server
```bash
npm run dev
```
## 🛠️ Admin API Endpoints

| Method | Endpoint           | Description               |
|--------|--------------------|---------------------------|
| POST   | `/api/auth/login`  | Admin login               |
| GET    | `/api/users`       | Get all users (admin)     |
| POST   | `/api/users`       | Create a new user         |
| PUT    | `/api/users/:id`   | Update user info          |
| DELETE | `/api/users/:id`   | Delete user               |
| ...    | ...                | More endpoints coming     |

### scripts
```bash
npm run dev        # Run in dev mode with nodemon
npm run build      # Build for production
npm start          # Start production server
```

### 📬 Contact
- Built with ❤️ by Salman Shaik
📧 Email: salmanshaikssk007@gmail.com

### 🪪 License
- This project is licensed under the MIT License.
