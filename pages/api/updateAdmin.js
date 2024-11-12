// pages/api/updateAdmin.js
import connectDb from '../../middleware/mongoose';
import Admin from '../../models/Admin';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const handler = async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify the token directly here
    const secret = process.env.JWT_SECRET; // Your JWT secret
    const decoded = jwt.verify(token, secret);

    const { email, password } = req.body;

    // Check for the existence of an admin
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Update email and password (if provided)
    if (email) {
      admin.email = email;
    }
    if (password) {
      admin.password = await bcrypt.hash(password, 10); // Hash the new password
    }

    await admin.save();
    return res.status(200).json({ email: admin.email });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default connectDb(handler);
