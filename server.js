require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');

const endpoints = require('./endpoints');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

function authentication(req, res, next) {
    let authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token is missing or expired' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(403).json({ message: 'Token has expired' });
            } else if (err.name === "JsonWebTokenError") {
                return res.status(403).json({ message: 'Invalid token' });
            } else {
                return res.status(403).json({ message: 'Authentication error' });
            }
        }

        req.username = decoded.username;
        next();
    });
}

app.get('/', authentication, (req, res) => {
    let username = req.username;
    res.json({ message: `Hello, ${username}` });
});

app.post('/register', endpoints.registerUser);
app.post('/login', endpoints.loginUser);
app.post('/refresh', endpoints.refreshToken);
app.post('/logout', endpoints.logout);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
