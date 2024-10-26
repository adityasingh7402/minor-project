import connectDb from '../../middleware/mongoose';
import Ngo from '../../models/NGO_List';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import jwt from 'jsonwebtoken'; // Import JWT for token generation

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb', // Adjust as needed
    },
  },
};

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find the volunteer by email
      const ngo = await Ngo.findOne({ email });
      if (!ngo) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, ngo.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate a JWT token
      const token = jwt.sign({ ngoId: ngo._id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expiration time
      });

      res.status(200).json({ token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default connectDb(handler);
