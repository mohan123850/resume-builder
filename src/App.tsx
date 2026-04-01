import * as React from 'react';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Briefcase, 
  Wrench, 
  Download, 
  Sparkles, 
  Search,
  Plus,
  Trash2,
  ChevronRight,
  FileText,
  CheckCircle2,
  Loader2,
  Globe,
  Linkedin,
  Code,
  Terminal,
  Database,
  Cpu,
  Layers,
  Lightbulb,
  Zap,
  Server,
  Braces,
  Laptop,
  Box,
  Cloud,
  GitBranch,
  Github,
  Monitor,
  Smartphone,
  Activity,
  Shield,
  Search as SearchIcon
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';

// --- Types ---
interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
  description: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
}

interface CustomSection {
  id: string;
  title: string;
  content: string;
}

interface JobMatch {
  title: string;
  company: string;
  matchScore: number;
  reason: string;
}

interface Skill {
  id: string;
  name: string;
  icon: string;
}

interface SkillCategory {
  id: string;
  name: string;
  skills: Skill[];
}

const ICON_OPTIONS = [
  { name: 'Code', icon: Code },
  { name: 'Terminal', icon: Terminal },
  { name: 'Database', icon: Database },
  { name: 'Cpu', icon: Cpu },
  { name: 'Layers', icon: Layers },
  { name: 'Lightbulb', icon: Lightbulb },
  { name: 'Zap', icon: Zap },
  { name: 'Server', icon: Server },
  { name: 'Braces', icon: Braces },
  { name: 'Laptop', icon: Laptop },
  { name: 'Globe', icon: Globe },
  { name: 'Wrench', icon: Wrench },
  { name: 'Box', icon: Box },
  { name: 'Cloud', icon: Cloud },
  { name: 'GitBranch', icon: GitBranch },
  { name: 'Github', icon: Github },
  { name: 'Monitor', icon: Monitor },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Activity', icon: Activity },
  { name: 'Shield', icon: Shield },
];

const getIconComponent = (name: string) => {
  const found = ICON_OPTIONS.find(opt => opt.name === name);
  return found ? found.icon : Code;
};

