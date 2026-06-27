import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
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
        type: String,   
        required: true
    },
    avatar: {
        type: String,
        default: "https://www.istockphoto.com/photo/mountain-landscape-gm517188688-89380423"
    },
    // isVerified: {
    //     type: Boolean,
    //     default: false,
    // },
    // verificationToken: {
    //     type: String,
    // },
}, { timestamps: true });  
const User = mongoose.model('User', userSchema);

export default User;