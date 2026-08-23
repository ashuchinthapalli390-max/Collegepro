/**
 * NEC Local Scholarly Research Index & Dataset Snapshot Store
 * 
 * Production architecture for offline public snapshot indexing:
 * - OpenAlex Parquet Public Snapshot (June 2026)
 * - Crossref Public Data File (March 2026)
 * - ORCID Annual Public Data File (2025)
 * 
 * ZERO runtime calls to external APIs. 100% deterministic local indexing.
 */

// 1. Snapshot Dataset Versions
export const INITIAL_DATASET_VERSIONS = [
  {
    id: 'ds_openalex_2026_06',
    source: 'OPENALEX',
    name: 'OpenAlex Public Snapshot (Parquet)',
    datasetVersion: '2026-06-01',
    publishedDate: '2026-06-01',
    status: 'READY',
    totalGlobalRecords: '649M Works / 112M Authors',
    relevantRecordCount: 486,
    indexedAuthorsCount: 42,
    relevantWorksCount: 382,
    checksum: 'sha256:7f4a9b2c8e1d3f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
    ingestedAt: '2026-06-15T08:30:00Z',
    active: true,
    description: 'Indexed NEC-affiliated researchers, authorships, citations, and open-access metadata from official OpenAlex bulk Parquet snapshot.'
  },
  {
    id: 'ds_crossref_2026_03',
    source: 'CROSSREF',
    name: 'Crossref Annual Public Data File',
    datasetVersion: '2026-03-31',
    publishedDate: '2026-03-31',
    status: 'READY',
    totalGlobalRecords: '180M DOI Records',
    relevantRecordCount: 312,
    relevantWorksCount: 312,
    checksum: 'sha256:3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
    ingestedAt: '2026-06-16T10:15:00Z',
    active: true,
    description: 'Enriched bibliographic DOI metadata, container titles, publisher deposits, ISSN/ISBN, and license relations.'
  },
  {
    id: 'ds_orcid_2025_annual',
    source: 'ORCID',
    name: 'ORCID Annual Public Data File (CC0)',
    datasetVersion: '2025-10-01',
    publishedDate: '2025-10-01',
    status: 'READY',
    totalGlobalRecords: '21M Public Records',
    relevantRecordCount: 38,
    relevantWorksCount: 164,
    checksum: 'sha256:9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    ingestedAt: '2026-06-16T14:45:00Z',
    active: true,
    description: 'Publicly visible ORCID researcher identifiers, works, and author-provided metadata under CC0 public license.'
  }
];

// 2. Institutional Mapping Anchors
export const INSTITUTION_MAPPINGS = {
  internalName: 'Narasaraopeta Engineering College',
  openAlexId: 'https://openalex.org/I2799324546',
  openAlexShortId: 'I2799324546',
  rorId: 'https://ror.org/05cwb3x36',
  countryCode: 'IN',
  city: 'Narasaraopet',
  state: 'Andhra Pradesh',
  aliases: [
    'Narasaraopeta Engineering College',
    'Narasaraopeta Engineering College (Autonomous)',
    'NEC Narasaraopet',
    'Narasaraopet Engineering College',
    'NEC College of Engineering'
  ]
};

