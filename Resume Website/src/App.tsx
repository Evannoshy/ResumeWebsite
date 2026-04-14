import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Github, 
  Linkedin, 
  ChevronDown, 
  Database, 
  Network, 
  Bot, 
  Code2, 
  Briefcase
} from 'lucide-react';
import './index.css';
import './App.css';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface Project {
  id: string;
  title: string;
  date: string;
  associatedWith?: string;
  description: string;
  details?: string[];
  tags: string[];
  category: 'Professional' | 'Self-Initiated';
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  skills: string[];
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  type?: string;
  duration: string;
  location: string;
  description: string[];
  skills: string[];
}

// ==========================================
// DATA
// ==========================================

const PROJECTS_DATA: Project[] = [
  {
    id: 'p1',
    title: 'AeroScribe',
    date: 'Feb 2026 – Mar 2026',
    associatedWith: 'RAiD (RSAF Agile innovation Digital)',
    description: 'Designed and deployed an edge-based, CPU-optimized speech-to-text and LLM pipeline, enabling low-latency semantic parsing for Air Traffic Control without relying on GPU acceleration.',
    details: [
      'Engineered an edge AI pipeline using Faster-Whisper and Qwen 2.5 (0.5B), achieving real-time semantic parsing and transcription in noisy radio environments.',
      'Developed prompt engineering templates resilient to phonetic ambiguity, significantly improving emergency detection reliability (e.g., MAYDAY escalations).',
      'Architected a hybrid probabilistic-deterministic state engine, combining LLM semantic interpretation with rule-based conflict detection for fail-safe aviation tracking.',
      'Enforced structured JSON outputs to guarantee deterministic state mutations and downstream data validation.',
      'Built an event-sourced logging system and FastAPI WebSocket architecture for real-time dashboard streaming and comprehensive safety audits.'
    ],
    tags: ['Edge AI', 'Python', 'LLM Prompt Engineering', 'FastAPI', 'Faster-Whisper'],
    category: 'Professional'
  },
  {
    id: 'p2',
    title: 'AI-Driven Business Intelligence Engine',
    date: 'Jan 2026 – Feb 2026',
    description: 'Architected an end-to-end Business Intelligence pipeline that transforms raw corporate data into actionable, executive-ready insights using classical ML and LLM generation.',
    details: [
      'Engineered a robust ETL pipeline with custom regex wrappers to normalize datasets, handle missing values, and ensure 100% data ingestion reliability.',
      'Applied K-Means clustering for contextual peer segmentation and Isolation Forests for predictive anomaly detection, flagging high-risk corporate profiles.',
      'Pre-computed derived financial metrics (IT Spend Ratio, Shadow Scale) to eliminate numeric hallucination in downstream LLM processing.',
      'Integrated Flan-T5 with structured prompting, n-gram blocking, and repetition penalties to auto-generate coherent, strategic executive summaries.'
    ],
    tags: ['Machine Learning', 'Pandas', 'Scikit-Learn', 'Flan-T5', 'Predictive Analytics', 'ETL'],
    category: 'Professional'
  },
  {
    id: 'p3',
    title: 'SSB Food Wastage Tracker',
    date: 'Jan 2026 – Jan 2026',
    associatedWith: 'RAiD (RSAF Agile innovation Digital)',
    description: 'Engineered an automated data integration pipeline and Power BI dashboard to track and mitigate institutional food wastage via ES:IS ratio analysis.',
    tags: ['Power BI', 'Power Automate', 'Data Visualization', 'ETL Architecture'],
    category: 'Professional'
  },
  {
    id: 'p4',
    title: 'SMS Spam Message Detector',
    date: 'May 2025 – May 2025',
    description: 'Developed a robust spam classification pipeline utilizing a Naive Bayes algorithm, optimizing for high precision in threat detection.',
    tags: ['Machine Learning', 'Algorithms', 'Naive Bayes', 'Classification'],
    category: 'Self-Initiated'
  },
  {
    id: 'p5',
    title: 'K-Nearest Neighbour Predictor',
    date: 'Apr 2025 – Apr 2025',
    description: 'Built a predictive modeling algorithm using KNN to forecast demographic metrics, utilizing confusion matrices to validate and fine-tune model accuracy.',
    tags: ['Predictive Modeling', 'KNN', 'Data Analysis', 'Scikit-Learn'],
    category: 'Self-Initiated'
  },
  {
    id: 'p6',
    title: 'AI-Augmented Enterprise Scheduling Engine',
    date: 'Jan 2026 – Present',
    associatedWith: 'RAiD (RSAF Agile innovation Digital)',
    description: 'Architected an enterprise-grade, consent-based scheduling system within Microsoft 365, utilizing LLMs to capture user intent and automate complex meeting logistics.',
    details: [
      'Integrated Copilot Studio for Natural Language Understanding (NLU), Outlook Graph API for free/busy intelligence, and SharePoint for state persistence.',
      'Designed a deterministic state machine (Draft → Proposed → Voting → Booked) to handle edge cases like organizer unavailability and empty suggestion states.',
      'Engineered a distributed majority-consensus approval mechanism via Teams Adaptive Cards, ensuring strict governance and full audit logging in a DLP-restricted environment.'
    ],
    tags: ['Microsoft Power Platform', 'Copilot Studio', 'System Architecture', 'Workflow Automation'],
    category: 'Professional'
  },
  {
    id: 'p7',
    title: 'Automated Flight Routing Workflow',
    date: 'Jan 2026 – Present',
    associatedWith: 'RAiD (RSAF Agile innovation Digital)',
    description: 'Developed a zero-touch enterprise workflow automating the generation of dynamic flight routes and multi-tier approval processes.',
    details: [
      'Deployed Microsoft Forms and Power Automate to ingest operational parameters and dynamically generate precise SkyVector routing links.',
      'Streamlined cross-functional collaboration by integrating an automated approval routing matrix seamlessly across Microsoft Teams and Outlook.'
    ],
    tags: ['Power Automate', 'Process Optimization', 'Microsoft Teams'],
    category: 'Professional'
  }
];

