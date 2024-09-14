import connectDb from '../../middleware/mongoose';
import cloudinary from 'cloudinary';
import { IncomingForm } from 'formidable';
import Volunteer from '../../models/Volunteer';
import jwt from 'jsonwebtoken';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method === 'PUT') {
    const form = new IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'File upload failed', details: err.message });
      }

      try {
        const { name, phoneNo, address, qualification, purposeAim, _id } = fields;
        const photoFile = files.profilePhoto && files.profilePhoto[0]; // Handle file upload
        let photoUrl = null;

        // Handle optional photo upload
        if (photoFile) {
          try {
            const result = await cloudinary.uploader.upload(photoFile.filepath);
            photoUrl = result.secure_url;
          } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            return res.status(500).json({ error: 'Failed to upload photo to Cloudinary' });
          }
        } else {
          // If no new photo is provided, keep the existing photo URL
          const volunteer = await Volunteer.findById(_id[0]); // Assuming _id is passed as an array
          if (volunteer) {
            photoUrl = volunteer.photo; // Retain existing photo URL
          }
        }

        // Prepare update data
        const updateData = {
          name: Array.isArray(name) ? name[0] : name,
          phoneNo: Array.isArray(phoneNo) ? phoneNo[0] : phoneNo,
          address: Array.isArray(address) ? address[0] : address,
          qualification: Array.isArray(qualification) ? qualification[0] : qualification,
          purposeAim: Array.isArray(purposeAim) ? purposeAim[0] : purposeAim,
          photo: photoUrl,
        };

        // Extract token from Authorization header
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ error: 'No token provided' });

        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });

        // Verify token
        let decoded;
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
          return res.status(401).json({ error: 'Invalid token' });
        }

        // Update volunteer profile
        const volunteer = await Volunteer.findByIdAndUpdate(decoded.volunteerId, updateData, { new: true });
        if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });

        res.status(200).json(volunteer);
      } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
      }
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default connectDb(handler);