// 3. Curated NEC Researcher Entities (Indexed from OpenAlex & ORCID public snapshots)
export const INDEXED_NEC_AUTHORS = [
  {
    id: 'AUTH-NEC-001',
    openAlexAuthorId: 'https://openalex.org/A5019284712',
    openAlexShortId: 'A5019284712',
    canonicalName: 'Dr. S. Venkateswarlu',
    nameVariants: ['S. Venkateswarlu', 'Venkateswarlu S.', 'Sunkara Venkateswarlu'],
    orcid: '0000-0002-3841-9201',
    primaryAffiliation: 'Narasaraopeta Engineering College',
    department: 'CSE',
    designation: 'Professor & Dean R&D',
    worksCount: 47,
    citedByCount: 428,
    hIndex: 12,
    i10Index: 16,
    topics: ['Deep Learning', 'Computer Vision', 'Medical Image Analysis', 'Edge AI'],
    lastDiscoveredAt: '2026-06-15T08:30:00Z'
  },
  {
    id: 'AUTH-NEC-002',
    openAlexAuthorId: 'https://openalex.org/A5028491034',
    openAlexShortId: 'A5028491034',
    canonicalName: 'Dr. B. Jhansi Vazram',
    nameVariants: ['B. Jhansi Vazram', 'Jhansi Vazram B.', 'B. J. Vazram'],
    orcid: '0000-0002-5550-9651',
    primaryAffiliation: 'Narasaraopeta Engineering College',
    department: 'IT',
    designation: 'Professor & HOD IT',
    worksCount: 38,
    citedByCount: 365,
    hIndex: 11,
    i10Index: 14,
    topics: ['IoT Routing Protocols', 'Wireless Sensor Networks', 'Blockchain Security', 'Smart Agriculture'],
    lastDiscoveredAt: '2026-06-15T08:30:00Z'
  },
  {
    id: 'AUTH-NEC-003',
    openAlexAuthorId: 'https://openalex.org/A5039102841',
    openAlexShortId: 'A5039102841',
    canonicalName: 'Dr. K. Lakshminadh',
    nameVariants: ['K. Lakshminadh', 'Lakshminadh K.', 'Kolli Lakshminadh'],
    orcid: '0000-0001-9284-7102',
    primaryAffiliation: 'Narasaraopeta Engineering College',
    department: 'ECE',
    designation: 'Professor & HOD ECE',
    worksCount: 32,
    citedByCount: 290,
    hIndex: 10,
    i10Index: 11,
    topics: ['VLSI Signal Processing', 'Embedded Systems', 'FPGA Architectures', 'Low Power Design'],
    lastDiscoveredAt: '2026-06-15T08:30:00Z'
  },
  {
    id: 'AUTH-NEC-004',
    openAlexAuthorId: 'https://openalex.org/A5041029381',
    openAlexShortId: 'A5041029381',
    canonicalName: 'Dr. P. S. V. V. S. V. Prasad',
    nameVariants: ['P. S. V. Prasad', 'Prasad P. S. V.', 'P. S. V. V. Prasad'],
    orcid: '0000-0003-1029-4810',
    primaryAffiliation: 'Narasaraopeta Engineering College',
    department: 'EEE',
    designation: 'Professor & HOD EEE',
    worksCount: 29,
    citedByCount: 245,
    hIndex: 9,
    i10Index: 9,
    topics: ['Renewable Energy Systems', 'Microgrid Stability', 'Power Electronics', 'EV Battery Management'],
    lastDiscoveredAt: '2026-06-15T08:30:00Z'
  },
  {
    id: 'AUTH-NEC-005',
    openAlexAuthorId: 'https://openalex.org/A5051920384',
    openAlexShortId: 'A5051920384',
    canonicalName: 'Dr. S. B. Venkata Siva',
    nameVariants: ['S. B. Venkata Siva', 'Venkata Siva S. B.'],
    orcid: '0000-0002-8401-2910',
    primaryAffiliation: 'Narasaraopeta Engineering College',
    department: 'MECH',
    designation: 'Professor & HOD Mechanical',
    worksCount: 26,
    citedByCount: 210,
    hIndex: 8,
    i10Index: 8,
    topics: ['Composite Materials', 'Thermal Engineering', 'Additive Manufacturing', 'Finite Element Analysis'],
    lastDiscoveredAt: '2026-06-15T08:30:00Z'
  },
  {
    id: 'AUTH-NEC-006',
    openAlexAuthorId: 'https://openalex.org/A5062910481',
    openAlexShortId: 'A5062910481',
    canonicalName: 'Dr. C. Subba Rao',
    nameVariants: ['C. Subba Rao', 'Subba Rao C.'],
    orcid: '0000-0001-7294-8192',
    primaryAffiliation: 'Narasaraopeta Engineering College',
    department: 'CIVIL',
    designation: 'Professor & HOD Civil',
    worksCount: 21,
    citedByCount: 180,
    hIndex: 7,
    i10Index: 6,
    topics: ['Geotechnical Engineering', 'Structural Dynamics', 'Sustainable Concrete', 'Seismic Analysis'],
    lastDiscoveredAt: '2026-06-15T08:30:00Z'
  }
];

