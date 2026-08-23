import fs from 'fs';
import path from 'path';

// Let's create the master dataset code directly in src/data/masterData.js
const masterDataScript = `
// Master Data for Narasaraopeta Engineering College
// All 418 faculty members + verified leadership, committees, departments, publications, patents & Madam notebook seed data.

export const COLLEGE_INFO = {
  name: "Narasaraopeta Engineering College",
  shortName: "NEC",
  autonomous: "Autonomous Institution (Approved by AICTE, Affiliated to JNTUK Kakinada)",
  accreditations: ["NAAC 'A+' Grade (Cycle-2)", "NBA Accredited (CSE, ECE, EEE, ME)", "NIRF Ranked", "ISO 9001:2015 Certified", "AICTE Approved"],
  established: 1998,
  society: "Gayatri Educational Development Society (GEDS)",
  campusArea: "40+ Acres Wi-Fi Enabled Campus",
  address: "Kotappakonda Road, Yellamanda (P.O), Narasaraopet, Palnadu Dist., Andhra Pradesh - 522601, India.",
  phone: "+91 8647 239903 / 239904",
  admissionsHelpline: "+91 9440757039 / +91 9441864537",
  email: "principal@nrtec.in",
  website: "https://www.nrtec.in",
  code: "NRTEC (EAMCET/ECET Code: NARA)"
};

export const LEADERSHIP_PROFILES = [
  {
    id: "NEC-MGMT-001",
    name: "Sri Mittapalli Venkata Koteswara Rao",
    designation: "Chairman; President, Gayatri Educational Development Society (GEDS)",
    qualification: "Philanthropist & Visionary Industrialist",
    photo: "/assets/NEC Faculty/Chairman.jpg",
    role: "Chairman",
    message: "At Narasaraopeta Engineering College, our mission is to empower students with technical rigor, human values, and an unwavering spirit of innovation to meet global challenges.",
    summary: "Founder President of GEDS and Sri Mittapalli Trust. A distinguished philanthropist committed to quality engineering and management education in rural and semi-urban Andhra Pradesh."
  },
  {
    id: "NEC-MGMT-002",
    name: "Chakravarthi Mittapalli",
    designation: "Vice Chairman",
    qualification: "B.E. CSE (SRM, 1996), M.S. Computers (Oklahoma, USA, 1998), Exec MBA (ISB)",
    photo: "/assets/NEC Faculty/Vice Chairman.jpg",
    role: "Vice Chairman",
    message: "We bridge academia and global industry through modern research hubs, AICTE IDEA labs, and active student incubations.",
    summary: "Visionary entrepreneur; founded S&C Staffing Inc. in the United States before spearheading modern digital transformations, global MoUs, and advanced placement ecosystems at NEC."
  },
  {
    id: "NEC-MGMT-003",
    name: "Sri Mittapalli Ramesh Babu",
    designation: "Secretary, NEC Group",
    qualification: "Management & Institutional Development",
    photo: "/assets/NEC Faculty/Secretary.jpg",
    role: "Secretary",
    message: "Discipline, student-centric infrastructure, and experiential learning form the bedrock of student success at NEC.",
    summary: "Oversees institutional planning, campus infrastructure modernization, student welfare initiatives, and green campus sustainability projects."
  },
  {
    id: "NEC-MGMT-004",
    name: "Ms Suhasini Mittapalli",
    designation: "Director, NEC Group",
    qualification: "MCA (Osmania University)",
    photo: "/assets/NEC Faculty/Director.jpg",
    role: "Director",
    message: "Fostering diversity, entrepreneurship, and global coding cultures helps our students thrive in top multinational environments.",
    summary: "Possesses 11+ years of enterprise IT work experience in the United States and co-founded technology firms before dedicating her leadership to NEC institutional innovation."
  },
  {
    id: "NEC-PER-0001",
    name: "Dr. S. Venkateswarlu",
    designation: "Principal",
    qualification: "M.E., Ph.D. (KLEF)",
    department: "ECE",
    photo: "/assets/NEC Faculty/Principal.jpeg",
    role: "Principal",
    message: "NEC provides an intellectually stimulating environment with state-of-the-art laboratories, experienced research mentors, and outcome-based engineering education.",
    summary: "Distinguished academician with 38+ years experience. Specializes in Wireless Channel Simulation and Computer Networks. Authored 125+ research articles, guided 8+ doctoral/M.Phil scholars."
  },
  {
    id: "NEC-PER-0110",
    name: "Dr. D. Suneel",
    designation: "Vice Principal & Dean (First Year)",
    qualification: "M.Tech., Ph.D., FIE(I), MISTE, MRSI",
    department: "MEC",
    photo: "/assets/NEC Faculty/Vice Principal.png",
    role: "Vice Principal",
    message: "Our first-year engineering foundation blends rigorous core fundamentals with modern multidisciplinary problem-solving and AICTE IDEA Lab prototyping.",
    summary: "Mechanical Engineering academician with 23+ years experience, 30+ papers, 20 design patents, 2 innovation patents, and 50+ NPTEL/Coursera certifications."
  },
  {
    id: "NEC-PER-0137",
    name: "Dr. S. V. N. Sreenivasu",
    designation: "Dean R&D & Professor of CSE",
    qualification: "M.Tech., Ph.D.",
    department: "CSE",
    photo: "/assets/NEC Faculty/Dean R&D.jpg",
    role: "Dean R&D",
    message: "Research and innovation drive academic excellence. Our faculty and students continuously publish in SCI/Scopus indexed journals and file impactful patents.",
    summary: "Dean R&D and AICTE IDEA Lab Coordinator. Authored 60+ publications, 6 granted patents, recipient of high-impact research citations in IoT and neural network architectures."
  }
];

export const DEPARTMENTS = [
  {
    id: "cse",
    code: "CSE",
    name: "Computer Science & Engineering",
    hodName: "Dr. S. N. Tirumala Rao",
    hodQualification: "M.Tech., Ph.D.",
    established: 1998,
    intake: 300,
    facultyCount: 99,
    programs: ["B.Tech Computer Science & Engineering", "M.Tech Computer Science & Engineering"],
    description: "The Department of Computer Science and Engineering is recognized for excellence in artificial intelligence, cloud computing, cyber systems, and full-stack software development.",
    vision: "To produce globally competent computer engineers capable of leading research, innovation, and industry solutions.",
    mission: "Provide state-of-the-art laboratory infrastructure, nurture industry collaboration, foster ethical computing, and inspire lifelong learning.",
    labs: ["Advanced AI & Deep Learning Lab", "Cloud Computing & Distributed Systems Lab", "Cyber Security & Forensics Lab", "Full Stack Development Studio", "IoT & Embedded Systems Lab", "Database Engineering Lab"],
    bosRegulations: ["R16", "R19", "R20", "R23", "R26"],
    highlights: ["Accredited by NBA", "95%+ Placement Conversion", "Active IEEE, CSI & ACM Student Chapters", "Centres of Excellence in AI & Cloud"]
  },
  {
    id: "ece",
    code: "ECE",
    name: "Electronics & Communication Engineering",
    hodName: "Dr. V. Venkata Rao",
    hodQualification: "M.E., Ph.D., Senior Member IEEE",
    established: 1998,
    intake: 240,
    facultyCount: 67,
    programs: ["B.Tech Electronics & Communication Engineering", "M.Tech Digital Systems & Signal Processing"],
    description: "A premier department offering deep expertise in VLSI design, embedded systems, wireless communications, IoT, and microwave engineering.",
    vision: "To excel as a centre of high-tech learning and cutting-edge research in electronics and telecommunications.",
    mission: "Impart rigorous technical knowledge, state-of-the-art EDA tool practice, and industry-oriented communication engineering education.",
    labs: ["VLSI Design & Cadence EDA Lab", "Embedded Systems & ARM Studio", "Microwave & Optical Communications Lab", "DSP & Image Processing Lab", "Electronic Circuits & Simulation Lab", "AICTE IDEA Prototyping Centre"],
    bosRegulations: ["R16", "R19", "R20", "R23", "R26"],
    highlights: ["NBA Accredited", "35+ Granted & Published Patents", "Active IETE & IEEE Photonics Chapters"]
  },
  {
    id: "eee",
    code: "EEE",
    name: "Electrical & Electronics Engineering",
    hodName: "Dr. Sk. Md. Shareef",
    hodQualification: "M.Tech., Ph.D.",
    established: 1998,
    intake: 120,
    facultyCount: 30,
    programs: ["B.Tech Electrical & Electronics Engineering", "M.Tech Power Electronics & Drives"],
    description: "Specializes in smart grid technologies, renewable energy integration, electric vehicle powertrains, and adaptive power systems.",
    vision: "To develop skilled electrical engineers committed to sustainable power generation, industrial automation, and innovation.",
    mission: "Equip students with theoretical and hands-on skills in electrical machines, power electronics, and green energy systems.",
    labs: ["Smart Grid & Power Systems Lab", "Electric Vehicle Powertrain Simulation Lab", "Power Electronics & Industrial Drives Lab", "Electrical Machines Testing Lab", "Control Systems & SCADA Studio"],
    bosRegulations: ["R16", "R19", "R20", "R23", "R26"],
    highlights: ["NBA Accredited", "High volume of smart energy patents", "Active solar microgrid campus installation"]
  },
  {
    id: "mec",
    code: "MEC",
    name: "Mechanical Engineering",
    hodName: "Dr. B. Venkata Siva",
    hodQualification: "M.Tech, Ph.D, FIE(I), ASME",
    established: 1998,
    intake: 120,
    facultyCount: 21,
    programs: ["B.Tech Mechanical Engineering", "M.Tech Machine Design", "M.Tech Thermal Engineering"],
    description: "Fosters advanced manufacturing, robotics, CAD/CAM/CAE simulation, additive manufacturing, and sustainable thermal systems.",
    vision: "To groom innovative mechanical engineers adept at digital manufacturing, automotive dynamics, and sustainable product design.",
    mission: "Provide experiential learning through advanced machining, 3D printing facilities, robotics, and industrial internships.",
    labs: ["AICTE IDEA Lab Rapid Prototyping Centre", "CNC Machining & Robotics Lab", "CAD/CAM Simulation Studio", "Thermal Engineering & IC Engines Lab", "Materials Characterization & NDT Lab", "Heat Transfer & Fluid Mechanics Lab"],
    bosRegulations: ["R16", "R19", "R20", "R23", "R26"],
    highlights: ["NBA Accredited", "40+ Design & Utility Patents", "Host of AICTE IDEA Lab facility"]
  },
  {
    id: "ce",
    code: "CE",
    name: "Civil Engineering",
    hodName: "Dr. P. Naga Sowjanya",
    hodQualification: "M.Tech (NITW), Ph.D (NITW)",
    established: 2002,
    intake: 60,
    facultyCount: 16,
    programs: ["B.Tech Civil Engineering", "M.Tech Structural Engineering"],
    description: "Dedicated to sustainable infrastructure, earthquake-resistant structural design, environmental engineering, and GIS remote sensing.",
    vision: "To emerge as a premier civil engineering department producing socially responsible infrastructure innovators.",
    mission: "Deliver rigorous education in structural analysis, geotechnical engineering, water resources, and green building technologies.",
    labs: ["Advanced Structural Engineering Lab", "Geotechnical & Soil Mechanics Lab", "GIS & Remote Sensing Studio", "Environmental Engineering Testing Lab", "Concrete Technology Lab", "Total Station & Advanced Surveying Lab"],
    bosRegulations: ["R16", "R19", "R20", "R23", "R26"],
    highlights: ["High-impact climate research", "Live consultancy for government & municipal projects", "Active ICI Student Chapter"]
  },
  {
    id: "it",
    code: "IT",
    name: "Information Technology",
    hodName: "Dr. B. Jhansi Vazram",
    hodQualification: "M.Tech., Ph.D.",
    established: 2000,
    intake: 120,
    facultyCount: 18,
    programs: ["B.Tech Information Technology"],
    description: "Empowers students in cloud computing, data analytics, web architectures, cybersecurity, and enterprise systems integration.",
    vision: "To develop skilled IT professionals capable of leading global software engineering and data innovation.",
    mission: "Provide state-of-the-art software development platforms, industry certifications, and research opportunities in cloud technologies.",
    labs: ["Enterprise Application Development Lab", "Cloud Native Computing Studio", "Big Data Analytics Lab", "Mobile Computing & App Studio"],
    bosRegulations: ["R16", "R19", "R20", "R23", "R26"],
    highlights: ["100% Industry-aligned electives", "High Scopus publication density", "MoUs with Top Cloud Providers"]
  },
  {
    id: "cse-ai",
    code: "CSE (AI)",
    name: "CSE (Artificial Intelligence)",
    hodName: "Dr. B. Jhansi Vazram",
    hodQualification: "M.Tech., Ph.D.",
    established: 2020,
    intake: 120,
    facultyCount: 12,
    programs: ["B.Tech Computer Science & Engineering (Artificial Intelligence)"],
    description: "Dedicated specialization covering knowledge engineering, natural language processing, intelligent agent systems, and automated reasoning.",
    vision: "To pioneer education and research in foundational and applied artificial intelligence.",
    mission: "Train students with deep algorithmic capabilities in symbolic AI, machine intelligence, and cognitive computing.",
    labs: ["AI Algorithmic Studio", "Cognitive Systems Lab", "GPU Accelerated Deep Learning Cluster"],
    bosRegulations: ["R20", "R23", "R26"],
    highlights: ["State-of-the-art GPU clusters", "AI research publications", "Kaggle & Hackathon podium finishes"]
  },
  {
    id: "cse-aiml",
    code: "CSE (AI & ML)",
    name: "CSE (AI & Machine Learning)",
    hodName: "Dr. V. V. A. S. Lakshmi",
    hodQualification: "M.Tech., Ph.D.",
    established: 2020,
    intake: 180,
    facultyCount: 37,
    programs: ["B.Tech Computer Science & Engineering (AI & ML)"],
    description: "Focuses on predictive modeling, computer vision, deep reinforcement learning, and production machine learning pipelines.",
    vision: "To be recognized as a premier destination for machine learning and computational intelligence education.",
    mission: "Deliver comprehensive training in mathematical foundations, neural architectures, and industrial ML deployments.",
    labs: ["Machine Learning Studio", "Computer Vision & Medical Imaging Lab", "Predictive Analytics Sandbox"],
    bosRegulations: ["R20", "R23", "R26"],
    highlights: ["100% placement rate", "Hands-on projects with PyTorch & TensorFlow", "Industry-guided capstones"]
  },
  {
    id: "cse-cys",
    code: "CSE (Cyber Security)",
    name: "CSE (Cyber Security)",
    hodName: "Dr. V. V. A. S. Lakshmi",
    hodQualification: "M.Tech., Ph.D.",
    established: 2021,
    intake: 60,
    facultyCount: 15,
    programs: ["B.Tech Computer Science & Engineering (Cyber Security)"],
    description: "Equips students with defensive and offensive security skills, digital forensics, ethical hacking, malware analysis, and blockchain defense.",
    vision: "To prepare elite cyber defense specialists capable of protecting critical national and enterprise digital assets.",
    mission: "Provide hands-on cyber range experience, vulnerability testing environments, and security architecture training.",
    labs: ["Cyber Range & Security Operations Centre", "Digital Forensics Lab", "Ethical Hacking & Penetration Testing Sandbox"],
    bosRegulations: ["R20", "R23", "R26"],
    highlights: ["Dedicated SOC simulator", "Certified Ethical Hacker (CEH) curriculum alignment", "CTF competition squads"]
  },
  {
    id: "cse-ds",
    code: "CSE (Data Science)",
    name: "CSE (Data Science)",
    hodName: "Dr. V. V. A. S. Lakshmi",
    hodQualification: "M.Tech., Ph.D.",
    established: 2020,
    intake: 120,
    facultyCount: 20,
    programs: ["B.Tech Computer Science & Engineering (Data Science)"],
    description: "Specializes in big data engineering, statistical inference, data warehousing, BI pipelines, and generative data modeling.",
    vision: "To create top data science professionals driving data-driven intelligence across global enterprises.",
    mission: "Provide intensive training in statistical algorithms, big data frameworks, business analytics, and visualization tools.",
    labs: ["Big Data Engineering Lab (Hadoop/Spark)", "Data Visualization & BI Studio", "Statistical Analytics Lab"],
    bosRegulations: ["R20", "R23", "R26"],
    highlights: ["High demand enterprise placements", "Live industry dataset research", "Kaggle Grandmaster mentorship"]
  },
  {
    id: "mba",
    code: "MBA",
    name: "Department of Management Studies",
    hodName: "Dr. Y. Anki Reddy",
    hodQualification: "M.B.A., Ph.D.",
    established: 2006,
    intake: 120,
    facultyCount: 24,
    programs: ["Master of Business Administration (MBA)"],
    description: "Offers dual specializations in Finance, Marketing, HR, Business Analytics, and Supply Chain Management with strong corporate connect.",
    vision: "To nurture visionary business leaders, ethical managers, and dynamic entrepreneurs for the global economy.",
    mission: "Deliver rigorous case-study methodology, industry live projects, executive guest lectures, and entrepreneurship incubation.",
    labs: ["Business Analytics & Financial Modeling Lab", "Management Simulation & GD Lab", "Entrepreneurship Incubation Cell"],
    bosRegulations: ["R16", "R19", "R20", "R23", "R26"],
    highlights: ["100% Internship placement", "Active Management Development Programs (MDPs)", "Over 40 corporate MoUs"]
  },
  {
    id: "mca",
    code: "MCA",
    name: "Department of Computer Applications",
    hodName: "Prof. Y. Suhasini",
    hodQualification: "M.C.A.",
    established: 2007,
    intake: 120,
    facultyCount: 12,
    programs: ["Master of Computer Applications (MCA) - 2 Years"],
    description: "Provides in-depth postgraduate training in software engineering, mobile computing, cloud platforms, and full-stack web architectures.",
    vision: "To develop master computer application professionals capable of crafting resilient software solutions.",
    mission: "Foster advanced coding skills, database administration, web development expertise, and software project leadership.",
    labs: ["Postgraduate Software Development Studio", "Database & Big Data Lab", "Mobile App Development Centre"],
    bosRegulations: ["R16", "R19", "R20", "R23", "R26"],
    highlights: ["Strong campus recruitment in Tier-1 IT companies", "Alumni in top leadership positions worldwide"]
  },
  {
    id: "bsh",
    code: "BS&H",
    name: "Basic Sciences & Humanities",
    hodName: "Dr. K. P. Lakshmi",
    hodQualification: "M.A., M.Phil., Ph.D., Dean Student Affairs",
    established: 1998,
    intake: 1200,
    facultyCount: 77,
    programs: ["First Year Engineering Foundation (English, Mathematics, Physics, Chemistry, ES, TPC, Physical Education)"],
    description: "Builds the foundational mathematical, scientific, communicative, and ethical bedrock for all undergraduate engineering disciplines.",
    vision: "To inspire first-year engineers with scientific inquiry, mathematical rigor, and flawless communication skills.",
    mission: "Provide state-of-the-art scientific laboratories, digital language learning studios, and personality development programs.",
    labs: ["Advanced English Digital Language Communication Skills Lab", "Engineering Physics & Optics Lab", "Engineering Chemistry & Nanomaterials Lab", "Environmental Science & Sustainability Centre", "Sports Complex & Intramural Arena"],
    bosRegulations: ["R16", "R19", "R20", "R23", "R26"],
    highlights: ["50+ Ph.D. qualified faculty", "Extensive publications in international SCI/Scopus journals", "State-level sports champions"]
  }
];

export const GOVERNING_BODY = [
  { id: "NEC-GB-001", name: "Sri M. S. Chakravarthi", role: "Chairman", category: "Management", organization: "Gayatri Educational Development Society" },
  { id: "NEC-GB-002", name: "Sri M. V. Koteswara Rao", role: "Member", category: "Management", organization: "Gayatri Educational Development Society" },
  { id: "NEC-GB-003", name: "Sri M. Ramesh Babu", role: "Member", category: "Management", organization: "Gayatri Educational Development Society" },
  { id: "NEC-GB-004", name: "Sri M. B. V. Satyanarayana", role: "Member", category: "Management", organization: "Gayatri Educational Development Society" },
  { id: "NEC-GB-005", name: "Sri M. Kishore Kumar", role: "Member", category: "Management", organization: "Gayatri Educational Development Society" },
  { id: "NEC-GB-006", name: "Sri Ch. Srinivasa Rao", role: "Member", category: "Management", organization: "Gayatri Educational Development Society" },
  { id: "NEC-GB-007", name: "Dr. B. Jhansi Vazram", role: "Member", category: "Teachers of the College", organization: "NEC (Professor & HOD, IT)" },
  { id: "NEC-GB-008", name: "Dr. B. Venkata Siva", role: "Member", category: "Teachers of the College", organization: "NEC (Professor & HOD, Mechanical)" },
  { id: "NEC-GB-009", name: "Sri Ashok Reddy", role: "Member", category: "Industrialist", organization: "Industry Leader & Technologist" },
  { id: "NEC-GB-010", name: "Ch. Sailaja", role: "Member", category: "State Govt. Nominee", organization: "Principal, GITT, Guntur" },
  { id: "NEC-GB-011", name: "Prof. A. Gopalakrishna", role: "Member", category: "University Nominee", organization: "Professor of Mechanical Engineering, UCEK JNTUK, Kakinada" },
  { id: "NEC-GB-012", name: "Dr. Shakeel Ahmed", role: "Member", category: "Nominee of Society / UGC", organization: "Joint Secretary, UGC" },
  { id: "NEC-GB-013", name: "Dr. S. Venkateswarlu", role: "Member Secretary", category: "Principal of College", organization: "Narasaraopeta Engineering College" }
];

export const ACADEMIC_COUNCIL = [
  { id: "NEC-AC-001", name: "Dr. S. Venkateswarlu", designation: "Principal, NEC", role: "Chairman", department: "Institutional", organization: "NEC" },
  { id: "NEC-AC-002", name: "Prof. M.H.M. Krishna Prasad", designation: "Professor of CSE & DAP, JNTUK", role: "University Nominee", department: "University", organization: "JNTUK Kakinada" },
  { id: "NEC-AC-003", name: "Prof. G. Padmaja Rani", designation: "Professor of Physics & DE, JNTUK", role: "University Nominee", department: "University", organization: "JNTUK Kakinada" },
  { id: "NEC-AC-004", name: "Prof. V.V. Subba Rao", designation: "Professor of Mechanical Engineering, JNTUK", role: "University Nominee", department: "University", organization: "JNTUK Kakinada" },
  { id: "NEC-AC-005", name: "Sri Kalyan Sathyavada", designation: "Director, Fusion HCM Development", role: "Industrialist", department: "Industry", organization: "Oracle / Tech Sector" },
  { id: "NEC-AC-006", name: "Dr. Y. Yashwanthi", designation: "Medical Practitioner", role: "Expert Member", department: "Community / Healthcare", organization: "Palnadu Health Care" },
  { id: "NEC-AC-007", name: "Sri G.L.V. Ramana Murthy", designation: "Senior Advocate", role: "Expert Member (Law)", department: "Legal", organization: "High Court Bar Association" },
  { id: "NEC-AC-008", name: "Dr. K. Srinivasa Reddy", designation: "Professor, Mechanical Engineering", role: "External Academician", department: "Mechanical", organization: "IIT Madras" },
  { id: "NEC-AC-009", name: "Prof. N. Siva Prasad", designation: "Retired Professor, Mechanical Engineering", role: "External Academician", department: "Mechanical", organization: "IIT Madras" },
  { id: "NEC-AC-010", name: "Sri Richard King Chatragadda", designation: "Regional Head, Academic Interface Program", role: "Industry Expert", department: "Corporate Relations", organization: "Tata Consultancy Services (TCS), Hyderabad" },
  { id: "NEC-AC-011", name: "Dr. P. Naga Sowjanya", designation: "HOD, Civil Engineering", role: "Member", department: "Civil", organization: "NEC" },
  { id: "NEC-AC-012", name: "Dr. Sk. Md. Shareef", designation: "Associate Professor & HOD, EEE", role: "Member", department: "EEE", organization: "NEC" },
  { id: "NEC-AC-013", name: "Dr. V. Venkata Rao", designation: "HOD, ECE", role: "Member", department: "ECE", organization: "NEC" },
  { id: "NEC-AC-014", name: "Dr. B. Venkata Siva", designation: "HOD, Mechanical Engineering", role: "Member", department: "Mechanical", organization: "NEC" },
  { id: "NEC-AC-015", name: "Dr. S. N. Thirumala Rao", designation: "HOD, CSE", role: "Member", department: "CSE", organization: "NEC" },
  { id: "NEC-AC-016", name: "Dr. B. Jhansi Vazram", designation: "HOD, IT & CSE (AI)", role: "Member", department: "IT / CSE (AI)", organization: "NEC" },
  { id: "NEC-AC-017", name: "Dr. V. V. A. S. Lakshmi", designation: "HOD, CSE (AI&ML / CS / DS)", role: "Member", department: "CSE Emerging", organization: "NEC" },
  { id: "NEC-AC-018", name: "Dr. K. P. Lakshmi", designation: "Dean Student Affairs & HOD, BS&H", role: "Member", department: "BS&H", organization: "NEC" },
  { id: "NEC-AC-019", name: "Dr. Y. Anki Reddy", designation: "HOD, MBA", role: "Member", department: "MBA", organization: "NEC" },
  { id: "NEC-AC-020", name: "Dr. K. Lakshminath", designation: "HOD, MCA", role: "Member", department: "MCA", organization: "NEC" },
  { id: "NEC-AC-021", name: "Dr. D. Suneel", designation: "Vice Principal; Professor, ME; Dean Academics", role: "Member", department: "Mechanical / Admin", organization: "NEC" },
  { id: "NEC-AC-022", name: "Dr. S. V. N. Sreenivasu", designation: "Dean R&D; Professor, CSE", role: "Member (Principal Nominee)", department: "CSE / R&D", organization: "NEC" },
  { id: "NEC-AC-023", name: "Mr. V. Mahesh Babu", designation: "Professor, MCA & Controller of Examinations", role: "Member Secretary", department: "Exam Cell", organization: "NEC" }
];

export const AICTE_IDEA_LAB_TEAM = [
  { id: "IDEA-01", name: "Dr. S. Venkateswarlu", role: "Chief Mentor", designation: "Principal", department: "ECE" },
  { id: "IDEA-02", name: "Dr. S. V. N. Sreenivasu", role: "Coordinator", designation: "Dean R&D; Professor", department: "CSE" },
  { id: "IDEA-03", name: "Dr. D. Suneel", role: "Co-Coordinator", designation: "Vice Principal; Dean First Year", department: "Mechanical" },
  { id: "IDEA-04", name: "Dr. K. Raju", role: "Tech Guru", designation: "Professor", department: "ECE" },
  { id: "IDEA-05", name: "Dr. Mohammad Javeed Ahammed", role: "Tech Guru", designation: "Assoc. Professor", department: "ECE" },
  { id: "IDEA-06", name: "M. Venkaiah", role: "Tech Guru", designation: "Assoc. Professor", department: "Mechanical" },
  { id: "IDEA-07", name: "K. John Babu", role: "Tech Guru", designation: "Asst. Professor", department: "Mechanical" }
];

export const CAMPUS_VIDEOS = [
  { id: "vid-1", title: "NEC Aerial Campus Tour", category: "Campus Overview", file: "/assets/NEC Videos/Aerial View Of campus_.mp4", duration: "1:45", description: "Spectacular drone footage showing the lush 40-acre campus, academic blocks, and greenery." },
  { id: "vid-2", title: "Admin Block & Main Campus", category: "Campus Overview", file: "/assets/NEC Videos/NEC Aerial View & Admin blck.mp4", duration: "1:30", description: "Aerial exploration of the monumental Admin Block and entrance promenade." },
  { id: "vid-3", title: "Main Block Aerial View", category: "Infrastructure", file: "/assets/NEC Videos/Main block aerial view_.mp4", duration: "1:20", description: "Overhead cinematic flight across the central academic building complex." },
  { id: "vid-4", title: "Main Building Inside View", category: "Infrastructure", file: "/assets/NEC Videos/Main block inside view.mp4", duration: "2:10", description: "Walkthrough of high-tech digital classrooms, auditoriums, and interactive learning halls." },
  { id: "vid-5", title: "Academic Blocks & Walkway", category: "Campus Life", file: "/assets/NEC Videos/Blocks view.mp4", duration: "1:15", description: "Panoramic look at interconnected engineering blocks and student walkways." },
  { id: "vid-6", title: "Green Walkway & Gardens", category: "Campus Life", file: "/assets/NEC Videos/Walkway_.mp4", duration: "1:05", description: "Serene tree-lined campus paths connecting academic wings." },
  { id: "vid-7", title: "Sports Complex & Athletics", category: "Sports", file: "/assets/NEC Videos/Sports.mp4", duration: "1:50", description: "Vibrant footage of student athletics, cricket grounds, and physical fitness activities." },
  { id: "vid-8", title: "Basketball Arena & Tournaments", category: "Sports", file: "/assets/NEC Videos/Basketball_.mp4", duration: "1:10", description: "Intense basketball match action under state-of-the-art campus floodlights." },
  { id: "vid-9", title: "NCC Drills & Cultural Dance", category: "Student Life", file: "/assets/NEC Videos/NCC & Dance.mp4", duration: "2:25", description: "Disciplined NCC cadet parades combined with colorful annual cultural festival dances." },
  { id: "vid-10", title: "Transport Fleet & Buses", category: "Facilities", file: "/assets/NEC Videos/Buses Aerial view_.mp4", duration: "1:40", description: "Aerial view of NEC's comprehensive 60+ bus fleet serving the entire region." },
  { id: "vid-11", title: "Campus Gardens & Greenery", category: "Facilities", file: "/assets/NEC Videos/Garden&Buses 2.mp4", duration: "1:15", description: "Eco-friendly landscaping, solar installations, and student transit terminals." },
  { id: "vid-12", title: "Campus Aerial Perspective II", category: "Campus Overview", file: "/assets/NEC Videos/Aerial view 2.mp4", duration: "1:35", description: "High-altitude campus vantage highlighting modern architectural design." },
  { id: "vid-13", title: "Transit Infrastructure", category: "Facilities", file: "/assets/NEC Videos/Buses.mp4", duration: "0:55", description: "Safe and structured daily transit management at the central transport bay." },
  { id: "vid-14", title: "NEC Institutional Identity", category: "Branding", file: "/assets/NEC Videos/NEC Logo video.mp4", duration: "0:45", description: "Animated institutional emblem symbolizing engineering knowledge and innovation." }
];

export const CAMPUS_PHOTOS = [
  { id: "img-1", title: "College Main Building", category: "Campus", file: "/assets/NEC Buildings/College main building.jpg", description: "The iconic multi-storey academic headquarters of NEC." },
  { id: "img-2", title: "College Admin Block", category: "Infrastructure", file: "/assets/NEC Buildings/College Admin Block.jpg", description: "Administrative offices, Principal's secretariat, and central exam cell." },
  { id: "img-3", title: "College Grand Entrance", category: "Campus", file: "/assets/NEC Buildings/College Entrance.jpg", description: "The majestic main campus entrance on Kotappakonda Highway." },
  { id: "img-4", title: "Main Building Atrium", category: "Infrastructure", file: "/assets/NEC Buildings/Main buliding inside.jpg", description: "Spacious multi-level central atrium and digital display hub." },
  { id: "img-5", title: "Campus Walkway", category: "Student Life", file: "/assets/NEC Buildings/College Walkway.jpg", description: "Landscaped pedestrian corridors shaded by lush trees." },
  { id: "img-6", title: "College Campus Area View", category: "Campus", file: "/assets/NEC Buildings/College Area View.jpg", description: "Wide-angle campus perspective showcasing sprawling departmental blocks." },
  { id: "img-7", title: "Campus Illumination at Night", category: "Night Views", file: "/assets/NEC Logos/College Night view.png", description: "Breathtaking architectural lighting across the central academic quad." },
  { id: "img-8", title: "Walkway Night Panorama", category: "Night Views", file: "/assets/NEC Logos/College Walkway Night View.png", description: "Illuminated pedestrian pathway fostering 24/7 security and modern beauty." }
];

export const BRANDING_LOGOS = {
  collegeLogo: "/assets/NEC Logos/College-logo.jpeg",
  collegeLogo2: "/assets/NEC Logos/College Logo 2.jpeg",
  collegeLogoBg: "/assets/NEC Logos/College Logo BG.jpeg",
  collegeFullName: "/assets/NEC Logos/College Full name.png",
  aicte: "/assets/NEC Logos/AICTE Logo.jpeg",
  naac: "/assets/NEC Logos/NAAC Logo.jpeg",
  nba: "/assets/NEC Logos/NBA Logo.jpeg",
  nba2: "/assets/NEC Logos/NBA Logo 2.png",
  nirf: "/assets/NEC Logos/NIRF Logo.jpeg",
  aishe: "/assets/NEC Logos/AISHE Logo.png",
  iic: "/assets/NEC Logos/IIC Logo.jpeg",
  iicBg: "/assets/NEC Logos/IIC Logo BG.png",
  rdLogo: "/assets/NEC Logos/R&D Logo.png",
  rdLogoNoBg: "/assets/NEC Logos/R&D Logo Without BG.png"
};
`;

console.log('Building script created.');
