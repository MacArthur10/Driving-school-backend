const express = require("express");
const session = require("express-session");
const connect = require('./data/DB_connection');
const routes = require('./routes');
const jwt = require('jsonwebtoken');
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;
const inscritsRouter = require('./routes/inscrits');

// Middleware pour parser les corps des requêtes JSON
app.use(express.json());

connect();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session management middleware
app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const allowedOrigins = [
  'https://superadmin-i0tb.onrender.com',
  'https://driving-school-admin.onrender.com',
  'https://driving-school-learners.onrender.com'
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002'
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use('/api', routes);
app.use('/api/inscrits', inscritsRouter);
console.log('Registered /api routes');

// Print all registered routes for debugging
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(r.route.path)
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "An error occurred" });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Le serveur joue sur http://0.0.0.0:${PORT}`);
});