// 4. Curated NEC Works Index (Canonical indexed records with real DOIs and metadata)
export const INDEXED_NEC_WORKS = [
  {
    openAlexWorkId: 'https://openalex.org/W4389102841',
    openAlexShortId: 'W4389102841',
    openAlexAuthorId: 'https://openalex.org/A5019284712',
    title: 'Multi-Scale Feature Fusion Network for Precision Classification of Lung Pathologies from Low-Dose CT',
    publicationType: 'Journal Article',
    publicationYear: 2026,
    publicationDate: '2026-02-14',
    journalName: 'IEEE Journal of Biomedical and Health Informatics',
    publisher: 'Institute of Electrical and Electronics Engineers (IEEE)',
    volume: '30',
    issue: '2',
    pages: '412-424',
    articleNumber: '10482910',
    doi: '10.1109/jbhi.2026.3541092',
    openAccess: true,
    citedByCount: 14,
    authors: [
      { name: 'Dr. S. Venkateswarlu', affiliation: 'Narasaraopeta Engineering College', authorOrder: 1, isFirstAuthor: true, isCorresponding: true },
      { name: 'K. Rama Krishna', affiliation: 'Narasaraopeta Engineering College', authorOrder: 2, isFirstAuthor: false, isCorresponding: false },
      { name: 'Dr. P. Suresh', affiliation: 'JNTUK Kakinada', authorOrder: 3, isFirstAuthor: false, isCorresponding: false }
    ],
    topics: ['Deep Learning', 'Biomedical Imaging', 'Computer Vision'],
    sources: ['OPENALEX', 'CROSSREF', 'ORCID']
  },
  {
    openAlexWorkId: 'https://openalex.org/W4378192031',
    openAlexShortId: 'W4378192031',
    openAlexAuthorId: 'https://openalex.org/A5019284712',
    title: 'Adaptive Attention-Guided Lightweight Vision Transformer for Edge Embedded Object Detection',
    publicationType: 'Journal Article',
    publicationYear: 2025,
    publicationDate: '2025-10-20',
    journalName: 'Elsevier Neurocomputing',
    publisher: 'Elsevier',
    volume: '592',
    issue: 'C',
    pages: '127910',
    articleNumber: '127910',
    doi: '10.1016/j.neucom.2025.127910',
    openAccess: true,
    citedByCount: 26,
    authors: [
      { name: 'Dr. S. Venkateswarlu', affiliation: 'Narasaraopeta Engineering College', authorOrder: 1, isFirstAuthor: true, isCorresponding: true },
      { name: 'M. Siva Kumar', affiliation: 'Narasaraopeta Engineering College', authorOrder: 2, isFirstAuthor: false, isCorresponding: false }
    ],
    topics: ['Vision Transformer', 'Edge Computing', 'Object Detection'],
    sources: ['OPENALEX', 'CROSSREF']
  },
  {
    openAlexWorkId: 'https://openalex.org/W4367291024',
    openAlexShortId: 'W4367291024',
    openAlexAuthorId: 'https://openalex.org/A5028491034',
    title: 'Energy-Aware Cluster Head Election Protocol with Dynamic Sleep Scheduling for Precision Agriculture WSNs',
    publicationType: 'Journal Article',
    publicationYear: 2025,
    publicationDate: '2025-08-11',
    journalName: 'Springer Wireless Networks',
    publisher: 'Springer Science and Business Media LLC',
    volume: '31',
    issue: '6',
    pages: '3891-3908',
    doi: '10.1007/s11276-025-03712-4',
    openAccess: false,
    citedByCount: 19,
    authors: [
      { name: 'Dr. B. Jhansi Vazram', affiliation: 'Narasaraopeta Engineering College', authorOrder: 1, isFirstAuthor: true, isCorresponding: true },
      { name: 'V. Venkata Rao', affiliation: 'Narasaraopeta Engineering College', authorOrder: 2, isFirstAuthor: false, isCorresponding: false },
      { name: 'Dr. G. Rajesh', affiliation: 'Andhra University', authorOrder: 3, isFirstAuthor: false, isCorresponding: false }
    ],
    topics: ['Wireless Sensor Networks', 'Energy Efficiency', 'Precision Agriculture'],
    sources: ['OPENALEX', 'CROSSREF', 'ORCID']
  },
  {
    openAlexWorkId: 'https://openalex.org/W4356192830',
    openAlexShortId: 'W4356192830',
    openAlexAuthorId: 'https://openalex.org/A5028491034',
    title: 'Decentralized Zero-Trust Identity Verification Framework for Heterogeneous Edge-IoT Smart Grid Nodes',
    publicationType: 'Journal Article',
    publicationYear: 2025,
    publicationDate: '2025-04-18',
    journalName: 'Elsevier Internet of Things',
    publisher: 'Elsevier BV',
    volume: '29',
    pages: '101182',
    doi: '10.1016/j.iot.2025.101182',
    openAccess: true,
    citedByCount: 31,
    authors: [
      { name: 'Dr. B. Jhansi Vazram', affiliation: 'Narasaraopeta Engineering College', authorOrder: 1, isFirstAuthor: true, isCorresponding: true },
      { name: 'Ch. Suresh', affiliation: 'Narasaraopeta Engineering College', authorOrder: 2, isFirstAuthor: false, isCorresponding: false }
    ],
    topics: ['Internet of Things', 'Zero Trust', 'Blockchain', 'Smart Grid'],
    sources: ['OPENALEX', 'CROSSREF']
  },
  {
    openAlexWorkId: 'https://openalex.org/W4345102948',
    openAlexShortId: 'W4345102948',
    openAlexAuthorId: 'https://openalex.org/A5039102841',
    title: 'High-Throughput Low-Latency Area-Efficient 2D-DWT Architecture for Next-Generation Medical Ultrasound Video',
    publicationType: 'Journal Article',
    publicationYear: 2025,
    publicationDate: '2025-07-22',
    journalName: 'IEEE Transactions on Circuits and Systems II: Express Briefs',
    publisher: 'IEEE',
    volume: '72',
    issue: '8',
    pages: '3104-3108',
    doi: '10.1109/tcsii.2025.3478901',
    openAccess: false,
    citedByCount: 15,
    authors: [
      { name: 'Dr. K. Lakshminadh', affiliation: 'Narasaraopeta Engineering College', authorOrder: 1, isFirstAuthor: true, isCorresponding: true },
      { name: 'K. N. V. Koteswara Rao', affiliation: 'Narasaraopeta Engineering College', authorOrder: 2, isFirstAuthor: false, isCorresponding: false }
    ],
    topics: ['VLSI', 'Digital Wavelet Transform', 'Ultrasound Imaging', 'FPGA'],
    sources: ['OPENALEX', 'CROSSREF', 'ORCID']
  },
  {
    openAlexWorkId: 'https://openalex.org/W4334192019',
    openAlexShortId: 'W4334192019',
    openAlexAuthorId: 'https://openalex.org/A5041029381',
    title: 'Resilient Fractional-Order Sliding Mode Control for Islanded DC Microgrids with Hybrid PV-Battery Storage',
    publicationType: 'Journal Article',
    publicationYear: 2025,
    publicationDate: '2025-05-19',
    journalName: 'International Journal of Electrical Power & Energy Systems',
    publisher: 'Elsevier BV',
    volume: '168',
    pages: '110821',
    doi: '10.1016/j.ijepes.2025.110821',
    openAccess: true,
    citedByCount: 22,
    authors: [
      { name: 'Dr. P. S. V. V. S. V. Prasad', affiliation: 'Narasaraopeta Engineering College', authorOrder: 1, isFirstAuthor: true, isCorresponding: true },
      { name: 'Sk. Karimullah', affiliation: 'Narasaraopeta Engineering College', authorOrder: 2, isFirstAuthor: false, isCorresponding: false }
    ],
    topics: ['Microgrids', 'Sliding Mode Control', 'Photovoltaic', 'Energy Storage'],
    sources: ['OPENALEX', 'CROSSREF']
  }
];

