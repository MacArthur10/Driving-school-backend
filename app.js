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

const hostname = '127.0.0.1';
const port = process.env.Port || 5000;

connect();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session management middleware
app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


app.use(cors({
    origin: '*', // accepter toutes les requêtes
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // accepter les méthodes
    allowedHeaders: ['Content-Type', 'Authorization'] // accepter les headers
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

app.listen(port, hostname, () => {
    console.log(`Le serveur joue sur http://${hostname}:${port}`);
});
