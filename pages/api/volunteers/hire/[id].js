import connectDb from '../../../../middleware/mongoose';
import VolunteerHire from '../../../../models/VolunteerHire';
import Volunteer from '../../../../models/Volunteer';
import NGO_List from '../../../../models/NGO_List';

const handler = async (req, res) => {
    const { id } = req.query; // Volunteer ID from the query
    const { ngoId } = req.body; // NGO ID from the body (sent by the admin)

    console.log('Request Body:', req.body); // Log the body to verify ngoId is present

    if (req.method === 'POST') {
        try {
            // Fetch the volunteer by ID
            const volunteer = await Volunteer.findById(id);

            if (!volunteer) {
                return res.status(404).json({ error: 'Volunteer not found' });
            }

            // Fetch the NGO by ID
            const ngo = await NGO_List.findById(ngoId);

            if (!ngo) {
                return res.status(404).json({ error: 'NGO not found' });
            }

            // Create a new hire record
            const hireRequest = new VolunteerHire({
                volunteerId: volunteer._id,
                ngoId: ngo._id,
                status: 'Pending', // Initial status is pending
            });

            await hireRequest.save(); // Save the hire request

            res.status(200).json({ message: 'Hire request successfully created', hireRequest });
        } catch (error) {
            console.error('Error hiring volunteer:', error);
            res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};

export default connectDb(handler);
