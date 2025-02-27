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

const createPost = async (req, res) => {
    try {
        let { title, content } = req.body;

        if(!title || !content) {
            return res.status(400).json({ message: 'All fields are required' });
        }
    
        let postData = {
            title : title,
            content : content,
            author : req.username
        }
    
        let post = await dataManagement.createPost(postData);
        res.status(201).json({ post : post, message: 'Post created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getAllPosts = async (req, res) => {
    try {
        let postsList = await dataManagement.getAllPosts();
        if(!postsList) {
            res.status(400).json({ message : 'No post available' });
        }

        res.json({ postsLists : postsList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const updatePost = async (req, res) => {
    try {
        let { id } = req.params;
        let { title, content } = req.body;
        let author = req.username;

        let newPostData = {
            title : title,
            content :content
        }

        let postUpdated = await dataManagement.updatePost(id, author, newPostData);
        if(!postUpdated) {
            return res.status(403).json({ message : 'Error updating post' });
        }

        res.json({ postUpdated : postUpdated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const deletePost = async (req, res) => {
    try {
        let { id } = req.params;
        let author = req.username;

        let deleted = await dataManagement.deletePost(id, author);
        if(!deleted) {
            return res.status(400).json({ message: 'Post not found or already deleted' });
        }

        res.json({ message : 'Post deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { registerUser, loginUser, refreshToken, logout, createPost, getAllPosts, updatePost, deletePost };
