import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const TRANSLATIONS = {
  en: {
    // Brand & General
    brandName: "RADHE RADIOS",
    brandSubtitle: "Transport Nagar, Kota (Rajasthan) • Estd. 2018",
    tagline: "Custom Power Amplifiers & Professional Vehicle Audio",
    location: "Transport Nagar, Kota, Rajasthan",
    deliveryReach: "Safe delivery & installation across all Indian states",
    monogram: "RR",
    phone: "+91 98871 58522",
    phoneSecondary: "+91 95090 40057",
    whatsapp: "+919887158522",
    callDirect: "Call Workshop",
    whatsappChat: "WhatsApp Us",
    quickQuote: "Get Factory Price",
    learnMore: "Learn More",
    viewAll: "View All",

    // Navbar
    nav: {
      home: "Home",
      about: "About Us",
      products: "Amps & Audio",
      services: "Services",
      contact: "Get in Touch",
      account: "Client Portal",
      login: "Login",
      logout: "Log Out",
      portal: "My Account",
      activeAccount: "Active Account",
    },

    // Hero / Cinematic Scroll
    hero: {
      eyebrow: "RADHE RADIOS • TRANSPORT NAGAR, KOTA • ESTD. 2018",
      heading1: "HIGH-PERFORMANCE",
      heading2: "POWER AMPLIFIERS & VEHICLE AUDIO",
      headingSubtitle: "Handcrafted in Kota, Rajasthan • True Paisa Vasool Sound Engineering",
      description: "Custom, heavy-duty Made in India power amplifiers and professional-grade speakers designed to deliver a premium, thunderous sound experience that lasts for years.",
      reelBadge: "SOUND REEL",
      exploreBtn: "Explore Systems",
      callBtn: "Call: 9887158522",
      loading: "Loading Radhe Radios Sound Reel...",
      reelLabel: "FRAME",
    },

    // Studio Stats
    stats: [
      { value: "10L+", label: "Products Sold", desc: "10,00,000+ Units Pan-India" },
      { value: "200+", label: "Total Dealers", desc: "200+ Authorized Dealers Nationwide" },
      { value: "2018", label: "Estd. in Kota", desc: "Transport Nagar Headquarters" },
      { value: "100%", label: "Paisa Vasool", desc: "Every single rupee worth it" },
    ],

    // About Section
    about: {
      eyebrow: "ABOUT RADHE RADIOS • ESTABLISHED 2018",
      heading: "Welcome to Radhe Radios — High-Performance Audio in Kota, Rajasthan",
      subheading: "Based in the heart of Transport Nagar, Kota, specializing in custom heavy-duty power amplifiers and professional-grade speakers.",
      paragraphs: [
        "Established in 2018 in Kota, Rajasthan, Radhe Radios has been a trusted name in high-performance vehicle and professional audio solutions. Based in the heart of Transport Nagar, Kota, we specialize in crafting custom, heavy-duty power amplifiers and professional-grade speakers designed to deliver a premium, thunderous sound experience.",
        "Our Philosophy: Quality & Value. We believe in true paisa vasool—delivering top-tier audio quality that ensures every single rupee spent by our customers is completely worth it. Our products are engineered not just to sound extraordinary, but to last for years, providing unmatched durability and performance on every journey.",
        "Proudly Made in India: Advanced Power Amplifiers. At Radhe Radios, every single power amplifier is proudly Made in India, crafted with precision engineering and heavy-duty components designed to match global standards. Our circuit boards feature robust heatsinks, premium-grade capacitors, and advanced Class-A architecture to deliver ultra-clean sound, minimal distortion, and thunderous power output that lasts for years. When you choose Radhe Radios, you are investing in authentic Indian manufacturing built for heavy bass performance and absolute reliability.",
        "Whether you are looking to upgrade your vehicle audio setup or need powerful professional sound systems, Radhe Radios is your ultimate destination for quality and reliability."
      ],
      madeInIndia: {
        title: "Proudly Made in India: Advanced Power Amplifiers",
        desc: "Crafted with precision engineering, robust heatsinks, premium-grade capacitors, and advanced Class-A architecture to deliver ultra-clean sound, minimal distortion, and thunderous power output."
      },
      pillars: [
        {
          title: "Premium Sound Engineering",
          desc: "Custom-built amplifiers and speakers designed for crystal-clear acoustics and massive bass output."
        },
        {
          title: "Built to Last",
          desc: "Rugged durability that stands the test of time, giving you years of uninterrupted, reliable performance."
        },
        {
          title: "Customer First",
          desc: "Complete satisfaction guaranteed with products tailored to your exact sound preferences."
        }
      ]
    },

    // Categories
    categories: [
      'All Audio Systems',
      'Custom Power Amplifiers',
      'Vehicle Audio Setups',
      'Heavy Bass Speakers',
      'Professional Sound Rigs'
    ],

    // Sound Systems & Services
    systemsHeading: "Our Audio Solutions & Capabilities",
    systemsSubtitle: "From custom vehicle sound to Made in India power amplifiers and full professional rigs.",
    services: [
      {
        id: "power-amplifiers",
        number: "01",
        title: "Made in India Power Amplifiers",
        category: "Custom Power Amplifiers",
        accentTag: "Proudly Made in India",
        description: "Engineered with robust heatsinks, premium-grade capacitors, and advanced Class-A architecture for ultra-clean sound and thunderous output.",
        deliverables: [
          "Heavy-duty oversized aluminum heatsinks for maximum cooling",
          "High-current toroidal power supply & premium capacitors",
          "Zero-distortion Class-A audio architecture",
          "Full thermal, short-circuit, and overload protection"
        ]
      },
      {
        id: "vehicle-audio",
        number: "02",
        title: "High-Performance Vehicle Audio",
        category: "Vehicle Audio Setups",
        accentTag: "Custom Vehicle Fit",
        description: "Custom sound upgrades for cars, pickups, tractors, and commercial vehicles engineered for road vibrations and massive punch.",
        deliverables: [
          "Vibration-proof customized wooden enclosures",
          "Seamless integration with 12V / 24V vehicle electricals",
          "Ultra-low latency Bluetooth & digital inputs",
          "Crystal-clear treble with earth-shaking sub-bass"
        ]
      },
      {
        id: "pro-speakers",
        number: "03",
        title: "Professional-Grade Speakers & Subwoofers",
        category: "Heavy Bass Speakers",
        accentTag: "Thunderous Bass",
        description: "Heavy-duty subwoofers and mid-top cabinets delivering massive acoustic displacement and durable touring performance.",
        deliverables: [
          "High-excursion voice coils with high thermal dissipation",
          "18mm high-density waterproof reinforced cabinets",
          "Clear vocal projection across open grounds",
          "Long-lasting components with genuine spares"
        ]
      },
      {
        id: "nationwide-dealership",
        number: "04",
        title: "Direct Kota Workshop Supply & Support",
        category: "Professional Sound Rigs",
        accentTag: "Direct Workshop Rates",
        description: "Direct sales and technical consultation straight from Transport Nagar, Kota, with doorstep dispatch across India.",
        deliverables: [
          "Direct manufacturer pricing with true paisa vasool value",
          "Fast dispatch to all towns and transport hubs",
          "Dedicated technician support via phone and WhatsApp",
          "Genuine replacement parts and circuit service"
        ]
      }
    ],

    // Product Showcase
    showcase: {
      eyebrow: "RADHE RADIOS HARDWARE • KOTA WORKSHOP",
      heading: "Custom Amplifiers & Heavy-Duty Audio Rigs",
      description: "Made in India power amplifiers with Class-A architecture, high-efficiency heatsinks, and heavy bass speakers.",
      inquireBtn: "Inquire Price",
      viewSpecs: "View Full Specs",
      specLabels: {
        powerHandling: "Power Handling",
        driverSize: "Circuit Architecture",
        frequencyRange: "Acoustic Spectrum",
        enclosure: "Chassis / Enclosure",
      }
    },

    // Products Data
    products: [
      {
        id: "radhe-class-a-amp",
        title: "Radhe Signature Heavy-Duty Power Amplifier",
        category: 'Custom Power Amplifiers',
        badge: "Made in India",
        image: "/frames/frame_0180.jpg",
        description: "100% Made in India heavy power amplifier. Built with oversized heatsinks, high-grade capacitors, and clean Class-A sound architecture for thunderous bass and crystal vocals.",
        tags: ["Made in India", "Heavy Heatsink", "Zero Distortion", "Class-A Sound"],
        specs: {
          powerHandling: "High-Current Class-A Power Output",
          driverSize: "Heavy Toroidal Transformer + Dual Heatsinks",
          frequencyRange: "15Hz - 25,000Hz Ultra-Clean Spectrum",
          enclosure: "Powder-Coated Industrial Steel Chassis"
        }
      },
      {
        id: "vehicle-sound-system",
        title: "Custom High-Performance Vehicle Audio Setup",
        category: 'Vehicle Audio Setups',
        badge: "Paisa Vasool",
        image: "/frames/frame_0320.jpg",
        description: "Specially designed for cars, pickups, and tractors. Delivers deep, chest-thumping bass on rough roads without distortion or battery drain.",
        tags: ["Vehicle Ready", "Paisa Vasool", "Heavy Vibration Proof"],
        specs: {
          powerHandling: "High-Efficiency 12V/24V Power Draw",
          driverSize: "Custom Heavy Subwoofer + Mid-Range Pods",
          frequencyRange: "Tight Punchy Lows & Crisp Vocals",
          enclosure: "Vibration-Damped Reinforced Body"
        }
      },
      {
        id: "dual-18-bass",
        title: "Dual 18\" Professional Heavy Bass Cabinet",
        category: 'Heavy Bass Speakers',
        badge: "Massive Bass",
        image: "/frames/frame_0450.jpg",
        description: "Massive bass output engineered for open grounds, roadshows, and events. High-density wooden cabinet ensures zero rattle at peak volume.",
        tags: ["Massive Bass", "Pure Copper Coil", "Reinforced Wood"],
        specs: {
          powerHandling: "Peak High-SPL Handling Capacity",
          driverSize: "Dual 18\" High-Excursion Drivers",
          frequencyRange: "Deep Sub-Bass (28Hz - 160Hz)",
          enclosure: "High-Density Waterproof Cabinet"
        }
      },
      {
        id: "professional-rig",
        title: "Radhe Radios Full Professional Sound System",
        category: 'Professional Sound Rigs',
        badge: "Turnkey Sound",
        image: "/frames/frame_0580.jpg",
        description: "Complete turnkey audio solution matching Radhe Radios Made in India amplifiers with professional speaker rigs for events and vehicle setups.",
        tags: ["Turnkey Rig", "Matched Amps", "Complete Cables"],
        specs: {
          powerHandling: "High-Decibel Concert Level",
          driverSize: "Amplifier Rack + Subwoofers + Mid-Tops",
          frequencyRange: "Full Spectrum Acoustic Response",
          enclosure: "Rugged Touring Grade Finish"
        }
      }
    ],

    // Workflow
    workflow: {
      eyebrow: "ENGINEERING STANDARDS & METHODOLOGY",
      heading: "How Every Amplifier & Speaker is Crafted in Kota",
      description: "From component selection to full thermal and audio stress testing, here is our 4-stage quality protocol.",
      steps: [
        {
          step: "01",
          name: "Precision Component Sourcing",
          desc: "Toroidal transformers, heavy-duty capacitors, and robust aluminum heatsinks selected for zero overheating."
        },
        {
          step: "02",
          name: "Handcrafted Indian Assembly",
          desc: "Circuit boards and cabinets are hand-assembled and soldered by skilled technicians in Transport Nagar, Kota."
        },
        {
          step: "03",
          name: "Full-Load Thermal & Audio Stress Test",
          desc: "Every amplifier and speaker is pushed through rigorous continuous load tests to ensure zero distortion and reliable cooling."
        },
        {
          step: "04",
          name: "All-India Doorstep Dispatch",
          desc: "Carefully shock-packaged and shipped directly from Transport Nagar, Kota, to your town or doorstep."
        }
      ]
    },

    // Dealership & Contact Form
    dealership: {
      eyebrow: "GET IN TOUCH WITH RADHE RADIOS",
      heading: "Connect With Our Kota Workshop Desk",
      description: "Serving vehicle owners, sound operators, and dealers across all Indian states with authentic Made in India power and value.",
      form: {
        title: "Send Inquiry or Ask Rates",
        nameLabel: "Your Name",
        namePlaceholder: "Enter your full name",
        phoneLabel: "Phone Number",
        phonePlaceholder: "+91 9887158522 / +91 9509040057",
        cityLabel: "City / Town & State",
        cityPlaceholder: "e.g., Kota, Jaipur, Indore",
        requirementLabel: "Required Sound / Amplifier System",
        messageLabel: "Vehicle Model or Audio Requirements",
        messagePlaceholder: "Mention your car/pickup model, preferred amplifier wattage, or speaker size...",
        submitBtn: "Send Inquiry & Get Rates",
        successMsg: "Inquiry received! Our Kota workshop will call you shortly on your number.",
        guarantee: "100% Paisa Vasool Quality • Direct Kota Workshop Support"
      }
    },

    // Footer
    footer: {
      description: "High-performance vehicle and professional audio solutions. Custom heavy-duty power amplifiers and speakers crafted in Transport Nagar, Kota, Rajasthan since 2018.",
      quickLinks: "Quick Navigation",
      channels: "Direct Helplines",
      copyright: "All rights reserved. Radhe Radios, Transport Nagar, Kota, Rajasthan.",
      madeIn: "Proudly Made in India • Transport Nagar, Kota, Rajasthan.",
      backToTop: "Back to Top"
    }
  }

};

// Guarantee fallback is strictly English
TRANSLATIONS.hi = TRANSLATIONS.en;

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    try {
      localStorage.setItem('radhe_radios_lang', 'en');
    } catch {}
  }, []);

  const setLanguage = () => {
    setLanguageState('en');
    try {
      localStorage.setItem('radhe_radios_lang', 'en');
    } catch {}
  };

  const toggleLanguage = () => {
    setLanguageState('en');
  };

  const t = TRANSLATIONS.en;

  return (
    <LanguageContext.Provider
      value={{
        language: 'en',
        isHindi: false,
        isEnglish: true,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
