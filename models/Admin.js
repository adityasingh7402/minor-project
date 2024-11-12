// models/Admin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

let Admin;

try {
  Admin = mongoose.model('Admin');
} catch {
  const AdminSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  });

  // Middleware to hash password before saving
  AdminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  });

  Admin = mongoose.model('Admin', AdminSchema);
}

export default Admin;
