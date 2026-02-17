import User from '../Models/user_Model.js';

export const signUp = async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password }) ;
    // Here you would typically add logic to save the user to a database
    // For demonstration, we'll just return the received data
await newUser.save();
    res.status(201).json({ message: 'User registered successfully', User: newUser });
}
