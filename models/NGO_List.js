import mongoose from 'mongoose';

let NGO_List;

try {
  NGO_List = mongoose.model('NGO_List');
} catch {
  const NGO_ListSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true // Unique constraint for email
    },
    message: {
      type: String,
      required: true
    },
    ngoName: {
      type: String,
      required: true,
      unique: true // Unique constraint for ngoName
    },
    contactNo: {
      type: String,
      required: true,
      unique: true // Unique constraint for contactNo
    },
    managerName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    capital: {
      type: String,
      required: true
    },
    managerContactNo: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    ngoType: {
      type: String,
      enum: [
        'charitable', 'service', 'participatory', 'empowering'
      ],
      required: true
    },
    ngoImages: {
      type: [String], // Array of image URLs
      required: false,
      validate: {
        validator: function(v) {
          return Array.isArray(v) && v.length === new Set(v).size; // Check for uniqueness
        },
        message: 'Duplicate image URLs are not allowed'
      }
    },
    websiteLink: {
      type: String,
      required: false
    },
    approval: {
      type: String,
      enum: ['Pending', 'Approved', 'Reject'],
      default: 'Pending',
      required: true
    }
  });

  // Ensure indexes for unique fields are created
  NGO_ListSchema.index({ ngoName: 1 }, { unique: true });
  NGO_ListSchema.index({ contactNo: 1 }, { unique: true });
  NGO_ListSchema.index({ email: 1 }, { unique: true });

  NGO_List = mongoose.model('NGO_List', NGO_ListSchema);
}

export default NGO_List;
