import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 35000,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    specs: {
      powerHandling: String,
      driverSize: String,
      frequencyRange: String,
      enclosure: String,
      impedance: String,
      cooling: String,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const SEED_PRODUCTS = [
  {
    id: 'radhe-class-a-amp',
    title: 'Radhe Signature Heavy-Duty Power Amplifier',
    category: 'Custom Power Amplifiers',
    badge: 'Flagship Amplifier',
    description:
      'Our pride: 100% Made in India heavy power amplifier. Built with oversized heatsinks, high-grade capacitors, and clean Class-A sound architecture for thunderous bass and crystal vocals.',
    image: '/frames/frame_0180.jpg',
    tags: ['Made in India', 'Heavy Heatsink', 'Zero Distortion', 'Class-A Sound'],
    specs: {
      powerHandling: 'High-Current Class-A Power Output',
      driverSize: 'Heavy Toroidal Transformer + Dual Heatsinks',
      frequencyRange: '15Hz - 25,000Hz Ultra-Clean Spectrum',
      enclosure: 'Powder-Coated Industrial Steel Chassis',
    },
  },
  {
    id: 'vehicle-sound-system',
    title: 'Custom High-Performance Vehicle Audio Setup',
    category: 'Vehicle Audio Setups',
    badge: 'Paisa Vasool',
    description:
      'Specially designed for cars, pickups, and tractors. Delivers deep, chest-thumping bass on rough roads without distortion or battery drain.',
    image: '/frames/frame_0320.jpg',
    tags: ['Vehicle Ready', 'Paisa Vasool', 'Heavy Vibration Proof'],
    specs: {
      powerHandling: 'High-Efficiency 12V/24V Power Draw',
      driverSize: 'Custom Heavy Subwoofer + Mid-Range Pods',
      frequencyRange: 'Tight Punchy Lows & Crisp Vocals',
      enclosure: 'Vibration-Damped Reinforced Body',
    },
  },
  {
    id: 'dual-18-bass',
    title: 'Dual 18" Professional Heavy Bass Cabinet',
    category: 'Heavy Bass Speakers',
    badge: 'Massive Bass',
    description:
      'Massive bass output engineered for open grounds, roadshows, and events. High-density wooden cabinet ensures zero rattle at peak volume.',
    image: '/frames/frame_0450.jpg',
    tags: ['Massive Bass', 'Pure Copper Coil', 'Reinforced Wood'],
    specs: {
      powerHandling: 'Peak High-SPL Handling Capacity',
      driverSize: 'Dual 18" High-Excursion Drivers',
      frequencyRange: 'Deep Sub-Bass (28Hz - 160Hz)',
      enclosure: 'High-Density Waterproof Cabinet',
    },
  },
  {
    id: 'professional-rig',
    title: 'Radhe Radios Full Professional Sound System',
    category: 'Professional Sound Rigs',
    badge: 'Turnkey Sound',
    description:
      'Complete turnkey audio solution matching Radhe Radios Made in India amplifiers with professional speaker rigs for events, venues, and sound operators.',
    image: '/frames/frame_0580.jpg',
    tags: ['Turnkey Rig', 'Matched Amps', 'Complete Cables'],
    specs: {
      powerHandling: 'High-Decibel Concert Level',
      driverSize: 'Amplifier Rack + Subwoofers + Mid-Tops',
      frequencyRange: 'Full Spectrum Acoustic Response',
      enclosure: 'Rugged Touring Grade Finish',
    },
  },
];

export async function seedProducts() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(SEED_PRODUCTS);
      console.log('✅ Default products seeded to MongoDB');
    }
  } catch (err) {
    console.error('Error seeding products:', err.message);
  }
}

export default Product;
