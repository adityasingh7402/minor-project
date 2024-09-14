import connectDb from '../../middleware/mongoose';
import cloudinary from 'cloudinary';
import { IncomingForm } from 'formidable';
import bcrypt from 'bcryptjs';
import Volunteer from '../../models/Volunteer';

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
  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'File upload failed', details: err.message });
      }

      try {
        const { name, phoneNo, email, address, qualification, purposeAim, password } = fields;

        // Handle optional photo upload
        const photoFile = files.photo && files.photo[0];
        let photoUrl = null;

        if (photoFile) {
          // Upload file to Cloudinary
          const result = await cloudinary.uploader.upload(photoFile.filepath);
          photoUrl = result.secure_url;
        }

        // Ensure all fields are strings
        const nameStr = Array.isArray(name) ? name[0] : name;
        const phoneNoStr = Array.isArray(phoneNo) ? phoneNo[0] : phoneNo;
        const emailStr = Array.isArray(email) ? email[0] : email;
        const addressStr = Array.isArray(address) ? address[0] : address;
        const qualificationStr = Array.isArray(qualification) ? qualification[0] : qualification;
        const purposeAimStr = Array.isArray(purposeAim) ? purposeAim[0] : purposeAim;
        const passwordStr = Array.isArray(password) ? password[0] : password;

        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passwordStr, salt);

        // Create and save the new volunteer record
        const newVolunteer = new Volunteer({
          name: nameStr,
          phoneNo: phoneNoStr,
          email: emailStr,
          address: addressStr,
          qualification: qualificationStr,
          purposeAim: purposeAimStr,
          password: hashedPassword, // Save the hashed password
          photo: photoUrl,
        });

        await newVolunteer.save();

        res.status(200).json({ success: "Volunteer registration successful" });
      } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
      }
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default connectDb(handler);
