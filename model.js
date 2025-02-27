const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 40
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    password: {
        type: String,
        required: true
    }
});

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }
});

const postSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    content : {
        type : String,
        required : true,
        maxlength : 250
    },
    addedAt : {
        type : Date,
        default : new Date()
    },
    author : {
        type : String,
        required : true
    }
})

const userModel = mongoose.model('users', userSchema);
const refreshTokenModel = mongoose.model('refreshTokens', refreshTokenSchema);
const postModel = mongoose.model('posts', postSchema);

module.exports = { userModel, refreshTokenModel, postModel };