const SKILLS_DATA: SkillCategory[] = [
  {
    id: 's1',
    title: 'Data & ML',
    icon: <Database style={{ width: 24, height: 24 }} />,
    skills: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'K-Means Clustering', 'Isolation Forests', 'Naive Bayes', 'KNN', 'PySpark']
  },
  {
    id: 's2',
    title: 'Systems & Integration',
    icon: <Network style={{ width: 24, height: 24 }} />,
    skills: ['Palantir Foundry', 'Palantir AIP', 'Ontology Design', 'Data Pipelines', 'ETL', 'FastAPI', 'WebSockets']
  },
  {
    id: 's3',
    title: 'Automation & BI',
    icon: <Bot style={{ width: 24, height: 24 }} />,
    skills: ['Microsoft Power Automate', 'Power BI', 'PowerApps', 'Copilot Studio', 'Agentic Workflows', 'RPA']
  },
  {
    id: 's4',
    title: 'Web & Tech',
    icon: <Code2 style={{ width: 24, height: 24 }} />,
    skills: ['TypeScript', 'JavaScript', 'React', 'HTML/CSS', 'Faster-Whisper', 'Qwen', 'Flan-T5', 'Web Design']
  }
];

const EXPERIENCE_DATA: Experience[] = [
  {
    id: 'e1',
    role: 'Software Developer: Power Platform CoE',
    organization: 'RAiD (RSAF Agile innovation Digital)',
    type: 'Internship',
    duration: 'Jan 2026 - Present',
    location: 'Singapore',
    description: [
      'Engineered automated ETL pipelines (PySpark, PowerQuery) to analyze food wastage, optimizing Indent Strength ratios and driving measurable reductions in operational waste.',
      'Spearheaded the digital transformation of enterprise booking systems using PowerApps, Dataverse, and Power Automate, eliminating manual bottlenecks for 100+ personnel.',
      'Architected an AI-augmented scheduling engine in Microsoft 365. Integrated Copilot Studio (LLM intent capture) and Microsoft Graph API, utilizing a deterministic state machine to ensure null-safe orchestration and compliance in DLP-restricted environments.',
      'Developed a zero-touch flight routing workflow utilizing Power Automate to dynamically generate SkyVector links, seamlessly integrating multi-tier approval routing across Teams and Outlook.',
      'Designed a real-time, fully offline AI decision-support system for Air Traffic Control, utilizing Faster-Whisper and Qwen 2.5 to convert noisy radio speech into structured operational data.'
    ],
    skills: ['Microsoft Power Platform', 'ETL Architecture', 'LLM Integration', 'Process Optimization']
  },
  {
    id: 'e2',
    role: 'Software Developer: Mission Data Team Intern',
    organization: 'RAiD (RSAF Agile innovation Digital)',
    type: 'Internship',
    duration: 'Oct 2025 - Present',
    location: 'Singapore',
    description: [
      'Spearheaded the integration of Palantir Foundry for four airbases, architecting a centralized platform to automate Notice to Airmen (NOTAM) ingestion and tracking.',
      'Designed a custom Palantir AIP Workshop module with drag-and-drop workflows to parse emails, utilizing LLMs to extract unstructured text into highly structured ontology objects.',
      'Engineered automated computer vision and PDF image-segmentation pipelines (Python/TypeScript) to extract exact geospatial coordinates from translucent aviation charts.',
      'Built end-to-end data cleaning and validation pipelines using Python and Apache Spark, accelerating mission-planning workflows and reducing manual data entry by 90%.'
    ],
    skills: ['Palantir Foundry', 'Computer Vision', 'Data Integration', 'Python / PySpark']
  },
  {
    id: 'e3',
    role: 'Air Operations Specialist',
    organization: 'Republic of Singapore Air Force',
    type: 'Full-time',
    duration: 'Jun 2024 - Jan 2026',
    location: 'Singapore',
    description: [
      'Directed daily operational briefings and maintained seamless cross-functional collaboration with Air Traffic Control within a high-pressure, mission-critical control tower environment.',
      'Partnered with Palantir and the RAiD innovation team to architect Python-based data extraction pipelines, transitioning legacy processes into data-driven operations.',
      'Led strategic logistical planning as Operations Cell 2-IC and Stores IC, ensuring the flawless execution of organizational milestone ceremonies.',
      'Honors: Best Airman of the Month (Apr 2025), Best Control Squadron of the Year (WY25).'
    ],
    skills: ['Operations Management', 'Cross-functional Collaboration', 'Stakeholder Management']
  }
];

