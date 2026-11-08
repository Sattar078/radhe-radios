import mongoose from 'mongoose';

const downloadItemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    title_hindi: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      default: 'PDF',
    },
    size: {
      type: String,
      default: '5 MB',
    },
    category: {
      type: String,
      default: 'Catalog',
    },
    file_url: {
      type: String,
      default: '',
    },
    tier_required: {
      type: String,
      enum: ['public', 'auth_required', 'dealer_only'],
      default: 'auth_required',
    },
    download_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

downloadItemSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const DownloadItem =
  mongoose.models.DownloadItem || mongoose.model('DownloadItem', downloadItemSchema);

const SEED_DOWNLOADS = [
  {
    id: 'dl-pricelist-2026',
    title: 'Radhe Radios 2026 Wholesale Price Matrix & Factory Margins',
    title_hindi: 'राधे रेडियोज़ 2026 संपूर्ण डीजे रेट लिस्ट व फैक्ट्री मार्जिन',
    format: 'PDF',
    size: '4.8 MB',
    category: 'Price List',
    tier_required: 'auth_required',
    download_count: 142,
  },
  {
    id: 'dl-18inch-schematics',
    title: 'Dual 18" Subwoofer Acoustic Blueprints & Crossover DSP Curves',
    title_hindi: '18 इंच डबल बेस कैबिनेट नाप व डीएसपी क्रॉसओवर सेटिंग्स',
    format: 'PDF / CAD',
    size: '18.4 MB',
    category: 'Technical Blueprints',
    tier_required: 'auth_required',
    download_count: 98,
  },
  {
    id: 'dl-class-a-amp-wiring',
    title: 'Made in India Class-A Power Amplifier Wiring & Heatsink Thermal Specs',
    title_hindi: 'मेड इन इंडिया क्लास-ए पावर एंपलीफायर वायरिंग व थर्मल विवरण',
    format: 'PDF Spec',
    size: '6.2 MB',
    category: 'Technical Blueprints',
    tier_required: 'auth_required',
    download_count: 75,
  },
  {
    id: 'dl-vehicle-sound-guide',
    title: 'Vehicle & Tractor Audio Installation Guide (12V/24V Heavy Duty)',
    title_hindi: 'गाड़ी व ट्रैक्टर साउंड सिस्टम 12V/24V फिटिंग गाइड',
    format: 'PDF',
    size: '7.1 MB',
    category: 'Installation Guide',
    tier_required: 'public',
    download_count: 210,
  },
];

export async function seedDownloads() {
  try {
    const count = await DownloadItem.countDocuments();
    if (count === 0) {
      await DownloadItem.insertMany(SEED_DOWNLOADS);
      console.log('✅ Technical blueprints & downloads seeded to MongoDB');
    }
  } catch (err) {
    console.error('Error seeding downloads:', err.message);
  }
}

export default DownloadItem;

