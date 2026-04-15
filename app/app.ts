import React, { useState, useEffect } from 'react';
import { 
  Home, Map as MapIcon, FileText, Newspaper, User, 
  ChevronRight, Plus, CheckCircle2, Circle, Briefcase, 
  GraduationCap, Download, Settings, ChevronLeft, ArrowRight
} from 'lucide-react';

// --- Mock Data (Singapore Context) ---

const SG_NEWS = [
  { id: 1, category: 'Policy', title: 'SkillsFuture Level-Up Programme Expanded', summary: 'New subsidies announced for mid-career professionals aged 40 and above undertaking full-time diplomas.', date: '2 days ago', source: 'MOF' },
  { id: 2, category: 'Tech', title: 'GovTech Scaling Cloud Engineering Roles', summary: 'Public sector digital transformation drives demand for cloud-native skills. Focus on AWS and Azure certifications.', date: '4 days ago', source: 'Tech in Asia' },
  { id: 3, category: 'Finance', title: 'MAS Launches Green Finance Initiative', summary: 'Financial institutions in Singapore are accelerating hiring for ESG analysts and sustainable finance compliance officers.', date: '1 week ago', source: 'Business Times' },
  { id: 4, category: 'Macro', title: 'Q3 Employment Growth Driven by Tech & Health', summary: 'MOM reports localized growth in technical sectors, balancing out manufacturing slowdowns.', date: '1 week ago', source: 'MOM Report' },
];

const PRESET_TRACKS = {
  finance: {
    id: 't-fin-1',
    title: 'Data Analytics in Finance',
    description: 'Transition from general finance to data-driven roles.',
    progress: 25,
    steps: [
      { id: 's1', title: 'Advanced Excel & VBA', provider: 'SkillsFuture / NUS ISS', type: 'course', completed: true },
      { id: 's2', title: 'SQL for Financial Data', provider: 'Coursera', type: 'course', completed: false },
      { id: 's3', title: 'Financial Modeling Project', provider: 'Self-directed', type: 'project', completed: false },
      { id: 's4', title: 'Python for Data Analysis', provider: 'General Assembly SG', type: 'certification', completed: false }
    ]
  },
  tech: {
    id: 't-tech-1',
    title: 'Frontend Development Baseline',
    description: 'Core skills for junior developer roles in local startups.',
    progress: 0,
    steps: [
      { id: 's1', title: 'HTML, CSS & JS Fundamentals', provider: 'FreeCodeCamp', type: 'course', completed: false },
      { id: 's2', title: 'React JS Development', provider: 'SkillsFuture / NTU', type: 'course', completed: false },
      { id: 's3', title: 'Build 3 Portfolio Projects', provider: 'Self-directed', type: 'project', completed: false }
    ]
  }
};

// --- Main App Component ---

