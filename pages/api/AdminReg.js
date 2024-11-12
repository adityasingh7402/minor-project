// pages/api/admin.js
import connectDb from '../../middleware/mongoose';
import Admin from '../../models/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // Check if admin already exists
      let admin = await Admin.findOne({ email });

      if (!admin) {
        // If admin doesn't exist, create a new admin
        const newAdmin = new Admin({
          email,
          password, // This will be hashed automatically in the model's pre-save hook
        });
        await newAdmin.save();

        return res.status(201).json({ message: 'Admin registered successfully' });
      } else {
        // Admin login process
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Generate JWT token for admin login
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });

        res.status(200).json({ message: 'Login successful', token });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default connectDb(handler);