// ==========================================
// COMPONENTS
// ==========================================

const Hero = () => {
  return (
    <section id="hero" className="section-dark">
      <div className="section-container content-centered">
        <h2 className="t-sub-heading hero-subheadline" style={{marginBottom: 16}}>Portfolio & Professional Resume</h2>
        <h1 className="hero-headline">Hi, I'm Evan.</h1>
        <p className="hero-subheadline" style={{marginBottom: 16, fontWeight: 600}}>
          Double Degree in Computer Science & Business at NUS
        </p>
        <p className="hero-subheadline">Software Developer & AI Integration</p>
        <p className="t-body" style={{maxWidth: 600, color: 'var(--white-32)'}}>
          Bridging the gap between complex data systems and actionable business insights through Machine Learning, LLMs, and workflow automation.
        </p>
        
        <div className="cta-group">
          <a href="#experience" className="btn-pill">
            View Experience <span className="chevron">&gt;</span>
          </a>
          <a href="#projects" className="btn-primary">
            View Projects
          </a>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="section-light">
      <div className="section-container content-centered">
        <h2 className="t-section-heading" style={{marginBottom: 48}}>About Me</h2>
        <div style={{maxWidth: 800, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 24}}>
          <p className="t-body">
            I am an undergraduate at the <strong>National University of Singapore (NUS)</strong> pursuing a 
            Double Degree in Computer Science and Business. My academic and professional journey 
            is driven by a passion for solving complex business problems through software engineering and automation.
          </p>
          <p className="t-body">
            Currently serving as a Software Developer Intern at <strong>RAiD (RSAF Agile innovation Digital)</strong>, 
            I specialize in building intelligent systems. My expertise spans <strong>AI-driven pipelines, large language models (LLMs), 
            data integrations (Palantir Foundry), and enterprise automation (Power Platform)</strong>. I thrive on architecting solutions 
            that transform raw, noisy data into structured, operational intelligence.
          </p>
        </div>
      </div>
    </section>
  );
};

