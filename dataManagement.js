const mongoose = require('mongoose');
const User = require('./model').userModel;
const Token = require('./model').refreshTokenModel;

mongoose.connect("mongodb://localhost:27017/postManage");

const registerUser = async (userData) => {
    try {       
        let user = await User.create({
            username: userData.username,
            email: userData.email,
            password: userData.password
        });

        return user;
    } catch (error) {
        console.error("Error registering user:", error);
        return null;
    }
};

const findUser = async (email) => {
    try {        
        return await User.findOne({ email: email });
    } catch (error) {
        console.error("Error finding user:", error);
        return null;
    }
};

const registerToken = async (refreshToken) => {
    try {       
        return await Token.create({ token: refreshToken });
    } catch (error) {
        console.error("Error registering token:", error);
        return null;
    }
};

const findToken = async (refreshToken) => {
    try {      
        return await Token.findOne({ token: refreshToken });
    } catch (error) {
        console.error("Error finding token:", error);
        return null;
    }
};

const deleteToken = async (refreshToken) => {
    try {   
        await Token.deleteOne({ token: refreshToken });
        return true;
    } catch (error) {
        console.error("Error deleting token:", error);
        return null;
    }
};

module.exports = { registerUser, findUser, registerToken, findToken, deleteToken };
