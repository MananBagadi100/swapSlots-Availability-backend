# Backend - Slot Swap App

This backend provides authentication, event management, and swap request logic for the Slot Swap application.

## Tech Stack
- Node.js
- Express.js
- MySQL (with mysql2)
- JWT Authentication
- Cookies for session handling

## Folder Structure
```
backend/
├─ config/
│  └─ db.js            # MySQL connection
├─ controllers/
│  ├─ authController.js
│  ├─ eventController.js
│  └─ swapController.js
├─ Middleware/
│  └─ verifyToken.js
├─ Routes/
│  ├─ authRoutes.js
│  └─ protectedRoutes.js
├─ server.js
└─ .env
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup MySQL Database
Create a database and run the SQL schema (tables: `users`, `events`, `swap_requests`).

### 3. Create a `.env` File
```
PORT=3000
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
```

### 4. Start the Server
```bash
npm run start
```
Server runs at: `http://localhost:3000`

## Authentication Flow
- On login/signup, a JWT is created and stored in HTTP-only cookie.
- Protected routes require token validation via `verifyToken.js`.

## API Routes Summary

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | /auth/signup | Register new user | ❌ |
| POST | /auth/login | Login user & set cookie | ❌ |
| POST | /api/logout | Logout (clear cookie) | ✅ |
| GET | /api/me | Get logged-in user | ✅ |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/events/my | Get logged-in user's events |
| POST | /api/events | Create new event |
| PATCH | /api/events/:id/status | Change status (BUSY <-> SWAPPABLE) |
| DELETE | /api/events/:id | Remove event |

### Swapping
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/swappable-slots | Get swappable slots from other users |
| GET | /api/my-swappable-slots | Get user's own swappable slots |
| POST | /api/swap-request | Request a swap |
| POST | /api/swap-response/:requestId | Accept/Reject swap |
| GET | /api/swap-requests/incoming | Incoming requests |
| GET | /api/swap-requests/outgoing | Outgoing requests |

## Notes
- Cookies must be sent from frontend via `withCredentials: true`.
- CORS is configured to allow requests from the frontend URL specified in `.env`.

---

This backend is production-ready and structured cleanly for clarity and extension.
