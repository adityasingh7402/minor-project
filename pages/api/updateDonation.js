// pages/api/updateDonation.js
import connectDb from '../../middleware/mongoose';
import Donation from '../../models/Donation_List';

const updateDonationStatus = async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { _id, approval } = req.body;

  if (!['Pending', 'Approved', 'Rejected'].includes(approval)) {
    return res.status(400).json({ error: 'Invalid approval status' });
  }

  try {
    const donation = await Donation.findByIdAndUpdate(
      _id,
      { approval },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    res.status(200).json({ success: `Approval status updated to ${approval}` });
  } catch (error) {
    console.error('Error updating approval status:', error);
    res.status(500).json({ error: 'Failed to update approval status' });
  }
};

export default connectDb(updateDonationStatus);
