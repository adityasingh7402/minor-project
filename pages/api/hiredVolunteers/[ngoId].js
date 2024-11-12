// routes/api/hiredVolunteers/[ngoId].js
import connectDb from '../../../middleware/mongoose';
import VolunteerHire from '../../../models/VolunteerHire'; // VolunteerHire model

export default async function handler(req, res) {
  const { ngoId } = req.query;
  console.log(ngoId)

  await connectDb();

  if (req.method === 'GET') {
    // Fetch all hired volunteers for a specific NGO
    try {
      const hiredVolunteers = await VolunteerHire.find({ ngoId });
      res.status(200).json(hiredVolunteers);
      // console.log(hiredVolunteers)
    } catch (error) {
      console.error('Error fetching hired volunteers:', error);
      res.status(500).json({ error: 'Failed to fetch hired volunteers' });
    }
  } else if (req.method === 'DELETE') {
    // Delete a hired volunteer by hireId
    const { hireId } = req.body; // Expect hireId in the request body for DELETE

    if (!hireId) {
      return res.status(400).json({ error: 'hireId is required to delete a volunteer' });
    }

    try {
      const deletedVolunteer = await VolunteerHire.findByIdAndDelete(hireId);
      if (!deletedVolunteer) {
        return res.status(404).json({ error: 'Volunteer not found' });
      }
      res.status(200).json({ message: 'Volunteer removed successfully' });
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      res.status(500).json({ error: 'Failed to remove volunteer' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
