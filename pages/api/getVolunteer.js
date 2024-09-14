import connectDb from '../../middleware/mongoose';
import Volunteer_List from '../../models/Volunteer';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const Volunteer = await Volunteer_List.find();
      res.status(200).json(Volunteer);
    } catch (error) {
      console.error('Error fetching Volunteers:', error); // Log the error on the server
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default connectDb(handler);
