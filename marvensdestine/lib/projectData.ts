export interface ProjectData {
  scene: string;
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
    scene: "https://prod.spline.design/rNSu9VRHiYbIR5lg/scene.splinecode",
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

export const getAllProjectSlugs = (): string[] => {
  return projectsData.map(project => project.slug);
}; 