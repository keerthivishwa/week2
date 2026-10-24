# Notes App Backend

A REST API for a notes-taking application built with Node.js, Express, MongoDB, and JWT authentication.

---

## Tech Stack

- **Node.js** — JavaScript runtime
- **Express.js** — Web framework
- **MongoDB** — Database
- **Mongoose** — ODM for MongoDB
- **JWT** — Authentication tokens
- **bcryptjs** — Password hashing
- **dotenv** — Environment variables

---

## Installation & Setup

### 1. Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) installed locally **or** a [MongoDB Atlas](https://www.mongodb.com/atlas) account

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

The `.env` file has already been created with default values for local MongoDB.  
If you are using MongoDB Atlas, replace the `MONGODB_URI` value with your Atlas connection string.

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notesapp
JWT_SECRET=mynoteappsecretkey123
JWT_EXPIRES_IN=7d
```

> **Important:** Never commit your `.env` file to Git. It is already listed in `.gitignore`.

### 4. Start the server

```bash
npm start
```

You should see:
```
Server running on port 5000
MongoDB connected: localhost
```

---

## API Endpoints

### Authentication (Public)

| Method | Endpoint             | Description       |
|--------|----------------------|-------------------|
| POST   | /api/auth/register   | Register new user |
| POST   | /api/auth/login      | Login and get JWT |

### Notes (Protected — requires JWT token)

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| POST   | /api/notes       | Create a new note        |
| GET    | /api/notes       | Get all your notes       |
| GET    | /api/notes/:id   | Get a single note by ID  |
| PUT    | /api/notes/:id   | Update a note            |
| DELETE | /api/notes/:id   | Delete a note            |

---

## Postman Testing Guide

### Step 1 — Register a user

- Method: `POST`
- URL: `http://localhost:5000/api/auth/register`
- Body → raw → JSON:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "password123"
}
```

Expected response (201):
```json
{
  "_id": "...",
  "name": "Alice",
  "email": "alice@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

### Step 2 — Login

- Method: `POST`
- URL: `http://localhost:5000/api/auth/login`
- Body → raw → JSON:

```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

Copy the `token` from the response — you will need it for all note requests.

### Step 3 — Add the token to note requests

In Postman, for every notes request:
- Go to the **Authorization** tab
- Select **Bearer Token**
- Paste your token

### Step 4 — Create a note

- Method: `POST`
- URL: `http://localhost:5000/api/notes`
- Body → raw → JSON:

```json
{
  "title": "My First Note",
  "content": "This is the content of my first note."
}
```

### Step 5 — Get all notes

- Method: `GET`
- URL: `http://localhost:5000/api/notes`

### Step 6 — Get a single note

- Method: `GET`
- URL: `http://localhost:5000/api/notes/<note_id>`

Replace `<note_id>` with an `_id` from the previous response.

### Step 7 — Update a note

- Method: `PUT`
- URL: `http://localhost:5000/api/notes/<note_id>`
- Body → raw → JSON:

```json
{
  "title": "Updated Title",
  "content": "Updated content."
}
```

### Step 8 — Delete a note

- Method: `DELETE`
- URL: `http://localhost:5000/api/notes/<note_id>`

---

## Error Responses

All errors return JSON in this format:

```json
{
  "message": "Description of the error"
}
```

| Status | Meaning                          |
|--------|----------------------------------|
| 400    | Bad request / validation error   |
| 401    | Not authenticated                |
| 403    | Forbidden (not your resource)    |
| 404    | Not found                        |
| 500    | Server error                     |