export default function App() {
  // --- State ---
  const [name, setName] = React.useState('Ravu Mohan Durga Prasad');
  const [email, setEmail] = React.useState('ravu@example.com');
  const [phone, setPhone] = React.useState('+91 9381814335');
  const [linkedin, setLinkedin] = React.useState('https://linkedin.com/in/ravu');
  const [github, setGithub] = React.useState('https://github.com/yourusername');
  const [portfolio, setPortfolio] = React.useState('https://yourproject.vercel.app');
  const [summary, setSummary] = React.useState('Computer Science undergraduate with hands-on experience in building full-stack and AI-based applications using Python, Django, and React. Strong foundation in Data Structures and problem-solving, with a focus on developing scalable and efficient solutions.');
  const [skillCategories, setSkillCategories] = React.useState<SkillCategory[]>([
    {
      id: '1',
      name: 'Languages',
      skills: [
        { id: '1-1', name: 'Python', icon: 'Code' },
        { id: '1-2', name: 'JavaScript', icon: 'Braces' }
      ]
    },
    {
      id: '2',
      name: 'Frameworks',
      skills: [
        { id: '2-1', name: 'Django', icon: 'Server' },
        { id: '2-2', name: 'React', icon: 'Layers' }
      ]
    },
    {
      id: '3',
      name: 'Tools',
      skills: [
        { id: '3-1', name: 'Git', icon: 'Terminal' },
        { id: '3-2', name: 'Docker', icon: 'Laptop' }
      ]
    },
    {
      id: '4',
      name: 'Concepts',
      skills: [
        { id: '4-1', name: 'REST APIs', icon: 'Globe' },
        { id: '4-2', name: 'Data Structures', icon: 'Cpu' },
        { id: '4-3', name: 'AI/ML Basics', icon: 'Zap' },
        { id: '4-4', name: 'NLP', icon: 'Lightbulb' }
      ]
    }
  ]);
  const [education, setEducation] = React.useState<Education[]>([
    { 
      id: '1', 
      school: 'Pragati Engineering College', 
      degree: 'B.Tech in Computer Science', 
      year: 'Expected Graduation: 2026',
      description: ''
    }
  ]);
  const [experience, setExperience] = React.useState<Experience[]>([
    {
      id: '1',
      role: 'Software Developer Intern',
      company: 'Monam Technologies',
      duration: 'Jun 2025 – Aug 2025',
      description: 'Developed web applications using Python and Django. Built REST APIs for frontend integration. Collaborated with team members to improve system performance. Debugged and optimized application features.'
    },
    {
      id: '2',
      role: 'Academic Project Experience',
      company: 'Pragati Engineering College',
      duration: '2024 – Present',
      description: 'Developed AI-based applications using Python and NLP. Built full-stack applications using Django and React. Implemented REST APIs and database integration. Improved application performance and UI responsiveness.'
    }
  ]);
  const [projects, setProjects] = React.useState<Project[]>([
    { 
      id: '1', 
      title: 'Job Matching Application', 
      description: 'Developed a full-stack web application to match job seekers with relevant opportunities. Implemented TF-IDF and cosine similarity to rank job descriptions. Achieved ~85% matching relevance on test dataset. Built backend services using Django REST framework and frontend using React.' 
    },
    { 
      id: '2', 
      title: 'AI Chatbot for Customer Support', 
      description: 'Designed and developed a chatbot to handle frequently asked questions using NLP techniques. Improved response efficiency by automating user queries. Implemented intent recognition using NLP techniques such as keyword extraction and similarity matching.' 
    }
  ]);
  const [achievements, setAchievements] = React.useState<string>('Solved 200+ coding problems on LeetCode and CodeChef, focusing on Data Structures and Algorithms. Developed and deployed 2+ full-stack applications with real-world use cases. Implemented NLP-based solutions achieving improved accuracy in project outputs. Actively improving problem-solving and system design skills through continuous practice.');
  const [cgpa, setCgpa] = React.useState('8.4 / 10');
  const [academicDetails, setAcademicDetails] = React.useState('Consistent academic performance across semesters. Strong understanding of core subjects: Data Structures, Algorithms, DBMS');
  const [customSections, setCustomSections] = React.useState<CustomSection[]>([]);
  const [certificates, setCertificates] = React.useState<string[]>(['Python for Data Science - IBM', 'Full Stack Web Development - Coursera']);
  
  const [jobMatches, setJobMatches] = React.useState<JobMatch[]>([]);
  const [isMatching, setIsMatching] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'edit' | 'preview' | 'jobs'>('edit');

  // --- Handlers ---
  const addEducation = () => setEducation([...education, { id: Date.now().toString(), school: '', degree: '', year: '', description: '' }]);
  const removeEducation = (id: string) => setEducation(education.filter(e => e.id !== id));
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const addExperience = () => setExperience([...experience, { id: Date.now().toString(), company: '', role: '', duration: '', description: '' }]);
  const removeExperience = (id: string) => setExperience(experience.filter(e => e.id !== id));
  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperience(experience.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const addProject = () => setProjects([...projects, { id: Date.now().toString(), title: '', description: '' }]);
  const removeProject = (id: string) => setProjects(projects.filter(p => p.id !== id));
  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addCustomSection = () => setCustomSections([...customSections, { id: Date.now().toString(), title: '', content: '' }]);
  const removeCustomSection = (id: string) => setCustomSections(customSections.filter(s => s.id !== id));
  const updateCustomSection = (id: string, field: keyof CustomSection, value: string) => {
    setCustomSections(customSections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addCertificate = (name: string) => {
    if (name.trim()) {
      setCertificates([...certificates, name.trim()]);
    }
  };

  const removeCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  // --- Skill Handlers ---
  const addSkillCategory = () => setSkillCategories([...skillCategories, { id: Date.now().toString(), name: '', skills: [] }]);
  const removeSkillCategory = (id: string) => setSkillCategories(skillCategories.filter(c => c.id !== id));
  const updateSkillCategoryName = (id: string, name: string) => {
    setSkillCategories(skillCategories.map(c => c.id === id ? { ...c, name } : c));
  };
  const addSkillToCategory = (categoryId: string) => {
    setSkillCategories(skillCategories.map(c => c.id === categoryId ? { 
      ...c, 
      skills: [...c.skills, { id: Date.now().toString(), name: '', icon: 'Code' }] 
    } : c));
  };
  const removeSkillFromCategory = (categoryId: string, skillId: string) => {
    setSkillCategories(skillCategories.map(c => c.id === categoryId ? { 
      ...c, 
      skills: c.skills.filter(s => s.id !== skillId) 
    } : c));
  };
  const updateSkill = (categoryId: string, skillId: string, field: keyof Skill, value: string) => {
    setSkillCategories(skillCategories.map(c => c.id === categoryId ? { 
      ...c, 
      skills: c.skills.map(s => s.id === skillId ? { ...s, [field]: value } : s) 
    } : c));
  };

  // --- AI Job Matching ---
  const findJobMatches = async () => {
    if (skillCategories.length === 0 && !experience[0]?.role) {
      alert("Please add some skills or experience first to get relevant matches.");
      return;
    }

    setIsMatching(true);
    setActiveTab('jobs');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const skillsContext = skillCategories.map(cat => `${cat.name}: ${cat.skills.map(s => s.name).join(', ')}`).join('; ');
      
      const resumeContext = `
        Name: ${name}
        Primary Skills: ${skillsContext}
        Education: ${education.map(e => `${e.degree} from ${e.school}`).join(', ')}
        Experience: ${experience.map(e => `${e.role} at ${e.company} (${e.description})`).join('; ')}
        Projects: ${projects.map(p => `${p.title}: ${p.description}`).join('; ')}
      `;

      const prompt = `
        As a career expert, suggest exactly 5 suitable job roles for a person with the following professional profile. 
        Focus heavily on their skills and experience.
        
        Profile Context:
        ${resumeContext}

        Return the response in strict JSON format:
        {
          "matches": [
            {
              "title": "Specific Job Title",
              "company": "Type of Company (e.g., Tech Startup, Fortune 500, Creative Agency)",
              "matchScore": 95,
              "reason": "A one-sentence explanation of why their specific skills make them a great fit for this role."
            }
          ]
        }
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || '{}');
      setJobMatches(result.matches || []);
    } catch (err) {
      console.error("AI Matching Error:", err);
      alert("Failed to generate job suggestions. Please check your connection.");
    } finally {
      setIsMatching(false);
    }
  };

  // --- PDF Export (Traditional Layout) ---
  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 12;
    const contentWidth = pageWidth - (margin * 2);
    
    // Header - Centered
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    const nameText = (name || "RAVU MOHAN DURGA PRASAD").toUpperCase();
    const nameWidth = doc.getTextWidth(nameText);
    doc.text(nameText, (pageWidth - nameWidth) / 2, 18);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(85, 85, 85);
    const contactInfo = `${phone || "+91 XXXXXXXXXX"} | ${email || "your.email@gmail.com"} | LinkedIn: ${linkedin || "linkedin.com/in/yourprofile"} | GitHub: ${github || "github.com/yourusername"}`;
    const contactWidth = doc.getTextWidth(contactInfo);
    doc.text(contactInfo, (pageWidth - contactWidth) / 2, 24);
    
    let y = 32;

    const addSectionTitle = (title: string) => {
      if (y > 280) {
        doc.addPage();
        y = 12;
      }
      y += 3;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(title.toUpperCase(), margin, y);
      
      y += 1.2;
      doc.setDrawColor(221, 221, 221);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;
    };

    const writeParagraph = (text: string) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 51, 51);
      const splitText = doc.splitTextToSize(text, contentWidth);
      splitText.forEach((line: string) => {
        if (y > 285) {
          doc.addPage();
          y = 12;
        }
        doc.text(line, margin, y);
        y += 4.5;
      });
      y += 1.5;
    };

    const writeBullets = (items: string[]) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 51, 51);
      items.forEach(item => {
        if (y > 285) {
          doc.addPage();
          y = 12;
        }
        doc.text("•", margin + 2, y);
        const splitItem = doc.splitTextToSize(item, contentWidth - 7);
        doc.text(splitItem, margin + 5, y);
        y += (splitItem.length * 4.5);
      });
      y += 1;
    };

    // Profile
    if (summary) {
      addSectionTitle("Profile");
      writeParagraph(summary);
    }

    // Experience
    if (experience.length > 0) {
      addSectionTitle("Experience");
      experience.forEach(exp => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(exp.role, margin, y);
        
        doc.setFont("helvetica", "normal");
        const durWidth = doc.getTextWidth(exp.duration);
        doc.text(exp.duration, pageWidth - margin - durWidth, y);
        y += 4.5;
        
        doc.setFont("helvetica", "italic");
        doc.text(exp.company, margin, y);
        y += 4.5;
        
        const bullets = exp.description.split('. ').filter(b => b.trim().length > 0);
        writeBullets(bullets);
      });
    }

    // Projects
    if (projects.length > 0) {
      addSectionTitle("Projects");
      projects.forEach(proj => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(proj.title, margin, y);
        y += 4.5;
        const bullets = proj.description.split('. ').filter(b => b.trim().length > 0);
        writeBullets(bullets);
      });
    }

    // Certificates
    if (certificates.length > 0) {
      addSectionTitle("Certifications");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      certificates.forEach(cert => {
        doc.text(`• ${cert}`, margin + 5, y);
        y += 4.5;
      });
    }

    // Skills
    if (skillCategories.length > 0) {
      addSectionTitle("Skills");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      skillCategories.forEach(cat => {
        if (cat.name && cat.skills.length > 0) {
          const skillsText = cat.skills.map(s => s.name).join(", ");
          const line = `${cat.name}: ${skillsText}`;
          const splitLine = doc.splitTextToSize(line, contentWidth);
          splitLine.forEach((l: string) => {
            if (y > 285) {
              doc.addPage();
              y = 12;
            }
            doc.text(l, margin, y);
            y += 4.5;
          });
        }
      });
      y += 1.5;
    }
    
    // Education
    if (education.length > 0) {
      addSectionTitle("Education");
      education.forEach(edu => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.text(edu.degree, margin, y);
        doc.setFont("helvetica", "normal");
        const yearWidth = doc.getTextWidth(edu.year);
        doc.text(edu.year, pageWidth - margin - yearWidth, y);
        y += 4;
        doc.text(edu.school, margin, y);
        y += 5;
      });
    }

    // Achievements
    if (achievements) {
      addSectionTitle("Achievements");
      const bullets = achievements.split('. ').filter(b => b.trim().length > 0);
      writeBullets(bullets);
    }

    // Custom Sections
    customSections.forEach(section => {
      if (section.title || section.content) {
        addSectionTitle(section.title || "Custom Section");
        if (section.content) {
          writeParagraph(section.content);
        }
      }
    });

    doc.save(`${name.replace(/\s+/g, '_')}_Resume.pdf`);
    alert("Success! Your ultra-compact traditional resume PDF has been generated.");
  };


  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white">
      {/* Navigation Rail */}
      <nav className="fixed left-0 top-0 h-full w-20 bg-white border-r border-[#E5E5E5] flex flex-col items-center py-8 gap-8 z-50">
        <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white">
          <FileText size={20} />
        </div>
        <div className="flex flex-col gap-4">
          {[
            { id: 'edit', icon: User, label: 'Edit' },
            { id: 'preview', icon: Globe, label: 'Preview' },
            { id: 'jobs', icon: Search, label: 'Jobs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "p-3 rounded-xl transition-all group relative",
                activeTab === tab.id ? "bg-zinc-100 text-zinc-900" : "hover:bg-zinc-50 text-zinc-400"
              )}
            >
              <tab.icon size={20} />
              <span className="absolute left-full ml-4 px-2 py-1 bg-[#1A1A1A] text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
        <button 
          onClick={exportToPDF}
          className="mt-auto p-3 text-zinc-600 hover:bg-zinc-100 rounded-xl transition-all"
        >
          <Download size={20} />
        </button>
      </nav>

      <main className="pl-20 min-h-screen">
        <div className="max-w-5xl mx-auto p-8 lg:p-16">
          <AnimatePresence mode="wait">
            {activeTab === 'edit' && (
              <motion.div 
                key="edit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <header>
                  <h1 className="text-5xl font-serif font-light tracking-tight mb-2">Resume Builder</h1>
                  <p className="text-[#8E8E8E] font-mono text-xs uppercase tracking-[0.3em]">Craft your professional narrative</p>
                </header>

                {/* Basic Info */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-[#E5E5E5] pb-2">
                    <User size={16} className="text-[#8E8E8E]" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Personal Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Full Name</label>
                      <input 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full bg-transparent border-b border-[#E5E5E5] py-2 focus:border-[#1A1A1A] outline-none transition-colors text-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Email Address</label>
                      <input 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full bg-transparent border-b border-[#E5E5E5] py-2 focus:border-[#1A1A1A] outline-none transition-colors text-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Phone Number</label>
                      <input 
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+1 234 567 890"
                        className="w-full bg-transparent border-b border-[#E5E5E5] py-2 focus:border-[#1A1A1A] outline-none transition-colors text-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">LinkedIn URL</label>
                      <input 
                        value={linkedin}
                        onChange={e => setLinkedin(e.target.value)}
                        placeholder="linkedin.com/in/janedoe"
                        className="w-full bg-transparent border-b border-[#E5E5E5] py-2 focus:border-[#1A1A1A] outline-none transition-colors text-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">GitHub URL</label>
                      <input 
                        value={github}
                        onChange={e => setGithub(e.target.value)}
                        placeholder="github.com/janedoe"
                        className="w-full bg-transparent border-b border-[#E5E5E5] py-2 focus:border-[#1A1A1A] outline-none transition-colors text-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Portfolio URL</label>
                      <input 
                        value={portfolio}
                        onChange={e => setPortfolio(e.target.value)}
                        placeholder="portfolio.com"
                        className="w-full bg-transparent border-b border-[#E5E5E5] py-2 focus:border-[#1A1A1A] outline-none transition-colors text-lg"
                      />
                    </div>
                  </div>
                </section>

                {/* Summary */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-[#E5E5E5] pb-2">
                    <Sparkles size={16} className="text-[#8E8E8E]" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Professional Summary</h2>
                  </div>
                  <textarea 
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                    placeholder="Briefly describe your career goals and key achievements..."
                    className="w-full bg-white border border-[#E5E5E5] p-4 rounded-lg focus:border-[#1A1A1A] outline-none transition-colors min-h-[120px] text-sm leading-relaxed"
                  />
                </section>

                {/* Achievements */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-[#E5E5E5] pb-2">
                    <CheckCircle2 size={16} className="text-[#8E8E8E]" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Achievements</h2>
                  </div>
                  <textarea 
                    value={achievements}
                    onChange={e => setAchievements(e.target.value)}
                    placeholder="List your key achievements (one per sentence)..."
                    className="w-full bg-white border border-[#E5E5E5] p-4 rounded-lg focus:border-[#1A1A1A] outline-none transition-colors min-h-[100px] text-sm leading-relaxed"
                  />
                </section>

                {/* Experience */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
                    <div className="flex items-center gap-4">
                      <Briefcase size={16} className="text-[#8E8E8E]" />
                      <h2 className="text-xs font-bold uppercase tracking-widest">Experience</h2>
                    </div>
                    <button onClick={addExperience} className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 hover:text-[#8E8E8E] transition-colors">
                      <Plus size={12} /> Add
                    </button>
                  </div>
                  <div className="space-y-8">
                    {experience.map((exp) => (
                      <div key={exp.id} className="relative group bg-white p-6 rounded-2xl border border-[#E5E5E5] hover:shadow-xl hover:shadow-black/5 transition-all">
                        <button 
                          onClick={() => removeExperience(exp.id)}
                          className="absolute top-4 right-4 text-[#E5E5E5] hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                          <input 
                            value={exp.company}
                            onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                            placeholder="Company Name"
                            className="bg-transparent border-b border-[#E5E5E5] py-1 focus:border-[#1A1A1A] outline-none text-sm font-bold"
                          />
                          <input 
                            value={exp.role}
                            onChange={e => updateExperience(exp.id, 'role', e.target.value)}
                            placeholder="Job Title"
                            className="bg-transparent border-b border-[#E5E5E5] py-1 focus:border-[#1A1A1A] outline-none text-sm"
                          />
                          <input 
                            value={exp.duration}
                            onChange={e => updateExperience(exp.id, 'duration', e.target.value)}
                            placeholder="Duration (e.g. 2020 - Present)"
                            className="bg-transparent border-b border-[#E5E5E5] py-1 focus:border-[#1A1A1A] outline-none text-xs font-mono"
                          />
                        </div>
                        <textarea 
                          value={exp.description}
                          onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                          placeholder="Describe your responsibilities and achievements..."
                          className="w-full bg-[#F5F5F4] p-3 rounded-lg text-xs min-h-[80px] outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Education */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
                    <div className="flex items-center gap-4">
                      <GraduationCap size={16} className="text-[#8E8E8E]" />
                      <h2 className="text-xs font-bold uppercase tracking-widest">Education</h2>
                    </div>
                    <button onClick={addEducation} className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 hover:text-[#8E8E8E] transition-colors">
                      <Plus size={12} /> Add
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {education.map((edu) => (
                      <div key={edu.id} className="bg-white p-6 rounded-2xl border border-[#E5E5E5] relative">
                        <button 
                          onClick={() => removeEducation(edu.id)}
                          className="absolute top-4 right-4 text-[#E5E5E5] hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                        <input 
                          value={edu.school}
                          onChange={e => updateEducation(edu.id, 'school', e.target.value)}
                          placeholder="University Name"
                          className="w-full bg-transparent border-b border-[#E5E5E5] py-1 mb-3 focus:border-[#1A1A1A] outline-none text-sm font-bold"
                        />
                        <div className="flex gap-4 mb-3">
                          <input 
                            value={edu.degree}
                            onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                            placeholder="Degree"
                            className="flex-1 bg-transparent border-b border-[#E5E5E5] py-1 focus:border-[#1A1A1A] outline-none text-xs"
                          />
                          <input 
                            value={edu.year}
                            onChange={e => updateEducation(edu.id, 'year', e.target.value)}
                            placeholder="Year"
                            className="w-20 bg-transparent border-b border-[#E5E5E5] py-1 focus:border-[#1A1A1A] outline-none text-xs font-mono"
                          />
                        </div>
                        <textarea 
                          value={edu.description}
                          onChange={e => updateEducation(edu.id, 'description', e.target.value)}
                          placeholder="Highlights (e.g. GPA, relevant courses...)"
                          className="w-full bg-[#F5F5F4] p-3 rounded-lg text-xs min-h-[60px] outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Academic Performance */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-[#E5E5E5] pb-2">
                    <GraduationCap size={16} className="text-[#8E8E8E]" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Academic Performance</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Current CGPA</label>
                      <input 
                        value={cgpa}
                        onChange={e => setCgpa(e.target.value)}
                        placeholder="8.4 / 10"
                        className="w-full bg-transparent border-b border-[#E5E5E5] py-2 focus:border-[#1A1A1A] outline-none transition-colors text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Academic Details</label>
                      <textarea 
                        value={academicDetails}
                        onChange={e => setAcademicDetails(e.target.value)}
                        placeholder="List academic highlights (one per sentence)..."
                        className="w-full bg-white border border-[#E5E5E5] p-4 rounded-lg focus:border-[#1A1A1A] outline-none transition-colors min-h-[100px] text-sm leading-relaxed"
                      />
                    </div>
                  </div>
                </section>

                {/* Projects */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
                    <div className="flex items-center gap-4">
                      <FileText size={16} className="text-[#8E8E8E]" />
                      <h2 className="text-xs font-bold uppercase tracking-widest">Projects</h2>
                    </div>
                    <button onClick={addProject} className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 hover:text-[#8E8E8E] transition-colors">
                      <Plus size={12} /> Add
                    </button>
                  </div>
                  <div className="space-y-8">
                    {projects.map((proj) => (
                      <div key={proj.id} className="relative group bg-white p-6 rounded-2xl border border-[#E5E5E5] hover:shadow-xl hover:shadow-black/5 transition-all">
                        <button 
                          onClick={() => removeProject(proj.id)}
                          className="absolute top-4 right-4 text-[#E5E5E5] hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <input 
                          value={proj.title}
                          onChange={e => updateProject(proj.id, 'title', e.target.value)}
                          placeholder="Project Title"
                          className="w-full bg-transparent border-b border-[#E5E5E5] py-1 mb-4 focus:border-[#1A1A1A] outline-none text-sm font-bold"
                        />
                        <textarea 
                          value={proj.description}
                          onChange={e => updateProject(proj.id, 'description', e.target.value)}
                          placeholder="Describe your project..."
                          className="w-full bg-[#F5F5F4] p-3 rounded-lg text-xs min-h-[80px] outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Skills */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
                    <div className="flex items-center gap-4">
                      <Wrench size={16} className="text-[#8E8E8E]" />
                      <h2 className="text-xs font-bold uppercase tracking-widest">Technical Skills</h2>
                    </div>
                    <button onClick={addSkillCategory} className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 hover:text-[#8E8E8E] transition-colors">
                      <Plus size={12} /> Add Category
                    </button>
                  </div>
                  <div className="space-y-6">
                    {skillCategories.map((cat) => (
                      <div key={cat.id} className="bg-white p-6 rounded-2xl border border-[#E5E5E5] space-y-4">
                        <div className="flex items-center justify-between gap-4">
                          <input 
                            value={cat.name}
                            onChange={e => updateSkillCategoryName(cat.id, e.target.value)}
                            placeholder="Category (e.g. Languages)"
                            className="bg-transparent border-b border-[#E5E5E5] py-1 focus:border-[#1A1A1A] outline-none text-sm font-bold flex-1"
                          />
                          <button 
                            onClick={() => removeSkillCategory(cat.id)}
                            className="text-[#E5E5E5] hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {cat.skills.map((skill) => (
                            <div key={skill.id} className="flex items-center gap-2 bg-[#F5F5F4] p-2 rounded-xl group/skill">
                              <div className="relative group/icon">
                                <button className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-[#E5E5E5] hover:border-[#1A1A1A] transition-colors">
                                  {React.createElement(getIconComponent(skill.icon), { size: 14 })}
                                </button>
                                <div className="absolute top-full left-0 mt-2 bg-white border border-[#E5E5E5] rounded-xl shadow-xl p-2 hidden group-focus-within/icon:grid grid-cols-5 gap-1 z-50 w-[200px]">
                                  {ICON_OPTIONS.map((opt) => (
                                    <button 
                                      key={opt.name}
                                      onClick={() => updateSkill(cat.id, skill.id, 'icon', opt.name)}
                                      className={cn(
                                        "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F5F5F4] transition-colors",
                                        skill.icon === opt.name && "bg-[#1A1A1A] text-white"
                                      )}
                                    >
                                      <opt.icon size={14} />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <input 
                                value={skill.name}
                                onChange={e => updateSkill(cat.id, skill.id, 'name', e.target.value)}
                                placeholder="Skill"
                                className="bg-transparent border-none outline-none text-xs flex-1"
                              />
                              <button 
                                onClick={() => removeSkillFromCategory(cat.id, skill.id)}
                                className="text-[#E5E5E5] hover:text-red-500 transition-colors opacity-0 group-hover/skill:opacity-100"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => addSkillToCategory(cat.id)}
                            className="flex items-center justify-center gap-2 border-2 border-dashed border-[#E5E5E5] rounded-xl py-2 text-[10px] uppercase tracking-widest font-bold text-[#8E8E8E] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all"
                          >
                            <Plus size={12} /> Add Skill
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Custom Sections */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
                    <div className="flex items-center gap-4">
                      <Plus size={16} className="text-[#8E8E8E]" />
                      <h2 className="text-xs font-bold uppercase tracking-widest">Custom Sections</h2>
                    </div>
                    <button onClick={addCustomSection} className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 hover:text-[#8E8E8E] transition-colors">
                      <Plus size={12} /> Add Section
                    </button>
                  </div>
                  <div className="space-y-8">
                    {customSections.map((section) => (
                      <div key={section.id} className="relative group bg-white p-6 rounded-2xl border border-[#E5E5E5] hover:shadow-xl hover:shadow-black/5 transition-all">
                        <button 
                          onClick={() => removeCustomSection(section.id)}
                          className="absolute top-4 right-4 text-[#E5E5E5] hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <input 
                          value={section.title}
                          onChange={e => updateCustomSection(section.id, 'title', e.target.value)}
                          placeholder="Section Title (e.g. Certifications)"
                          className="w-full bg-transparent border-b border-[#E5E5E5] py-1 mb-4 focus:border-[#1A1A1A] outline-none text-sm font-bold"
                        />
                        <textarea 
                          value={section.content}
                          onChange={e => updateCustomSection(section.id, 'content', e.target.value)}
                          placeholder="Section content..."
                          className="w-full bg-[#F5F5F4] p-3 rounded-lg text-xs min-h-[100px] outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Certificates Section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-[#E5E5E5] pb-2">
                    <CheckCircle2 size={16} className="text-[#8E8E8E]" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Certifications</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border border-[#ddd] p-[15px] rounded-[5px] bg-[#f9f9f9] w-full md:w-[60%]">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Enter certificate name..."
                          className="flex-1 bg-white px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#1A1A1A] outline-none text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              addCertificate((e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                        <button 
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addCertificate(input.value);
                            input.value = '';
                          }}
                          className="bg-[#333] hover:bg-[#555] text-white px-[15px] py-[8px] border-none rounded-[4px] cursor-pointer transition-colors text-xs font-bold uppercase"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {certificates.map((cert, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E5E5E5] group">
                          <span className="text-xs text-gray-700">{cert}</span>
                          <button 
                            onClick={() => removeCertificate(idx)}
                            className="text-[#E5E5E5] hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <div className="pt-12 flex gap-4">
                  <button 
                    onClick={() => setActiveTab('preview')}
                    className="flex-1 py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    Preview Resume
                    <ChevronRight size={16} />
                  </button>
                  <button 
                    onClick={findJobMatches}
                    className="flex-1 py-4 border border-[#1A1A1A] text-[#1A1A1A] rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    Find Job Matches
                    <Search size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'preview' && (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                className="bg-white shadow-2xl rounded-sm mx-auto print:shadow-none print:m-0 overflow-hidden p-[25px]"
                style={{ 
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '12px',
                  lineHeight: '1.25',
                  color: '#333',
                  maxWidth: '900px',
                  minHeight: '297mm'
                }}
              >
                <header className="text-center mb-[15px]">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-bold mb-[2px] uppercase"
                  >
                    {name || "RAVU MOHAN DURGA PRASAD"}
                  </motion.h1>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-[12px] text-[#555]"
                  >
                    {phone || "+91 XXXXXXXXXX"} | {email || "your.email@gmail.com"} | 
                    LinkedIn: {linkedin || "linkedin.com/in/yourprofile"} | 
                    GitHub: {github || "github.com/yourusername"}
                  </motion.div>
                </header>

                <div className="space-y-[12px]">
                  {/* Profile Section */}
                  {summary && (
                    <section>
                      <h2 className="text-[14px] font-bold border-b-2 border-[#ddd] pb-[2px] mb-[4px] uppercase tracking-tight">PROFILE</h2>
                      <p className="leading-relaxed text-[#333]">{summary}</p>
                    </section>
                  )}

                  {/* Experience Section */}
                  {experience.length > 0 && (
                    <section>
                      <h2 className="text-[14px] font-bold border-b-2 border-[#ddd] pb-[2px] mb-[4px] uppercase tracking-tight">EXPERIENCE</h2>
                      <div className="space-y-[10px]">
                        {experience.map((exp) => (
                          <div key={exp.id}>
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-[13px]">{exp.role}</span>
                              <span className="text-[11px] text-[#555]">{exp.duration}</span>
                            </div>
                            <div className="text-[12px] italic text-[#555] mb-[2px]">{exp.company}</div>
                            <ul className="list-disc ml-[20px] space-y-[1px]">
                              {exp.description.split('. ').filter(b => b.trim().length > 0).map((bullet, idx) => (
                                <li key={idx} className="text-[#333]">{bullet}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Projects Section */}
                  {projects.length > 0 && (
                    <section>
                      <h2 className="text-[14px] font-bold border-b-2 border-[#ddd] pb-[2px] mb-[4px] uppercase tracking-tight">PROJECTS</h2>
                      <div className="space-y-[8px]">
                        {projects.map((proj) => (
                          <div key={proj.id}>
                            <h3 className="text-[13px] font-bold mb-[2px]">{proj.title}</h3>
                            <ul className="list-disc ml-[20px] space-y-[1px]">
                              {proj.description.split('. ').filter(b => b.trim().length > 0).map((bullet, idx) => (
                                <li key={idx} className="text-[#333]">{bullet}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Certificates Section */}
                  {certificates.length > 0 && (
                    <section>
                      <h2 className="text-[14px] font-bold border-b-2 border-[#ddd] pb-[2px] mb-[4px] uppercase tracking-tight">CERTIFICATIONS</h2>
                      <ul className="list-disc ml-[20px] space-y-[1px]">
                        {certificates.map((cert, idx) => (
                          <li key={idx} className="text-[#333] text-[12px]">{cert}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                  <section>
                    <h2 className="text-[14px] font-bold border-b-2 border-[#ddd] pb-[2px] mb-[4px] uppercase tracking-tight">SKILLS</h2>
                    <div className="grid grid-cols-2 gap-[4px]">
                      {skillCategories.map((cat) => (
                        <div key={cat.id}>
                          <strong>{cat.name}:</strong> {cat.skills.map(s => s.name).join(", ")}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Education Section */}
                  <section>
                    <h2 className="text-[14px] font-bold border-b-2 border-[#ddd] pb-[2px] mb-[4px] uppercase tracking-tight">EDUCATION</h2>
                    <div className="space-y-[4px]">
                      {education.map((edu) => (
                        <div key={edu.id} className="flex justify-between items-start">
                          <div>
                            <strong>{edu.degree}</strong><br />
                            {edu.school}
                          </div>
                          <div className="text-right">{edu.year}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Achievements Section */}
                  {achievements && (
                    <section>
                      <h2 className="text-[14px] font-bold border-b-2 border-[#ddd] pb-[2px] mb-[4px] uppercase tracking-tight">ACHIEVEMENTS</h2>
                      <ul className="list-disc ml-[20px] space-y-[1px]">
                        {achievements.split('. ').filter(b => b.trim().length > 0).map((bullet, idx) => (
                          <li key={idx} className="text-[#333]">{bullet}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Custom Sections */}
                  {customSections.map((section) => (
                    <section key={section.id}>
                      <h2 className="text-[14px] font-bold border-b-2 border-[#ddd] pb-[2px] mb-[4px] uppercase tracking-tight">{section.title || "CUSTOM SECTION"}</h2>
                      <div className="whitespace-pre-wrap text-[#333]">
                        {section.content}
                      </div>
                    </section>
                  ))}
                </div>

                <button 
                  onClick={() => setActiveTab('edit')}
                  className="fixed bottom-8 right-8 w-14 h-14 bg-[#333] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all z-50 print:hidden"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </motion.div>
            )}

            {activeTab === 'jobs' && (
              <motion.div 
                key="jobs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <header>
                  <h1 className="text-5xl font-serif font-light tracking-tight mb-2">Job Matcher</h1>
                  <p className="text-[#8E8E8E] font-mono text-xs uppercase tracking-[0.3em]">AI-powered career opportunities</p>
                </header>

                {isMatching ? (
                  <div className="h-[400px] flex flex-col items-center justify-center gap-6">
                    <div className="relative">
                      <Loader2 className="w-16 h-16 animate-spin text-[#1A1A1A] opacity-20" />
                      <Search className="absolute inset-0 m-auto w-6 h-6 text-[#1A1A1A]" />
                    </div>
                    <p className="text-xs font-mono uppercase tracking-widest opacity-50 animate-pulse">Scanning global job markets...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {jobMatches.length > 0 ? (
                      jobMatches.map((job, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl border border-[#E5E5E5] hover:border-[#1A1A1A] transition-all group">
                          <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-[#F5F5F4] rounded-2xl flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                              <Briefcase size={20} />
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-mono uppercase tracking-widest opacity-40">Match Score</p>
                              <p className="text-2xl font-serif font-bold text-green-600">{job.matchScore}%</p>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                          <p className="text-sm font-serif italic text-[#8E8E8E] mb-6">{job.company}</p>
                          <div className="p-4 bg-[#F5F5F4] rounded-xl">
                            <p className="text-xs leading-relaxed text-[#4A4A4A] italic">"{job.reason}"</p>
                          </div>
                          <button className="w-full mt-6 py-3 bg-zinc-100 text-zinc-900 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors">
                            View Details
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="md:col-span-3 py-20 text-center border-2 border-dashed border-[#E5E5E5] rounded-3xl">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-10" />
                        <h3 className="text-lg font-serif italic mb-2">No matches yet</h3>
                        <p className="text-xs text-[#8E8E8E] mb-6">Click the button below to analyze your resume and find matches.</p>
                        <button 
                          onClick={findJobMatches}
                          className="px-8 py-3 bg-[#1A1A1A] text-white rounded-full text-[10px] font-bold uppercase tracking-widest"
                        >
                          Find Matches
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {jobMatches.length > 0 && (
                  <div className="bg-[#1A1A1A] text-white p-12 rounded-[40px] flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-4">
                      <h2 className="text-4xl font-serif font-light leading-tight">Ready to take the next step?</h2>
                      <p className="text-sm text-white/60 leading-relaxed max-w-md">Our AI has identified these roles as the best fit for your current skill set and experience level. You can export your resume now to start applying.</p>
                    </div>
                    <button 
                      onClick={exportToPDF}
                      className="px-12 py-5 bg-white text-[#1A1A1A] rounded-full font-bold uppercase text-xs tracking-widest hover:scale-105 transition-all flex items-center gap-3"
                    >
                      <Download size={18} />
                      Download Resume
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Background Accents */}
      <div className="fixed top-0 right-0 w-[60vw] h-[60vh] bg-gradient-to-bl from-[#E5E5E5]/30 to-transparent pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[40vw] h-[40vh] bg-gradient-to-tr from-[#E5E5E5]/20 to-transparent pointer-events-none -z-10" />
    </div>
  );
}
