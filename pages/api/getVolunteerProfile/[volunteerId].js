// pages/api/getVolunteerProfile/[volunteerId].js
import connectDb from '../../../middleware/mongoose'; // Assuming you have a utility for DB connection
import Volunteer from '../../../models/Volunteer';  // Import the Volunteer model

export default async function handler(req, res) {
  const { volunteerId } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Connect to the database
    await connectDb();

    // Find the volunteer by ID
    const volunteer = await Volunteer.findById(volunteerId);

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    // Respond with volunteer data
    res.status(200).json(volunteer);
  } catch (error) {
    console.error('Error fetching volunteer profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
