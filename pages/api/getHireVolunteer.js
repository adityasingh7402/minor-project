import connectDb from '../../middleware/mongoose';
import VolunteerHire from '../../models/VolunteerHire';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const volunteer = await VolunteerHire.find();
      res.status(200).json(volunteer);
    } catch (error) {
      console.error('Error fetching Volunteers:', error); // Log the error on the server
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default connectDb(handler);
