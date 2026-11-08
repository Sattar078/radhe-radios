import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDb } from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Inquiry from './models/Inquiry.js';
import ContactMessage from './models/ContactMessage.js';
import Review from './models/Review.js';
import DownloadItem from './models/DownloadItem.js';
import Notification from './models/Notification.js';

async function seedDatabase() {
  console.log('🌱 Starting Radhe Radios Complete Database Seeding...');
  await connectDb();

  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('adminpassword123', salt);
  const clientPasswordHash = await bcrypt.hash('demo_client_123', salt);
  const dealerPasswordHash = await bcrypt.hash('demo_dealer_123', salt);

  // ─── 1. SEED USERS ──────────────────────────────────────────────────────────
  console.log('👤 Seeding Users & Sound Engineers...');
  const usersData = [
    {
      name: 'Rajesh Sharma (Workshop Owner & Super Admin)',
      phone: '9887158522',
      email: 'superadmin@radheradios.com',
      password_hash: defaultPasswordHash,
      role: 'super_admin',
      adminApproved: true,
      adminRequested: false,
      company: 'Radhe Radios Headquarters',
      location: 'Transport Nagar, Kota, Rajasthan',
      tier: 'Workshop Master & Super Administrator',
      avatar: 'SA',
    },
    {
      name: 'Ramesh Verma (Approved Staff Admin)',
      phone: '9829011223',
      email: 'ramesh.admin@radheradios.com',
      password_hash: defaultPasswordHash,
      role: 'admin',
      adminApproved: true,
      adminRequested: false,
      company: 'Radhe Radios Technical Operations',
      location: 'Kota, Rajasthan',
      tier: 'Authorized Workshop Admin',
      avatar: 'RV',
    },
    {
      name: 'Deepak Meena (Workshop Tech - Pending Approval)',
      phone: '9829988776',
      email: 'deepak.tech@gmail.com',
      password_hash: clientPasswordHash,
      role: 'client',
      adminApproved: false,
      adminRequested: true,
      company: 'Meena Sound Services',
      location: 'Baran, Rajasthan',
      tier: 'Pending Staff Admin Approval',
      avatar: 'DM',
    },
    {
      name: 'Vikramaditya Rathore',
      phone: '9829087654',
      email: '9829087654@radhestudio.com',
      password_hash: dealerPasswordHash,
      role: 'Authorized Dealer',
      company: 'Rajputana Sound & Lighting Co.',
      location: 'Jaipur, Rajasthan',
      tier: 'Gold Tier Dealer',
      avatar: 'VR',
    },
    {
      name: 'Ananya Sharma',
      phone: '9414033211',
      email: '9414033211@radhestudio.com',
      password_hash: clientPasswordHash,
      role: 'Wedding Client',
      company: 'Desert Echo Music Festivals',
      location: 'Udaipur, Rajasthan',
      tier: 'VIP Client',
      avatar: 'AS',
    },
    {
      name: 'Sunil Gurjar',
      phone: '9829123456',
      email: 'sunil.dj@gmail.com',
      password_hash: clientPasswordHash,
      role: 'DJ Operator',
      company: 'Gurjar DJ Sound System',
      location: 'Bundi, Rajasthan',
      tier: 'Pro Sound Operator',
      avatar: 'SG',
    },
    {
      name: 'Mohan Lal Soni',
      phone: '9414567890',
      email: 'mohan.audio@gmail.com',
      password_hash: clientPasswordHash,
      role: 'Sound Engineer',
      company: 'Chambal Acoustic Works',
      location: 'Kota Industrial Area, Rajasthan',
      tier: 'Acoustic Specialist',
      avatar: 'MS',
    },
    {
      name: 'Rameshwar Meena',
      phone: '9785123987',
      email: 'rameshwar.meena@gmail.com',
      password_hash: dealerPasswordHash,
      role: 'Audio Dealer',
      company: 'Meena Electronics & Sound',
      location: 'Ajmer, Rajasthan',
      tier: 'Verified Dealer',
      avatar: 'RM',
    },
    {
      name: 'Kavita Rathore',
      phone: '9928345671',
      email: 'kavita.events@gmail.com',
      password_hash: clientPasswordHash,
      role: 'Wedding Client',
      company: 'Royal Rajput Weddings',
      location: 'Jodhpur, Rajasthan',
      tier: 'Event Partner',
      avatar: 'KR',
    },
  ];

  const userMap = {};
  for (const u of usersData) {
    const userDoc = await User.findOneAndUpdate(
      { phone: u.phone },
      { $set: u },
      { upsert: true, new: true }
    );
    userMap[u.phone] = userDoc;
  }
  console.log(`✅ ${Object.keys(userMap).length} users seeded.`);

  // ─── 2. SEED PRODUCTS ───────────────────────────────────────────────────────
  console.log('📦 Seeding Hardware Rigs & Products...');
  const productsData = [
    {
      id: 'radhe-class-a-amp',
      title: 'Radhe Signature Heavy-Duty Power Amplifier',
      category: 'Custom Power Amplifiers',
      badge: 'Flagship Amplifier',
      description:
        '100% Made in India heavy power amplifier. Built with oversized copper toroidal transformer, dual aluminum heatsinks, high-grade Japanese capacitors, and zero-distortion Class-A sound architecture for thunderous bass and crystal vocals.',
      image: '/frames/frame_0180.jpg',
      price: 45000,
      inStock: true,
      featured: true,
      tags: ['Made in India', 'Heavy Heatsink', 'Zero Distortion', 'Class-A Sound'],
      specs: {
        powerHandling: '3200W RMS Continuous Class-A Output',
        driverSize: 'Heavy Copper Toroidal Transformer + Dual Heatsinks',
        frequencyRange: '15Hz - 25,000Hz Ultra-Clean Spectrum',
        enclosure: 'Industrial Powder-Coated 2mm Steel Chassis',
        impedance: '2 / 4 / 8 Ohms Stable',
        cooling: 'Quad High-CFM Thermal Fan Matrix',
      },
    },
    {
      id: 'radhe-thunder-10000w-beast-rig',
      title: 'Radhe Thunder 10000W Beast Rig',
      category: 'Custom Power Amplifiers',
      badge: 'Kota Handcrafted',
      description:
        'Tour-grade dual 18-inch neodymium subwoofer system paired with our highest-current Class-A toroidal power engine for extreme acoustic displacement and chest-thumping ground vibrations.',
      image: '/frames/frame_0450.jpg',
      price: 85000,
      inStock: true,
      featured: true,
      tags: ['10000W Peak', 'Tour Grade', 'Neodymium Drivers', 'Severe Sub-Bass'],
      specs: {
        powerHandling: '5000W RMS / 10000W Peak Output',
        driverSize: 'Dual 18" High-Excursion Voice Coil Drivers',
        frequencyRange: '20Hz - 140Hz Heavy Low-End',
        enclosure: '18mm Marine-Grade Waterproof Birch Plywood',
        impedance: '4 Ohms Parallel Bridged',
        cooling: 'Forced Tunnel Dual Fan System',
      },
    },
    {
      id: 'vehicle-sound-system',
      title: 'Custom High-Performance Vehicle Audio Setup',
      category: 'Vehicle Audio Setups',
      badge: 'Paisa Vasool',
      description:
        'Specially engineered for Bolero campers, pickups, tractors, and commercial vehicles. Delivers deep, punchy sub-bass over rough village roads without battery drain or chassis rattle.',
      image: '/frames/frame_0320.jpg',
      price: 38000,
      inStock: true,
      featured: true,
      tags: ['Vehicle Ready', 'Paisa Vasool', 'Heavy Vibration Proof'],
      specs: {
        powerHandling: '1200W RMS 12V/24V Power Draw',
        driverSize: '15" Heavy Subwoofer + Mid-Range Bullet Pods',
        frequencyRange: '30Hz - 18,000Hz Punchy Lows & Crisp Highs',
        enclosure: 'Vibration-Damped Reinforced Body with Steel Braces',
        impedance: '4 Ohms Single Channel',
        cooling: 'Alloy Heat Spreader System',
      },
    },
    {
      id: 'tractor-heavy-punch-rig',
      title: 'Tractor & Pickup Chest-Thumping Sound Rig',
      category: 'Vehicle Audio Setups',
      badge: 'Tractor Special',
      description:
        'Ruggedized weatherproof acoustic setup designed specifically for open-field tractors and agricultural rallies. Features dual shock-mounts and moisture-sealed circuits.',
      image: '/frames/frame_0320.jpg',
      price: 42000,
      inStock: true,
      featured: false,
      tags: ['Field Ready', 'Weatherproof', 'Tractor Special'],
      specs: {
        powerHandling: '1800W Peak High-Efficiency Draw',
        driverSize: 'Dual 12" Long-Throw Drivers with Titanium Tweeters',
        frequencyRange: '35Hz - 20,000Hz High-SPL Spectrum',
        enclosure: 'Waterproof Coated Marine Plywood with Metal Grille',
        impedance: '4 Ohms',
        cooling: 'Passive Heavy Fin Convection',
      },
    },
    {
      id: 'dual-18-bass',
      title: 'Dual 18" Professional Heavy Bass Cabinet',
      category: 'Heavy Bass Speakers',
      badge: 'Massive Bass',
      description:
        'Massive bass displacement engineered for open grounds, roadshows, wedding processions, and temple festivals. High-density acoustic bracing guarantees zero air leakage or box vibration.',
      image: '/frames/frame_0450.jpg',
      price: 55000,
      inStock: true,
      featured: true,
      tags: ['Massive Bass', 'Pure Copper Coil', 'Reinforced Wood'],
      specs: {
        powerHandling: '4000W Program High-SPL Handling Capacity',
        driverSize: 'Dual 18" Die-Cast Aluminum Frame Drivers',
        frequencyRange: '28Hz - 160Hz Deep Sub-Bass',
        enclosure: '18mm High-Density Marine Birch Plywood',
        impedance: '4 Ohms',
        cooling: 'Venturi Airflow Magnet Cooling',
      },
    },
    {
      id: 'single-18-compact-bass',
      title: 'Single 18" Compact Touring Subwoofer',
      category: 'Heavy Bass Speakers',
      badge: 'Touring Compact',
      description:
        'Compact high-output subwoofer box tailored for mobile DJ setups and club banquets where transport space is limited but maximum low-end impact is mandatory.',
      image: '/frames/frame_0450.jpg',
      price: 32000,
      inStock: true,
      featured: false,
      tags: ['Mobile DJ', 'Compact Footprint', 'Fast Loading'],
      specs: {
        powerHandling: '2000W Peak / 1000W RMS',
        driverSize: 'Single 18" High-Excursion Voice Coil',
        frequencyRange: '32Hz - 180Hz Tight Lows',
        enclosure: 'CNC Routed Birch Cabinet with Ergonomic Handles',
        impedance: '8 Ohms',
        cooling: 'Pole-Piece Ventilated Voice Coil',
      },
    },
    {
      id: 'dual-15-mid-top',
      title: 'Dual 15" High-Throw Mid-High Stage Top',
      category: 'Heavy Bass Speakers',
      badge: 'Crystal Vocals',
      description:
        'Full-range two-way loudspeaker delivering high-clarity vocal projection over long open distances. Fitted with 3-inch titanium diaphragm compression driver.',
      image: '/frames/frame_0060.jpg',
      price: 28000,
      inStock: true,
      featured: false,
      tags: ['Long Throw', 'Titanium HF', 'Crisp Treble'],
      specs: {
        powerHandling: '1500W Program Audio Power',
        driverSize: 'Dual 15" Mid-Bass Woofers + 3" Titanium Horn',
        frequencyRange: '45Hz - 20,000Hz Full Spectrum',
        enclosure: 'Trapezoidal Plywood Enclosure with Black Polyurea Coat',
        impedance: '4 Ohms',
        cooling: 'Aluminum Phase Plug Dissipation',
      },
    },
    {
      id: 'professional-rig',
      title: 'Radhe Radios Full Professional Sound System',
      category: 'Professional Sound Rigs',
      badge: 'Turnkey Sound Rig',
      description:
        'Complete turnkey audio setup matching Radhe Radios handcrafted amplifiers, dual 18-inch sub-woofers, and mid-high stage tops. Pre-wired with heavy-duty Speakon cables and touring flight racks.',
      image: '/frames/frame_0580.jpg',
      price: 195000,
      inStock: true,
      featured: true,
      tags: ['Turnkey Rig', 'Complete Package', 'Touring Flight Rack'],
      specs: {
        powerHandling: '8000W Total Combined RMS Output',
        driverSize: '4x 18" Subwoofers + 4x 15" Stage Tops + Amp Rack',
        frequencyRange: '20Hz - 22,000Hz Concert Grade Dynamic Range',
        enclosure: 'Complete Tour-Grade Birch & Flight Cases',
        impedance: 'Multi-Channel Balanced 4/8 Ohms',
        cooling: 'Master High-Velocity Forced Air Cooling Rack',
      },
    },
    {
      id: 'stadium-line-array-4top',
      title: '4-Box Flying Line Array Rig with Dual Subs',
      category: 'Professional Sound Rigs',
      badge: 'Concert Series',
      description:
        'Professional flying line array system engineered for auditoriums, political rallies, and mega wedding grounds with uniform sound pressure up to 100 meters.',
      image: '/frames/frame_0580.jpg',
      price: 280000,
      inStock: true,
      featured: true,
      tags: ['Line Array', '100m Throw', 'Even SPL Coverage'],
      specs: {
        powerHandling: '12000W Peak / 6000W RMS Continuous',
        driverSize: '4x Dual 10" Line Array Modules + 2x Ground Subwoofers',
        frequencyRange: '30Hz - 22,000Hz Phase-Aligned',
        enclosure: 'Aircraft-Grade Aluminum Rigging Hardware + Birch Enclosures',
        impedance: '4-Way Bi-Amped Matrix',
        cooling: 'Integrated Thermal Limiting Architecture',
      },
    },
    {
      id: 'sound-bar-heavy',
      title: 'Radhe Heavy-Duty Studio Soundbar & Bass Tube',
      category: 'Custom Power Amplifiers',
      badge: 'Studio Pure',
      description:
        'Compact audiophile listening rig handcrafted with solid wood chassis and analog Class-A power stage for home studios, lounges, and connoisseurs.',
      image: '/frames/frame_0180.jpg',
      price: 24000,
      inStock: true,
      featured: false,
      tags: ['Studio Warmth', 'Analog Circuit', 'Solid Wood'],
      specs: {
        powerHandling: '500W RMS Pure Audio Power',
        driverSize: '8" Carbon Fiber Woofer + Dual Silk Dome Tweeters',
        frequencyRange: '25Hz - 24,000Hz Hi-Res Certified',
        enclosure: 'Handcrafted Teak & Birch Composite Chassis',
        impedance: '8 Ohms',
        cooling: 'Internal Fin Convection',
      },
    },
  ];

  for (const p of productsData) {
    await Product.findOneAndUpdate(
      { id: p.id },
      { $set: p },
      { upsert: true, new: true }
    );
  }
  console.log(`✅ ${productsData.length} products seeded.`);

  // ─── 3. SEED INQUIRIES & ORDERS ─────────────────────────────────────────────
  console.log('📋 Seeding Customer Inquiries & Sales Orders...');
  const inquiriesData = [
    {
      id: 'INQ-1001',
      user_id: userMap['9829123456']._id,
      system: '18" Dual Bass System',
      location: 'Bundi, Rajasthan',
      notes: 'Customer requested 4 Ohms parallel copper coil with heavy duty Speakon jacks for local rally.',
      status: 'In Production',
      priority: 'High',
      est_delivery: 'Dispatch within 48 hours',
      amount: 65000,
      payment_status: 'Advance Received',
      customer_name: 'Sunil Gurjar',
      customer_phone: '9829123456',
      customer_email: 'sunil.dj@gmail.com',
    },
    {
      id: 'INQ-1002',
      user_id: userMap['9829087654']._id,
      system: 'Radhe Signature Heavy-Duty Power Amplifier',
      location: 'Jaipur, Rajasthan',
      notes: 'Delivered to Jaipur transport hub. 48-hour burn-in test cleared with zero distortion.',
      status: 'Completed',
      priority: 'Standard',
      est_delivery: 'Delivered & Deployed',
      amount: 90000,
      payment_status: 'Paid in Full',
      customer_name: 'Vikramaditya Rathore',
      customer_phone: '9829087654',
      customer_email: '9829087654@radhestudio.com',
    },
    {
      id: 'INQ-1003',
      user_id: userMap['9414033211']._id,
      system: 'Custom High-Performance Vehicle Audio Setup',
      location: 'Udaipur, Rajasthan',
      notes: 'Custom mounting brackets fabricated for Mahindra Thar 2024. Vibration-damped sub box.',
      status: 'In Production',
      priority: 'Standard',
      est_delivery: 'Estimated 3 days',
      amount: 38000,
      payment_status: 'Advance Received',
      customer_name: 'Ananya Sharma',
      customer_phone: '9414033211',
      customer_email: '9414033211@radhestudio.com',
    },
    {
      id: 'INQ-1004',
      user_id: userMap['9414567890']._id,
      system: 'Radhe Thunder 10000W Beast Rig',
      location: 'Kota Industrial Area, Rajasthan',
      notes: 'Requires oversized heatsinks and dual 18 neodymium woofers for 14-hour marathon roadshow.',
      status: 'Awaiting Engineering Review',
      priority: 'High',
      est_delivery: 'Pending bench test',
      amount: 85000,
      payment_status: 'Pending',
      customer_name: 'Mohan Lal Soni',
      customer_phone: '9414567890',
      customer_email: 'mohan.audio@gmail.com',
    },
    {
      id: 'INQ-1005',
      user_id: userMap['9928345671']._id,
      system: 'Radhe Radios Full Professional Sound System',
      location: 'Jodhpur, Rajasthan',
      notes: 'Heritage wedding ground installation at Jodhpur palace. Multi-channel amp rack included.',
      status: 'Acoustic Review',
      priority: 'Urgent',
      est_delivery: 'Scheduled dispatch 5th Nov',
      amount: 195000,
      payment_status: 'Advance Received',
      customer_name: 'Kavita Rathore',
      customer_phone: '9928345671',
      customer_email: 'kavita.events@gmail.com',
    },
    {
      id: 'INQ-1006',
      user_id: userMap['9785123987']._id,
      system: '4-Box Flying Line Array Rig with Dual Subs',
      location: 'Ajmer, Rajasthan',
      notes: 'Dispatched via Kota Transport Agency. Waybill #KTA-98821 confirmed. Complete dealer invoice generated.',
      status: 'Delivered & Deployed',
      priority: 'High (Dealer)',
      est_delivery: 'Delivered',
      amount: 280000,
      payment_status: 'Paid in Full',
      customer_name: 'Rameshwar Meena',
      customer_phone: '9785123987',
      customer_email: 'rameshwar.meena@gmail.com',
    },
    {
      id: 'INQ-1007',
      user_id: userMap['9887158522']._id,
      system: 'Tractor & Pickup Chest-Thumping Sound Rig',
      location: 'Transport Nagar, Kota, Rajasthan',
      notes: 'Heavy shock mounts installed for rough agricultural road performance. Moisture-sealed circuit verified.',
      status: 'In Production',
      priority: 'Standard',
      est_delivery: 'Ready tomorrow',
      amount: 42000,
      payment_status: 'Advance Received',
      customer_name: 'Pappu Lal Gurjar',
      customer_phone: '9887332211',
      customer_email: 'pappulal@gmail.com',
    },
    {
      id: 'INQ-1008',
      user_id: userMap['9829123456']._id,
      system: 'Dual 15" High-Throw Mid-High Stage Top',
      location: 'Bundi, Rajasthan',
      notes: 'Titanium compression drivers tuned for long throw open ground vocal clarity.',
      status: 'Completed',
      priority: 'Standard',
      est_delivery: 'Delivered',
      amount: 56000,
      payment_status: 'Paid in Full',
      customer_name: 'Sunil Gurjar',
      customer_phone: '9829123456',
      customer_email: 'sunil.dj@gmail.com',
    },
  ];

  for (const inq of inquiriesData) {
    await Inquiry.findOneAndUpdate(
      { id: inq.id },
      { $set: inq },
      { upsert: true, new: true }
    );
  }
  console.log(`✅ ${inquiriesData.length} customer inquiries seeded.`);

  // ─── 4. SEED CONTACT LEADS ──────────────────────────────────────────────────
  console.log('📩 Seeding Contact Leads & Dealership Messages...');
  const contactsData = [
    {
      ticket_id: 'RR-401201',
      name: 'Deepak Verma',
      contact: '9829445566',
      requirement_type: '18" Dual Bass System',
      location: 'Udaipur, Rajasthan',
      message: 'Need full quote for 4x dual 18 bass cabinets and 6000W amp for upcoming wedding season.',
      source: 'dealership_desk',
      status: 'New',
    },
    {
      ticket_id: 'RR-401202',
      name: 'Mahesh Choudhary',
      contact: '9414223344',
      requirement_type: 'Dealership Inquiry',
      location: 'Jaipur, Rajasthan',
      message: 'Interested in becoming authorized distributor for Jaipur, Sikar, and Alwar belt.',
      source: 'contact_page',
      status: 'In Review',
    },
    {
      ticket_id: 'RR-401203',
      name: 'Pappu Lal Gurjar',
      contact: '9887332211',
      requirement_type: 'Vehicle Audio Upgrade',
      location: 'Kota, Rajasthan',
      message: 'Can you install the 24V Class-A amp directly in my Bolero Camper tomorrow morning at workshop?',
      source: 'quick_bar',
      status: 'Contacted',
    },
    {
      ticket_id: 'RR-401204',
      name: 'Harish Rawat',
      contact: '9782556677',
      requirement_type: 'Professional Sound Rigs',
      location: 'Indore, MP',
      message: 'Please dispatch 2 dual-15 tops and 1 power amplifier via Indore Transport Nagar logistics.',
      source: 'contact_page',
      status: 'Resolved',
    },
    {
      ticket_id: 'RR-401205',
      name: 'Surendra Singh',
      contact: '9928114477',
      requirement_type: 'Line Array Rig Rental & Sale',
      location: 'Jodhpur, Rajasthan',
      message: 'Looking for 4-box flying line array setup for event ground. Please share complete spec sheet.',
      source: 'dealership_desk',
      status: 'New',
    },
    {
      ticket_id: 'RR-401206',
      name: 'Gopal Sharma',
      contact: '9414998877',
      requirement_type: 'Service & Spares',
      location: 'Ajmer, Rajasthan',
      message: 'Need genuine replacement toroidal power transformer for 2021 Radhe 4000W amplifier.',
      source: 'contact_page',
      status: 'Contacted',
    },
  ];

  for (const c of contactsData) {
    await ContactMessage.findOneAndUpdate(
      { ticket_id: c.ticket_id },
      { $set: c },
      { upsert: true, new: true }
    );
  }
  console.log(`✅ ${contactsData.length} contact leads seeded.`);

  // ─── 5. SEED VERIFIED CUSTOMER REVIEWS ───────────────────────────────────────
  console.log('⭐ Seeding Customer Reviews...');
  const reviewsData = [
    {
      author_name: 'Deepak DJ Sound',
      author_role: 'Pro DJ Operator',
      location: 'Transport Nagar, Kota',
      rating: 5,
      title: 'Original Class-A Sound • Unmatched Bass in Kota',
      comment:
        'Running Radhe Radios heavy power amp with dual 18-inch subwoofers for 3 years across Rajasthan rallies. Oversized aluminum heatsinks keep it completely cool even after 10 hours at full gain.',
      bass_power: 5,
      clarity: 5,
      is_verified: true,
      user_id: userMap['9829123456']._id,
    },
    {
      author_name: 'Rathore Roadshows',
      author_role: 'Event & Sound Contractor',
      location: 'Jaipur, Rajasthan',
      rating: 5,
      title: 'True Paisa Vasool • Thunderous Low-End',
      comment:
        'Ran two 18-inch cabinets with the Radhe Signature amplifier on Diwali procession in Jaipur. Ground was shaking half a kilometer away! Clean vocals with zero distortion.',
      bass_power: 5,
      clarity: 5,
      is_verified: true,
      user_id: userMap['9829087654']._id,
    },
    {
      author_name: 'Bundi Bass King',
      author_role: 'Vehicle Audio Specialist',
      location: 'Bundi, Rajasthan',
      rating: 5,
      title: 'Fitted on Pickup • Heavy Punch on Rough Roads',
      comment:
        'Had our Bolero camper fitted with custom Radhe bass box and 24V Class-A amp. Bumpy village roads have zero impact on the sound. Genuine Indian engineering!',
      bass_power: 5,
      clarity: 5,
      is_verified: true,
      user_id: userMap['9829123456']._id,
    },
    {
      author_name: 'Royal Rajput Sound',
      author_role: 'Wedding Sound Engineer',
      location: 'Jodhpur, Rajasthan',
      rating: 5,
      title: 'Best Handcrafted Cabinets in Rajasthan',
      comment:
        '18mm waterproof marine birch wood cabinet quality is unmatched. Zero rattle at peak volume. Rajesh bhai personally tuned the crossovers for our palace setup.',
      bass_power: 5,
      clarity: 5,
      is_verified: true,
      user_id: userMap['9928345671']._id,
    },
    {
      author_name: 'Udaipur Live Events',
      author_role: 'Festival Sound Director',
      location: 'Udaipur, Rajasthan',
      rating: 5,
      title: '14-Hour Burn-In Test Cleared with Ease',
      comment:
        'We toured entire Mewar region with Radhe 8000W setup. Clear vocal projection across open grounds and pure copper toroidal transformer delivers massive energy.',
      bass_power: 5,
      clarity: 5,
      is_verified: true,
      user_id: userMap['9414033211']._id,
    },
    {
      author_name: 'Hadoti Beats',
      author_role: 'DJ Operator',
      location: 'Baran, Rajasthan',
      rating: 5,
      title: 'Fast 24-Hour Dispatch & Support',
      comment:
        'Received shipment via Transport Nagar within 24 hours. Plugged it in for wedding baarat and everyone was blown away. 100% recommended for every DJ in Hadoti.',
      bass_power: 5,
      clarity: 5,
      is_verified: true,
      user_id: userMap['9414567890']._id,
    },
  ];

  await Review.deleteMany({});
  await Review.insertMany(reviewsData);
  console.log(`✅ ${reviewsData.length} customer reviews seeded.`);

  // ─── 6. SEED DOWNLOAD ITEMS (BLUEPRINTS) ────────────────────────────────────
  console.log('📥 Seeding Blueprints & Technical Schematics...');
  const downloadsData = [
    {
      id: 'dl-class-a-circuit',
      title: 'Radhe Radios Class-A High-Power Toroidal Circuit Blueprint',
      title_hindi: 'राधे रेडियोज क्लास-ए हाई-पावर टॉरॉयडल सर्किट ब्लूप्रिंट',
      format: 'PDF',
      size: '4.2 MB',
      category: 'Schematic',
      file_url: '/blueprints/radhe-class-a-circuit.pdf',
      tier_required: 'auth_required',
      download_count: 142,
    },
    {
      id: 'dl-dual18-schematics',
      title: 'Dual 18" Heavy Bass Marine Birch Cabinet Cutting Plan',
      title_hindi: 'डबल 18 इंच हैवी बास मरीन बर्च कैबिनेट कटिंग प्लान',
      format: 'PDF',
      size: '6.8 MB',
      category: 'Woodworking Blueprint',
      file_url: '/blueprints/dual-18-cutting-plan.pdf',
      tier_required: 'auth_required',
      download_count: 289,
    },
    {
      id: 'dl-vehicle-wiring',
      title: '12V / 24V Automotive High-Current Audio Wiring & Isolator Guide',
      title_hindi: '12V / 24V ऑटोमोटिव हाई-करंट ऑडियो वायरिंग एवं आइसोलेटर गाइड',
      format: 'PDF',
      size: '3.1 MB',
      category: 'Vehicle Guide',
      file_url: '/blueprints/vehicle-audio-wiring.pdf',
      tier_required: 'public',
      download_count: 512,
    },
    {
      id: 'dl-hardware-catalog-2026',
      title: 'Radhe Radios Official 2026 Hardware Catalog & Workshop Rate Sheet',
      title_hindi: 'राधे रेडियोज आधिकारिक 2026 हार्डवेयर कैटलॉग एवं रेट शीट',
      format: 'PDF',
      size: '12.4 MB',
      category: 'Catalog',
      file_url: '/blueprints/radhe-hardware-catalog-2026.pdf',
      tier_required: 'public',
      download_count: 830,
    },
  ];

  for (const d of downloadsData) {
    await DownloadItem.findOneAndUpdate(
      { id: d.id },
      { $set: d },
      { upsert: true, new: true }
    );
  }
  console.log(`✅ ${downloadsData.length} download schematics seeded.`);

  // ─── 7. SEED NOTIFICATIONS HISTORY ──────────────────────────────────────────
  console.log('📲 Seeding Notification History...');
  const notificationsData = [
    {
      user_id: userMap['9414033211']._id,
      recipient_name: 'Ananya Sharma',
      recipient_phone: '9414033211',
      recipient_email: '9414033211@radhestudio.com',
      type: 'whatsapp',
      subject: 'Acoustic Rig Passed Zero-Distortion Benchmark',
      message:
        'Great news! Your customized amplifier rig has successfully cleared our 48-hour thermal and zero-distortion burn-in tests at Radhe Radios Kota. Ready for final packing and dispatch.',
      status: 'delivered',
      sent_by: 'Rajesh Workshop Admin',
    },
    {
      user_id: userMap['9829087654']._id,
      recipient_name: 'Vikramaditya Rathore',
      recipient_phone: '9829087654',
      recipient_email: '9829087654@radhestudio.com',
      type: 'whatsapp',
      subject: 'Sound System Dispatched via Transport Nagar Logistics',
      message:
        'Your 4000W stage power amplifier has been dispatched via Kota Transport Agency. Waybill tracking details sent to your registered mobile number.',
      status: 'delivered',
      sent_by: 'Rajesh Workshop Admin',
    },
    {
      user_id: userMap['9829123456']._id,
      recipient_name: 'Sunil Gurjar',
      recipient_phone: '9829123456',
      recipient_email: 'sunil.dj@gmail.com',
      type: 'whatsapp',
      subject: 'Your Radhe Radios Custom Build is in Production',
      message:
        'Hello Sunil ji! Your dual 18-inch sub cabinet has entered the CNC cutting and internal acoustic bracing stage at our Transport Nagar workshop.',
      status: 'delivered',
      sent_by: 'Rajesh Workshop Admin',
    },
    {
      user_id: userMap['9928345671']._id,
      recipient_name: 'Kavita Rathore',
      recipient_phone: '9928345671',
      recipient_email: 'kavita.events@gmail.com',
      type: 'email',
      subject: 'Official Quotation & Build Blueprint — Radhe Radios',
      message:
        'Greetings from Radhe Radios! Enclosed is your customized system blueprint with Class-A toroidal power architecture and reinforced cabinet specs for Jodhpur Palace event.',
      status: 'delivered',
      sent_by: 'Rajesh Workshop Admin',
    },
  ];

  await Notification.deleteMany({});
  await Notification.insertMany(notificationsData);
  console.log(`✅ ${notificationsData.length} notifications seeded.`);

  console.log('\n🎉 ALL RADHE RADIOS DUMMY DATA SEEDED SUCCESSFULLY!');
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});

