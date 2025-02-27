const mongoose = require('mongoose');
const User = require('./model').userModel;
const Token = require('./model').refreshTokenModel;
const Post = require('./model').postModel;

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

const createPost = async (postData) => {
    try {
        let newPost = await Post.create({
            title : postData.title,
            content : postData.content,
            author : postData.author
        })

        return newPost;
    } catch (error) {
        console.log('Error registering post : ', error);
        return null;
    }
}

const getAllPosts = async () => {
    try {
        let posts = await Post.find();
        return posts;
    } catch (error) {
        console.log('An error occured when searching posts : ', error);
        return null;
    }
}

const updatePost = async (id, author, newPostData) => {
    try {
        let postUpdated = await Post.updateOne({_id : id, author : author}, {
            $set : {
                title : newPostData.title,
                content : newPostData.content
            }
        })

        return postUpdated;
    } catch (error) {
        console.log('Error updating post : ', error);
        return null;
    }
}

const deletePost = async (id, author) => {
    try {
        await Post.deleteOne({ _id : id, author : author });
        return true;
    } catch (error) {
        console.log('Error deleting post : ', error);
        return false;
    }
}

module.exports = { registerUser, findUser, registerToken, findToken, deleteToken, createPost, getAllPosts, updatePost, deletePost };
