import connectDb from '../../middleware/mongoose';
import Ngo from '../../models/NGO_List';
import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ error: 'No token provided' });

      const token = authHeader.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'No token provided' });

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) return res.status(401).json({ error: 'Invalid token' });

      // Fetch user profile
      const ngo = await Ngo.findById(decoded.ngoId);
      if (!ngo) return res.status(404).json({ error: 'NGO not found' });

      res.status(200).json(ngo);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default connectDb(handler);
