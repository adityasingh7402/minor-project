// pages/api/adminProfile.js
import connectDb from '../../middleware/mongoose';
import Admin from '../../models/Admin';
import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
  if (req.method !== 'GET') {
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

    const admin = await Admin.findById(decoded.id).select('email');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    return res.status(200).json(admin);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default connectDb(handler);
