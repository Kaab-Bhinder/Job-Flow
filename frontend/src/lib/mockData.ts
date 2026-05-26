// ═══════════════════════════════════════════════════════════
// Mock Data — Realistic job listings, users, and applications
// ═══════════════════════════════════════════════════════════

export interface Job {
  id: string;
  source: 'adzuna' | 'jsearch';
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  description: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  jobType: string;
  isRemote: boolean;
  applyUrl: string;
  category: string;
  postedAt: string;
  tags: string[];
}

export interface Application {
  id: string;
  jobId: string;
  status: 'saved' | 'applied' | 'interview' | 'rejected' | 'offer';
  notes: string;
  appliedAt: string;
  statusChangedAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
}

export const mockUser: User = {
  id: '1',
  email: 'kaab@jobflow.com',
  fullName: 'Kaab Bhinder',
  avatarUrl: '',
};

export const mockJobs: Job[] = [
  {
    id: '1',
    source: 'jsearch',
    title: 'Senior Frontend Engineer',
    company: 'Stripe',
    companyLogo: 'https://logo.clearbit.com/stripe.com',
    location: 'San Francisco, CA',
    description: `We're looking for a Senior Frontend Engineer to join our Dashboard team. You'll work on building beautiful, performant interfaces that millions of businesses use daily to manage their payments infrastructure.\n\n**What you'll do:**\n- Build and maintain complex React applications\n- Collaborate with designers to implement pixel-perfect UIs\n- Optimize performance for large-scale data rendering\n- Mentor junior engineers and conduct code reviews\n\n**Requirements:**\n- 5+ years of experience with React/TypeScript\n- Strong understanding of CSS, accessibility, and web performance\n- Experience with design systems and component libraries\n- Excellent communication skills`,
    salaryMin: 180000,
    salaryMax: 250000,
    salaryCurrency: 'USD',
    jobType: 'Full-time',
    isRemote: false,
    applyUrl: 'https://stripe.com/jobs',
    category: 'Engineering',
    postedAt: '2026-05-24T10:00:00Z',
    tags: ['React', 'TypeScript', 'CSS', 'Design Systems'],
  },
  {
    id: '2',
    source: 'adzuna',
    title: 'Full Stack Developer',
    company: 'Vercel',
    companyLogo: 'https://logo.clearbit.com/vercel.com',
    location: 'Remote',
    description: `Join Vercel to help build the future of web development. We're looking for a Full Stack Developer who is passionate about developer experience and web performance.\n\n**Responsibilities:**\n- Develop features for the Vercel platform using Next.js\n- Build and maintain APIs with Node.js\n- Work with PostgreSQL and Redis\n- Contribute to our open-source projects\n\n**Requirements:**\n- 3+ years of full-stack development experience\n- Proficiency in TypeScript, React, and Node.js\n- Experience with serverless architectures\n- Familiarity with CI/CD pipelines`,
    salaryMin: 140000,
    salaryMax: 200000,
    salaryCurrency: 'USD',
    jobType: 'Full-time',
    isRemote: true,
    applyUrl: 'https://vercel.com/careers',
    category: 'Engineering',
    postedAt: '2026-05-23T14:30:00Z',
    tags: ['Next.js', 'Node.js', 'PostgreSQL', 'TypeScript'],
  },
  {
    id: '3',
    source: 'jsearch',
    title: 'Backend Engineer — Python',
    company: 'Notion',
    companyLogo: 'https://logo.clearbit.com/notion.so',
    location: 'New York, NY',
    description: `Notion is looking for a Backend Engineer to help scale our infrastructure. You'll work on the systems that power millions of workspaces around the world.\n\n**What you'll do:**\n- Design and implement scalable backend services\n- Optimize database queries and data models\n- Build robust APIs and microservices\n- Participate in on-call rotations\n\n**Requirements:**\n- 4+ years of backend development with Python\n- Experience with FastAPI or Django\n- Strong knowledge of PostgreSQL\n- Understanding of distributed systems`,
    salaryMin: 160000,
    salaryMax: 220000,
    salaryCurrency: 'USD',
    jobType: 'Full-time',
    isRemote: false,
    applyUrl: 'https://notion.so/careers',
    category: 'Engineering',
    postedAt: '2026-05-22T09:15:00Z',
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'Microservices'],
  },
  {
    id: '4',
    source: 'adzuna',
    title: 'Product Designer',
    company: 'Figma',
    companyLogo: 'https://logo.clearbit.com/figma.com',
    location: 'San Francisco, CA',
    description: `We're looking for a Product Designer who can shape the future of collaborative design tools. You'll work closely with engineering and product to deliver delightful experiences.\n\n**Responsibilities:**\n- Design end-to-end product experiences\n- Create high-fidelity prototypes and design specs\n- Conduct user research and usability testing\n- Contribute to our design system\n\n**Requirements:**\n- 4+ years of product design experience\n- Expert in Figma (obviously!)\n- Strong portfolio demonstrating UI/UX skills\n- Experience with design systems`,
    salaryMin: 150000,
    salaryMax: 210000,
    salaryCurrency: 'USD',
    jobType: 'Full-time',
    isRemote: false,
    applyUrl: 'https://figma.com/careers',
    category: 'Design',
    postedAt: '2026-05-21T16:00:00Z',
    tags: ['UI/UX', 'Figma', 'Design Systems', 'Prototyping'],
  },
  {
    id: '5',
    source: 'jsearch',
    title: 'DevOps Engineer',
    company: 'GitLab',
    companyLogo: 'https://logo.clearbit.com/gitlab.com',
    location: 'Remote',
    description: `GitLab is looking for a DevOps Engineer to help maintain and improve our CI/CD platform. This is a fully remote role.\n\n**What you'll do:**\n- Manage Kubernetes clusters at scale\n- Automate infrastructure using Terraform\n- Monitor and optimize system performance\n- Collaborate with development teams\n\n**Requirements:**\n- 3+ years of DevOps/SRE experience\n- Strong knowledge of Kubernetes and Docker\n- Experience with cloud providers (AWS/GCP/Azure)\n- Proficiency in scripting (Python, Bash)`,
    salaryMin: 130000,
    salaryMax: 180000,
    salaryCurrency: 'USD',
    jobType: 'Full-time',
    isRemote: true,
    applyUrl: 'https://about.gitlab.com/jobs/',
    category: 'Engineering',
    postedAt: '2026-05-20T11:45:00Z',
    tags: ['Kubernetes', 'Docker', 'Terraform', 'AWS'],
  },
  {
    id: '6',
    source: 'adzuna',
    title: 'Machine Learning Engineer',
    company: 'OpenAI',
    companyLogo: 'https://logo.clearbit.com/openai.com',
    location: 'San Francisco, CA',
    description: `Join OpenAI to work on cutting-edge AI research and engineering. We're looking for ML Engineers to help bring our models to production.\n\n**Responsibilities:**\n- Train and fine-tune large language models\n- Build inference pipelines and APIs\n- Optimize model performance and efficiency\n- Collaborate with research scientists\n\n**Requirements:**\n- MS/PhD in Computer Science or related field\n- 3+ years of ML engineering experience\n- Proficiency in PyTorch and Python\n- Experience with distributed training`,
    salaryMin: 200000,
    salaryMax: 350000,
    salaryCurrency: 'USD',
    jobType: 'Full-time',
    isRemote: false,
    applyUrl: 'https://openai.com/careers',
    category: 'AI/ML',
    postedAt: '2026-05-19T08:30:00Z',
    tags: ['PyTorch', 'Python', 'LLMs', 'ML Ops'],
  },
  {
    id: '7',
    source: 'jsearch',
    title: 'iOS Developer',
    company: 'Spotify',
    companyLogo: 'https://logo.clearbit.com/spotify.com',
    location: 'Stockholm, Sweden',
    description: `Spotify is looking for an iOS Developer to help craft the best music listening experience. You'll work on features used by hundreds of millions.\n\n**What you'll do:**\n- Develop new features for the Spotify iOS app\n- Write clean, testable Swift code\n- Optimize app performance and battery usage\n- Collaborate with cross-functional teams\n\n**Requirements:**\n- 3+ years of iOS development with Swift\n- Experience with UIKit and SwiftUI\n- Understanding of audio frameworks\n- Published apps on the App Store`,
    salaryMin: 90000,
    salaryMax: 140000,
    salaryCurrency: 'EUR',
    jobType: 'Full-time',
    isRemote: false,
    applyUrl: 'https://spotify.com/jobs',
    category: 'Engineering',
    postedAt: '2026-05-18T13:00:00Z',
    tags: ['Swift', 'iOS', 'SwiftUI', 'UIKit'],
  },
  {
    id: '8',
    source: 'adzuna',
    title: 'Data Analyst — Remote',
    company: 'Shopify',
    companyLogo: 'https://logo.clearbit.com/shopify.com',
    location: 'Remote',
    description: `Shopify is looking for a Data Analyst to help merchants succeed by turning data into actionable insights.\n\n**Responsibilities:**\n- Analyze merchant behavior and platform metrics\n- Build dashboards and reports using SQL and Looker\n- Partner with product teams to define KPIs\n- Present findings to stakeholders\n\n**Requirements:**\n- 2+ years of data analysis experience\n- Advanced SQL skills\n- Experience with Python (pandas, numpy)\n- Strong visualization skills (Looker, Tableau, or similar)`,
    salaryMin: 100000,
    salaryMax: 150000,
    salaryCurrency: 'USD',
    jobType: 'Full-time',
    isRemote: true,
    applyUrl: 'https://shopify.com/careers',
    category: 'Data',
    postedAt: '2026-05-17T10:20:00Z',
    tags: ['SQL', 'Python', 'Looker', 'Analytics'],
  },
  {
    id: '9',
    source: 'jsearch',
    title: 'React Native Developer',
    company: 'Discord',
    companyLogo: 'https://logo.clearbit.com/discord.com',
    location: 'San Francisco, CA',
    description: `Discord is hiring a React Native Developer to work on our mobile apps. Help us build the best communication platform for communities.\n\n**What you'll do:**\n- Build cross-platform mobile features with React Native\n- Optimize app performance for mobile\n- Implement real-time messaging features\n- Write unit and integration tests\n\n**Requirements:**\n- 3+ years of React Native experience\n- Strong JavaScript/TypeScript skills\n- Experience with native modules (iOS/Android)\n- Understanding of real-time communication protocols`,
    salaryMin: 150000,
    salaryMax: 210000,
    salaryCurrency: 'USD',
    jobType: 'Full-time',
    isRemote: false,
    applyUrl: 'https://discord.com/careers',
    category: 'Engineering',
    postedAt: '2026-05-16T15:00:00Z',
    tags: ['React Native', 'TypeScript', 'Mobile', 'Real-time'],
  },
  {
    id: '10',
    source: 'adzuna',
    title: 'Cloud Solutions Architect',
    company: 'AWS',
    companyLogo: 'https://logo.clearbit.com/aws.amazon.com',
    location: 'Seattle, WA',
    description: `Amazon Web Services is looking for a Cloud Solutions Architect to help enterprise customers design and implement cloud solutions.\n\n**Responsibilities:**\n- Design cloud architectures for enterprise customers\n- Conduct technical workshops and presentations\n- Write whitepapers and best practice guides\n- Stay current with AWS services and features\n\n**Requirements:**\n- 5+ years of cloud architecture experience\n- AWS certifications preferred (SA Pro)\n- Experience with multi-account strategies\n- Strong communication and presentation skills`,
    salaryMin: 160000,
    salaryMax: 240000,
    salaryCurrency: 'USD',
    jobType: 'Full-time',
    isRemote: false,
    applyUrl: 'https://amazon.jobs',
    category: 'Engineering',
    postedAt: '2026-05-15T09:00:00Z',
    tags: ['AWS', 'Cloud', 'Architecture', 'Enterprise'],
  },
  {
    id: '11',
    source: 'jsearch',
    title: 'Junior Frontend Developer',
    company: 'Canva',
    companyLogo: 'https://logo.clearbit.com/canva.com',
    location: 'Sydney, Australia',
    description: `Canva is looking for a Junior Frontend Developer to join our growing team. Great opportunity for someone starting their career.\n\n**What you'll do:**\n- Build UI components using React and TypeScript\n- Collaborate with senior engineers on features\n- Write tests and documentation\n- Participate in code reviews\n\n**Requirements:**\n- 1+ years of frontend development\n- Knowledge of React and TypeScript\n- Understanding of HTML, CSS, and responsive design\n- Eagerness to learn and grow`,
    salaryMin: 70000,
    salaryMax: 100000,
    salaryCurrency: 'AUD',
    jobType: 'Full-time',
    isRemote: false,
    applyUrl: 'https://canva.com/careers',
    category: 'Engineering',
    postedAt: '2026-05-14T07:30:00Z',
    tags: ['React', 'TypeScript', 'Junior', 'CSS'],
  },
  {
    id: '12',
    source: 'adzuna',
    title: 'Technical Writer',
    company: 'Twilio',
    companyLogo: 'https://logo.clearbit.com/twilio.com',
    location: 'Remote',
    description: `Twilio is looking for a Technical Writer to create world-class API documentation and developer guides.\n\n**Responsibilities:**\n- Write and maintain API reference documentation\n- Create tutorials and quickstart guides\n- Collaborate with engineering teams\n- Improve documentation infrastructure\n\n**Requirements:**\n- 2+ years of technical writing experience\n- Understanding of REST APIs and SDKs\n- Familiarity with docs-as-code workflows\n- Strong writing and editing skills`,
    salaryMin: 100000,
    salaryMax: 140000,
    salaryCurrency: 'USD',
    jobType: 'Full-time',
    isRemote: true,
    applyUrl: 'https://twilio.com/careers',
    category: 'Writing',
    postedAt: '2026-05-13T12:00:00Z',
    tags: ['API Docs', 'Technical Writing', 'REST', 'Developer Experience'],
  },
];

