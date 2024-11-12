import mongoose from 'mongoose';

let Volunteer;

try {
  Volunteer = mongoose.model('Volunteer');
} catch {
  const VolunteerSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: false, // Address is optional
    },
    qualification: {
      type: String,
      required: true,
    },
    purposeAim: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false, // URL or path to photo, optional
    },
    approval: {
      type: String,
      enum: ['Pending', 'Approved', 'Reject'],
      default: 'Pending',
      required: true
    },
  });

  // Ensure index for unique fields is created
  VolunteerSchema.index({ phoneNo: 1 }, { unique: true });

  Volunteer = mongoose.model('Volunteer', VolunteerSchema);
}

export default Volunteer;
