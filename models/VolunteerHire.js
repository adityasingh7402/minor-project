import mongoose from 'mongoose';

let VolunteerHire;

try {
  VolunteerHire = mongoose.model('VolunteerHire');
} catch {
  const VolunteerHireSchema = new mongoose.Schema({
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Volunteer',
      required: true
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO_List',
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
      required: true
    },
    hireDate: {
      type: Date,
      default: Date.now,
    }
  });

  VolunteerHire = mongoose.model('VolunteerHire', VolunteerHireSchema);
}

export default VolunteerHire;
