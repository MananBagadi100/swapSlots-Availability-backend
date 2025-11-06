
## API Endpoints Overview

| Method | Endpoint | Description | Body (if applicable) |
|-------|----------|-------------|----------------------|
| **POST** | `/auth/signup` | Register a new user | `{ name, email, password }` |
| **POST** | `/auth/login` | Login & set auth cookie | `{ email, password }` |
| **POST** | `/api/logout` | Logout (clears cookie) | — |
| **GET** | `/api/events/my` | Fetch logged-in user's events | — |
| **POST** | `/api/events` | Create a new event | `{ title, startTime, endTime }` |
| **PATCH** | `/api/events/:id/status` | Update event status (`BUSY`/`SWAPPABLE`) | `{ status }` |
| **DELETE** | `/api/events/:id` | Delete an event | — |
| **GET** | `/api/swappable-slots` | Get swappable events from **other** users | — |
| **GET** | `/api/my-swappable-slots` | View your own swappable events | — |
| **POST** | `/api/swap-request` | Request a swap with another user's slot | `{ mySlotId, theirSlotId }` |
| **GET** | `/api/swap-requests/incoming` | View requests **you received** | — |
| **GET** | `/api/swap-requests/outgoing` | View requests **you sent** | — |
| **POST** | `/api/swap-response/:requestId` | Accept or Reject a swap request | `{ accepted: true/false }` |
