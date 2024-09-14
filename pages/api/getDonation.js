import connectDb from '../../middleware/mongoose';
import Donation_List from '../../models/Donation_List';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const donation = await Donation_List.find();
      res.status(200).json(donation);
    } catch (error) {
      console.error('Error fetching Donations:', error); // Log the error on the server
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default connectDb(handler);
