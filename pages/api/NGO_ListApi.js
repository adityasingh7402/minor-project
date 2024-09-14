import connectDb from '../../middleware/mongoose';
import cloudinary from 'cloudinary';
import { IncomingForm } from 'formidable';
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
  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'File upload failed', details: err.message });
      }

      try {
        // Extract single values and convert arrays to strings if necessary
        const getStringValue = (field) => Array.isArray(field) ? field[0] : field;

        const {
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
        } = fields;

        // Handle file uploads
        const ngoImagesFiles = files.ngoImages || [];
        const ngoImages = [];

        for (const file of (Array.isArray(ngoImagesFiles) ? ngoImagesFiles : [ngoImagesFiles])) {
          if (file.filepath) {
            const result = await cloudinary.uploader.upload(file.filepath);
            ngoImages.push(result.secure_url);
          }
        }

        // Create and save the new NGO record
        const newNGO = new NGO_List({
          name: getStringValue(name),
          email: getStringValue(email),
          message: getStringValue(message),
          ngoName: getStringValue(ngoName),
          contactNo: getStringValue(contactNo),
          managerName: getStringValue(managerName),
          managerContactNo: getStringValue(managerContactNo),
          address: getStringValue(address),
          ngoType: getStringValue(ngoType),
          ngoImages,
          websiteLink: getStringValue(websiteLink),
        });

        await newNGO.save();

        res.status(200).json({ success: "NGO information saved successfully" });
      } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
      }
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default connectDb(handler);
