import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    recipient_name: {
      type: String,
      default: '',
    },
    recipient_phone: {
      type: String,
      default: '',
    },
    recipient_email: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['whatsapp', 'email', 'both'],
      default: 'whatsapp',
    },
    subject: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['dispatched', 'delivered', 'pending', 'failed'],
      default: 'dispatched',
    },
    sent_by: {
      type: String,
      default: 'Rajesh Workshop Admin',
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  obj.date = obj.createdAt ? obj.createdAt.toISOString() : new Date().toISOString();
  delete obj.__v;
  return obj;
};

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;

