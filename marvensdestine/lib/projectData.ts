export interface MediaItem {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface ProjectData {
  scene?: string;
  title: string;
  description: string;
  opCode: string;
  status: string;
  clearance: string;
  location: string;
  priority: string;
  slug: string;
  fullDescription?: string;
  objectives?: string[];
  timeline?: string;
  assets?: string[];
  riskAssessment?: string;
  // New media properties for showcase
  heroImage?: string;
  gallery?: MediaItem[];
  process?: {
    title: string;
    description: string;
    media?: MediaItem[];
  }[];
  technologies?: string[];
  results?: string[];
  // Client-focused information
  projectDuration?: string;
  budget?: string;
  clientType?: string;
  services?: string[];
  deliverables?: string[];
  challenges?: string[];
  solutions?: string[];
  testimonial?: {
    quote: string;
    author: string;
    company: string;
  };
  personnel?: {
    commander: string;
    operatives: number;
    specialization: string[];
  };
  classification?: {
    level: string;
    compartments: string[];
    distribution: string;
  };
  coordinates?: {
    latitude: string;
    longitude: string;
    elevation: string;
  };
}

export interface NFTProjectData {
  scene?: string;
  title: string;
  description: string;
  collectionSize: number;
  blockchain: string;
  mintPrice: string;
  status: string;
  slug: string;
  fullDescription?: string;
  // New media properties for NFT showcase
  heroImage?: string;
  gallery?: MediaItem[];
  artworkShowcase?: {
    title: string;
    description: string;
    media?: MediaItem[];
  }[];
  creationProcess?: string[];
  inspiration?: string;
  // Client-focused information
  projectDuration?: string;
  clientType?: string;
  services?: string[];
  deliverables?: string[];
  marketingStrategy?: string[];
  communitySize?: string;
  testimonial?: {
    quote: string;
    author: string;
    company: string;
  };
  rarity?: {
    common: number;
    uncommon: number;
    rare: number;
    legendary: number;
  };
  utilities?: string[];
  roadmap?: string[];
  artistStatement?: string;
  technicalSpecs?: {
    format: string;
    resolution: string;
    metadata: string;
  };
}

export type ProjectType = '3d' | 'nft';

export const projectsData: ProjectData[] = [
  {
    scene: "https://prod.spline.design/HcZu9MGXXX8KnuVk/scene.splinecode",
    title: "ODESZA",
    description: "Stage visual creation for ODESZA's I CAN'T SLEEP tour from London to New York, focusing on geometry node and point cloud animation and manipulation.",
    opCode: "OW-71225",
    status: "ACTIVE",
    clearance: "LEVEL 4",
    location: "SECTOR 7, GRID 19-A",
    priority: "ALPHA",
    slug: "operation-watchkeeper",
    heroImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=800&fit=crop",
    gallery: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop', alt: 'Stage setup overview' },
      { type: 'video', src: '/projects/videos/ryandestinedoyou.mp4', alt: 'Point cloud animation' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=800&fit=crop', alt: 'Geometry nodes setup' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop', alt: 'Final stage render' }
    ],
    process: [
      {
        title: "Concept Development",
        description: "Initial design concepts and mood boarding for the I CAN'T SLEEP tour visual identity.",
        media: [
          { type: 'image', src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop', alt: 'Concept art 1' },
          { type: 'image', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop', alt: 'Concept art 2' }
        ]
      },
      {
        title: "Technical Implementation", 
        description: "Development of the geometry node system for real-time point cloud animations.",
        media: [
          { type: 'image', src: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop', alt: 'Node development process' }
        ]
      }
    ],
    technologies: ["Blender", "Geometry Nodes", "Python", "OSC Protocol", "TouchDesigner"],
    results: [
      "Successfully deployed across 25+ tour venues",
      "Reduced setup time by 60% using procedural systems", 
      "Generated 2M+ social media impressions"
    ],
    // Client-focused information
    projectDuration: "6 months",
    budget: "$150K - $250K",
    clientType: "Music & Entertainment",
    services: [
      "3D Visual Design & Animation",
      "Real-time Rendering Systems", 
      "Live Performance Integration",
      "Technical Documentation & Training"
    ],
    deliverables: [
      "Custom 3D visual system",
      "Real-time control interface",
      "Technical documentation",
      "On-site deployment support",
      "Post-launch optimization"
    ],
    challenges: [
      "Real-time rendering for large venues",
      "Seamless integration with existing audio systems",
      "Cross-platform compatibility requirements"
    ],
    solutions: [
      "Developed custom geometry node system for efficient real-time processing",
      "Implemented OSC protocol for seamless audio-visual synchronization",
      "Created modular system architecture for easy venue adaptation"
    ],
    testimonial: {
      quote: "The visual system transformed our live performance experience. The procedural animations perfectly synced with our music, creating an immersive atmosphere that our fans absolutely loved.",
      author: "Clayton Knight",
      company: "ODESZA"
    },
    fullDescription: "Operation Watchkeeper represents a comprehensive surveillance and reconnaissance mission targeting critical infrastructure elements within the designated operational theater. The mission employs advanced geospatial mapping technologies, satellite surveillance systems, and ground-based reconnaissance assets to provide detailed intelligence assessment of the target area. All identified access points have been catalogued and potential vulnerabilities assessed using standardized threat evaluation protocols.",
    objectives: [
      "Conduct comprehensive geospatial mapping of target infrastructure",
      "Establish continuous satellite surveillance coverage",
      "Identify and assess all potential access points",
      "Evaluate structural vulnerabilities and security gaps",
      "Provide real-time intelligence updates to command structure"
    ],
    timeline: "72 HOURS CONTINUOUS OPERATION",
    assets: [
      "2x Satellite Surveillance Units",
      "4x Ground Reconnaissance Teams",
      "1x Mobile Command Center",
      "Advanced Mapping Equipment",
      "Encrypted Communication Systems"
    ],
    riskAssessment: "MODERATE - Environmental factors and potential hostile presence require constant vigilance",
    personnel: {
      commander: "COL. Sarah Mitchell",
      operatives: 16,
      specialization: ["Intelligence Analysis", "Geospatial Mapping", "Electronic Surveillance"]
    },
    classification: {
      level: "SECRET//NOFORN",
      compartments: ["WATCHKEEPER", "GEOINT", "SIGINT"],
      distribution: "EYES ONLY - AUTHORIZED PERSONNEL"
    },
    coordinates: {
      latitude: "38°53'42.4\"N",
      longitude: "77°02'12.0\"W",
      elevation: "17m above sea level"
    }
  },
  {
    scene: "https://prod.spline.design/A7zppi2sIzSoYEOx/scene.splinecode",
    title: "WebRend",
    description: "Creation of a hyper-realistic, 3D globe with moving textures, flying through the atmosphere, and a fully interactive experience.",
    opCode: "OD-85311",
    status: "STANDBY",
    clearance: "LEVEL 3",
    location: "SECTOR 2, GRID 08-C",
    priority: "BRAVO",
    slug: "operation-deadbolt",
    fullDescription: "Operation Deadbolt is a defensive posture operation designed to secure critical assets through deployment of advanced tactical countermeasures and establishment of multi-layered defensive perimeters. The operation was initiated following confirmed intelligence reports indicating potential hostile incursion activities in the operational area. All strategic assets have been secured using standardized protection protocols, with continuous monitoring systems maintaining real-time awareness of the tactical situation.",
    objectives: [
      "Establish secure defensive perimeters around strategic assets",
      "Deploy advanced countermeasure systems",
      "Maintain continuous monitoring and early warning capabilities",
      "Coordinate rapid response protocols",
      "Ensure asset integrity and operational continuity"
    ],
    timeline: "INDEFINITE - UNTIL THREAT NEUTRALIZED",
    assets: [
      "3x Mobile Defense Platforms",
      "Advanced Sensor Arrays",
      "Electronic Countermeasure Systems",
      "Rapid Response Teams",
      "Hardened Communication Networks"
    ],
    riskAssessment: "HIGH - Active threat environment requires maximum operational security",
    personnel: {
      commander: "MAJ. David Chen",
      operatives: 24,
      specialization: ["Defensive Operations", "Electronic Warfare", "Rapid Response"]
    },
    classification: {
      level: "SECRET//REL TO USA, FVEY",
      compartments: ["DEADBOLT", "DEFENSIVE", "TACTICAL"],
      distribution: "OPERATIONAL COMMANDERS ONLY" 
    },
    coordinates: {
      latitude: "39°16'18.7\"N",
      longitude: "76°36'44.2\"W",
      elevation: "156m above sea level"
    }
  },
  {
    scene: "https://prod.spline.design/d3ny-zHKaeUwslBx/scene.splinecode",
    title: "Mal D'Amour",
    description: "RUNNING OUT OF TIME project, consisting of the modeling and animation of a watch on top of an undead hand.",
    opCode: "OB-42780",
    status: "PENDING",
    clearance: "LEVEL 5",
    location: "SECTOR 9, GRID 32-F",
    priority: "DELTA",
    slug: "operation-blacksite",
    fullDescription: "Operation Blacksite is a high-priority extraction mission focused on the recovery and containment of critical intelligence assets from a facility that has been compromised by hostile elements. The operation requires precise execution due to the sensitive nature of the intelligence materials and the high-risk operational environment. Comprehensive data analysis and tactical modeling indicate an 86% probability of successful mission completion using the current tactical approach and asset allocation.",
    objectives: [
      "Extract high-value intelligence assets from compromised facility",
      "Ensure complete data containment and security",
      "Neutralize any hostile presence at target location",
      "Establish secure extraction corridor",
      "Complete mission with zero intelligence compromise"
    ],
    timeline: "48 HOUR WINDOW - CRITICAL TIMING",
    assets: [
      "Special Operations Team Alpha",
      "Mobile Secure Data Unit",
      "Tactical Air Support",
      "Electronic Suppression Systems",
      "Emergency Extraction Vehicles"
    ],
    riskAssessment: "CRITICAL - High-value target with confirmed hostile presence",
    personnel: {
      commander: "LTC. Maria Rodriguez",
      operatives: 8,
      specialization: ["Special Operations", "Data Recovery", "Counter-Intelligence"]
    },
    classification: {
      level: "TOP SECRET//SCI//NOFORN",
      compartments: ["BLACKSITE", "HUMINT", "SPECIAL ACCESS"],
      distribution: "COMPARTMENTED - NEED TO KNOW ONLY"
    },
    coordinates: {
      latitude: "37°14'06.5\"N", 
      longitude: "80°25'09.8\"W",
      elevation: "423m above sea level"
    }
  },
  {
    title: "Vital Element",
    description: "First visualization of the Element pod, sparking investor interest amongst the chaotic tech startup scene.",
    opCode: "OB-42780",
    status: "PENDING",
    clearance: "LEVEL 5",
    location: "SECTOR 9, GRID 32-F",
    priority: "DELTA",
    slug: "vital-element",
    fullDescription: "Operation Blacksite is a high-priority extraction mission focused on the recovery and containment of critical intelligence assets from a facility that has been compromised by hostile elements. The operation requires precise execution due to the sensitive nature of the intelligence materials and the high-risk operational environment. Comprehensive data analysis and tactical modeling indicate an 86% probability of successful mission completion using the current tactical approach and asset allocation.",
    objectives: [
      "Extract high-value intelligence assets from compromised facility",
      "Ensure complete data containment and security",
      "Neutralize any hostile presence at target location",
      "Establish secure extraction corridor",
      "Complete mission with zero intelligence compromise"
    ],
    timeline: "48 HOUR WINDOW - CRITICAL TIMING",
    assets: [
      "Special Operations Team Alpha",
      "Mobile Secure Data Unit",
      "Tactical Air Support",
      "Electronic Suppression Systems",
      "Emergency Extraction Vehicles"
    ],
    riskAssessment: "CRITICAL - High-value target with confirmed hostile presence",
    personnel: {
      commander: "LTC. Maria Rodriguez",
      operatives: 8,
      specialization: ["Special Operations", "Data Recovery", "Counter-Intelligence"]
    },
    classification: {
      level: "TOP SECRET//SCI//NOFORN",
      compartments: ["BLACKSITE", "HUMINT", "SPECIAL ACCESS"],
      distribution: "COMPARTMENTED - NEED TO KNOW ONLY"
    },
    coordinates: {
      latitude: "37°14'06.5\"N", 
      longitude: "80°25'09.8\"W",
      elevation: "423m above sea level"
    }
  }
];

export const getProjectBySlug = (slug: string): ProjectData | undefined => {
  return projectsData.find(project => project.slug === slug);
};

// NFT Collections Data
export const nftProjectsData: NFTProjectData[] = [
  {
    scene: "",
    title: "Ethereal Beings",
    description: "A collection of 10,000 unique digital entities exploring the intersection of consciousness and digital existence.",
    collectionSize: 10000,
    blockchain: "Ethereum",
    mintPrice: "0.08 ETH",
    status: "LIVE",
    slug: "ethereal-beings",
    heroImage: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=1200&h=800&fit=crop",
    gallery: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=1200&h=800&fit=crop', alt: 'Collection overview' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop', alt: 'Reveal animation' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=1200&h=800&fit=crop', alt: 'Rarity tiers' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=1200&h=800&fit=crop', alt: '3D rendered beings' }
    ],
    artworkShowcase: [
      {
        title: "Character Design Philosophy",
        description: "Each Ethereal Being is designed to represent different aspects of digital consciousness, from data streams to quantum entanglement.",
        media: [
          { type: 'image', src: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&h=800&fit=crop', alt: 'Design sketches' },
          { type: 'image', src: 'https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?w=1200&h=800&fit=crop', alt: 'Digital refinement' }
        ]
      },
      {
        title: "Procedural Generation System",
        description: "Advanced algorithmic generation ensuring true uniqueness across all 10,000 beings.",
        media: [
          { type: 'image', src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=800&fit=crop', alt: 'Generation algorithm demo' }
        ]
      }
    ],
    creationProcess: [
      "Conceptual research into digital consciousness theories",
      "Development of base character archetypes", 
      "Creation of procedural generation algorithms",
      "3D modeling and texturing of base components",
      "Integration of rarity and trait systems"
    ],
    inspiration: "Inspired by theories of digital consciousness, quantum computing, and the philosophical question of what it means to exist in purely digital form.",
    // Client-focused information
    projectDuration: "4 months",
    clientType: "NFT & Digital Art",
    services: [
      "NFT Collection Design & Development",
      "Smart Contract Development",
      "Community Building Strategy",
      "Marketing & Launch Support"
    ],
    deliverables: [
      "10,000 unique NFT artworks",
      "Smart contract deployment",
      "Metadata generation system",
      "Community Discord setup",
      "Marketing campaign materials"
    ],
    marketingStrategy: [
      "Influencer partnerships in crypto space",
      "Community building through Discord",
      "Twitter Spaces and AMA sessions",
      "Exclusive holder benefits program"
    ],
    communitySize: "15K+ Discord members",
    testimonial: {
      quote: "Working with this team was incredible. They understood our vision for digital consciousness and brought it to life in ways we never imagined. The collection sold out in 3 hours!",
      author: "Alex Chen",
      company: "Ethereal Studios"
    },
    fullDescription: "Ethereal Beings represents a groundbreaking exploration of digital consciousness through generative art. Each NFT is a unique manifestation of an otherworldly entity, crafted using advanced 3D modeling techniques and algorithmic generation. The collection explores themes of digital transcendence, consciousness uploading, and the evolution of identity in virtual spaces.",
    rarity: {
      common: 6000,
      uncommon: 3000,
      rare: 800,
      legendary: 200
    },
    utilities: [
      "Exclusive access to virtual gallery exhibitions",
      "Voting rights in community governance",
      "Early access to future collections",
      "3D model downloads for personal use",
      "Virtual world avatar integration"
    ],
    roadmap: [
      "Q1 2024: Launch virtual gallery space",
      "Q2 2024: Community DAO formation",
      "Q3 2024: AR/VR integration",
      "Q4 2024: Physical art installations"
    ],
    artistStatement: "Through Ethereal Beings, I explore the liminal space between digital and physical consciousness, questioning what it means to exist in purely digital form.",
    technicalSpecs: {
      format: "MP4 + GLB",
      resolution: "4K (3840x2160)",
      metadata: "ERC-721 Standard"
    }
  },
  {
    scene: "https://prod.spline.design/d3ny-zHKaeUwslBx/scene.splinecode",
    title: "Cyber Citadels",
    description: "Architectural NFTs depicting futuristic cityscapes and megastructures in a post-digital world.",
    collectionSize: 5555,
    blockchain: "Polygon",
    mintPrice: "50 MATIC",
    status: "UPCOMING",
    slug: "cyber-citadels",
    fullDescription: "Cyber Citadels is an architectural journey through speculative urban futures. Each NFT represents a unique megastructure or cityscape, designed with photorealistic detail and inspired by cyberpunk aesthetics. The collection serves as both art and commentary on urban development in the digital age.",
    rarity: {
      common: 3000,
      uncommon: 1800,
      rare: 555,
      legendary: 200
    },
    utilities: [
      "Virtual land ownership in metaverse",
      "Architectural blueprint downloads",
      "Community building contests",
      "Exclusive architect interviews",
      "Physical model 3D printing files"
    ],
    roadmap: [
      "Q2 2024: Collection launch",
      "Q3 2024: Metaverse integration",
      "Q4 2024: Physical exhibition",
      "Q1 2025: Interactive city builder"
    ],
    artistStatement: "Cyber Citadels imagines how our cities might evolve in response to technological advancement and climate change, creating spaces that are both beautiful and functional.",
    technicalSpecs: {
      format: "PNG + 3D Model",
      resolution: "8K (7680x4320)",
      metadata: "ERC-1155 Standard"
    }
  },
  {
    scene: "https://prod.spline.design/rNSu9VRHiYbIR5lg/scene.splinecode",
    title: "Temporal Fragments",
    description: "Abstract time-based NFTs that evolve and change based on blockchain timestamps and market conditions.",
    collectionSize: 2222,
    blockchain: "Solana",
    mintPrice: "2.5 SOL",
    status: "SOLD OUT",
    slug: "temporal-fragments",
    fullDescription: "Temporal Fragments pushes the boundaries of what NFTs can be by creating artworks that exist in constant flux. Each piece evolves based on real-world data including time, weather, market conditions, and blockchain activity. No two viewings are ever the same, making each NFT a living, breathing artwork.",
    rarity: {
      common: 1000,
      uncommon: 800,
      rare: 333,
      legendary: 89
    },
    utilities: [
      "Dynamic artwork that changes over time",
      "Market data visualization dashboard",
      "Collector analytics tools",
      "Priority access to time-based drops",
      "Custom temporal algorithm creation"
    ],
    roadmap: [
      "COMPLETE: Initial mint and algorithm launch",
      "COMPLETE: Community analytics dashboard",
      "Q3 2024: Advanced temporal mechanics",
      "Q4 2024: Cross-chain integration"
    ],
    artistStatement: "Time is the ultimate medium. Temporal Fragments explores how digital art can exist not as static objects, but as processes that unfold through duration.",
    technicalSpecs: {
      format: "Dynamic WebGL",
      resolution: "Scalable Vector",
      metadata: "Metaplex Standard"
    }
  },
  {
    scene: "https://prod.spline.design/A7zppi2sIzSoYEOx/scene.splinecode",
    title: "Biomech Evolution",
    description: "Organic-mechanical hybrid creatures that showcase the fusion of biological and technological aesthetics.",
    collectionSize: 7777,
    blockchain: "Ethereum",
    mintPrice: "0.12 ETH",
    status: "MINTING",
    slug: "biomech-evolution",
    fullDescription: "Biomech Evolution explores the convergence of organic life and mechanical precision. Each NFT features a unique creature that seamlessly blends biological forms with technological enhancements. The collection questions the boundaries between natural and artificial, organic and synthetic.",
    rarity: {
      common: 4000,
      uncommon: 2500,
      rare: 1000,
      legendary: 277
    },
    utilities: [
      "Breeding mechanics for new combinations",
      "Game integration as playable characters",
      "Evolution tracking and genealogy",
      "Scientific collaboration partnerships",
      "Biotech research fund contributions"
    ],
    roadmap: [
      "Q3 2024: Breeding system launch",
      "Q4 2024: Gaming partnerships",
      "Q1 2025: Scientific collaborations",
      "Q2 2025: Real-world bio-art installations"
    ],
    artistStatement: "As technology becomes increasingly biological and biology becomes increasingly technological, Biomech Evolution imagines the aesthetic possibilities of this convergence.",
    technicalSpecs: {
      format: "MP4 + Interactive 3D",
      resolution: "4K (3840x2160)",
      metadata: "ERC-721A Standard"
    }
  }
];

export const getAllProjectSlugs = (): string[] => {
  return projectsData.map(project => project.slug);
};

export const getAllNFTProjectSlugs = (): string[] => {
  return nftProjectsData.map(project => project.slug);
};

export const getNFTProjectBySlug = (slug: string): NFTProjectData | undefined => {
  return nftProjectsData.find(project => project.slug === slug);
}; 