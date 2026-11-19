# Spotifyy Backend

REST API for a Spotify-like music streaming app. Artists upload songs and albums, users browse, search, like songs and build playlists. Authentication uses JWT stored in an HTTP cookie, with role-based access control (`user` and `artist`).

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB with Mongoose
- **Auth:** JSON Web Tokens (cookie-based), bcryptjs for password hashing
- **File Upload:** Multer (memory storage) and Cloudinary for audio hosting
- **Dev tool:** Nodemon

## Features

- Register, login, logout and profile for users and artists
- Role-based access control (`user` / `artist`)
- Artists can upload songs (audio stored on Cloudinary) and create albums
- Artists can view their own uploaded songs and update the title of their own songs
- Users can browse all songs and albums
- Case-insensitive search of songs by title
- Users can like / unlike songs and view their liked songs
- Playlists: create, list, add song, remove song, delete

## Project Structure

```
spotifyy/
├── server.js
├── .env
└── src/
    ├── app.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── music.controller.js
    │   └── playlist.controller.js
    ├── db/
    │   └── db.js
    ├── middlewares/
    │   └── auth.middleware.js
    ├── models/
    │   ├── album.model.js
    │   ├── music.model.js
    │   ├── playlist.model.js
    │   └── user.model.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── music.routes.js
    │   └── playlist.routes.js
    └── services/
        └── storage.service.js
```

## Getting Started

### Prerequisites

- Node.js
- A MongoDB database (local or Atlas)
- A Cloudinary account

### Installation

```bash
git clone <your-repo-url>
cd spotifyy
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run

```bash
npx nodemon server.js
```

The server starts on `http://localhost:3000`.

## Authentication

Login and register set a `token` cookie containing a JWT with the payload `{ id, role }`. Protected routes read this cookie. Three middlewares are used:

| Middleware | Allowed roles |
|---|---|
| `authArtist` | artist |
| `authUser` | user |
| `authAny` | user, artist |

Responses: `401 Unauthorized` when the token is missing or invalid, `403 You don't have access` when the role is not allowed.

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user or artist (`role` defaults to `user`) |
| POST | `/login` | Public | Login with username or email and password |
| POST | `/logout` | Public | Clear the auth cookie |
| GET | `/myProfile` | Logged in | Get the current user's profile (password excluded) |

**Register body**
```json
{
  "username": "av",
  "email": "av@example.com",
  "password": "123456",
  "role": "artist"
}
```

**Login body**
```json
{
  "email": "av@example.com",
  "password": "123456"
}
```

### Music (`/api/music`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/upload` | Artist | Upload a song (`multipart/form-data`: `title`, file field `music`) |
| POST | `/album` | Artist | Create an album (`title`, `musics` array of song ids) |
| GET | `/` | User | Get all songs |
| GET | `/albums` | User | Get all albums |
| GET | `/albums/:albumId` | User | Get one album |
| GET | `/search?q=term` | Any | Search songs by title (case-insensitive) |
| GET | `/my-music` | Artist | Get songs uploaded by the logged-in artist |
| POST | `/like/:id` | User | Like or unlike a song (toggle) |
| GET | `/liked` | User | Get the logged-in user's liked songs |
| PUT | `/:id` | Artist | Update the title of your own song (`{ "title": "new title" }`) |

**Search responses**

- `200` with matching songs, or an empty list when nothing matches
- `400 Search query is required` when `q` is missing or empty

### Playlists

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create a playlist (`{ "name": "My playlist" }`) |
| GET | `/` | Get the logged-in user's playlists |
| POST | `/:playlistId/songs` | Add a song (`{ "musicId": "..." }`) |
| DELETE | `/:playlistId/songs/:musicId` | Remove a song |
| DELETE | `/:playlistId` | Delete a playlist |

## Data Models

**User:** `username` (unique), `email` (unique), `password` (hashed), `role` (`user` | `artist`), `likedSongs` (array of Music ids)

**Music:** `uri` (Cloudinary URL), `title`, `artist` (User id)

**Album:** `title`, `artist` (User id), `musics` (array of Music ids)

**Playlist:** `name`, `owner` (User id), `musics` (array of Music ids)

## Security Notes

- Passwords are hashed with bcrypt before saving.
- Owner checks: artists can only edit their own songs, and playlist actions only work on the owner's playlists.
- Audio URLs use Cloudinary's `secure_url` (HTTPS).

## Roadmap

- Delete song, update and delete album
- Add and remove songs in an album
- Pagination for the songs list
- CORS configuration and production cookie settings (`httpOnly`, `secure`, `sameSite`)
- Frontend

## Author

Aanchal