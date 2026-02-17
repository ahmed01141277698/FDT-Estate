const { Schema } = require("mongoose");
const mongoose = require('mongoose');

const userSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        required: true
    }
})  
const User = mongoose.model('User', userSchema);

module.exports = User;  