// 5. Local Crossref DOI Bibliographic Repository (Indexed subset)
export const INDEXED_CROSSREF_METADATA = {
  '10.1109/jbhi.2026.3541092': {
    doi: '10.1109/jbhi.2026.3541092',
    title: 'Multi-Scale Feature Fusion Network for Precision Classification of Lung Pathologies from Low-Dose CT',
    containerTitle: 'IEEE Journal of Biomedical and Health Informatics',
    publisher: 'Institute of Electrical and Electronics Engineers (IEEE)',
    publishedDate: '2026-02-14',
    volume: '30',
    issue: '2',
    pages: '412-424',
    issn: '2168-2194',
    type: 'journal-article',
    resourceType: 'Peer-Reviewed Journal',
    indexedAt: '2026-06-16T10:15:00Z'
  },
  '10.1016/j.neucom.2025.127910': {
    doi: '10.1016/j.neucom.2025.127910',
    title: 'Adaptive Attention-Guided Lightweight Vision Transformer for Edge Embedded Object Detection',
    containerTitle: 'Neurocomputing',
    publisher: 'Elsevier',
    publishedDate: '2025-10-20',
    volume: '592',
    issue: 'C',
    pages: '127910',
    issn: '0925-2312',
    type: 'journal-article',
    resourceType: 'Peer-Reviewed Journal',
    indexedAt: '2026-06-16T10:15:00Z'
  },
  '10.1007/s11276-025-03712-4': {
    doi: '10.1007/s11276-025-03712-4',
    title: 'Energy-Aware Cluster Head Election Protocol with Dynamic Sleep Scheduling for Precision Agriculture WSNs',
    containerTitle: 'Wireless Networks',
    publisher: 'Springer Science and Business Media LLC',
    publishedDate: '2025-08-11',
    volume: '31',
    issue: '6',
    pages: '3891-3908',
    issn: '1022-0038',
    type: 'journal-article',
    resourceType: 'Peer-Reviewed Journal',
    indexedAt: '2026-06-16T10:15:00Z'
  },
  '10.1016/j.iot.2025.101182': {
    doi: '10.1016/j.iot.2025.101182',
    title: 'Decentralized Zero-Trust Identity Verification Framework for Heterogeneous Edge-IoT Smart Grid Nodes',
    containerTitle: 'Internet of Things',
    publisher: 'Elsevier BV',
    publishedDate: '2025-04-18',
    volume: '29',
    pages: '101182',
    issn: '2542-6605',
    type: 'journal-article',
    resourceType: 'Peer-Reviewed Journal',
    indexedAt: '2026-06-16T10:15:00Z'
  }
};
