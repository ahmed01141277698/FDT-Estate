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
  url: {
    type: String,
    default: "رابط الصورة الافتراضية"
  },
  public_id: {
    type: String,
    default: null
  }
},
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
}, { timestamps: true });  
const User = mongoose.model('User', userSchema);

export default User;