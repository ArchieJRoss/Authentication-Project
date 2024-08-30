const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

mongoose.connect('mongodb://localhost:27017/usersauth')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
});
const User = mongoose.model('User', UserSchema);

app.use(express.json());

app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User registered');
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Server error');
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid credentials');
        }
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, '6242fed13f250c50c527908e89a4812ab6a43942ef5db95971e7d82bbb7dd2f5');
        res.json({ token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Server error');
    }
});

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Unauthorized: No token provided.');
    }
    try {
        const decoded = jwt.verify(token, '6242fed13f250c50c527908e89a4812ab6a43942ef5db95971e7d82bbb7dd2f5');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send('Unauthorized: Invalid token.');
    }
};

app.get('/api/protected', authMiddleware, (req, res) => {
    res.send('This is a protected route.');
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});
