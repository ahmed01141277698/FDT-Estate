import User from '../Models/user_Model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/errors.js';

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