const Skills = () => {
  return (
    <section id="skills" className="section-dark">
      <div className="section-container">
        <h2 className="t-section-heading content-centered" style={{marginBottom: 48}}>Technical Expertise</h2>
        <div className="cards-grid">
          {SKILLS_DATA.map((category) => (
            <div key={category.id} className="apple-card">
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24}}>
                <div style={{color: 'var(--apple-blue)'}}>
                  {category.icon}
                </div>
                <h3 className="card-title">{category.title}</h3>
              </div>
              <div className="card-tags" style={{marginTop: 'auto'}}>
                {category.skills.map((skill, index) => (
                  <span key={index} className="card-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ExperienceSection = () => {
  return (
    <section id="experience" className="section-light">
      <div className="section-container">
        <h2 className="t-section-heading content-centered" style={{marginBottom: 64, display: 'flex', alignItems: 'center', gap: 12}}>
          <Briefcase style={{ width: 32, height: 32, color: 'var(--apple-blue)' }} />
          Professional Experience
        </h2>
        
        <div style={{maxWidth: 800, margin: '0 auto'}}>
          {EXPERIENCE_DATA.map((exp) => (
            <div key={exp.id} className="exp-item">
              <div className="exp-header">
                <div>
                  <h3 className="exp-role">{exp.role}</h3>
                  <div className="exp-org">{exp.organization} — {exp.location} ({exp.type})</div>
                </div>
                <div className="exp-meta">{exp.duration}</div>
              </div>
              <ul className="detail-list" style={{marginBottom: 24}}>
                {exp.description.map((item, i) => (
                  <li key={i}>
                    <span className="detail-bullet">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="card-tags">
                {exp.skills.map((skill, index) => (
                  <span key={index} className="card-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="apple-card" style={{height: '100%'}}>
      <h3 className="card-title">{project.title}</h3>
      <div className="card-subtitle">
        {project.date} {project.associatedWith ? ` • ${project.associatedWith}` : ''}
      </div>
      <p className="card-content">{project.description}</p>
      
      {project.details && project.details.length > 0 && isExpanded && (
        <ul className="detail-list" style={{marginTop: 24, animation: 'fadeIn 0.3s ease-out'}}>
          {project.details.map((detail, i) => (
            <li key={i}>
              <span className="detail-bullet" style={{fontSize: 12}}>▹</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      )}
      
      <div className="card-tags">
        {project.tags.map((tag, index) => (
          <span key={index} className="card-tag">
            {tag}
          </span>
        ))}
      </div>
      
      {project.details && project.details.length > 0 && (
        <div style={{marginTop: 32}}>
          <button 
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }} 
            className="link-inline" 
            style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit'}}
          >
            {isExpanded ? 'Show less' : 'Learn more'} <span className="chevron" style={{display: 'inline-block', transform: isExpanded ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s'}}>&gt;</span>
          </button>
        </div>
      )}
    </div>
  );
};

const Projects = () => {
  const professionalProjects = PROJECTS_DATA.filter(p => p.category === 'Professional');
  const selfInitiatedProjects = PROJECTS_DATA.filter(p => p.category === 'Self-Initiated');

  return (
    <section id="projects" className="section-dark">
      <div className="section-container">
        <h2 className="t-section-heading content-centered" style={{marginBottom: 64}}>Projects</h2>
        
        <div style={{marginBottom: 80}}>
          <h3 className="t-tile-heading" style={{marginBottom: 8}}>Professional Deployments</h3>
          <p className="t-body" style={{color: 'var(--white-32)', marginBottom: 32}}>Enterprise integrations and organizational initiatives.</p>
          <div className="cards-grid">
            {professionalProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="t-tile-heading" style={{marginTop: 64, marginBottom: 8}}>Self-Initiated Projects</h3>
          <p className="t-body" style={{color: 'var(--white-32)', marginBottom: 32}}>Academic work, hackathons, and personal explorations.</p>
          <div className="cards-grid">
            {selfInitiatedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="apple-footer">
      <div style={{maxWidth: 800, textAlign: 'center', marginBottom: 40}}>
        <h2 className="t-section-heading" style={{marginBottom: 16}}>Let's Connect</h2>
        <p className="t-body" style={{color: 'var(--apple-black-80)'}}>
          Whether you want to discuss data integrations, automated workflows, or potential opportunities, I'm always open to a conversation.
        </p>
      </div>

      <div style={{display: 'flex', gap: 24, marginBottom: 40}}>
        <a 
          href="https://mail.google.com/mail/?view=cm&fs=1&to=Evantan005@gmail.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="link-inline"
          aria-label="Email"
        >
          <Mail style={{width: 24, height: 24, color: 'var(--apple-near-black)'}} />
        </a>
        <a 
          href="https://www.linkedin.com/in/evan-tan-3b0b59323/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="link-inline"
          aria-label="LinkedIn"
        >
          <Linkedin style={{width: 24, height: 24, color: 'var(--apple-near-black)'}} />
        </a>
        <a 
          href="https://github.com/Evannoshy" 
          target="_blank" 
          rel="noopener noreferrer"
          className="link-inline"
          aria-label="GitHub"
        >
          <Github style={{width: 24, height: 24, color: 'var(--apple-near-black)'}} />
        </a>
      </div>
      
      <p className="apple-footer-text">
        © {new Date().getFullYear()} Evan. All rights reserved. Created with Apple Design Patterns.
      </p>
    </footer>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function App() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.origin === window.location.origin) {
        e.preventDefault();
        const element = document.querySelector(anchor.hash);
        if (element) {
          const headerOffset = 48; 
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
          window.scrollTo({
               top: offsetPosition,
               behavior: "smooth"
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div>
      <nav className="apple-nav">
        <div className="apple-nav-container">
          <a href="#" className="apple-nav-logo">Evan.</a>
          <div className="apple-nav-links">
            <a href="#about" className="apple-nav-link">About</a>
            <a href="#skills" className="apple-nav-link">Skills</a>
            <a href="#experience" className="apple-nav-link">Experience</a>
            <a href="#projects" className="apple-nav-link">Projects</a>
            <a href="#contact" className="apple-nav-link">Contact</a>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <About />
        <Skills />
        <ExperienceSection />
        <Projects />
      </main>

      <Footer />
    </div>
  );
}
