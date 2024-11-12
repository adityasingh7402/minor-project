import connectDb from '../../middleware/mongoose';
import NGO from '../../models/NGO_List'; // Adjust the path based on your project structure

// Connect to MongoDB
connectDb();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { ngoId } = req.query;

    if (!ngoId) {
      return res.status(400).json({ message: 'NGO ID is required' });
    }

    try {
      const ngo = await NGO.findById(ngoId);
      
      if (!ngo) {
        return res.status(404).json({ message: 'NGO not found' });
      }

      // Return the NGO details
      res.status(200).json(ngo);
    } catch (error) {
      console.error('Error fetching NGO details:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
