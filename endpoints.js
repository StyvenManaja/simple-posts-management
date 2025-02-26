require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dataManagement = require('./dataManagement');

function generateToken(username) {
    return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '15m' });
}

const registerUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        let userData = { username, email, password: hashedPassword };

        let user = await dataManagement.registerUser(userData);
        if (!user) {
            return res.status(400).json({ message: 'Error registering user' });
        }

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        let user = await dataManagement.findUser(email);
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }

        let validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        let token = generateToken(user.username);
        let refreshToken = jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '1d' });

        await dataManagement.registerToken(refreshToken);

        res.json({ accessToken: token, refreshToken });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const refreshToken = async (req, res) => {
    try {
        let { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        let storedToken = await dataManagement.findToken(token);
        if (!storedToken) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }

            let newAccessToken = generateToken(decoded.username);
            res.json({ accessToken: newAccessToken });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const logout = async (req, res) => {
    try {
        let { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        let deleted = await dataManagement.deleteToken(refreshToken);
        if (!deleted) {
            return res.status(400).json({ message: 'Token not found or already deleted' });
        }

        res.json({ message: 'Logged out successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser, refreshToken, logout };
