import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    author_name: {
      type: String,
      required: true,
      trim: true,
    },
    author_role: {
      type: String,
      default: 'DJ Operator',
    },
    location: {
      type: String,
      default: 'Rajasthan',
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    bass_power: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    clarity: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    product_id: {
      type: String,
      default: null,
    },
    is_verified: {
      type: Boolean,
      default: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// High-concurrency query optimization indexes
reviewSchema.index({ is_verified: 1, rating: -1, createdAt: -1 });
reviewSchema.index({ product_id: 1, createdAt: -1 });

reviewSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  obj.date = obj.createdAt ? obj.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  delete obj.__v;
  return obj;
};

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

const SEED_REVIEWS = [
  {
    author_name: 'Mukesh Gurjar',
    author_role: 'Gurjar DJ Sound Kota',
    location: 'Kota, Rajasthan',
    rating: 5,
    title: 'True Paisa Vasool Bass, Shakes the Ground!',
    comment:
      'Bought the 18-inch dual bass and Class-A amplifier directly from the Kota workshop. It throws clean sound and punchy bass up to 500 meters across open grounds. Zero overheating issues even during peak hours.',
    bass_power: 5,
    clarity: 5,
    product_id: 'dual-18-bass',
    is_verified: true,
  },
  {
    author_name: 'Kailash Meena',
    author_role: 'Royal Sound Services',
    location: 'Jaipur, Rajasthan',
    rating: 5,
    title: 'Top-tier Class-A Made in India Amplifier',
    comment:
      'The heatsink performance on Radhe Radios amplifiers is unmatched. Ran it for 8 hours non-stop at peak DJ load without any protection trip. Real Indian engineering.',
    bass_power: 5,
    clarity: 5,
    product_id: 'radhe-class-a-amp',
    is_verified: true,
  },
  {
    author_name: 'Surendra Singh Rathore',
    author_role: 'Thakur DJ & Events',
    location: 'Bundi, Rajasthan',
    rating: 5,
    title: 'Exceptional Vehicle Fitting and Finish',
    comment:
      'Built a full 4-bass sound system for our pickup truck. There is zero cabin body rattling and the waterproof reinforced birch plywood cabinet quality is rock-solid.',
    bass_power: 5,
    clarity: 5,
    product_id: 'vehicle-sound-system',
    is_verified: true,
  },
];

export async function seedReviews() {
  try {
    const count = await Review.countDocuments();
    if (count === 0) {
      await Review.insertMany(SEED_REVIEWS);
      console.log('✅ DJ reviews & ratings seeded to MongoDB');
    } else {
      for (const rev of SEED_REVIEWS) {
        await Review.updateOne(
          { author_name: rev.author_name },
          { $set: { title: rev.title, comment: rev.comment } }
        );
      }
    }
  } catch (err) {
    console.error('Error seeding reviews:', err.message);
  }
}

export default Review;