export const mockApplications: Application[] = [
  {
    id: 'app-1',
    jobId: '1',
    status: 'interview',
    notes: 'Had phone screen, technical round scheduled for next week',
    appliedAt: '2026-05-20T10:00:00Z',
    statusChangedAt: '2026-05-24T14:00:00Z',
  },
  {
    id: 'app-2',
    jobId: '2',
    status: 'applied',
    notes: 'Applied through website, waiting to hear back',
    appliedAt: '2026-05-22T09:00:00Z',
    statusChangedAt: '2026-05-22T09:00:00Z',
  },
  {
    id: 'app-3',
    jobId: '3',
    status: 'saved',
    notes: 'Looks interesting, need to update resume first',
    appliedAt: '',
    statusChangedAt: '2026-05-23T16:00:00Z',
  },
  {
    id: 'app-4',
    jobId: '6',
    status: 'rejected',
    notes: 'Didn\'t pass the ML coding challenge',
    appliedAt: '2026-05-15T11:00:00Z',
    statusChangedAt: '2026-05-21T10:00:00Z',
  },
  {
    id: 'app-5',
    jobId: '8',
    status: 'offer',
    notes: 'Received offer! $130k base + equity. Need to respond by Friday.',
    appliedAt: '2026-05-10T08:00:00Z',
    statusChangedAt: '2026-05-25T15:00:00Z',
  },
  {
    id: 'app-6',
    jobId: '5',
    status: 'applied',
    notes: 'Referred by a friend who works there',
    appliedAt: '2026-05-21T14:30:00Z',
    statusChangedAt: '2026-05-21T14:30:00Z',
  },
  {
    id: 'app-7',
    jobId: '9',
    status: 'interview',
    notes: 'System design interview coming up',
    appliedAt: '2026-05-18T10:00:00Z',
    statusChangedAt: '2026-05-23T09:00:00Z',
  },
  {
    id: 'app-8',
    jobId: '4',
    status: 'saved',
    notes: '',
    appliedAt: '',
    statusChangedAt: '2026-05-24T11:00:00Z',
  },
];

export const mockSavedJobIds: string[] = ['1', '3', '4', '7', '11'];

export const jobCategories = [
  'Engineering', 'Design', 'Data', 'AI/ML', 'Product', 'Marketing', 'Sales', 'Writing', 'DevOps', 'Management'
];

export const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];

export const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'salary-desc', label: 'Highest Salary' },
  { value: 'salary-asc', label: 'Lowest Salary' },
];
