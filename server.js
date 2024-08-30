const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const mongoose = require('mongoose');
const { type } = require('@testing-library/user-event/dist/type');

mongoose.connect('mongodb://localhost:27017/usersauth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

app.use(express.json());

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send('Unauthorized: No token provided.');
    }
    try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).send('Unauthorized: Invalid token.');
    }
  };

const users = [];

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: { type: String, default: 'user' }
});
const User = mongoose.model('User', UserSchema);

module.exports = User;

const User = require('./models/User');

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
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
      const user = await User.findOne({ email }); // Find the user by email
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
      }
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, 'your_jwt_secret');
      res.json({ token });
    } catch (err) {
      console.error('Error logging in:', err);
      res.status(500).send('Server error');
    }
  });
  

app.get('/api/protected', authMiddleware, (req, res) => {
    res.send('This is a protected route.');
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});

