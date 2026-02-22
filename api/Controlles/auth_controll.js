import User from '../Models/user_Model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/errors.js';
import jwt from 'jsonwebtoken';
export const signUp = async (req, res , next) => {
    const { username, email, password } = req.body;
    // here i am hashing the password using bcrypt before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword }) ;
    // Here you would typically add logic to save the user to a database
    // For demonstration, we'll just return the received data
    try {
        await newUser.save();
        // Exclude the password from the response
   const { password: pass, ...rest } = newUser._doc;
res.status(201).json({ message: "User registered successfully", user: rest });
     } catch (error) {
        next(errorHandler(500, 'Error registering user'));
    }

}


// signIn function to handle user login
export const signIn = async (req, res, next) => {
    const { email, password } = req.body;   
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(errorHandler(401, 'Invalid password'));
        }
        // Exclude the password from the response
        // Here we are using destructuring to exclude the password field from the user object before sending the response
        const { password: pass, ...rest } = user._doc;
        // Generate JWT token
        // Here we are generating a JWT token using the jsonwebtoken library. The token includes the user's ID and is signed with a secret key from the environment variables. The token is then sent back to the client in an HTTP-only cookie for security.
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie("access_token", token,
            { httpOnly: true }).status(200).json({ message: "User signed in successfully", user: rest });

    } catch (error) {
        next(errorHandler(500, 'Error signing in user'));
    }
}   