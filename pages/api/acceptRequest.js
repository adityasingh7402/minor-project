// pages/api/acceptRequest.js
import connectDb from '../../middleware/mongoose';
import VolunteerHire from '../../models/VolunteerHire';

export default async function handler(req, res) {
  await connectDb();

  if (req.method === 'GET') {
    const { volunteerId } = req.query;

    try {
      // Fetch the requests based on volunteerId
      const requests = await VolunteerHire.find({ volunteerId });

      if (!requests || requests.length === 0) {
        return res.status(404).json({ message: 'No requests found' });
      }

      res.status(200).json(requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  } else if (req.method === 'PUT') {
    const { requestId } = req.body;

    try {
      const hireRequest = await VolunteerHire.findById(requestId);

      if (!hireRequest) {
        return res.status(404).json({ message: 'Request not found' });
      }

      // Update the status to 'Accepted'
      hireRequest.status = 'Accepted';
      await hireRequest.save();

      res.status(200).json({ message: 'Request accepted successfully' });
    } catch (error) {
      console.error('Error accepting request:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
