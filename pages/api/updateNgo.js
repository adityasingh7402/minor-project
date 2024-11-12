import connectDb from '../../middleware/mongoose';
import cloudinary from 'cloudinary';
import { IncomingForm } from 'formidable';
import bcrypt from 'bcryptjs'; // Updated to bcryptjs
import NGO_List from '../../models/NGO_List';

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
  if (req.method === 'PUT') { // Change to PUT for update
    const form = new IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'File upload failed', details: err.message });
      }

      try {
        const getStringValue = (field) => Array.isArray(field) ? field[0] : field;

        // Extract fields
        const {
          _id, // NGO ID for updating
          approval, // Approval status to update
          name,
          email,
          message,
          ngoName,
          contactNo,
          managerName,
          managerContactNo,
          address,
          ngoType,
          websiteLink,
          password, // Password can be updated
        } = fields;

        // Hash the new password only if it is provided
        let hashedPassword = null;
        if (password) {
          hashedPassword = await bcrypt.hash(getStringValue(password), 10);
        }

        // Handle file uploads for NGO images
        const ngoImagesFiles = files.ngoImages || [];
        const ngoImages = [];

        // Process image uploads
        for (const file of (Array.isArray(ngoImagesFiles) ? ngoImagesFiles : [ngoImagesFiles])) {
          if (file.filepath) {
            const result = await cloudinary.uploader.upload(file.filepath);
            ngoImages.push(result.secure_url);
          }
        }

        // Prepare the update data object
        const updateData = {
          name: getStringValue(name),
          email: getStringValue(email),
          message: getStringValue(message),
          ngoName: getStringValue(ngoName),
          contactNo: getStringValue(contactNo),
          managerName: getStringValue(managerName),
          managerContactNo: getStringValue(managerContactNo),
          address: getStringValue(address),
          ngoType: getStringValue(ngoType),
          websiteLink: getStringValue(websiteLink),
          ngoImages: ngoImages.length > 0 ? ngoImages : undefined, // Include images if present
          approval: getStringValue(approval), // Add approval state to update
        };

        // Include hashed password if updated
        if (hashedPassword) {
          updateData.password = hashedPassword;
        }

        // Update NGO in the database
        const updatedNGO = await NGO_List.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedNGO) {
          return res.status(404).json({ error: 'NGO not found' });
        }

        res.status(200).json({ success: "NGO information updated successfully", updatedNGO });
      } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
      }
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default connectDb(handler);
