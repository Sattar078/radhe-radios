import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    requirement_type: {
      type: String,
      default: 'General Inquiry',
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    message: {
      type: String,
      default: '',
      trim: true,
    },
    source: {
      type: String,
      enum: ['contact_page', 'dealership_desk', 'quick_bar', 'product_modal'],
      default: 'contact_page',
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['New', 'In Review', 'Contacted', 'Resolved'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

contactMessageSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  obj.date = obj.createdAt ? obj.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  delete obj.__v;
  return obj;
};

const ContactMessage =
  mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);
export default ContactMessage;