export default function App() {
  // App State
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  // User Data State
  const [profile, setProfile] = useState({ name: '', status: '', interest: '' });
  const [activeTrack, setActiveTrack] = useState(null);
  
  // Resume State
  const [resume, setResume] = useState({
    basics: { name: '', email: '', phone: '', linkedin: '' },
    experience: [],
    education: [],
    skills: ''
  });

  // Load appropriate track based on interest during onboarding
  useEffect(() => {
    if (profile.interest === 'Finance') setActiveTrack(PRESET_TRACKS.finance);
    else if (profile.interest === 'Technology') setActiveTrack(PRESET_TRACKS.tech);
    else if (profile.interest) setActiveTrack(PRESET_TRACKS.finance); // Fallback
  }, [profile.interest]);

  // --- Render Helpers ---

  const renderContent = () => {
    if (!hasOnboarded) {
      return <OnboardingView setProfile={setProfile} setHasOnboarded={setHasOnboarded} profile={profile} />;
    }

    switch (activeTab) {
      case 'home': return <HomeView profile={profile} track={activeTrack} setActiveTab={setActiveTab} />;
      case 'tracks': return <TracksView track={activeTrack} setTrack={setActiveTrack} profile={profile} />;
      case 'resume': return <ResumeView resume={resume} setResume={setResume} />;
      case 'news': return <NewsView />;
      case 'profile': return <ProfileView profile={profile} setHasOnboarded={setHasOnboarded} />;
      default: return <HomeView profile={profile} track={activeTrack} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-gray-200">
      {/* Mobile Container Simulator for Desktop view, actual full width on mobile */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-sm relative flex flex-col border-x border-gray-100">
        
        {/* Main scrollable content area */}
        <main className="flex-1 overflow-y-auto pb-20 print:pb-0 hide-scrollbar">
          {renderContent()}
        </main>

        {/* Bottom Navigation */}
        {hasOnboarded && (
          <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex justify-between px-6 py-3 pb-safe print:hidden">
            <NavItem icon={<Home size={20} />} label="Home" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavItem icon={<MapIcon size={20} />} label="Tracks" isActive={activeTab === 'tracks'} onClick={() => setActiveTab('tracks')} />
            <NavItem icon={<FileText size={20} />} label="Resume" isActive={activeTab === 'resume'} onClick={() => setActiveTab('resume')} />
            <NavItem icon={<Newspaper size={20} />} label="News" isActive={activeTab === 'news'} onClick={() => setActiveTab('news')} />
            <NavItem icon={<User size={20} />} label="Profile" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          </nav>
        )}
      </div>

      {/* Global styles for hiding scrollbar and print formatting */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          .max-w-md { max-width: 100% !important; border: none !important; box-shadow: none !important; }
        }
      `}} />
    </div>
  );
}

// --- Navigation Component ---

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center justify-center space-y-1 w-14 transition-colors duration-200 ${isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
    >
      {icon}
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
  );
}

// --- Views ---

function OnboardingView({ setProfile, setHasOnboarded, profile }) {
  const [step, setStep] = useState(1);

  const updateProfile = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-8 h-full flex flex-col justify-center animate-in fade-in duration-500">
      <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-8">
        <MapIcon size={24} />
      </div>
      
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight mb-2">Welcome.</h1>
            <p className="text-gray-500">Let's establish your current professional baseline.</p>
          </div>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">What is your name?</label>
            <input 
              type="text" 
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors"
              placeholder="e.g. Wei Jie"
              value={profile.name}
              onChange={(e) => updateProfile('name', e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Current Status</label>
            <div className="grid grid-cols-1 gap-2">
              {['Undergraduate / Student', 'Serving NS', 'Working Professional (1-3 yrs)', 'Seeking Employment'].map(status => (
                <button
                  key={status}
                  onClick={() => updateProfile('status', status)}
                  className={`text-left px-4 py-3 border text-sm rounded-md transition-colors ${profile.status === status ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <button 
            disabled={!profile.name || !profile.status}
            onClick={() => setStep(2)}
            className="w-full bg-black text-white py-3 rounded-md font-medium mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            Continue <ArrowRight size={16} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight mb-2">Target Industry.</h1>
            <p className="text-gray-500">Which sector are you aiming to pivot into or grow within?</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {['Technology', 'Finance', 'Public Sector', 'Healthcare', 'Supply Chain & Logistics'].map(industry => (
                <button
                  key={industry}
                  onClick={() => updateProfile('interest', industry)}
                  className={`text-left px-4 py-3 border text-sm rounded-md transition-colors ${profile.interest === industry ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button 
              onClick={() => setStep(1)}
              className="px-4 py-3 border border-gray-200 rounded-md text-gray-600"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              disabled={!profile.interest}
              onClick={() => setHasOnboarded(true)}
              className="flex-1 bg-black text-white py-3 rounded-md font-medium disabled:opacity-50 flex justify-center items-center"
            >
              Construct Strategy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function HomeView({ profile, track, setActiveTab }) {
  const firstName = profile.name.split(' ')[0] || 'User';
  
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <header className="mb-8 mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Good afternoon, {firstName}.</h1>
        <p className="text-gray-500 mt-1 text-sm">{profile.status} • Focusing on {profile.interest}</p>
      </header>

      <section className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Current Track</h2>
          <button onClick={() => setActiveTab('tracks')} className="text-xs text-gray-500 hover:text-black font-medium">View Plan</button>
        </div>
        
        {track ? (
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-lg mb-1">{track.title}</h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-1">{track.description}</p>
            
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
              <div className="bg-black h-1.5 rounded-full transition-all duration-500" style={{ width: `${track.progress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mb-4">
              <span>Progress</span>
              <span>{track.progress}%</span>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">Up Next</span>
              {track.steps.filter(s => !s.completed).slice(0,1).map(step => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.provider}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 border border-dashed border-gray-300 rounded-xl text-center">
            <p className="text-sm text-gray-500 mb-2">No track selected.</p>
            <button onClick={() => setActiveTab('tracks')} className="text-sm font-medium text-black">Browse Tracks</button>
          </div>
        )}
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Resume Status</h2>
          <button onClick={() => setActiveTab('resume')} className="text-xs text-gray-500 hover:text-black font-medium">Edit Document</button>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
              <FileText size={20} />
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900">Primary Profile.pdf</p>
              <p className="text-xs text-gray-500 mt-0.5">Last updated today</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Market Intelligence</h2>
          <button onClick={() => setActiveTab('news')} className="text-xs text-gray-500 hover:text-black font-medium">Read All</button>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500">{SG_NEWS[0].category}</span>
          <h3 className="font-medium text-sm text-gray-900 mt-1 mb-2 leading-snug">{SG_NEWS[0].title}</h3>
          <p className="text-xs text-gray-500 line-clamp-2">{SG_NEWS[0].summary}</p>
        </div>
      </section>
    </div>
  );
}

function TracksView({ track, setTrack, profile }) {
  const handleToggleStep = (stepId) => {
    if (!track) return;
    const updatedSteps = track.steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s);
    const completedCount = updatedSteps.filter(s => s.completed).length;
    const progress = Math.round((completedCount / updatedSteps.length) * 100);
    setTrack({ ...track, steps: updatedSteps, progress });
  };

  return (
    <div className="p-6 animate-in fade-in duration-300">
      <header className="mb-6 mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Upskilling Track.</h1>
        <p className="text-gray-500 mt-1 text-sm">Structured path for {profile.interest}.</p>
      </header>

      {track && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium">{track.title}</h2>
              <p className="text-sm text-gray-500">{track.progress}% Completed</p>
            </div>
          </div>

          <div className="relative border-l border-gray-200 ml-3 space-y-8 pb-4">
            {track.steps.map((step, index) => (
              <div key={step.id} className="relative pl-6">
                {/* Node */}
                <button 
                  onClick={() => handleToggleStep(step.id)}
                  className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center transition-colors ${step.completed ? 'border-black text-black' : 'border-gray-300 text-transparent hover:border-gray-400'}`}
                >
                  {step.completed && <CheckCircle2 size={12} />}
                </button>
                
                {/* Content */}
                <div className={`transition-opacity ${step.completed ? 'opacity-50' : 'opacity-100'}`}>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Phase {index + 1}</span>
                  <h3 className={`text-base font-medium ${step.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{step.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] uppercase font-medium">{step.type}</span>
                    <span className="text-xs text-gray-500">{step.provider}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:text-black hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
        <Plus size={16} /> Add Custom Milestone
      </button>
    </div>
  );
}

function ResumeView({ resume, setResume }) {
  const [mode, setMode] = useState('edit'); // 'edit' or 'preview'

  const updateBasics = (field, value) => {
    setResume(prev => ({ ...prev, basics: { ...prev.basics, [field]: value } }));
  };

  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now(), company: '', role: '', period: '', description: '' }]
    }));
  };

  const updateExperience = (id, field, value) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now(), institution: '', degree: '', period: '' }]
    }));
  };

  const updateEducation = (id, field, value) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 px-6 flex justify-between items-center z-10 print:hidden">
        <h1 className="text-lg font-semibold tracking-tight text-gray-900">Document Builder</h1>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-md">
          <button 
            onClick={() => setMode('edit')}
            className={`px-3 py-1 text-xs font-medium rounded ${mode === 'edit' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Structure
          </button>
          <button 
            onClick={() => setMode('preview')}
            className={`px-3 py-1 text-xs font-medium rounded ${mode === 'preview' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="p-6">
        {mode === 'edit' ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Basics */}
            <section>
              <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Identification</h2>
              <div className="space-y-3">
                <input type="text" placeholder="Full Name" value={resume.basics.name} onChange={e => updateBasics('name', e.target.value)} className="w-full text-sm border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors" />
                <input type="email" placeholder="Email Address" value={resume.basics.email} onChange={e => updateBasics('email', e.target.value)} className="w-full text-sm border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors" />
                <input type="text" placeholder="Phone Number" value={resume.basics.phone} onChange={e => updateBasics('phone', e.target.value)} className="w-full text-sm border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors" />
                <input type="text" placeholder="LinkedIn URL" value={resume.basics.linkedin} onChange={e => updateBasics('linkedin', e.target.value)} className="w-full text-sm border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors" />
              </div>
            </section>

            {/* Experience */}
            <section>
              <div className="flex justify-between items-end mb-4 border-b border-gray-200 pb-2">
                <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Experience</h2>
                <button onClick={addExperience} className="text-xs text-black font-medium flex items-center gap-1"><Plus size={14}/> Add Entry</button>
              </div>
              <div className="space-y-6">
                {resume.experience.length === 0 && <p className="text-sm text-gray-400 italic">No experience added.</p>}
                {resume.experience.map((exp, index) => (
                  <div key={exp.id} className="space-y-3 p-4 border border-gray-100 rounded-lg bg-gray-50/50 relative group">
                    <input type="text" placeholder="Company Name" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} className="w-full text-sm font-medium bg-transparent border-none p-0 focus:outline-none focus:ring-0 placeholder:font-normal" />
                    <input type="text" placeholder="Role / Title" value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} className="w-full text-sm bg-transparent border-none p-0 focus:outline-none text-gray-600" />
                    <input type="text" placeholder="Period (e.g. Jan 2022 - Present)" value={exp.period} onChange={e => updateExperience(exp.id, 'period', e.target.value)} className="w-full text-xs bg-transparent border-none p-0 focus:outline-none text-gray-400" />
                    <textarea placeholder="Key achievements (use action verbs)" value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} className="w-full text-sm bg-transparent border border-gray-200 rounded p-2 focus:outline-none min-h-[80px] resize-none" />
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <div className="flex justify-between items-end mb-4 border-b border-gray-200 pb-2">
                <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Education</h2>
                <button onClick={addEducation} className="text-xs text-black font-medium flex items-center gap-1"><Plus size={14}/> Add Entry</button>
              </div>
              <div className="space-y-6">
                {resume.education.length === 0 && <p className="text-sm text-gray-400 italic">No education added.</p>}
                {resume.education.map((edu, index) => (
                  <div key={edu.id} className="space-y-3 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                    <input type="text" placeholder="Institution Name" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} className="w-full text-sm font-medium bg-transparent border-none p-0 focus:outline-none" />
                    <input type="text" placeholder="Degree / Certification" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} className="w-full text-sm bg-transparent border-none p-0 focus:outline-none text-gray-600" />
                    <input type="text" placeholder="Period / Year of Graduation" value={edu.period} onChange={e => updateEducation(edu.id, 'period', e.target.value)} className="w-full text-xs bg-transparent border-none p-0 focus:outline-none text-gray-400" />
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Core Competencies</h2>
              <textarea 
                placeholder="List key skills separated by commas..." 
                value={resume.skills} 
                onChange={e => setResume(prev => ({...prev, skills: e.target.value}))}
                className="w-full text-sm bg-transparent border border-gray-200 rounded p-3 focus:outline-none focus:border-black min-h-[100px] resize-none" 
              />
            </section>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <div className="bg-white border border-gray-200 print:border-none print:shadow-none shadow-sm rounded-lg p-8 print:p-0 min-h-[600px] text-gray-900">
              
              {/* Output PDF Structure */}
              <header className="mb-6 border-b border-gray-300 pb-4 text-center">
                <h1 className="text-2xl font-serif text-black uppercase tracking-wide">{resume.basics.name || 'Your Name'}</h1>
                <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
                  {resume.basics.email && <span>{resume.basics.email}</span>}
                  {resume.basics.phone && <span>{resume.basics.phone}</span>}
                  {resume.basics.linkedin && <span>{resume.basics.linkedin}</span>}
                </div>
              </header>

              {resume.experience.length > 0 && (
                <section className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 mb-3 pb-1">Professional Experience</h2>
                  <div className="space-y-4">
                    {resume.experience.map(exp => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-sm font-semibold">{exp.role || 'Role Title'}</h3>
                          <span className="text-xs text-gray-600">{exp.period}</span>
                        </div>
                        <p className="text-sm italic text-gray-800 mb-1">{exp.company || 'Company Name'}</p>
                        {exp.description && (
                          <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {resume.education.length > 0 && (
                <section className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 mb-3 pb-1">Education</h2>
                  <div className="space-y-3">
                    {resume.education.map(edu => (
                      <div key={edu.id} className="flex justify-between items-baseline">
                        <div>
                          <h3 className="text-sm font-semibold">{edu.institution || 'Institution'}</h3>
                          <p className="text-xs text-gray-800">{edu.degree}</p>
                        </div>
                        <span className="text-xs text-gray-600">{edu.period}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {resume.skills && (
                <section className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 mb-3 pb-1">Skills</h2>
                  <p className="text-xs text-gray-800 leading-relaxed">{resume.skills}</p>
                </section>
              )}

            </div>
            
            <button 
              onClick={() => window.print()}
              className="mt-6 w-full bg-black text-white py-3 rounded-md font-medium flex items-center justify-center gap-2 print:hidden"
            >
              <Download size={16} /> Export to PDF
            </button>
            <p className="text-xs text-center text-gray-400 mt-3 print:hidden">Tip: Adjust print settings to remove margins and headers.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function NewsView() {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <header className="mb-6 mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Market Intelligence.</h1>
        <p className="text-gray-500 mt-1 text-sm">Curated signals for the Singapore economy.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 pb-2">
        {['All', 'Policy', 'Tech', 'Finance', 'Macro'].map((tag, i) => (
          <button key={tag} className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
            {tag}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {SG_NEWS.map(news => (
          <article key={news.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm group cursor-pointer hover:border-gray-300 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500">{news.category}</span>
              <span className="text-[10px] text-gray-400">{news.date}</span>
            </div>
            <h3 className="font-medium text-sm text-gray-900 mb-2 leading-snug group-hover:text-black">{news.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{news.summary}</p>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide">Source: {news.source}</div>
          </article>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
         <p className="text-xs text-gray-400 italic">End of recent updates.</p>
      </div>
    </div>
  );
}

function ProfileView({ profile, setHasOnboarded }) {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <header className="mb-8 mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Settings.</h1>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-200">
            <User size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{profile.name || 'User'}</h2>
            <p className="text-sm text-gray-500">{profile.status}</p>
          </div>
        </div>

        <div className="space-y-4 border-t border-gray-100 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Industry Interest</span>
            <span className="font-medium">{profile.interest || 'Not set'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Account Type</span>
            <span className="font-medium">Local Data (Device)</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          <span className="flex items-center gap-3"><Settings size={18} className="text-gray-400" /> Account Settings</span>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={() => {
            if(window.confirm('Reset all local data and return to onboarding?')) {
              setHasOnboarded(false);
            }
          }}
          className="text-xs text-red-500 font-medium hover:text-red-600"
        >
          Reset Application Data
        </button>
        <p className="text-[10px] text-gray-400 mt-4">v1.0.0 • Singapore Build</p>
      </div>
    </div>
  );
}