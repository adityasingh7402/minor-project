// pages/api/Admin_Login.js
import connectDb from '../../middleware/mongoose';
import Admin from '../../models/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    console.log(email, password)
    try {
      // Find the admin by email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // Check the password
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // Generate JWT
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Return the token
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default connectDb(handler);
