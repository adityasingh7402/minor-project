import { IncomingForm } from 'formidable';
import cloudinary from 'cloudinary';
import connectDb from '../../middleware/mongoose';
import Donation_List from '../../models/Donation_List';

// Configure Cloudinary
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
        const { name, emailPhone, address, option, donorPurpose } = fields;

        // Handle optional file upload
        const paymentScreenshotFile = files.paymentScreenshot && files.paymentScreenshot[0];
        let paymentScreenshot = null;

        if (paymentScreenshotFile) {
          // Upload file to Cloudinary
          const result = await cloudinary.uploader.upload(paymentScreenshotFile.filepath);
          paymentScreenshot = result.secure_url;
        }

        // Ensure all fields are strings
        const nameStr = Array.isArray(name) ? name[0] : name;
        const emailPhoneStr = Array.isArray(emailPhone) ? emailPhone[0] : emailPhone;
        const addressStr = Array.isArray(address) ? address[0] : address;
        const optionStr = Array.isArray(option) ? option[0] : option;
        const donorPurposeStr = Array.isArray(donorPurpose) ? donorPurpose[0] : donorPurpose;

        // Create and save the new donation record
        const newDonation = new Donation_List({
          name: nameStr,
          emailPhone: emailPhoneStr,
          address: addressStr,
          option: optionStr,
          paymentScreenshot,
          donorPurpose: donorPurposeStr,
        });

        await newDonation.save();

        res.status(200).json({ success: "Donation information saved successfully" });
      } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
      }
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default connectDb(handler);
