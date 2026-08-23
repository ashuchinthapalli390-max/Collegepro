/**
 * Master Verified Media Registry for Narasaraopeta Engineering College
 * All assets ingested from NRTEC official package with verified SHA-256 checksums.
 * Direct local static public paths are used to eliminate remote network dependencies.
 */

export const VERIFIED_MEDIA = {
  branding: {
    mainLogo: {
      id: 'nec-main-logo',
      src: '/assets/nrtec/branding/nec-main-logo.webp',
      alt: 'Narasaraopeta Engineering College Official Logo',
      width: 663,
      height: 120,
      aspectRatio: '663 / 120',
      category: 'BRANDING',
      sha256: '8e3ac0c9da84f44967fe82ff689b8194ce9fa450c53a357e7170d4d1d6f9dcdf',
      verified: true
    },
    accreditationBadges: {
      id: 'accreditations-badges',
      src: '/assets/nrtec/branding/accreditations-badges.png',
      alt: 'NAAC A+ Grade, NBA Accredited, Autonomous Institution, JNTUK Permanent Affiliation',
      width: 802,
      height: 311,
      aspectRatio: '802 / 311',
      category: 'BRANDING',
      sha256: '8b9ba53409447780328e10f3420827ebb723668e1fba26c4d43b0f89af3aa605',
      verified: true
    },
    organizationChart: {
      id: 'organization-chart',
      src: '/assets/nrtec/branding/organization-chart.webp',
      alt: 'NEC Institutional Governance & Organization Structure Chart',
      width: 1600,
      height: 1131,
      aspectRatio: '1600 / 1131',
      category: 'GOVERNANCE',
      sha256: '0a26c2b5b72c4d9e41c1cb92052e34f833376f4e8b536e5176b040728a3ce7b6',
      verified: true
    }
  },

  leadership: {
    chairman: {
      id: 'chairman-mittapalli-venkata-koteswara-rao',
      name: 'Sri Mittapalli Venkata Koteswara Rao',
      designation: 'Managing Founder & Chairman',
      src: '/assets/nrtec/people/chairman-mittapalli-venkata-koteswara-rao.webp',
      width: 853,
      height: 1280,
      objectPosition: '50% 15%',
      category: 'LEADERSHIP',
      sha256: '602a3c3733a5b273ecc34011753a1ca387d2e15973ac6f9248b4bd441752ee50',
      verified: true
    },
    viceChairmanPortrait: {
      id: 'vice-chairman-chakravarthi-portrait',
      name: 'Sri Mittapalli Chakravarthi',
      designation: 'Vice Chairman',
      src: '/assets/nrtec/people/vice-chairman-chakravarthi-portrait.webp',
      width: 2032,
      height: 2112,
      objectPosition: '50% 20%',
      category: 'LEADERSHIP',
      sha256: 'db7121254c08ac1ed926c7fb40b4e003162f4191b9dc3e817be88ee62e7531bd',
      verified: true
    },
    viceChairmanCard: {
      id: 'vice-chairman-chakravarthi',
      name: 'Sri Mittapalli Chakravarthi',
      designation: 'Vice Chairman',
      src: '/assets/nrtec/people/vice-chairman-chakravarthi.webp',
      width: 289,
      height: 200,
      objectPosition: '50% 20%',
      category: 'LEADERSHIP',
      sha256: '1217060ecc4c58abae9cc8cf0b815f042666eada9aeb19770c28cb3d00526061',
      verified: true
    },
    secretary: {
      id: 'secretary-mittapalli-ramesh-babu',
      name: 'Sri Mittapalli Ramesh Babu',
      designation: 'Secretary & Correspondent',
      src: '/assets/nrtec/people/secretary-mittapalli-ramesh-babu.webp',
      width: 400,
      height: 400,
      objectPosition: '50% 20%',
      category: 'LEADERSHIP',
      sha256: '899dfe65c1671c080a0e28ecce0eab908277900d868ea9b0a12c7116b2fd2d13',
      verified: true
    },
    director: {
      id: 'director-suhasini-mittapalli',
      name: 'Smt. Mittapalli Suhasini',
      designation: 'Executive Director',
      src: '/assets/nrtec/people/director-suhasini-mittapalli.webp',
      width: 300,
      height: 315,
      objectPosition: '50% 15%',
      category: 'LEADERSHIP',
      sha256: '719874e4e68952457f652549e14185ada57776e52baacf20523372b27edb31ec',
      verified: true
    },
    principal: {
      id: 'principal-s-venkateswarlu',
      name: 'Dr. S. Venkateswarlu',
      designation: 'Principal',
      src: '/assets/nrtec/people/principal-s-venkateswarlu.webp',
      width: 1200,
      height: 1598,
      objectPosition: '50% 18%',
      category: 'LEADERSHIP',
      sha256: '617c4a496904173e56dd5556e5ec9e4ad3aaf389c10e0f0c58229a470cf34542',
      verified: true
    },
    vicePrincipal: {
      id: 'vice-principal-d-suneel',
      name: 'Dr. D. Suneel',
      designation: 'Vice Principal & Dean Academics',
      src: '/assets/nrtec/people/vice-principal-d-suneel.webp',
      width: 1200,
      height: 630,
      objectPosition: '50% 25%',
      category: 'LEADERSHIP',
      sha256: '7000afa967418f6895ca86e21c38b57ec4fd7c76c4a1bf084d02a1d5a593dca6',
      verified: true
    }
  },

  homepage: {
    aboutUsStudents: {
      id: 'about-us-students',
      src: '/assets/nrtec/homepage/about-us-students.webp',
      alt: 'Students engaging in collaborative academic learning at NEC',
      width: 570,
      height: 390,
      category: 'HOMEPAGE',
      sha256: '4fc15c5e7617d0b0156a2ad8c9d926b73dfa0911b4bf27d4f6de9f7ddaa99b2b',
      verified: true
    },
    studentFeature: {
      id: 'student-feature-image',
      src: '/assets/nrtec/homepage/student-feature-image.webp',
      alt: 'NEC Engineering student at campus innovation center',
      width: 467,
      height: 465,
      category: 'HOMEPAGE',
      sha256: '665a207c3bc154ae72deef60abbcdd5225fad976f159afb4e83ce6fe3a290f8b',
      verified: true
    },
    indiaTodayRanking: {
      id: 'india-today-ranking-2026-mobile',
      src: '/assets/nrtec/homepage/india-today-ranking-2026-mobile.webp',
      alt: 'India Today Best Engineering Colleges Ranking 2026 - Narasaraopeta Engineering College',
      width: 360,
      height: 640,
      category: 'RANKINGS',
      sha256: '7c4d6ce6ec2c417211f42dba079d0ebf589f2f9f321c91d438754ef37b50934f',
      verified: true
    },
    timesRanking: {
      id: 'times-engineering-ranking-2026-mobile',
      src: '/assets/nrtec/homepage/times-engineering-ranking-2026-mobile.webp',
      alt: 'Times Engineering Institute Ranking Survey 2026 - NEC Top Rated',
      width: 360,
      height: 640,
      category: 'RANKINGS',
      sha256: '372ec7274da25c29f02d470b2ba1a2b740da2344ff7725ff0bbd8b58b92067c1',
      verified: true
    }
  },

  events: {
    roboticsAiWorkshop: {
      title: 'Advanced Robotics with Artificial Intelligence Workshop',
      poster: {
        id: 'advanced-robotics-ai-workshop-poster',
        src: '/assets/nrtec/events/advanced-robotics-ai-workshop-poster.webp',
        alt: 'Workshop Poster - Advanced Robotics with AI',
        width: 1170,
        height: 614,
        category: 'EVENT_POSTER',
        sha256: '58c6f39a11c8729a1480a7598e082ead19d2c84dc469590b166542bbf9754087',
        verified: true
      },
      sessions: [
        {
          id: 'robotics-session-01',
          src: '/assets/nrtec/events/advanced-robotics-ai-workshop-session-01.webp',
          alt: 'Hands-on practical session on AI robot kinematics and sensor integration',
          width: 1170,
          height: 614,
          sha256: '4724c9d03e454536d0d6b3d34c5d719f4e167bfef74b48a5e6a804cf74605f1a',
          verified: true
        },
        {
          id: 'robotics-session-02',
          src: '/assets/nrtec/events/advanced-robotics-ai-workshop-session-02.webp',
          alt: 'Faculty and student participants assembling embedded robotic controllers',
          width: 1170,
          height: 614,
          sha256: 'e8c9b93173f36afca7408a3e2a59e466f135d98cda0cb57aece3441aaac8d356',
          verified: true
        },
        {
          id: 'robotics-session-03',
          src: '/assets/nrtec/events/advanced-robotics-ai-workshop-session-03.webp',
          alt: 'Live demonstration of autonomous robot path planning and obstacle navigation',
          width: 1170,
          height: 614,
          sha256: '22c2ec7717e7d69301792aa4fe4beb48c7c7bb7d9e05e744375ef1d4a95aa9c5',
          verified: true
        },
        {
          id: 'robotics-session-04',
          src: '/assets/nrtec/events/advanced-robotics-ai-workshop-session-04.webp',
          alt: 'Interactive Q&A and project demonstration with resource persons',
          width: 1170,
          height: 614,
          sha256: '567300334e28df6dab1e13e72eb5b298cd100cc14ad78d033e5669781f3e4edf',
          verified: true
        }
      ]
    },
    mechanicalIndustrialVisit: {
      title: 'Department of Mechanical Engineering - Industrial Plant Visit',
      cover: {
        id: 'mechanical-industrial-visit-group',
        src: '/assets/nrtec/events/mechanical-industrial-visit-group.webp',
        alt: 'Mechanical Engineering students and faculty delegation at manufacturing plant',
        width: 1170,
        height: 614,
        category: 'EVENT_COVER',
        sha256: 'bce16adb40ac31ae83e0f4b3241afe0235ab9b7c7f8b2b667e2bbc77c9a70a44',
        verified: true
      },
      machinery: {
        id: 'mechanical-industrial-visit-machinery',
        src: '/assets/nrtec/events/mechanical-industrial-visit-machinery.webp',
        alt: 'Students examining heavy industrial automation and precision machining lines',
        width: 1170,
        height: 614,
        category: 'EVENT_GALLERY',
        sha256: '0e92d453dfdc203fb95386baa4530933468726b37e2e49357aec481127aedad8',
        verified: true
      }
    },
    quantumComputingFdp: {
      title: 'Faculty Development Programme (FDP) on Quantum Computing & Applications',
      poster: {
        id: 'quantum-computing-fdp-poster',
        src: '/assets/nrtec/events/quantum-computing-fdp-poster.webp',
        alt: 'Official Poster - Quantum Computing FDP',
        width: 1170,
        height: 614,
        category: 'FDP_POSTER',
        sha256: '346b078ab07de91d9af476e09e6247ed7d9e551b37883e861830289b9556f398',
        verified: true
      },
      session: {
        id: 'quantum-computing-fdp-session-01',
        src: '/assets/nrtec/events/quantum-computing-fdp-session-01.webp',
        alt: 'Faculty attendees in quantum algorithm formulation and qubit simulation session',
        width: 1170,
        height: 614,
        category: 'FDP_SESSION',
        sha256: '2187ddedc596387ce52509128760952c4bd9c73bc4b5379cd677ab897dcd2154',
        verified: true
      }
    }
  },

  placements: {
    lsAutomotiveGroup: {
      id: 'ls-automotive-35-students-group',
      src: '/assets/nrtec/placements/ls-automotive-35-students-group.webp',
      alt: '35 NEC students selected by LS Automotive Chennai in campus placement drive',
      width: 1170,
      height: 614,
      category: 'PLACEMENTS',
      sha256: '1b6f97275d8db10f8d2304c388101276d7d37db50d2a854f9d3bf1edbd5a17e7',
      verified: true
    },
    lsAutomotiveVertical: {
      id: 'ls-automotive-35-students-vertical',
      src: '/assets/nrtec/placements/ls-automotive-35-students-vertical.webp',
      alt: 'LS Automotive 35 Selections Official Announcement Poster',
      width: 720,
      height: 1280,
      category: 'PLACEMENTS',
      sha256: '1155d58aeef0af62f9879684318873bfe47608da5d8ceec2a48eee857be47cf5',
      verified: true
    },
    savantisVertical: {
      id: 'savantis-117-students-vertical',
      src: '/assets/nrtec/placements/savantis-117-students-vertical.webp',
      alt: 'Savantis Solutions 117 Students Placement Drive Announcement Poster',
      width: 360,
      height: 640,
      category: 'PLACEMENTS',
      sha256: '80e427a4552edb73a8045ad8706df88c389a3b5c88304f29f6ca66d2d2e72710',
      verified: true
    }
  },

  ui: {
    callAdmissionsIcon: {
      id: 'call-admissions-icon',
      src: '/assets/nrtec/ui/call-admissions-icon.png',
      alt: 'Admissions Inquiry Contact Icon',
      width: 512,
      height: 512,
      category: 'UI',
      sha256: '94d1024a28d9f1774a0be56a914755863d0c8fe19224c32cb72bf7e1d25180ed',
      verified: true
    }
  }
};
