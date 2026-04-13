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
  AlertCircle,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
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
  Search as SearchIcon,
  Sun,
  Moon
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
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

function isValidText(text: string) {
  // Reject too short or random strings
  if (!text || text.trim().length < 3) return false;

  // Reject strings with no vowels (common in gibberish)
  if (!/[aeiouAEIOU]/.test(text)) return false;

  // Reject too many random characters
  if (/^[^a-zA-Z\s]+$/.test(text)) return false;

  return true;
}

function isGibberish(text: string) {
  const words = text.split(" ");
  let validWords = words.filter(word => word.length > 2);
  return validWords.length < 2;
}

export default function App() {
  // --- State ---
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
    role: ''
  });
  const [skillCategories, setSkillCategories] = React.useState<SkillCategory[]>([]);
  const [education, setEducation] = React.useState<Education[]>([]);
  const [experience, setExperience] = React.useState<Experience[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [achievements, setAchievements] = React.useState<string>('');
  const [academicDetails, setAcademicDetails] = React.useState('');
  const [customSections, setCustomSections] = React.useState<CustomSection[]>([]);
  const [certificates, setCertificates] = React.useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = React.useState<string | null>(null);
  
  const [jobMatches, setJobMatches] = React.useState<JobMatch[]>([]);
  const [isMatching, setIsMatching] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'edit' | 'preview' | 'jobs'>('edit');
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [previewData, setPreviewData] = React.useState<any>(null);

  // --- ATS Analyzer State ---
  const [atsScoreResult, setAtsScoreResult] = React.useState<number | null>(null);
  const [atsFoundSkills, setAtsFoundSkills] = React.useState<string[]>([]);
  const [atsSuggestions, setAtsSuggestions] = React.useState<string[]>([]);

  // --- AI Resume Generator State ---
  const [aiName, setAiName] = React.useState('');
  const [aiRole, setAiRole] = React.useState('');
  const [aiSkills, setAiSkills] = React.useState('');
  const [aiEmail, setAiEmail] = React.useState('');
  const [aiPhone, setAiPhone] = React.useState('');
  const [aiLinkedin, setAiLinkedin] = React.useState('');
  const [aiGithub, setAiGithub] = React.useState('');
  const [aiPortfolio, setAiPortfolio] = React.useState('');
  const [aiAdditionalInfo, setAiAdditionalInfo] = React.useState('');
  const [aiExperience, setAiExperience] = React.useState('');
  const [aiSummary, setAiSummary] = React.useState('');
  const [aiProjects, setAiProjects] = React.useState('');
  const [aiEducation, setAiEducation] = React.useState('');
  const [aiAchievements, setAiAchievements] = React.useState('');
  const [isGeneratingAI, setIsGeneratingAI] = React.useState(false);
  const [generatedAIResume, setGeneratedAIResume] = React.useState<string | null>(null);

  // --- Manual Matcher State ---
  const [manualJobDescription, setManualJobDescription] = React.useState('');
  const [manualMatchScore, setManualMatchScore] = React.useState<number | null>(null);

  // --- Template Selection State ---
  const [selectedTemplate, setSelectedTemplate] = React.useState('template1');

  // --- Suggested Jobs State ---
  const [suggestedJobs, setSuggestedJobs] = React.useState<string[]>([]);

  const [isResumeInvalid, setIsResumeInvalid] = React.useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = React.useState(false);
  const [aiErrors, setAiErrors] = React.useState({ name: '', role: '', skills: '' });

  const isValidResume = formData.fullName.trim().length > 0 && formData.role.trim().length > 0;

  // --- Effects ---
  const clearAllData = React.useCallback(() => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      portfolio: '',
      summary: '',
      role: ''
    });
    setSkillCategories([]);
    setEducation([]);
    setExperience([]);
    setProjects([]);
    setAchievements('');
    setAcademicDetails('');
    setCustomSections([]);
    setCertificates([]);
    setProfilePhoto(null);
    setAtsScoreResult(null);
    setAtsFoundSkills([]);
    setAtsSuggestions([]);
    setJobMatches([]);
    setPreviewData(null);
    setManualJobDescription('');
    setManualMatchScore(null);
    setAiName('');
    setAiRole('');
    setAiSkills('');
    setAiExperience('');
    setAiSummary('');
    setAiProjects('');
    setAiEducation('');
    setAiAchievements('');
    setGeneratedAIResume(null);
    sessionStorage.removeItem("resumeSessionData");
    localStorage.removeItem("resumeData");
  }, []);

  React.useEffect(() => {
    // Clear data on initial load (window.onload equivalent)
    clearAllData();
    
    // Clear data before unload (window.onbeforeunload equivalent)
    const handleBeforeUnload = () => {
      clearAllData();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [clearAllData]);

  // --- Suggested Jobs Logic ---
  React.useEffect(() => {
    const allSkills = skillCategories.flatMap(cat => cat.skills.map(s => s.name.toLowerCase())).join(' ');
    const jobs: string[] = [];
    
    if (allSkills.includes("html") || allSkills.includes("css")) {
      jobs.push("Frontend Developer");
    }
    if (allSkills.includes("javascript") || allSkills.includes("js")) {
      jobs.push("Web Developer");
    }
    if (allSkills.includes("python")) {
      jobs.push("Python Developer");
    }
    if (allSkills.includes("excel") || allSkills.includes("data")) {
      jobs.push("Data Analyst");
    }
    if (allSkills.includes("communication") || allSkills.includes("support")) {
      jobs.push("Customer Support");
    }
    
    setSuggestedJobs([...new Set(jobs)]);
  }, [skillCategories]);

  // --- Handlers ---
  const handleGenerate = () => {
    setPreviewData(formData);
    setActiveTab('preview');
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    const skillsContext = skillCategories.map(cat => `${cat.name}: ${cat.skills.map(s => s.name).join(', ')}`).join('; ');
    const resumeText = `
      ${formData.fullName} ${formData.summary}
      ${skillsContext}
      ${education.map(e => `${e.degree} ${e.school}`).join(' ')}
      ${experience.map(e => `${e.role} ${e.company} ${e.description}`).join(' ')}
      ${projects.map(p => `${p.title} ${p.description}`).join(' ')}
    `;

    if (!isResumeRelated(resumeText)) {
      setIsResumeInvalid(true);
      setJobMatches([]);
      setActiveTab('jobs');
      return;
    }

    setIsResumeInvalid(false);
    if (skillCategories.length === 0 && !experience[0]?.role) {
      alert("Please add some skills or experience first to get relevant matches.");
      return;
    }

    setIsMatching(true);
    setActiveTab('jobs');
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      
      const resumeContext = `
        Name: ${formData.fullName}
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

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      const matchResult = JSON.parse(responseText || '{}');
      setJobMatches(matchResult.matches || []);
    } catch (err) {
      console.error("AI Matching Error:", err);
      alert("Failed to generate job suggestions. Please check your connection.");
    } finally {
      setIsMatching(false);
    }
  };

  // --- PDF Export (Traditional Layout) ---
  const downloadAIResume = async () => {
    const resume = document.getElementById("aiResumePreview");
    if (!resume) return;

    try {
      const canvas = await html2canvas(resume, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      const fileName = `AI_Generated_${aiName.replace(/\s+/g, '_') || 'Resume'}.pdf`;
      pdf.save(fileName);
      
      alert("AI Resume PDF has been generated!");
    } catch (error) {
      console.error("Error generating AI PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const exportToPDF = async () => {
    const resume = document.getElementById("resumePreview");
    const buttons = document.getElementById("actionButtons");
    if (!resume) return;

    try {
      // Hide buttons during capture
      if (buttons) buttons.style.display = "none";

      const canvas = await html2canvas(resume, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      const fileName = `${(previewData || formData).fullName.replace(/\s+/g, '_') || 'Resume'}.pdf`;
      pdf.save(fileName);
      
      // Show buttons again
      if (buttons) buttons.style.display = "flex";
      
      alert("Success! Your resume PDF has been generated via high-quality capture.");
    } catch (error) {
      // Ensure buttons are shown even if capture fails
      if (buttons) buttons.style.display = "flex";
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const downloadSimplePDF = () => {
    const doc = new jsPDF();
    
    const name = formData.fullName || "Your Name";
    const role = formData.role || "Job Role";
    const skills = skillCategories.flatMap(cat => cat.skills.map(s => s.name)).join(", ") || "No skills added";
    const experienceText = experience.map(exp => `${exp.role} at ${exp.company}`).join("\n") || "No experience added";

    doc.setFontSize(18);
    doc.text(name, 10, 10);

    doc.setFontSize(14);
    doc.text(role, 10, 20);

    doc.setFontSize(12);
    doc.text("Skills:", 10, 35);
    doc.setFontSize(10);
    const splitSkills = doc.splitTextToSize(skills, 180);
    doc.text(splitSkills, 10, 45);

    doc.setFontSize(12);
    doc.text("Experience:", 10, 70);
    doc.setFontSize(10);
    const splitExp = doc.splitTextToSize(experienceText, 180);
    doc.text(splitExp, 10, 80);

    doc.save("Resume_Simple.pdf");
  };

  const isResumeRelated = (text: string) => {
    const lower = text.toLowerCase();
    const keywords = [
      'experience', 'education', 'skills', 'projects', 'summary', 'achievements', 
      'university', 'college', 'school', 'work', 'job', 'role', 'company', 
      'contact', 'email', 'phone', 'linkedin', 'github', 'objective', 'profile'
    ];
    
    // Check for at least 3 keywords or a minimum word count of 15
    const words = lower.split(/\W+/).filter(w => w.length > 1);
    const foundKeywords = keywords.filter(k => lower.includes(k));
    
    return words.length >= 15 || foundKeywords.length >= 3;
  };

  const analyzeATSFromBuilder = () => {
    const skillsText = skillCategories.map(cat => cat.skills.map(s => s.name).join(' ')).join(' ').toLowerCase();
    const experienceText = experience.map(exp => `${exp.role} ${exp.company} ${exp.description}`).join(' ').toLowerCase();
    const educationText = education.map(edu => `${edu.degree} ${edu.institution}`).join(' ').toLowerCase();
    const projectsText = projects.map(proj => `${proj.title} ${proj.description}`).join(' ').toLowerCase();

    const resume = skillsText + experienceText + educationText + projectsText;

    // Skills Database
    const skillList = [
      "html", "css", "javascript", "react", "node",
      "python", "java", "sql", "excel", "communication",
      "teamwork", "leadership", "management",
      "data entry", "customer service"
    ];

    const foundSkills: string[] = [];
    skillList.forEach(skill => {
      if (resume.includes(skill)) {
        foundSkills.push(skill);
      }
    });
    setAtsFoundSkills(foundSkills);

    // ATS Score
    let atsScore = 0;
    atsScore += foundSkills.length * 8;
    if (experienceText.length > 50) atsScore += 20;
    if (educationText.length > 20) atsScore += 10;
    if (projectsText.length > 30) atsScore += 15;
    if (atsScore > 100) atsScore = 100;
    setAtsScoreResult(atsScore);

    // AI Suggestions
    const suggestions: string[] = [];
    if (foundSkills.length < 5) suggestions.push("Add more technical skills");
    if (projectsText.length < 20) suggestions.push("Add projects section");
    if (experienceText.length < 20) suggestions.push("Add experience");
    setAtsSuggestions(suggestions);
  };

  const generateAIResume = async () => {
    setAiErrors({ name: '', role: '', skills: '' });
    
    let hasError = false;
    const newErrors = { name: '', role: '', skills: '' };

    if (!isValidText(aiName) || isGibberish(aiName)) {
      newErrors.name = "Enter a valid name";
      hasError = true;
    }
    if (!isValidText(aiRole) || isGibberish(aiRole)) {
      newErrors.role = "Enter a meaningful job role";
      hasError = true;
    }
    if (!isValidText(aiSkills) || isGibberish(aiSkills)) {
      newErrors.skills = "Enter valid technologies/skills";
      hasError = true;
    }

    if (hasError) {
      setAiErrors(newErrors);
      return;
    }

    setIsGeneratingAI(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "You are a professional resume writer and career coach.",
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              summary: { type: SchemaType.STRING },
              experience: { type: SchemaType.STRING },
              projects: { type: SchemaType.STRING },
              education: { type: SchemaType.STRING },
              achievements: { type: SchemaType.STRING }
            },
            required: ["summary", "experience", "projects", "education", "achievements"]
          }
        }
      });

      const prompt = `
        Act as a senior resume writer with 10+ years of experience.
        Your task is to generate a clean, ATS-friendly, professional resume based on user input.

        Rules:
        - Keep formatting clean and structured
        - Use bullet points for experience
        - Expand skills into meaningful descriptions when helpful
        - Use strong action verbs
        - Keep it concise but impactful
        - Tailor the resume to the given job role
        - Do NOT include fake information
        - If information is missing, intelligently infer but stay realistic
        - Optimize for ATS systems, recruiter readability, impact, and clarity
        - Quantify achievements where possible
        - Make the candidate appear competitive but realistic

        Generate a resume with the following details:
        Name: ${aiName}
        Job Role: ${aiRole}
        Skills: ${aiSkills}
        Email: ${aiEmail}
        Phone: ${aiPhone}
        LinkedIn: ${aiLinkedin}
        GitHub: ${aiGithub}
        Portfolio: ${aiPortfolio}
        Additional Info: ${aiAdditionalInfo}

        Please provide the content for the following sections:
        1. Professional Summary (2-3 lines tailored to the role)
        2. Experience (Job-based bullet points generated from skills if no experience is provided)
        3. Projects (short impactful descriptions)
        4. Education (omit or keep minimal if not provided)
        5. Achievements (at least 2-3 professional bullet points)

        Format the experience, projects, and achievements as bullet points starting with "• ".
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      const data = JSON.parse(responseText || "{}");
      const { summary, experience, projects, education, achievements } = data;

      const resumeHtml = `
        <div class="space-y-4">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-2xl font-bold uppercase tracking-tight">${aiName}</h2>
              <h3 class="text-xl text-[#007BFF] font-medium">${aiRole}</h3>
            </div>
            <div class="text-[10px] text-right space-y-1 text-[#8E8E8E] font-mono uppercase tracking-widest">
              ${aiEmail ? `<div>${aiEmail}</div>` : ''}
              ${aiPhone ? `<div>${aiPhone}</div>` : ''}
              ${aiLinkedin ? `<div>LinkedIn</div>` : ''}
              ${aiGithub ? `<div>GitHub</div>` : ''}
              ${aiPortfolio ? `<div>Portfolio</div>` : ''}
            </div>
          </div>
          <hr class="border-[#E5E5E5]">
          
          <div class="space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-widest text-[#8E8E8E]">Professional Summary</h3>
            <p class="text-sm leading-relaxed text-[#333]">${summary}</p>
          </div>
          
          <div class="space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-widest text-[#8E8E8E]">Skills</h3>
            <p class="text-sm text-[#333]">${aiSkills}</p>
          </div>
          
          <div class="space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-widest text-[#8E8E8E]">Experience</h3>
            <div class="text-sm leading-relaxed text-[#333] whitespace-pre-line">${experience}</div>
          </div>

          <div class="space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-widest text-[#8E8E8E]">Projects</h3>
            <div class="text-sm leading-relaxed text-[#333] whitespace-pre-line">${projects}</div>
          </div>
          
          <div class="space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-widest text-[#8E8E8E]">Education</h3>
            <p class="text-sm text-[#333]">${education}</p>
          </div>

          <div class="space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-widest text-[#8E8E8E]">Achievements</h3>
            <div class="text-sm leading-relaxed text-[#333] whitespace-pre-line">${achievements}</div>
          </div>
        </div>
      `;
      setGeneratedAIResume(resumeHtml);
      // Update hidden states
      setAiExperience(experience);
      setAiSummary(summary);
      setAiProjects(projects);
      setAiEducation(education);
      setAiAchievements(achievements);
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Failed to generate AI resume. Please check your connection and try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const matchJobsManual = () => {
    let resumeText = "";
    
    if (generatedAIResume) {
      // Create a temporary div to extract text from the generated HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = generatedAIResume;
      resumeText = tempDiv.innerText.toLowerCase();
    } else {
      const skillsText = skillCategories.map(cat => cat.skills.map(s => s.name).join(' ')).join(' ').toLowerCase();
      const experienceText = experience.map(exp => `${exp.role} ${exp.company} ${exp.description}`).join(' ').toLowerCase();
      const projectsText = projects.map(proj => `${proj.title} ${proj.description}`).join(' ').toLowerCase();
      resumeText = skillsText + experienceText + projectsText;
    }

    const job = manualJobDescription.toLowerCase();

    if (!job) {
      alert("Please paste a job description first.");
      return;
    }

    const resumeWords = resumeText.split(/\W+/).filter(w => w.length > 1);
    const jobWords = job.split(/\W+/).filter(w => w.length > 1);

    if (jobWords.length === 0) {
      setManualMatchScore(0);
      return;
    }

    let matchCount = 0;
    const uniqueJobWords = Array.from(new Set(jobWords));
    uniqueJobWords.forEach((word: string) => {
      if (resumeText.includes(word)) {
        matchCount++;
      }
    });

    const score = Math.round((matchCount / uniqueJobWords.length) * 100);
    setManualMatchScore(score);
  };


  return (
    <div className={cn(
      "min-h-screen text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white transition-colors",
      isDarkMode && "dark text-white selection:bg-white selection:text-black"
    )}>
      {/* Confirmation Modal for Clear All */}
      <AnimatePresence>
        {isClearModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsClearModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[40px] p-10 shadow-2xl overflow-hidden transition-colors"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                  <AlertCircle size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-medium dark:text-white">Clear all data?</h3>
                  <p className="text-[#8E8E8E] dark:text-zinc-500 text-sm leading-relaxed">
                    This will permanently delete all your resume progress. This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-4 w-full pt-4">
                  <button
                    onClick={() => setIsClearModalOpen(false)}
                    className="flex-1 py-4 bg-[#F5F5F4] dark:bg-zinc-800 text-[#1A1A1A] dark:text-white rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-[#E5E5E5] dark:hover:bg-zinc-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      clearAllData();
                      setIsClearModalOpen(false);
                    }}
                    className="flex-1 py-4 bg-red-500 text-white rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                  >
                    Yes, Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation Rail */}
      <nav className="fixed left-0 top-0 h-full w-20 bg-white dark:bg-zinc-900 border-r border-[#E5E5E5] dark:border-zinc-800 flex flex-col items-center py-8 gap-8 z-50 transition-colors">
        <div className="w-10 h-10 bg-[#1A1A1A] dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black transition-colors">
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
                activeTab === tab.id 
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" 
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500"
              )}
            >
              <tab.icon size={20} />
              <span className="absolute left-full ml-4 px-2 py-1 bg-[#1A1A1A] dark:bg-white text-white dark:text-black text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest">
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {isValidResume && (
            <button 
              onClick={exportToPDF}
              className="p-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
            >
              <Download size={20} />
            </button>
          )}
        </div>
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
              >
                <form autoComplete="off" onSubmit={(e) => e.preventDefault()} className="space-y-12">
                  {/* Hidden Inputs to stop Chrome Autofill */}
                  <input type="text" style={{ display: 'none' }} />
                  <input type="password" style={{ display: 'none' }} />
                  
                  <header className="flex justify-between items-start">
                    <div>
                      <h1 className="text-5xl font-serif font-light tracking-tight mb-2 dark:text-white">Resume Builder</h1>
                      <p className="text-[#8E8E8E] dark:text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">Craft your professional narrative</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsClearModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest border border-red-100 dark:border-red-500/20"
                    >
                      <Trash2 size={14} />
                      Clear All
                    </button>
                  </header>

                {/* AI Resume Generator Section */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-[#E5E5E5] dark:border-zinc-800 pb-2">
                    <Zap size={16} className="text-[#8E8E8E] dark:text-zinc-500" />
                    <h2 className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">AI Resume Generator</h2>
                  </div>
                  
                  <div className="card p-8 border border-[#E5E5E5] dark:border-zinc-800 space-y-8 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Your Name</label>
                        <input 
                          value={aiName}
                          onChange={(e) => setAiName(e.target.value)}
                          placeholder="Full Name"
                          className={cn(
                            "w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 outline-none transition-all text-sm dark:text-white",
                            aiErrors.name ? "border-red-500" : "border-transparent focus:border-[#007BFF]"
                          )}
                        />
                        {aiErrors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{aiErrors.name}</p>}
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Job Role</label>
                        <input 
                          value={aiRole}
                          onChange={(e) => setAiRole(e.target.value)}
                          placeholder="Example: Frontend Developer"
                          className={cn(
                            "w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 outline-none transition-all text-sm dark:text-white",
                            aiErrors.role ? "border-red-500" : "border-transparent focus:border-[#007BFF]"
                          )}
                        />
                        {aiErrors.role && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{aiErrors.role}</p>}
                      </div>
                      <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Skills</label>
                        <textarea 
                          value={aiSkills}
                          onChange={(e) => setAiSkills(e.target.value)}
                          placeholder="HTML, CSS, JS, React..."
                          className={cn(
                            "w-full h-24 bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 outline-none transition-all text-sm resize-none dark:text-white",
                            aiErrors.skills ? "border-red-500" : "border-transparent focus:border-[#007BFF]"
                          )}
                        />
                        {aiErrors.skills && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{aiErrors.skills}</p>}
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Email</label>
                        <input 
                          value={aiEmail}
                          onChange={(e) => setAiEmail(e.target.value)}
                          placeholder="Email Address"
                          className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 border-transparent focus:border-[#007BFF] outline-none transition-all text-sm dark:text-white"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Phone</label>
                        <input 
                          value={aiPhone}
                          onChange={(e) => setAiPhone(e.target.value)}
                          placeholder="Phone Number"
                          className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 border-transparent focus:border-[#007BFF] outline-none transition-all text-sm dark:text-white"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">LinkedIn</label>
                        <input 
                          value={aiLinkedin}
                          onChange={(e) => setAiLinkedin(e.target.value)}
                          placeholder="LinkedIn URL"
                          className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 border-transparent focus:border-[#007BFF] outline-none transition-all text-sm dark:text-white"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">GitHub</label>
                        <input 
                          value={aiGithub}
                          onChange={(e) => setAiGithub(e.target.value)}
                          placeholder="GitHub URL"
                          className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 border-transparent focus:border-[#007BFF] outline-none transition-all text-sm dark:text-white"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Portfolio</label>
                        <input 
                          value={aiPortfolio}
                          onChange={(e) => setAiPortfolio(e.target.value)}
                          placeholder="Portfolio URL"
                          className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 border-transparent focus:border-[#007BFF] outline-none transition-all text-sm dark:text-white"
                        />
                      </div>
                      <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Additional Info / Experience Notes</label>
                        <textarea 
                          value={aiAdditionalInfo}
                          onChange={(e) => setAiAdditionalInfo(e.target.value)}
                          placeholder="Any specific experience or notes you want to include..."
                          className="w-full h-32 bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 border-transparent focus:border-[#007BFF] outline-none transition-all text-sm resize-none dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        type="button"
                        onClick={generateAIResume}
                        disabled={isGeneratingAI}
                        className="w-full md:w-auto px-12 py-4 bg-[#1A1A1A] text-white rounded-full font-bold uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {isGeneratingAI ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Loading your professional profile...
                          </>
                        ) : (
                          <>
                            <Zap size={16} />
                            Generate AI Resume
                          </>
                        )}
                      </button>
                    </div>

                    {generatedAIResume && (
                      <div className="mt-8 p-8 bg-[#F5F5F4] rounded-[32px] border border-[#E5E5E5] animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-[10px] font-mono uppercase tracking-widest opacity-40 mb-6">Generated Resume Preview</h3>
                        <div 
                          id="aiResumePreview"
                          className="prose prose-sm max-w-none card p-8"
                          dangerouslySetInnerHTML={{ __html: generatedAIResume }}
                        />
                        <div className="mt-8 flex flex-wrap gap-4">
                          <button 
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                fullName: aiName,
                                role: aiRole,
                                email: aiEmail || formData.email,
                                phone: aiPhone || formData.phone,
                                linkedin: aiLinkedin || formData.linkedin,
                                github: aiGithub || formData.github,
                                portfolio: aiPortfolio || formData.portfolio,
                                summary: aiSummary || `Motivated ${aiRole} skilled in ${aiSkills}. Passionate about delivering high-quality solutions.`
                              });
                              
                              // Add the skills to a new category
                              if (aiSkills) {
                                const newCat: SkillCategory = {
                                  id: crypto.randomUUID(),
                                  name: 'AI Generated Skills',
                                  skills: aiSkills.split(',').map(s => ({
                                    id: crypto.randomUUID(),
                                    name: s.trim(),
                                    icon: 'Code'
                                  }))
                                };
                                setSkillCategories([newCat, ...skillCategories]);
                              }

                              // Add experience
                              if (aiExperience) {
                                const newExp: Experience = {
                                  id: crypto.randomUUID(),
                                  role: aiRole,
                                  company: 'Experience from AI Generator',
                                  duration: 'Present',
                                  description: aiExperience
                                };
                                setExperience([newExp, ...experience]);
                              }

                              // Add projects
                              if (aiProjects) {
                                const newProj: Project = {
                                  id: crypto.randomUUID(),
                                  title: 'Project from AI Generator',
                                  description: aiProjects
                                };
                                setProjects([newProj, ...projects]);
                              }

                              // Add education
                              if (aiEducation) {
                                const newEdu: Education = {
                                  id: crypto.randomUUID(),
                                  school: 'University from AI Generator',
                                  degree: aiEducation,
                                  year: '2024',
                                  description: 'Completed with honors'
                                };
                                setEducation([newEdu, ...education]);
                              }

                              // Add achievements
                              if (aiAchievements) {
                                setAchievements(prev => prev ? prev + "\n" + aiAchievements : aiAchievements);
                              }

                              alert("Main builder fields have been populated with your AI-generated content!");
                            }}
                            className="px-6 py-3 bg-white border border-[#1A1A1A] text-[#1A1A1A] rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all"
                          >
                            Use this Resume
                          </button>
                          <button 
                            type="button"
                            onClick={downloadAIResume}
                            className="px-6 py-3 bg-[#1A1A1A] text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                          >
                            <Download size={14} />
                            Download Resume
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Personal Details */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-[#E5E5E5] dark:border-zinc-800 pb-2">
                    <User size={16} className="text-[#8E8E8E] dark:text-zinc-500" />
                    <h2 className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">Personal Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Full Name</label>
                        <input 
                          name="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Jane Doe"
                          autoComplete="off"
                          className="w-full bg-transparent border-b-2 border-[#ccc] dark:border-zinc-700 py-2 focus:border-[#007BFF] outline-none transition-colors text-lg dark:text-white"
                        />
                      </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Job Role</label>
                      <input 
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        placeholder="Frontend Developer"
                        autoComplete="off"
                        className="w-full bg-transparent border-b-2 border-[#ccc] dark:border-zinc-700 py-2 focus:border-[#007BFF] outline-none transition-colors text-lg dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Email Address</label>
                      <input 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="jane@example.com"
                        autoComplete="off"
                        className="w-full bg-transparent border-b-2 border-[#ccc] dark:border-zinc-700 py-2 focus:border-[#007BFF] outline-none transition-colors text-lg dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Phone Number</label>
                      <input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 234 567 890"
                        autoComplete="off"
                        className="w-full bg-transparent border-b-2 border-[#ccc] dark:border-zinc-700 py-2 focus:border-[#007BFF] outline-none transition-colors text-lg dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">LinkedIn URL</label>
                      <input 
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        placeholder="linkedin.com/in/janedoe"
                        autoComplete="off"
                        className="w-full bg-transparent border-b-2 border-[#ccc] dark:border-zinc-700 py-2 focus:border-[#007BFF] outline-none transition-colors text-lg dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">GitHub URL</label>
                      <input 
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        placeholder="github.com/janedoe"
                        autoComplete="off"
                        className="w-full bg-transparent border-b-2 border-[#ccc] dark:border-zinc-700 py-2 focus:border-[#007BFF] outline-none transition-colors text-lg dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Portfolio URL</label>
                      <input 
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleInputChange}
                        placeholder="portfolio.com"
                        autoComplete="off"
                        className="w-full bg-transparent border-b-2 border-[#ccc] dark:border-zinc-700 py-2 focus:border-[#007BFF] outline-none transition-colors text-lg dark:text-white"
                      />
                    </div>
                  </div>
                </section>

                {/* Profile Photo */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-[#E5E5E5] dark:border-zinc-800 pb-2">
                    <User size={16} className="text-[#8E8E8E] dark:text-zinc-500" />
                    <h2 className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">Profile Photo</h2>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-full bg-[#F5F5F4] dark:bg-zinc-800 border-2 border-dashed border-[#E5E5E5] dark:border-zinc-700 flex items-center justify-center overflow-hidden transition-colors">
                      {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="text-[#E5E5E5] dark:text-zinc-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 80 * 1024 * 1024) {
                              alert("File size exceeds 80MB limit.");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (ev) => setProfilePhoto(ev.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="text-xs text-[#8E8E8E] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#1A1A1A] file:text-white hover:file:bg-[#333] transition-all"
                      />
                      <p className="text-[10px] text-[#8E8E8E] mt-2 font-mono uppercase tracking-widest">Recommended: Square image, max 80MB</p>
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
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
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
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-zinc-800 pb-2">
                    <div className="flex items-center gap-4">
                      <Briefcase size={16} className="text-[#8E8E8E] dark:text-zinc-500" />
                      <h2 className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">Experience</h2>
                    </div>
                    <button onClick={addExperience} className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 hover:text-[#8E8E8E] dark:hover:text-zinc-400 transition-colors dark:text-zinc-500">
                      <Plus size={12} /> Add
                    </button>
                  </div>
                  <div className="space-y-8">
                    {experience.map((exp) => (
                      <div key={exp.id} className="relative group card p-6 border border-[#E5E5E5] dark:border-zinc-800 hover:shadow-xl hover:shadow-black/5 transition-all">
                        <button 
                          onClick={() => removeExperience(exp.id)}
                          className="absolute top-4 right-4 text-[#E5E5E5] dark:text-zinc-700 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                          <input 
                            value={exp.company}
                            onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                            placeholder="Company Name"
                            autoComplete="off"
                            className="bg-transparent border-b-2 border-[#ccc] dark:border-zinc-700 py-1 focus:border-[#007BFF] outline-none text-sm font-bold dark:text-white"
                          />
                          <input 
                            value={exp.role}
                            onChange={e => updateExperience(exp.id, 'role', e.target.value)}
                            placeholder="Job Title"
                            autoComplete="off"
                            className="bg-transparent border-b-2 border-[#ccc] dark:border-zinc-700 py-1 focus:border-[#007BFF] outline-none text-sm dark:text-white"
                          />
                          <input 
                            value={exp.duration}
                            onChange={e => updateExperience(exp.id, 'duration', e.target.value)}
                            placeholder="Duration (e.g. 2020 - Present)"
                            autoComplete="off"
                            className="bg-transparent border-b-2 border-[#ccc] dark:border-zinc-700 py-1 focus:border-[#007BFF] outline-none text-xs font-mono dark:text-zinc-400"
                          />
                        </div>
                        <textarea 
                          value={exp.description}
                          onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                          placeholder="Describe your responsibilities and achievements..."
                          className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-3 rounded-lg text-xs min-h-[80px] outline-none focus:ring-1 focus:ring-[#1A1A1A] dark:focus:ring-white dark:text-white transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Education */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-zinc-800 pb-2">
                    <div className="flex items-center gap-4">
                      <GraduationCap size={16} className="text-[#8E8E8E] dark:text-zinc-500" />
                      <h2 className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">Education</h2>
                    </div>
                    <button onClick={addEducation} className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 hover:text-[#8E8E8E] dark:hover:text-zinc-400 transition-colors dark:text-zinc-500">
                      <Plus size={12} /> Add
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {education.map((edu) => (
                      <div key={edu.id} className="card p-6 border border-[#E5E5E5] dark:border-zinc-800 relative transition-colors">
                        <button 
                          onClick={() => removeEducation(edu.id)}
                          className="absolute top-4 right-4 text-[#E5E5E5] dark:text-zinc-700 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                        <input 
                          value={edu.school}
                          onChange={e => updateEducation(edu.id, 'school', e.target.value)}
                          placeholder="University Name"
                          autoComplete="off"
                          className="w-full bg-transparent border-b-2 border-[#ccc] dark:border-zinc-700 py-1 mb-3 focus:border-[#007BFF] outline-none text-sm font-bold dark:text-white"
                        />
                        <div className="flex gap-4 mb-3">
                          <input 
                            value={edu.degree}
                            onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                            placeholder="Degree"
                            autoComplete="off"
                            className="flex-1 bg-transparent border-b-2 border-[#ccc] dark:border-zinc-700 py-1 focus:border-[#007BFF] outline-none text-xs dark:text-white"
                          />
                          <input 
                            value={edu.year}
                            onChange={e => updateEducation(edu.id, 'year', e.target.value)}
                            placeholder="Year"
                            autoComplete="off"
                            className="w-20 bg-transparent border-b-2 border-[#ccc] dark:border-zinc-700 py-1 focus:border-[#007BFF] outline-none text-xs font-mono dark:text-zinc-400"
                          />
                        </div>
                        <textarea 
                          value={edu.description}
                          onChange={e => updateEducation(edu.id, 'description', e.target.value)}
                          placeholder="Highlights (e.g. GPA, relevant courses...)"
                          className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-3 rounded-lg text-xs min-h-[60px] outline-none focus:ring-1 focus:ring-[#1A1A1A] dark:focus:ring-white dark:text-white transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Academic Performance */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-[#E5E5E5] dark:border-zinc-800 pb-2">
                    <GraduationCap size={16} className="text-[#8E8E8E] dark:text-zinc-500" />
                    <h2 className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">Academic Performance</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Academic Details</label>
                      <textarea 
                        value={academicDetails}
                        onChange={e => setAcademicDetails(e.target.value)}
                        placeholder="List academic highlights (one per sentence)..."
                        className="w-full bg-white dark:bg-zinc-900 border border-[#E5E5E5] dark:border-zinc-800 p-4 rounded-lg focus:border-[#1A1A1A] dark:focus:border-white outline-none transition-colors min-h-[100px] text-sm leading-relaxed dark:text-white"
                      />
                    </div>
                  </div>
                </section>

                {/* Projects */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-zinc-800 pb-2">
                    <div className="flex items-center gap-4">
                      <FileText size={16} className="text-[#8E8E8E] dark:text-zinc-500" />
                      <h2 className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">Projects</h2>
                    </div>
                    <button onClick={addProject} className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 hover:text-[#8E8E8E] dark:hover:text-zinc-400 transition-colors dark:text-zinc-500">
                      <Plus size={12} /> Add
                    </button>
                  </div>
                  <div className="space-y-8">
                    {projects.map((proj) => (
                      <div key={proj.id} className="relative group card p-6 border border-[#E5E5E5] dark:border-zinc-800 hover:shadow-xl hover:shadow-black/5 transition-all">
                        <button 
                          onClick={() => removeProject(proj.id)}
                          className="absolute top-4 right-4 text-[#E5E5E5] dark:text-zinc-700 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <input 
                          value={proj.title}
                          onChange={e => updateProject(proj.id, 'title', e.target.value)}
                          placeholder="Project Title"
                          autoComplete="off"
                          className="w-full bg-transparent border-b-2 border-[#ccc] dark:border-zinc-700 py-1 mb-4 focus:border-[#007BFF] outline-none text-sm font-bold dark:text-white"
                        />
                        <textarea 
                          value={proj.description}
                          onChange={e => updateProject(proj.id, 'description', e.target.value)}
                          placeholder="Describe your project..."
                          className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-3 rounded-lg text-xs min-h-[80px] outline-none focus:ring-1 focus:ring-[#1A1A1A] dark:focus:ring-white dark:text-white transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Certificates */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-[#E5E5E5] dark:border-zinc-800 pb-2">
                    <Shield size={16} className="text-[#8E8E8E] dark:text-zinc-500" />
                    <h2 className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">Certificates</h2>
                  </div>
                  <div className="space-y-4">
                    <input 
                      type="file" 
                      multiple 
                      accept=".pdf,.png,.jpeg,.doc,.docx"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const validFiles = files.filter((f: any) => f.size <= 80 * 1024 * 1024);
                        if (validFiles.length < files.length) {
                          alert("Some files were skipped because they exceed the 80MB limit.");
                        }
                        const filteredFiles = validFiles.filter((f: any) => !f.name.toLowerCase().endsWith('.jpg'));
                        const fileNames = filteredFiles.map((f: any) => f.name);
                        setCertificates(prev => [...prev, ...fileNames]);
                      }}
                      className="text-xs text-[#8E8E8E] dark:text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#1A1A1A] dark:file:bg-white file:text-white dark:file:text-black hover:file:bg-[#333] dark:hover:file:bg-zinc-200 transition-all"
                    />
                    <p className="text-[10px] text-[#8E8E8E] dark:text-zinc-500 mt-2 font-mono uppercase tracking-widest">Supported formats: PDF, PNG, JPEG (JPG not allowed), max 80MB per file</p>
                    <div className="flex flex-wrap gap-2">
                      {certificates.map((cert, idx) => (
                        <div key={idx} className="bg-[#F5F5F4] dark:bg-zinc-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 dark:text-white transition-colors">
                          {cert}
                          <button onClick={() => setCertificates(prev => prev.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">
                            <Plus size={12} className="rotate-45" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Skills */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-zinc-800 pb-2">
                    <div className="flex items-center gap-4">
                      <Wrench size={16} className="text-[#8E8E8E] dark:text-zinc-500" />
                      <h2 className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">Technical Skills</h2>
                    </div>
                    <button onClick={addSkillCategory} className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 hover:text-[#8E8E8E] dark:hover:text-zinc-400 transition-colors dark:text-zinc-500">
                      <Plus size={12} /> Add Category
                    </button>
                  </div>
                  <div className="space-y-6">
                    {skillCategories.map((cat) => (
                      <div key={cat.id} className="card p-6 border border-[#E5E5E5] dark:border-zinc-800 space-y-4 transition-colors">
                        <div className="flex items-center justify-between gap-4">
                          <input 
                            value={cat.name}
                            onChange={e => updateSkillCategoryName(cat.id, e.target.value)}
                            placeholder="Category (e.g. Languages)"
                            autoComplete="off"
                            className="bg-transparent border-b-2 border-[#ccc] dark:border-zinc-700 py-1 focus:border-[#007BFF] outline-none text-sm font-bold flex-1 dark:text-white"
                          />
                          <button 
                            onClick={() => removeSkillCategory(cat.id)}
                            className="text-[#E5E5E5] dark:text-zinc-700 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {cat.skills.map((skill) => (
                            <div key={skill.id} className="flex items-center gap-2 bg-[#F5F5F4] dark:bg-zinc-800 p-2 rounded-xl group/skill transition-colors">
                              <div className="relative group/icon">
                                <button className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-lg border border-[#E5E5E5] dark:border-zinc-700 hover:border-[#1A1A1A] dark:hover:border-white transition-colors">
                                  {React.createElement(getIconComponent(skill.icon), { size: 14, className: "dark:text-zinc-400" })}
                                </button>
                                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-zinc-900 border border-[#E5E5E5] dark:border-zinc-800 rounded-xl shadow-xl p-2 hidden group-focus-within/icon:grid grid-cols-5 gap-1 z-50 w-[200px]">
                                  {ICON_OPTIONS.map((opt) => (
                                    <button 
                                      key={opt.name}
                                      onClick={() => updateSkill(cat.id, skill.id, 'icon', opt.name)}
                                      className={cn(
                                        "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F5F5F4] dark:hover:bg-zinc-800 transition-colors",
                                        skill.icon === opt.name && "bg-[#1A1A1A] dark:bg-white text-white dark:text-black"
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
                                autoComplete="off"
                                className="bg-transparent border-none outline-none text-xs flex-1 dark:text-white"
                              />
                              <button 
                                onClick={() => removeSkillFromCategory(cat.id, skill.id)}
                                className="text-[#E5E5E5] dark:text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover/skill:opacity-100"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => addSkillToCategory(cat.id)}
                            className="flex items-center justify-center gap-2 border-2 border-dashed border-[#E5E5E5] dark:border-zinc-800 rounded-xl py-2 text-[10px] uppercase tracking-widest font-bold text-[#8E8E8E] dark:text-zinc-500 hover:border-[#1A1A1A] dark:hover:border-white hover:text-[#1A1A1A] dark:hover:text-white transition-all"
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
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-zinc-800 pb-2">
                    <div className="flex items-center gap-4">
                      <Plus size={16} className="text-[#8E8E8E] dark:text-zinc-500" />
                      <h2 className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">Custom Sections</h2>
                    </div>
                    <button onClick={addCustomSection} className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 hover:text-[#8E8E8E] dark:hover:text-zinc-400 transition-colors dark:text-zinc-500">
                      <Plus size={12} /> Add Section
                    </button>
                  </div>
                  <div className="space-y-8">
                    {customSections.map((section) => (
                      <div key={section.id} className="relative group card p-6 border border-[#E5E5E5] dark:border-zinc-800 hover:shadow-xl hover:shadow-black/5 transition-all">
                        <button 
                          onClick={() => removeCustomSection(section.id)}
                          className="absolute top-4 right-4 text-[#E5E5E5] dark:text-zinc-700 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <input 
                          value={section.title}
                          onChange={e => updateCustomSection(section.id, 'title', e.target.value)}
                          placeholder="Section Title (e.g. Certifications)"
                          autoComplete="off"
                          className="w-full bg-transparent border-b-2 border-[#ccc] dark:border-zinc-700 py-1 mb-4 focus:border-[#007BFF] outline-none text-sm font-bold dark:text-white"
                        />
                        <textarea 
                          value={section.content}
                          onChange={e => updateCustomSection(section.id, 'content', e.target.value)}
                          placeholder="Section content..."
                          className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-3 rounded-lg text-xs min-h-[100px] outline-none focus:ring-1 focus:ring-[#1A1A1A] dark:focus:ring-white dark:text-white transition-colors"
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
                    <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] w-full md:w-[60%]">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Enter certificate name..."
                          autoComplete="off"
                          className="flex-1 bg-transparent border-b-2 border-[#ccc] py-2 focus:border-[#007BFF] outline-none text-sm"
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
                          className="bg-[#1A1A1A] hover:bg-[#333] text-white px-6 py-2 rounded-xl transition-all text-xs font-bold uppercase tracking-widest"
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

                <div className="pt-12 flex flex-col gap-6">
                  {atsScoreResult !== null && (
                    <div className="card p-8 border border-[#E5E5E5] space-y-6 animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between border-b border-[#F5F5F4] pb-4">
                        <div className="flex items-center gap-3">
                          <Zap size={20} className="text-amber-500" />
                          <h3 className="text-xs font-bold uppercase tracking-widest">ATS Score Analysis</h3>
                        </div>
                        <p className={cn(
                          "text-3xl font-serif font-bold",
                          atsScoreResult > 70 ? "text-green-600" : atsScoreResult > 40 ? "text-amber-500" : "text-red-500"
                        )}>
                          {atsScoreResult}%
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <p className="text-[10px] font-mono uppercase tracking-widest opacity-40">Skills Found</p>
                          <p className="text-xs font-medium text-[#1A1A1A]">
                            {atsFoundSkills.length > 0 ? atsFoundSkills.join(", ") : "No matching skills identified"}
                          </p>
                        </div>

                        {atsSuggestions.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-mono uppercase tracking-widest opacity-40">AI Suggestions</p>
                            <ul className="space-y-1">
                              {atsSuggestions.map((s, i) => (
                                <li key={i} className="text-xs text-[#1A1A1A] flex items-start gap-2">
                                  <span className="text-blue-500">•</span>
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={analyzeATSFromBuilder}
                      className="flex-1 py-4 border border-amber-500 text-amber-600 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-amber-50 transition-all flex items-center justify-center gap-2"
                    >
                      Check ATS Score
                      <Zap size={16} />
                    </button>
                    <button 
                      type="button"
                      onClick={handleGenerate}
                      className="flex-1 py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      Preview Resume
                      <ChevronRight size={16} />
                    </button>
                    <button 
                      type="button"
                      onClick={findJobMatches}
                      className="flex-1 py-4 border border-[#1A1A1A] text-[#1A1A1A] rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      Find Job Matches
                      <Search size={16} />
                    </button>
                  </div>
                </div>
                </form>

                {/* Quick Live Preview Section */}
                <section className="mt-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center gap-4 border-b border-[#E5E5E5] dark:border-zinc-800 pb-2">
                    <Activity size={16} className="text-[#8E8E8E] dark:text-zinc-500" />
                    <h2 className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">Live Resume Preview</h2>
                  </div>
                  <div className="card p-8 border border-[#E5E5E5] dark:border-zinc-800 shadow-xl shadow-black/5 transition-colors">
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold uppercase tracking-tight dark:text-white">{formData.fullName || "Your Name"}</h2>
                      <h3 className="text-lg font-serif italic text-[#8E8E8E] dark:text-zinc-500">{formData.role || "Job Role"}</h3>
                      
                      <div className="pt-4 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-widest border-b border-[#F5F5F4] dark:border-zinc-800 pb-1 dark:text-zinc-400">Skills</h4>
                        <p className="text-sm text-[#4A4A4A] dark:text-zinc-300">
                          {skillCategories.flatMap(c => c.skills.map(s => s.name)).join(", ") || "No skills added yet"}
                        </p>
                      </div>

                      <div className="pt-4 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-widest border-b border-[#F5F5F4] dark:border-zinc-800 pb-1 dark:text-zinc-400">Experience</h4>
                        <div className="space-y-4">
                          {experience.length > 0 ? experience.map(exp => (
                            <div key={exp.id}>
                              <p className="text-sm font-bold dark:text-white">{exp.role} at {exp.company}</p>
                              <p className="text-xs text-[#8E8E8E] dark:text-zinc-500">{exp.duration}</p>
                              <p className="text-xs mt-1 text-[#4A4A4A] dark:text-zinc-300 line-clamp-2">{exp.description}</p>
                            </div>
                          )) : <p className="text-sm text-[#8E8E8E] dark:text-zinc-500 italic">No experience added yet</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'preview' && (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                className="max-w-5xl mx-auto space-y-8"
              >
                {/* Template Selection Dropdown */}
                <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-[#E5E5E5] dark:border-zinc-800 shadow-sm print:hidden transition-colors">
                  <div className="flex items-center gap-4">
                    <Layers size={20} className="text-[#1A1A1A] dark:text-white" />
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest dark:text-white">Choose Resume Template</h3>
                      <p className="text-[10px] text-[#8E8E8E] dark:text-zinc-500 font-mono uppercase tracking-widest">Select a style for your professional narrative</p>
                    </div>
                  </div>
                  <select 
                    id="templateSelect"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="bg-[#F5F5F4] dark:bg-zinc-800 dark:text-white border-none outline-none px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-[#E5E5E5] dark:hover:bg-zinc-700 transition-all"
                  >
                    <option value="template1">Professional</option>
                    <option value="template2">Modern</option>
                    <option value="template3">Creative</option>
                    <option value="template4">Elegant</option>
                    <option value="template5">Corporate</option>
                    <option value="template6">Minimal Dark</option>
                    <option value="template7">Sidebar</option>
                    <option value="template8">Clean Blue</option>
                  </select>
                </div>

                {/* Resume Preview Container */}
                <div 
                  id="resumePreview"
                  className={cn(
                    "bg-white shadow-2xl rounded-sm mx-auto print:shadow-none print:m-0 overflow-hidden resume-container",
                    selectedTemplate
                  )}
                  style={{ 
                    maxWidth: '900px',
                    minHeight: '297mm'
                  }}
                >
                  <div className="p-[25px]">
                    <header className="flex items-center gap-6 mb-[15px]">
                      {profilePhoto && (
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#ddd] flex-shrink-0">
                          <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className={cn("flex-1", !profilePhoto && "text-center")}>
                        <motion.h1 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xl font-bold mb-[2px] uppercase"
                        >
                          {(previewData || formData).fullName || "RAVU MOHAN DURGA PRASAD"}
                        </motion.h1>
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-[12px] text-[#555]"
                        >
                          {(previewData || formData).phone || "+91 XXXXXXXXXX"} | {(previewData || formData).email || "your.email@gmail.com"} | 
                          LinkedIn: {(previewData || formData).linkedin || "linkedin.com/in/yourprofile"} | 
                          GitHub: {(previewData || formData).github || "github.com/yourusername"}
                        </motion.div>
                      </div>
                    </header>

                    <div className="space-y-[12px]">
                      {/* Profile Section */}
                      {(previewData || formData).summary && (
                        <section>
                          <h2 className="text-[14px] font-bold border-b-2 border-[#ddd] pb-[2px] mb-[4px] uppercase tracking-tight">PROFILE</h2>
                          <p className="leading-relaxed text-[#333]">{(previewData || formData).summary}</p>
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

                      {/* Certificates Section */}
                      {certificates.length > 0 && (
                        <section>
                          <h2 className="text-[14px] font-bold border-b-2 border-[#ddd] pb-[2px] mb-[4px] uppercase tracking-tight">CERTIFICATES</h2>
                          <ul className="list-disc ml-[20px] space-y-[1px]">
                            {certificates.map((cert, idx) => (
                              <li key={idx} className="text-[#333] text-[12px]">{cert}</li>
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
                  </div>

                  {isValidResume && (
                    <div id="actionButtons" className="flex gap-4 mt-8 p-[25px] pt-0 print:hidden">
                      <button 
                        onClick={() => setActiveTab('edit')}
                        className="flex-1 py-3 border border-[#1A1A1A] text-[#1A1A1A] rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <ChevronLeft size={14} />
                        Back to Edit
                      </button>
                      <button 
                        onClick={exportToPDF}
                        className="flex-1 py-3 bg-[#1A1A1A] text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        <Download size={14} />
                        Download PDF
                      </button>
                      <button 
                        onClick={downloadSimplePDF}
                        className="flex-1 py-3 border border-[#1A1A1A] text-[#1A1A1A] rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <FileText size={14} />
                        Simple PDF
                      </button>
                    </div>
                  )}

                  <button 
                    onClick={() => setActiveTab('edit')}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-[#333] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all z-50 print:hidden"
                  >
                    <Plus size={24} className="rotate-45" />
                  </button>
                </div>
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
                      <Loader2 className="w-16 h-16 animate-spin text-[#1A1A1A] dark:text-white opacity-20" />
                      <Search className="absolute inset-0 m-auto w-6 h-6 text-[#1A1A1A] dark:text-white" />
                    </div>
                    <p className="text-xs font-mono uppercase tracking-widest opacity-50 animate-pulse dark:text-zinc-400">Scanning global job markets...</p>
                  </div>
                ) : isResumeInvalid && jobMatches.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-red-200 rounded-[40px] bg-red-50/30 animate-in fade-in zoom-in-95">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <h3 className="text-xl font-serif italic text-red-600 mb-2">It is not resume related data</h3>
                    <p className="text-xs text-[#8E8E8E] max-w-md mx-auto mb-8">
                      The current profile information doesn't appear to be resume-related. Please add valid professional experience, skills, and education in the Edit tab.
                    </p>
                    <button 
                      onClick={() => setActiveTab('edit')}
                      className="px-8 py-3 bg-[#1A1A1A] text-white rounded-full text-[10px] font-bold uppercase tracking-widest"
                    >
                      Go to Edit
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {jobMatches.length > 0 ? (
                      jobMatches.map((job, i) => (
                        <div key={i} className="card p-8 border border-[#E5E5E5] dark:border-zinc-800 hover:border-[#1A1A1A] dark:hover:border-white transition-all group">
                          <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-[#F5F5F4] dark:bg-zinc-800 rounded-2xl flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                              <Briefcase size={20} />
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-mono uppercase tracking-widest opacity-40 dark:text-zinc-500">Match Score</p>
                              <p className="text-2xl font-serif font-bold text-green-600">{job.matchScore}%</p>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mb-1 dark:text-white">{job.title}</h3>
                          <p className="text-sm font-serif italic text-[#8E8E8E] dark:text-zinc-500 mb-6">{job.company}</p>
                          <div className="p-4 bg-[#F5F5F4] dark:bg-zinc-800 rounded-xl">
                            <p className="text-xs leading-relaxed text-[#4A4A4A] dark:text-zinc-300 italic">"{job.reason}"</p>
                          </div>
                          <button className="w-full mt-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                            View Details
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="md:col-span-3 py-20 text-center border-2 border-dashed border-[#E5E5E5] dark:border-zinc-800 rounded-3xl">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-10 dark:text-white" />
                        <h3 className="text-lg font-serif italic mb-2 dark:text-white">No matches yet</h3>
                        <p className="text-xs text-[#8E8E8E] dark:text-zinc-500 mb-6">Click the button below to analyze your resume and find matches.</p>
                        <button 
                          onClick={findJobMatches}
                          className="px-8 py-3 bg-[#1A1A1A] dark:bg-white text-white dark:text-black rounded-full text-[10px] font-bold uppercase tracking-widest"
                        >
                          Find Matches
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Manual Job Matcher Section */}
                <section className="mt-16 space-y-8">
                  <div className="flex items-center gap-4 border-b border-[#E5E5E5] dark:border-zinc-800 pb-2">
                    <Search size={16} className="text-[#8E8E8E] dark:text-zinc-500" />
                    <h2 className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">Manual Job Matcher</h2>
                  </div>

                  {/* Suggested Jobs Quick View */}
                  {suggestedJobs.length > 0 && (
                    <div className="bg-zinc-900 dark:bg-zinc-950 text-white p-8 rounded-[40px] space-y-6 transition-colors">
                      <div className="flex items-center gap-3">
                        <Zap size={20} className="text-amber-400" />
                        <h3 className="text-xs font-bold uppercase tracking-widest">Suggested Jobs for You</h3>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {suggestedJobs.map((job, idx) => (
                          <span key={idx} className="px-4 py-2 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-colors cursor-default">
                            {job}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Based on your technical skills and experience</p>
                    </div>
                  )}
                  
                  <div className="card p-8 border border-[#E5E5E5] space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Paste Job Description</label>
                      <textarea 
                        value={manualJobDescription}
                        onChange={(e) => setManualJobDescription(e.target.value)}
                        placeholder="Paste the job description here to see how your builder data matches..."
                        className="w-full h-48 bg-[#F5F5F4] p-4 rounded-2xl border-b-2 border-transparent focus:border-[#007BFF] outline-none transition-all text-sm resize-none"
                      />
                    </div>

                    <div className="flex flex-col md:flex-row items-start justify-between gap-8 pt-4">
                      <button 
                        onClick={matchJobsManual}
                        className="w-full md:w-auto px-12 py-4 bg-[#1A1A1A] text-white rounded-full font-bold uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all"
                      >
                        Match Job
                      </button>
                      
                      {manualMatchScore !== null && (
                        <div className="flex-1 animate-in fade-in slide-in-from-right-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-mono uppercase tracking-widest opacity-40">Job Match Result</p>
                            <div className="flex items-center gap-4">
                              <p className={cn(
                                "text-4xl font-serif font-bold",
                                manualMatchScore > 70 ? "text-green-600" : manualMatchScore > 20 ? "text-amber-500" : "text-red-500"
                              )}>
                                {manualMatchScore < 20 ? "Not related to resume" : `${manualMatchScore}%`}
                              </p>
                              {manualMatchScore >= 20 && (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">Match Found</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

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
