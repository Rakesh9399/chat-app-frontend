# Real-Time Chat App Frontend

A React-based chat client built with Vite, Tailwind CSS, and Socket.IO for real-time messaging. This frontend connects to a backend API to create/join chat rooms, send and receive messages, and upload files.

## Features

- Join or create chat rooms by Room ID
- Real-time messaging using Socket.IO
- File upload support for images and documents
- Message history loaded from backend
- Responsive UI with Tailwind CSS
- Toast notifications for user feedback

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Socket.IO Client
- Axios
- React Router v7
- React Hot Toast
- React Icons

## Getting Started

### Prerequisites

- Node.js 18+ or compatible version
- npm
- Chat backend server running and reachable at the configured base URL

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Visit the URL shown in the terminal (typically `http://localhost:5173`).

## Available Scripts

- `npm run dev` - Start the dev server
- `npm run build` - Build the production bundle
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint across the project

## Project Structure

- `src/App.jsx` - App entry component
- `src/components/JoinCreateChate.jsx` - Join/create room UI
- `src/components/ChatPage.jsx` - Chat room UI and socket logic
- `src/context/ChatContext.jsx` - Global chat state management
- `src/config/AxiosHelper.js` - Axios base URL and HTTP client
- `src/service/RoomService.js` - API calls for room management and messages
- `src/service/FileService.js` - File upload API request

## Backend Configuration

The backend should expose endpoints for room creation, joining rooms, fetching messages, and uploading files.

## Notes

- Update `src/config/AxiosHelper.js` if your backend URL differs.
- Ensure the backend supports Socket.IO room join and message events.

## License

This project is provided as-is.
