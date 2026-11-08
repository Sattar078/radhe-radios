import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'DJ Operator',
    },
    company: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Rajasthan, India',
    },
    tier: {
      type: String,
      default: 'Registered Partner',
    },
    avatar: {
      type: String,
      default: 'RS',
    },
    adminApproved: {
      type: Boolean,
      default: false,
    },
    adminRequested: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Method to return user representation without sensitive fields
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj.password_hash;
  delete obj.__v;
  const roleLower = (obj.role || '').toLowerCase();
  obj.isSuperAdmin = roleLower === 'super_admin' || roleLower === 'super admin' || obj.phone === '9887158522';
  obj.isAdmin = obj.isSuperAdmin || (roleLower === 'admin' && obj.adminApproved === true);
  return obj;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

/**
 * Seed default Admin account if not already present
 */
export async function seedAdminUser() {
  try {
    const adminUser = await User.findOne({
      $or: [{ role: 'super_admin' }, { role: 'Admin' }, { email: 'superadmin@radheradios.com' }, { email: 'admin@radheradios.com' }, { phone: '9887158522' }],
    });

    if (!adminUser) {
      const hash = await bcrypt.hash('adminpassword123', 12);
      await User.create({
        name: 'Rajesh Sharma (Super Admin)',
        phone: '9887158522',
        email: 'superadmin@radheradios.com',
        password_hash: hash,
        role: 'super_admin',
        adminApproved: true,
        adminRequested: false,
        company: 'Radhe Radios Headquarters',
        location: 'Transport Nagar, Kota, Rajasthan',
        tier: 'Workshop Master & Super Administrator',
        avatar: 'SA',
      });
      console.log('✅ Super Admin account seeded: superadmin@radheradios.com / 9887158522');
    } else {
      // Ensure super_admin role and approvals are present on master account
      adminUser.role = 'super_admin';
      adminUser.adminApproved = true;
      if (!adminUser.email) adminUser.email = 'superadmin@radheradios.com';
      await adminUser.save();
    }
  } catch (err) {
    console.error('Error seeding admin user:', err.message);
  }
}

export default User;
