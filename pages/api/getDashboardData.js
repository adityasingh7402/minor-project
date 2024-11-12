// pages/api/getDashboardData.js
import connectDb from '../../middleware/mongoose';
import Donation from '../../models/Donation_List';
import NGO from '../../models/NGO_List';
import Volunteer from '../../models/Volunteer';

connectDb();

export default async function handler(req, res) {
  try {
    const totalDonations = await Donation.countDocuments({});
    const totalNGOs = await NGO.countDocuments({});
    const totalVolunteers = await Volunteer.countDocuments({});

    // Fetch donation images
    const donationImages = await Donation.find({}, 'paymentScreenshot');

    res.status(200).json({
      totalDonations,
      totalNGOs,
      totalVolunteers,
      donationImages,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
}
