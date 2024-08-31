const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

  const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});
const User = mongoose.model('User', UserSchema);

module.exports = User;

app.use(express.json());

app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    if (!validator.isEmail(email)) {
        return res.status(400).send('Invalid email format');
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
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET);
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send('Unauthorized: Invalid token.');
    }
};

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).send('No user with that email');
      }

      // Generate a reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpires;

      await user.save();

      // Send email
      const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD
          }
      });

      const mailOptions = {
          to: user.email,
          from: process.env.EMAIL_USERNAME,
          subject: 'Password Reset',
          text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `http://localhost:3000/reset-password?token=${resetToken}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`
      };

      transporter.sendMail(mailOptions, (err) => {
          if (err) {
              console.error('Error sending email:', err);
              return res.status(500).send('Error sending email');
          }
          res.status(200).send('Password reset email sent');
      });
  } catch (err) {
      console.error('Error in forgot password:', err);
      res.status(500).send('Server error');
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
      const user = await User.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
          return res.status(400).send('Password reset token is invalid or has expired');
      }

      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();
      res.status(200).send('Password has been reset');
  } catch (err) {
      console.error('Error in reset password:', err);
      res.status(500).send('Server error');
  }
});

app.get('/api/protected', authMiddleware, (req, res) => {
    res.send('This is a protected route.');
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});
