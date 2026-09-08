# Sonora

Sonora is a Spotify-inspired music platform with a bold Gen Z interface. The
project combines a React/Vite frontend with an Express, MongoDB, ImageKit, and
JWT-powered backend.

The app is designed around discovering music, playing tracks, managing a
listener profile, and giving artists a lightweight space to upload tracks and
create albums.

## Features

### Frontend

- Gen Z-inspired dark music dashboard with acid-lime and pink accents
- Responsive desktop and mobile layouts
- Home dashboard with curated track cards and playlist-style sections
- Discover view for new music and recommendations
- Radio view with a live-style listening experience
- Functional demo player with play, pause, next, previous, progress, and volume controls
- Login and registration modals
- Username or email login support
- Persistent logged-in profile in browser storage
- Artist workspace for uploading tracks and creating albums
- Toast feedback for successful actions and API errors
- Vite development proxy for local frontend-to-backend requests

### Backend

- Express API server
- MongoDB persistence through Mongoose
- User registration and login
- Password hashing with `bcryptjs`
- JWT authentication stored in cookies
- Listener and artist roles
- Artist-only music upload endpoint
- Artist-only album creation endpoint
- ImageKit storage for uploaded music files
- CORS support with credentialed requests
- Multipart file handling with Multer

## Project Structure

```text
Spotify-Clone/
├── Backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── controllers/
│       ├── db/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── services/
├── Frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── index.css
└── README.md
```

## API Routes

| Method | Route | Purpose | Access |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Create a user or artist account | Public |
| `POST` | `/api/auth/login` | Log in with username or email | Public |
| `POST` | `/api/music/upload` | Upload a music file and create a track | Artist |
| `POST` | `/api/music/album` | Create an album from music IDs | Artist |

## Local Development

Install dependencies in both applications:

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

Start the backend in one terminal:

```bash
cd Backend
node server.js
```

Start the frontend in another terminal:

```bash
cd Frontend
npm run dev
```

Open `http://localhost:5173` in a browser. The frontend proxies `/api` calls
to the backend at `http://localhost:3000` during development.

## Environment Variables

Create `Backend/.env` with the following values:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
FRONTEND_URL=http://localhost:5173
```

For a separately deployed frontend, set `VITE_API_URL` in the frontend
environment to the deployed backend API URL, including `/api`:

```env
VITE_API_URL=https://your-backend.example.com/api
```

Never commit real credentials or private keys. The repository ignores `.env`
files by default.

## Build and Quality Checks

Build the frontend for production:

```bash
cd Frontend
npm run build
```

Run the frontend linter:

```bash
npm run lint
```

## Deployment Notes

The React frontend can be deployed to Vercel using `Frontend` as the project
root, `npm run build` as the build command, and `dist` as the output directory.

The current backend starts a long-running Express server with `node server.js`.
For Vercel deployment, it needs a serverless function entry point such as
`api/index.js`, or it can be deployed as a regular Node service on Render,
Railway, or another host. Configure `FRONTEND_URL`, database credentials,
ImageKit credentials, and the frontend API URL in the deployment platform.

## Current Scope

The player and discovery content currently use curated demo track data because
the backend does not yet expose endpoints for listing, streaming, searching, or
liking saved music. Uploaded tracks and albums are stored through the backend,
but they are not automatically loaded into the discovery feed yet.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).