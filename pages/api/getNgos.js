import connectDb from '../../middleware/mongoose';
import NGO_List from '../../models/NGO_List';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const ngos = await NGO_List.find();
      res.status(200).json(ngos);
    } catch (error) {
      console.error('Error fetching NGOs:', error); // Log the error on the server
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default connectDb(handler);
