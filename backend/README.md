# Habit Tracker Backend

Backend API for the Habit Tracker application built with Express.js.

## Project Structure

```
backend/
├── src/
│   ├── routes/          # Route definitions
│   ├── controllers/     # Controller logic
│   ├── middleware/      # Custom middleware
│   ├── models/          # Data models
│   └── server.js        # Main server file
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
└── package.json         # Dependencies and scripts
```

## Installation

1. Clone the repository
2. Navigate to the backend directory: `cd backend`
3. Install dependencies: `npm install`

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

## Dependencies

- [Express.js](https://expressjs.com/) - Web framework
- [Cors](https://www.npmjs.com/package/cors) - CORS middleware
- [Helmet](https://www.npmjs.com/package/helmet) - Security headers
- [Morgan](https://www.npmjs.com/package/morgan) - Logging middleware
- [Nodemon](https://www.npmjs.com/package/nodemon) - Development server auto-restart

## Environment Variables

Create a `.env` file in the root of the backend directory with the following variables:

```
PORT=5000
NODE_ENV=development
```

## License

MIT