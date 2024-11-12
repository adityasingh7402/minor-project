import mongoose from 'mongoose';

let Donation_List;

try {
  Donation_List = mongoose.model('Donation_List');
} catch {
  const Donation_ListSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    emailPhone: {
      type: String,
      required: true, // Unique constraint for email or phone
    },
    address: {
      type: String,
      required: false // Address is optional
    },
    option: {
      type: String,
      enum: ['Money', 'Food', 'Things'], // Enum for donation options
      required: true
    },
    paymentScreenshot: {
      type: String,
      required: false // URL or path to payment screenshot, optional
    },
    donorPurpose: {
      type: String,
      required: true
    },
    approval: {
      type: String,
      enum: ['Pending', 'Approved', 'Reject'],
      default: 'Pending',
      required: true
    },
  });

  // Ensure index for unique fields is created
  Donation_ListSchema.index({ emailPhone: 1 }, { unique: true });

  Donation_List = mongoose.model('Donation_List', Donation_ListSchema);
}

export default Donation_List;
