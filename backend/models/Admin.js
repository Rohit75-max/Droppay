const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  fullName: { type: String, default: 'Master Node Operator' },
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
  avatar: { type: String, default: null },
  adminProfile: {
      title: { type: String, default: 'Security Engineer' },
      department: { type: String, default: 'Platform Governance' },
      bio: { type: String, default: 'Secure identity node for administrative operations.' },
      accessLevel: { type: Number, default: 1 }
  },
  lastLogin: { type: Date },
  lastLoginIP: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Hash password before saving
AdminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
AdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
