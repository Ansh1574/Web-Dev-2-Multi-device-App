import express from 'express';
import User from '../models/userModel.js';
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { firstName, lastName, age, email, password } = req.body;

    try {
        console.log(req.body);
        // Check if user already exists by email or username
        const userExists = await User.findOne({ "email": `${email}` });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({ firstName, lastName, age, email, password });
        await newUser.save();
        
        // Respond with the new user data (excluding the password)
        res.status(201).json({ 
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            age: newUser.age,
            email: newUser.email
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the password matches
        const isMatch = await user.isPasswordMatch(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Respond with user data (excluding the password)
        res.json({ 
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
