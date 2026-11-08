import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    system: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'Awaiting Engineering Review',
    },
    priority: {
      type: String,
      default: 'Standard',
    },
    est_delivery: {
      type: String,
      default: 'Estimated 3-5 days delivery',
    },
    amount: {
      type: Number,
      default: 45000,
    },
    payment_status: {
      type: String,
      enum: ['Pending', 'Advance Received', 'Paid in Full', 'Refunded'],
      default: 'Pending',
    },
    customer_name: {
      type: String,
      default: '',
    },
    customer_phone: {
      type: String,
      default: '',
    },
    customer_email: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// High-concurrency query optimization indexes
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ customer_phone: 1, createdAt: -1 });
inquirySchema.index({ createdAt: -1 });

inquirySchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  obj.date = obj.createdAt ? obj.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  delete obj.__v;
  return obj;
};

const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
