/**
 * V-REAL MEDIA Brand Configuration & Design Tokens
 */
export const BRAND = {
  name: "V-REAL MEDIA",
  tagline: "អ្វីដែលប្លែកភ្នែក • ស្នាមញញឹម • បន្តដំណើរទៅមុខ",
  description: "V-REAL MEDIA — ក្រុមផលិតមាតិកាច្នៃប្រឌិតជំនាន់ថ្មីនៅកម្ពុជា។ គោលបំណងរបស់យើងគឺនាំយកអ្វីដែលប្លែកភ្នែក ដើម្បីឱ្យអ្នកមើលអាចញញឹមបាន និងបន្តដំណើរទៅមុខជានិច្ច។",
  shortDescription: "នាំយកអ្វីដែលប្លែកភ្នែក ដើម្បីស្នាមញញឹមរបស់អ្នក និងបន្តដំណើរទៅមុខជានិច្ច។",
  
  // Contact details
  contact: {
    phone: "0968691543",
    phoneDisplay: "096 869 1543",
    email: "v.real.khmer@gmail.com",
    website: "https://v-real.web.app",
    location: "Phnom Penh, Cambodia",
  },

  // Social media handles (configurable)
  social: {
    tiktok: {
      name: "TikTok",
      handle: "@V-Real",
      url: "https://www.tiktok.com/@v_real_khmer", // configurable
    },
    youtube: {
      name: "YouTube",
      handle: "V-Real",
      url: "https://www.youtube.com/@v-real-khmer", // configurable
    },
    facebook: {
      name: "Facebook",
      handle: "V-Real Media",
      url: "https://www.facebook.com/vrealmedia",
    }
  },

  // Media Categories
  categories: [
    { id: "all", name: "All Works" },
    { id: "street-reality", name: "Street Reality" },
    { id: "social-experiment", name: "Social Experiment" },
    { id: "documentary", name: "Documentary" },
    { id: "human-stories", name: "Human Stories" },
  ],

  // Philosophy Pillars
  pillars: [
    {
      title: "Street Reality",
      description: "Unfiltered, unscripted moments captured right in the heart of urban and rural communities, revealing life as it truly unfolds.",
      tag: "Authenticity"
    },
    {
      title: "Social Experiments",
      description: "Probing human psychology, empathy, and social dilemmas to challenge perceptions and foster community reflection.",
      tag: "Perspective"
    },
    {
      title: "Human Documentaries",
      description: "Intimate cinematic portraits of resilience, culture, and untold struggles that inspire empathy and genuine connection.",
      tag: "Emotion"
    },
    {
      title: "Community Impact",
      description: "Amplifying voices of Cambodian youth, everyday workers, and families to foster positive social awareness and change.",
      tag: "Action"
    }
  ]
};

export default BRAND;
