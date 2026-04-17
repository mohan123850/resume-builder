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
import html2pdf from "html2pdf.js";
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';

// --- Types ---
interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
  percentage?: string;
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
  tech?: string;
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

const SKILL_ROLE_MAP: Record<string, string[]> = {
  "Frontend Developer": ["React", "TypeScript", "Tailwind CSS", "JavaScript", "HTML5", "CSS3", "Redux", "Vite", "Next.js", "Web Performance"],
  "Backend Developer": ["Node.js", "Express", "PostgreSQL", "MongoDB", "Docker", "REST API", "GraphQL", "Python", "Java", "Microservices"],
  "Full Stack Developer": ["React", "Node.js", "TypeScript", "SQL", "Git", "AWS", "Express", "PostgreSQL", "JavaScript", "Tailwind CSS"],
  "Data Scientist": ["Python", "SQL", "Machine Learning", "Pandas", "Scikit-Learn", "TensorFlow", "Statistics", "Data Visualization", "R"],
  "UI/UX Designer": ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping", "Design Systems", "Visual Design", "Sketch"],
  "Product Manager": ["Agile", "Scrum", "Product Roadmap", "JIRA", "Data Analysis", "Market Research", "Stakeholder Management", "PRDs"],
  "Software Engineer": ["Java", "C++", "Python", "Data Structures", "Algorithms", "System Design", "Git", "Unit Testing", "Go"],
  "DevOps Engineer": ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Jenkins", "Linux", "Ansible", "Monitoring"],
  "Data Analyst": ["SQL", "Excel", "Tableau", "Power BI", "Python", "Statistics", "Data Cleaning", "Data Visualization"],
  "Marketing Specialist": ["SEO", "Google Analytics", "Content Strategy", "Email Marketing", "PPC", "Social Media", "Copywriting"],
  "HR Manager": ["Recruitment", "Employee Relations", "Payroll", "Performance Management", "Conflict Resolution", "Policy Writing"],
  "Financial Analyst": ["Excel", "Financial Modeling", "Budgeting", "Forecasting", "ERP Systems", "Data Analysis", "Reporting"],
  "Cybersecurity Analyst": ["Network Security", "Penetration Testing", "SIEM", "Firewalls", "Incident Response", "Vulnerability Assessment"]
};

function isValidText(text: string) {
  if (!text || text.trim().length < 2) return false;
  if (!/[a-zA-Z]/.test(text)) return false;
  return true;
}

function isGibberish(text: string) {
  if (!text) return true;
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return true;
  
  // Single word like "Developer", "IT", "HR" are valid
  if (words.length === 1) {
    return words[0].length < 2 && !/^[A-Z]{2,3}$/.test(words[0]); 
  }

  // Multi-word check
  const hasVowels = /[aeiouAEIOU]/.test(text);
  if (!hasVowels) return true;

  return false;
}

export default function App() {
  // --- State ---
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    leetcode: '',
    hackerrank: '',
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
  const [aiLeetcode, setAiLeetcode] = React.useState('');
  const [aiHackerrank, setAiHackerrank] = React.useState('');
  const [aiAdditionalInfo, setAiAdditionalInfo] = React.useState('');
  const [aiExperience, setAiExperience] = React.useState('');
  const [aiSummary, setAiSummary] = React.useState('');
  const [aiProjects, setAiProjects] = React.useState('');
  const [aiEducation, setAiEducation] = React.useState('');
  const [aiSchool, setAiSchool] = React.useState('');
  const [aiSchoolPercent, setAiSchoolPercent] = React.useState('');
  const [aiInter, setAiInter] = React.useState('');
  const [aiInterPercent, setAiInterPercent] = React.useState('');
  const [aiDegree, setAiDegree] = React.useState('');
  const [aiBtechPercent, setAiBtechPercent] = React.useState('');
  const [aiProjectsInput, setAiProjectsInput] = React.useState('');
  const [aiCertificatesInput, setAiCertificatesInput] = React.useState('');
  const [aiAchievements, setAiAchievements] = React.useState('');
  const [aiGeneratedCertifications, setAiGeneratedCertifications] = React.useState('');
  const [isGeneratingAI, setIsGeneratingAI] = React.useState(false);
  const [generatedAIResume, setGeneratedAIResume] = React.useState<string | null>(null);

  // --- Manual Matcher State ---
  const [manualJobDescription, setManualJobDescription] = React.useState('');
  const [manualMatchScore, setManualMatchScore] = React.useState<number | null>(null);

  // --- Template Selection State ---
  const [selectedTemplate, setSelectedTemplate] = React.useState('professional');

  // --- Suggested Jobs State ---
  const [suggestedJobs, setSuggestedJobs] = React.useState<string[]>([]);

  const [isResumeInvalid, setIsResumeInvalid] = React.useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = React.useState(false);
  const [manualErrors, setManualErrors] = React.useState<Record<string, string>>({});
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
      leetcode: '',
      hackerrank: '',
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
    setAiLeetcode('');
    setAiHackerrank('');
    setGeneratedAIResume(null);
    
    // Explicitly clear storage
    localStorage.removeItem("resumeData");
  }, []);

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("resumeData");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.formData) setFormData(data.formData);
        if (data.skillCategories) setSkillCategories(data.skillCategories);
        if (data.education) setEducation(data.education);
        if (data.experience) setExperience(data.experience);
        if (data.projects) setProjects(data.projects);
        if (data.achievements) setAchievements(data.achievements);
        if (data.customSections) setCustomSections(data.customSections);
        if (data.certificates) setCertificates(data.certificates);
        if (data.profilePhoto) setProfilePhoto(data.profilePhoto);
        if (data.selectedTemplate) setSelectedTemplate(data.selectedTemplate);
      } catch (e) {
        console.error("Error loading saved data", e);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  React.useEffect(() => {
    const dataToSave = {
      formData,
      skillCategories,
      education,
      experience,
      projects,
      achievements,
      customSections,
      certificates,
      profilePhoto,
      selectedTemplate
    };
    localStorage.setItem("resumeData", JSON.stringify(dataToSave));
  }, [formData, skillCategories, education, experience, projects, achievements, customSections, certificates, profilePhoto, selectedTemplate]);

  const validateManualForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!formData.email.includes("@")) errs.email = "Invalid email format";
    if (!formData.role.trim()) errs.role = "Job role is required";
    
    setManualErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstError = Object.keys(errs)[0];
      const el = document.getElementsByName(firstError)[0];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };
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

  const addProject = () => setProjects([...projects, { id: Date.now().toString(), title: '', tech: '', description: '' }]);
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
      if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is missing from process.env");
        throw new Error("Gemini API Key is missing. Please configure it in the settings.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
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

      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const matchResult = JSON.parse(response.text || '{}');
      setJobMatches(matchResult.matches || []);
    } catch (err) {
      console.error("AI Matching Error:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      alert(`Failed to generate job suggestions: ${errorMessage}`);
    } finally {
      setIsMatching(false);
    }
  };

  // --- PDF Export (Traditional Layout) ---
  const downloadAIResume = async () => {
    const element = document.getElementById("aiResumePreview");
    if (!element) return;

    try {
      const opt = {
        margin: 5,
        filename: `AI_Generated_${aiName.replace(/\s+/g, '_') || 'Resume'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating AI PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const [isExporting, setIsExporting] = React.useState(false);

  const exportToPDF = () => {
    try {
      window.print();
    } catch (err) {
      console.error(err);
      alert("Download not supported here. Use Print instead.");
    }
  };

  const handleDownload = () => {
    window.print();
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
      'contact', 'email', 'phone', 'linkedin', 'github', 'objective', 'profile',
      'developer', 'engineer', 'manager', 'analyst', 'designer', 'consultant',
      'coordinator', 'specialist', 'technician', 'lead', 'director', 'intern'
    ];
    
    const words = lower.split(/\W+/).filter(w => w.length > 1);
    const foundKeywords = keywords.filter(k => lower.includes(k));
    
    // Stricter check: must have at least one professional keyword and enough content
    return words.length >= 10 && foundKeywords.length >= 2;
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
    // Job role optional — no validation
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
      if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is missing from process.env");
        throw new Error("Gemini API Key is missing. Please configure it in the settings.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
        LeetCode: ${aiLeetcode}
        HackerRank: ${aiHackerrank}
        School: ${aiSchool}
        Intermediate: ${aiInter}
        Degree: ${aiDegree}
        Projects Input: ${aiProjectsInput}
        Certifications Input: ${aiCertificatesInput}
        Additional Info: ${aiAdditionalInfo}

        Please provide the content for the following sections:
        1. Professional Summary (2-3 lines tailored to the role)
        2. Experience (Job-based bullet points generated from skills or info provided)
        3. Projects (short impactful descriptions based on projects input)
        4. Education (structured based on provided School, Inter, and Degree)
        5. Certifications (list based on input)
        6. Achievements (at least 2-3 professional bullet points)

        Format the experience, projects, and achievements as bullet points starting with "• ".
      `;

      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
        config: {
          systemInstruction: "You are a professional resume writer and career coach.",
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              experience: { type: Type.STRING },
              projects: { type: Type.STRING },
              education: { type: Type.STRING },
              certifications: { type: Type.STRING },
              achievements: { type: Type.STRING }
            },
            required: ["summary", "experience", "projects", "education", "certifications", "achievements"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      const { summary, experience, projects, education, certifications, achievements } = data;

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
              ${aiLeetcode ? `<div>LeetCode</div>` : ''}
              ${aiHackerrank ? `<div>HackerRank</div>` : ''}
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
          <div class="text-sm text-[#333] space-y-1">
            ${aiDegree ? `<div><strong>B.Tech / Degree:</strong> ${aiDegree} ${aiBtechPercent ? `<span class="bg-gray-100 px-2 rounded text-[10px] font-bold">(${aiBtechPercent})</span>` : ''}</div>` : ''}
            ${aiInter ? `<div><strong>Intermediate / Polytechnic:</strong> ${aiInter} ${aiInterPercent ? `<span class="bg-gray-100 px-2 rounded text-[10px] font-bold">(${aiInterPercent})</span>` : ''}</div>` : ''}
            ${aiSchool ? `<div><strong>High School (SSC):</strong> ${aiSchool} ${aiSchoolPercent ? `<span class="bg-gray-100 px-2 rounded text-[10px] font-bold">(${aiSchoolPercent})</span>` : ''}</div>` : ''}
            ${(!aiDegree && !aiInter && !aiSchool) ? education : ''}
          </div>
        </div>

          <div class="space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-widest text-[#8E8E8E]">Certifications</h3>
            <p class="text-sm leading-relaxed text-[#333]">${certifications}</p>
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
      setAiGeneratedCertifications(certifications);
    } catch (error) {
      console.error("AI Generation Error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Failed to generate AI resume: ${errorMessage}`);
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
                <section className="space-y-8 p-1 rounded-[40px] bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-zinc-800/20 dark:to-transparent">
                  <div className="flex items-center gap-4 border-b border-[#E5E5E5] dark:border-zinc-800 pb-2 px-8">
                    <Zap size={16} className="text-[#8E8E8E] dark:text-zinc-500" />
                    <h2 className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">AI Resume Generator</h2>
                  </div>
                  
                  <div className="card p-8 border border-white dark:border-zinc-800 space-y-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-xl shadow-indigo-100/20 dark:shadow-none transition-all">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Your Name</label>
                        <input 
                          value={aiName}
                          onChange={(e) => setAiName(e.target.value)}
                          placeholder="Full Name"
                          className={cn(
                            "w-full bg-white dark:bg-zinc-900/50 p-4 rounded-2xl border border-transparent shadow-sm focus:shadow-md focus:border-[#007BFF] outline-none transition-all text-sm dark:text-white",
                            aiErrors.name && "border-red-500 shadow-red-50/50"
                          )}
                        />
                        {aiErrors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{aiErrors.name}</p>}
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Job Role</label>
                        <input 
                          value={aiRole}
                          list="job-role-suggestions"
                          onChange={(e) => setAiRole(e.target.value)}
                          placeholder="Example: Frontend Developer"
                          className={cn(
                            "w-full bg-white dark:bg-zinc-900/50 p-4 rounded-2xl border border-transparent shadow-sm focus:shadow-md focus:border-[#007BFF] outline-none transition-all text-sm dark:text-white",
                            aiErrors.role && "border-red-500 shadow-red-50/50"
                          )}
                        />
                        <datalist id="job-role-suggestions">
                          <option value="Frontend Developer" />
                          <option value="Backend Developer" />
                          <option value="Full Stack Developer" />
                          <option value="Data Scientist" />
                          <option value="UI/UX Designer" />
                          <option value="Product Manager" />
                          <option value="Software Engineer" />
                          <option value="DevOps Engineer" />
                          <option value="Data Analyst" />
                          <option value="Marketing Specialist" />
                          <option value="HR Manager" />
                          <option value="Financial Analyst" />
                          <option value="Java Developer" />
                          <option value="Python Developer" />
                          <option value="Cybersecurity Analyst" />
                        </datalist>
                        {aiErrors.role && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{aiErrors.role}</p>}
                      </div>
                      <div className="space-y-4 md:col-span-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Skills</label>
                          <span className="text-[10px] font-mono text-[#8E8E8E] opacity-50 uppercase tracking-widest">Select relevant skills to add</span>
                        </div>
                        
                        {SKILL_ROLE_MAP[aiRole] && (
                          <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-top-1">
                            {SKILL_ROLE_MAP[aiRole].map((skill, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  const currentSkills = aiSkills ? aiSkills.split(",").map(s => s.trim()) : [];
                                  if (!currentSkills.includes(skill)) {
                                    setAiSkills(aiSkills ? `${aiSkills}, ${skill}` : skill);
                                  }
                                }}
                                className="px-3 py-1 bg-[#F5F5F4] dark:bg-zinc-800 border border-[#E5E5E5] dark:border-zinc-700 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                              >
                                + {skill}
                              </button>
                            ))}
                          </div>
                        )}

                        <textarea 
                          value={aiSkills}
                          onChange={(e) => setAiSkills(e.target.value)}
                          placeholder="HTML, CSS, JS, React..."
                          className={cn(
                            "w-full h-24 bg-white dark:bg-zinc-900/50 p-4 rounded-2xl border border-transparent shadow-sm focus:shadow-md focus:border-[#007BFF] outline-none transition-all text-sm resize-none dark:text-white",
                            aiErrors.skills && "border-red-500 shadow-red-50/50"
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
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">LeetCode</label>
                        <input 
                          value={aiLeetcode}
                          onChange={(e) => setAiLeetcode(e.target.value)}
                          placeholder="LeetCode URL"
                          className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 border-transparent focus:border-[#007BFF] outline-none transition-all text-sm dark:text-white"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">HackerRank</label>
                        <input 
                          value={aiHackerrank}
                          onChange={(e) => setAiHackerrank(e.target.value)}
                          placeholder="HackerRank URL"
                          className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 border-transparent focus:border-[#007BFF] outline-none transition-all text-sm dark:text-white"
                        />
                      </div>
                      <div className="space-y-4 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">School (SSC)</label>
                          <input 
                            value={aiSchool}
                            onChange={(e) => setAiSchool(e.target.value)}
                            placeholder="Example: ZPHS, Hyderabad"
                            className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 border-transparent focus:border-[#007BFF] outline-none transition-all text-sm dark:text-white mb-2"
                          />
                          <input 
                            value={aiSchoolPercent}
                            onChange={(e) => setAiSchoolPercent(e.target.value)}
                            placeholder="Percentage (e.g. 95%)"
                            className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-3 rounded-xl border border-transparent focus:border-[#007BFF] outline-none transition-all text-[10px] dark:text-white"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Intermediate / Polytechnic</label>
                          <input 
                            value={aiInter}
                            onChange={(e) => setAiInter(e.target.value)}
                            placeholder="Example: Narayana Junior College"
                            className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 border-transparent focus:border-[#007BFF] outline-none transition-all text-sm dark:text-white mb-2"
                          />
                          <input 
                            value={aiInterPercent}
                            onChange={(e) => setAiInterPercent(e.target.value)}
                            placeholder="Percentage (e.g. 98%)"
                            className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-3 rounded-xl border border-transparent focus:border-[#007BFF] outline-none transition-all text-[10px] dark:text-white"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">B.Tech / Degree</label>
                          <input 
                            value={aiDegree}
                            onChange={(e) => setAiDegree(e.target.value)}
                            placeholder="Example: JNTU, Computer Science"
                            className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 border-transparent focus:border-[#007BFF] outline-none transition-all text-sm dark:text-white mb-2"
                          />
                          <input 
                            value={aiBtechPercent}
                            onChange={(e) => setAiBtechPercent(e.target.value)}
                            placeholder="Percentage / CGPA (e.g. 8.5)"
                            className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-3 rounded-xl border border-transparent focus:border-[#007BFF] outline-none transition-all text-[10px] dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Projects (Optional)</label>
                        <textarea 
                          value={aiProjectsInput}
                          onChange={(e) => setAiProjectsInput(e.target.value)}
                          placeholder="Briefly describe 1-2 key projects you've worked on..."
                          className="w-full h-24 bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 border-transparent focus:border-[#007BFF] outline-none transition-all text-sm resize-none dark:text-white"
                        />
                      </div>

                      <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">Certifications (Optional)</label>
                        <input 
                          value={aiCertificatesInput}
                          onChange={(e) => setAiCertificatesInput(e.target.value)}
                          placeholder="Example: AWS Certified Cloud Practitioner, Java Fundamentals"
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
                                leetcode: aiLeetcode || formData.leetcode,
                                hackerrank: aiHackerrank || formData.hackerrank,
                                summary: aiSummary || `Motivated ${aiRole} skilled in ${aiSkills}. Passionate about delivering high-quality solutions.`
                              });

                              // Add certifications
                              if (aiGeneratedCertifications) {
                                setCertificates(prev => [...new Set([...prev, ...aiGeneratedCertifications.split('\n').map(c => c.replace(/^•\s*/, '').trim()).filter(c => c.length > 0)])]);
                              }
                              
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
                              const newEducation: Education[] = [];
                              if (aiDegree) {
                                newEducation.push({
                                  id: crypto.randomUUID(),
                                  school: aiDegree.split(',')[0].trim(),
                                  degree: 'B.Tech / Degree',
                                  year: '2024',
                                  percentage: aiBtechPercent,
                                  description: aiDegree
                                });
                              }
                              if (aiInter) {
                                newEducation.push({
                                  id: crypto.randomUUID(),
                                  school: aiInter.split(',')[0].trim(),
                                  degree: 'Intermediate / Polytechnic',
                                  year: '2020',
                                  percentage: aiInterPercent,
                                  description: aiInter
                                });
                              }
                              if (aiSchool) {
                                newEducation.push({
                                  id: crypto.randomUUID(),
                                  school: aiSchool.split(',')[0].trim(),
                                  degree: 'High School (SSC)',
                                  year: '2018',
                                  percentage: aiSchoolPercent,
                                  description: aiSchool
                                });
                              }
                              
                              if (newEducation.length > 0) {
                                setEducation([...newEducation, ...education]);
                              } else if (aiEducation) {
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
                              
                              // Stay on edit tab and scroll to manual builder
                              const manualBuilder = document.getElementById('manual-builder');
                              if (manualBuilder) {
                                manualBuilder.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className="px-8 py-4 bg-amber-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-lg group"
                          >
                            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                            Apply AI & Edit Manually
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              // Save AI data
                              setFormData({
                                ...formData,
                                fullName: aiName,
                                role: aiRole,
                                email: aiEmail || formData.email,
                                phone: aiPhone || formData.phone,
                                linkedin: aiLinkedin || formData.linkedin,
                                github: aiGithub || formData.github,
                                leetcode: aiLeetcode || formData.leetcode,
                                hackerrank: aiHackerrank || formData.hackerrank,
                                summary: aiSummary || `Motivated ${aiRole} skilled in ${aiSkills}. Passionate about delivering high-quality solutions.`
                              });

                              if (aiGeneratedCertifications) {
                                setCertificates(prev => [...new Set([...prev, ...aiGeneratedCertifications.split('\n').map(c => c.replace(/^•\s*/, '').trim()).filter(c => c.length > 0)])]);
                              }
                              
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

                              if (aiProjects) {
                                const newProj: Project = {
                                  id: crypto.randomUUID(),
                                  title: 'Project from AI Generator',
                                  description: aiProjects
                                };
                                setProjects([newProj, ...projects]);
                              }

                              const newEducation: Education[] = [];
                              if (aiDegree) {
                                newEducation.push({
                                  id: crypto.randomUUID(),
                                  school: aiDegree.split(',')[0].trim(),
                                  degree: 'B.Tech / Degree',
                                  year: '2024',
                                  percentage: aiBtechPercent,
                                  description: aiDegree
                                });
                              }
                              if (aiInter) {
                                newEducation.push({
                                  id: crypto.randomUUID(),
                                  school: aiInter.split(',')[0].trim(),
                                  degree: 'Intermediate / Polytechnic',
                                  year: '2020',
                                  percentage: aiInterPercent,
                                  description: aiInter
                                });
                              }
                              if (aiSchool) {
                                newEducation.push({
                                  id: crypto.randomUUID(),
                                  school: aiSchool.split(',')[0].trim(),
                                  degree: 'High School (SSC)',
                                  year: '2018',
                                  percentage: aiSchoolPercent,
                                  description: aiSchool
                                });
                              }
                              
                              if (newEducation.length > 0) {
                                setEducation([...newEducation, ...education]);
                              } else if (aiEducation) {
                                const newEdu: Education = {
                                  id: crypto.randomUUID(),
                                  school: 'University from AI Generator',
                                  degree: aiEducation,
                                  year: '2024',
                                  description: 'Completed with honors'
                                };
                                setEducation([newEdu, ...education]);
                              }

                              if (aiAchievements) {
                                setAchievements(prev => prev ? prev + "\n" + aiAchievements : aiAchievements);
                              }
                              
                              setActiveTab('preview');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-8 py-4 bg-[#1A1A1A] text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-lg group"
                          >
                            <FileText size={16} className="group-hover:rotate-12 transition-transform" />
                            Go to Preview
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Manual Resume Builder Section */}
                <section id="manual-builder" className="space-y-12 mt-20 pt-12 border-t border-[#E5E5E5] dark:border-zinc-800">
                  <div className="flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                      <User size={16} className="text-[#8E8E8E] dark:text-zinc-500" />
                      <h2 className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">Manual Resume Builder</h2>
                    </div>
                    <button 
                      onClick={() => setIsClearModalOpen(true)}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                      Clear All
                    </button>
                  </div>

                  {/* Personal Information */}
                  <div className="card p-8 border border-[#E5E5E5] dark:border-zinc-800 space-y-8 bg-white dark:bg-zinc-900 shadow-sm transition-all">
                    <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3 dark:text-white">
                      <User size={16} className="text-blue-500" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { label: 'Full Name', name: 'fullName', placeholder: 'John Doe' },
                        { label: 'Job Title', name: 'role', placeholder: 'Software Engineer' },
                        { label: 'Email', name: 'email', placeholder: 'john@example.com' },
                        { label: 'Phone', name: 'phone', placeholder: '+1 234 567 890' },
                        { label: 'LinkedIn', name: 'linkedin', placeholder: 'linkedin.com/in/...' },
                        { label: 'GitHub', name: 'github', placeholder: 'github.com/...' },
                        { label: 'LeetCode', name: 'leetcode', placeholder: 'leetcode.com/...' },
                        { label: 'HackerRank', name: 'hackerrank', placeholder: 'hackerrank.com/...' },
                      ].map(field => (
                        <div key={field.name} className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] dark:text-zinc-500 font-bold">{field.label}</label>
                          <input 
                            name={field.name}
                            value={(formData as any)[field.name]}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            className={cn(
                              "w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 border-transparent focus:border-[#007BFF] outline-none transition-all text-sm dark:text-white",
                              manualErrors[field.name] && "border-red-500 bg-red-50/50 dark:bg-red-500/5 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]"
                            )}
                          />
                          {manualErrors[field.name] && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 uppercase tracking-tight">{manualErrors[field.name]}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <div className="card p-8 border border-[#E5E5E5] dark:border-zinc-800 space-y-4 bg-white dark:bg-zinc-900 shadow-sm transition-all">
                    <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3 dark:text-white">
                      <Sparkles size={16} className="text-amber-500" />
                      Professional Summary
                    </h3>
                    <textarea 
                      name="summary" 
                      value={formData.summary} 
                      onChange={handleInputChange} 
                      placeholder="Write a compelling professional summary..." 
                      className="w-full h-32 bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 border-transparent focus:border-[#007BFF] outline-none transition-all text-sm resize-none dark:text-white" 
                    />
                  </div>

                  {/* Experience Section */}
                  <div className="card p-8 border border-[#E5E5E5] dark:border-zinc-800 space-y-8 bg-white dark:bg-zinc-900 shadow-sm transition-all">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3 dark:text-white">
                        <Briefcase size={16} className="text-blue-500" />
                        Professional Experience
                      </h3>
                      <button type="button" onClick={addExperience} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
                        <Plus size={16} className="text-zinc-600 dark:text-zinc-400" />
                      </button>
                    </div>
                    
                    <div className="space-y-12">
                      {experience.map((exp) => (
                        <motion.div key={exp.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="relative grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-zinc-100 dark:border-zinc-800 rounded-[32px]">
                          <button type="button" onClick={() => removeExperience(exp.id)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">
                            <Trash2 size={14} />
                          </button>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Role</label>
                            <input value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} placeholder="Senior Developer" className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl outline-none text-sm dark:text-white" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Company</label>
                            <input value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Tech Corp" className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl outline-none text-sm dark:text-white" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Duration</label>
                            <input value={exp.duration} onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)} placeholder="2020 - Present" className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl outline-none text-sm dark:text-white" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Responsibilities</label>
                            <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} placeholder="What did you achieve? Use bullet points..." className="w-full h-32 bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl outline-none resize-none text-sm dark:text-white" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Education Section */}
                  <div className="card p-8 border border-[#E5E5E5] dark:border-zinc-800 space-y-8 bg-white dark:bg-zinc-900 shadow-sm transition-all">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3 dark:text-white">
                        <GraduationCap size={16} className="text-blue-500" />
                        Education
                      </h3>
                      <button type="button" onClick={addEducation} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
                        <Plus size={16} className="text-zinc-600 dark:text-zinc-400" />
                      </button>
                    </div>
                    
                    <div className="space-y-12">
                      {education.map((edu) => (
                        <motion.div key={edu.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="relative grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-zinc-100 dark:border-zinc-800 rounded-[32px]">
                          <button type="button" onClick={() => removeEducation(edu.id)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">
                            <Trash2 size={14} />
                          </button>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Degree</label>
                            <input value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="B.Tech Computer Science" className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl outline-none text-sm dark:text-white" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">College / University</label>
                            <input value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} placeholder="MIT / Stanford / etc." className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl outline-none text-sm dark:text-white" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Year</label>
                            <input value={edu.year} onChange={(e) => updateEducation(edu.id, 'year', e.target.value)} placeholder="2024" className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl outline-none text-sm dark:text-white" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Percentage / CGPA</label>
                            <input value={edu.percentage || ''} onChange={(e) => updateEducation(edu.id, 'percentage', e.target.value)} placeholder="8.5 CGPA" className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl outline-none text-sm dark:text-white" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Description</label>
                            <textarea value={edu.description} onChange={(e) => updateEducation(edu.id, 'description', e.target.value)} placeholder="Major subjects, achievements..." className="w-full h-24 bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl outline-none resize-none text-sm dark:text-white" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="card p-8 border border-[#E5E5E5] dark:border-zinc-800 space-y-8 bg-white dark:bg-zinc-900 shadow-sm transition-all">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3 dark:text-white">
                        <Wrench size={16} className="text-blue-500" />
                        Skills Categories
                      </h3>
                      <button type="button" onClick={addSkillCategory} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
                        <Plus size={16} className="text-zinc-600 dark:text-zinc-400" />
                      </button>
                    </div>
                    
                    <div className="space-y-8">
                      {skillCategories.map((category) => (
                        <div key={category.id} className="p-6 border border-zinc-100 dark:border-zinc-800 rounded-[32px] space-y-6">
                          <div className="flex gap-4">
                            <input value={category.name} onChange={(e) => updateSkillCategoryName(category.id, e.target.value)} placeholder="Category (e.g. Frontend)" className="flex-1 bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl outline-none font-bold text-sm dark:text-white" />
                            <button type="button" onClick={() => removeSkillCategory(category.id)} className="p-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all">
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-4 px-2">
                            {category.skills.map(skill => (
                              <div key={skill.id} className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full group">
                                <input value={skill.name} onChange={(e) => updateSkill(category.id, skill.id, 'name', e.target.value)} placeholder="Skill name" className="bg-transparent outline-none text-xs w-24 text-zinc-900 dark:text-white" />
                                <button type="button" onClick={() => removeSkillFromCategory(category.id, skill.id)} className="opacity-0 group-hover:opacity-100 text-red-500 transition-all">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                            <button type="button" onClick={() => addSkillToCategory(category.id)} className="px-4 py-2 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-full text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all">
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projects Section */}
                  <div className="card p-8 border border-[#E5E5E5] dark:border-zinc-800 space-y-8 bg-white dark:bg-zinc-900 shadow-sm transition-all">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3 dark:text-white">
                        <Terminal size={16} className="text-blue-500" />
                        Projects
                      </h3>
                      <button type="button" onClick={addProject} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
                        <Plus size={16} className="text-zinc-600 dark:text-zinc-400" />
                      </button>
                    </div>
                    
                    <div className="space-y-12">
                      {projects.map((proj) => (
                        <motion.div key={proj.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="relative grid grid-cols-1 gap-6 p-6 border border-zinc-100 dark:border-zinc-800 rounded-[32px]">
                          <button type="button" onClick={() => removeProject(proj.id)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">
                            <Trash2 size={14} />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Project Title</label>
                              <input value={proj.title} onChange={(e) => updateProject(proj.id, 'title', e.target.value)} placeholder="E-commerce Platform" className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl outline-none text-sm dark:text-white" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Technologies Used</label>
                              <input value={proj.tech || ''} onChange={(e) => updateProject(proj.id, 'tech', e.target.value)} placeholder="React, Node.js, Tailwind" className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl outline-none text-sm dark:text-white" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Description</label>
                            <textarea value={proj.description} onChange={(e) => updateProject(proj.id, 'description', e.target.value)} placeholder="What did you build? Tools used?" className="w-full h-32 bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl outline-none resize-none text-sm dark:text-white" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications Section */}
                  <div className="card p-8 border border-[#E5E5E5] dark:border-zinc-800 space-y-8 bg-white dark:bg-zinc-900 shadow-sm transition-all">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3 dark:text-white">
                        <CheckCircle2 size={16} className="text-blue-500" />
                        Certifications
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <textarea 
                        value={certificates.join('\n')}
                        onChange={(e) => setCertificates(e.target.value.split('\n'))}
                        placeholder="AWS Certified Solutions Architect&#10;Google Cloud Professional Developer"
                        className="w-full h-32 bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl border-b-2 border-transparent focus:border-[#007BFF] outline-none transition-all text-sm resize-none dark:text-white"
                      />
                      <p className="text-[10px] text-zinc-400 font-mono text-center">Enter one certification per line</p>
                    </div>
                  </div>

                  {/* Custom Sections */}
                  {customSections.map((section) => (
                    <div key={section.id} className="card p-8 border border-[#E5E5E5] dark:border-zinc-800 space-y-8 bg-white dark:bg-zinc-900 shadow-sm transition-all">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3 dark:text-white">
                          <Layers size={16} className="text-purple-500" />
                          {section.title || "Custom Section"}
                        </h3>
                        <button type="button" onClick={() => removeCustomSection(section.id)} className="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Section Title</label>
                          <input value={section.title} onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)} placeholder="E.g. Languages" className="w-full bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl outline-none text-sm dark:text-white" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E] font-bold">Content</label>
                          <textarea value={section.content} onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)} placeholder="Details..." className="w-full h-32 bg-[#F5F5F4] dark:bg-zinc-800 p-4 rounded-2xl outline-none resize-none text-sm dark:text-white" />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col items-center gap-8 py-12">
                    <button
                      type="button"
                      onClick={addCustomSection}
                      className="px-6 py-3 bg-[#F5F5F4] dark:bg-zinc-800 text-[#1A1A1A] dark:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#E5E5E5] dark:hover:bg-zinc-700 transition-all flex items-center gap-2"
                    >
                      <Plus size={14} />
                      Add Custom Section
                    </button>

                    <button 
                      onClick={() => {
                        if (validateManualForm()) {
                          setActiveTab('preview');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="px-10 py-5 bg-black dark:bg-white text-white dark:text-[#1A1A1A] rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 group"
                    >
                      <Download size={18} className="group-hover:translate-y-1 transition-transform" />
                      Generate & Download Resume
                    </button>
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
                      disabled={!formData.fullName || !formData.email}
                      onClick={handleGenerate}
                      className="flex-1 py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                      Generate Resume
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
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => setActiveTab('edit')}
                      className="flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                    >
                      <ChevronLeft size={16} />
                      Back to Edit
                    </button>
                    <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700" />
                    <div className="flex items-center gap-4">
                      <Layers size={20} className="text-[#1A1A1A] dark:text-white" />
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest dark:text-white">Choose Template</h3>
                        <p className="text-[10px] text-[#8E8E8E] dark:text-zinc-500 font-mono uppercase tracking-widest">Toggle Styles</p>
                      </div>
                    </div>
                  </div>
                  <select 
                    id="templateSelect"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="bg-[#F5F5F4] dark:bg-zinc-800 dark:text-white border-none outline-none px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-[#E5E5E5] dark:hover:bg-zinc-700 transition-all"
                  >
                    <option value="professional">Professional</option>
                    <option value="modern">Modern</option>
                    <option value="minimal">Minimal</option>
                    <option value="creative">Creative</option>
                    <option value="corporate">Corporate</option>
                    <option value="elegant">Elegant</option>
                    <option value="sidebar">Sidebar</option>
                  </select>
                  <button 
                    onClick={exportToPDF}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-lg disabled:opacity-50"
                  >
                    {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                    {isExporting ? "Generating..." : "Download PDF"}
                  </button>
                </div>

                {/* Resume Preview Container */}
                <div 
                  id="resume"
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
                    {/* Modular Template Rendering */}
                    {selectedTemplate === 'modern' ? (
                      <div className="space-y-8">
                        <header className="text-center border-b-2 border-zinc-100 pb-8">
                          <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">
                            {(previewData || formData).fullName || "Your Name"}
                          </h1>
                          <p className="text-blue-600 font-semibold mb-3">{(previewData || formData).role}</p>
                          <div className="text-[10px] text-zinc-500 font-medium flex flex-wrap justify-center gap-4 uppercase tracking-widest">
                            <span>{(previewData || formData).phone}</span>
                            <span>{(previewData || formData).email}</span>
                            { (previewData || formData).linkedin && <span>LinkedIn: {(previewData || formData).linkedin}</span> }
                            { (previewData || formData).github && <span>GitHub: {(previewData || formData).github}</span> }
                          </div>
                        </header>

                        {(previewData || formData).summary && (
                          <section>
                            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3 border-l-4 border-blue-600 pl-3">Summary</h2>
                            <p className="text-sm leading-relaxed text-zinc-700">{(previewData || formData).summary}</p>
                          </section>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {experience.length > 0 && (
                            <section className="space-y-4">
                              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-l-4 border-blue-600 pl-3">Experience</h2>
                              {experience.map(exp => (
                                <div key={exp.id} className="space-y-1">
                                  <h3 className="text-sm font-bold text-zinc-900">{exp.role}</h3>
                                  <p className="text-[10px] text-zinc-500 font-bold uppercase">{exp.company} | {exp.duration}</p>
                                  <p className="text-xs text-zinc-600 line-clamp-3">{exp.description}</p>
                                </div>
                              ))}
                            </section>
                          )}

                          <div className="space-y-8">
                            <section className="space-y-4">
                              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-l-4 border-blue-600 pl-3">Skills</h2>
                              <div className="flex flex-wrap gap-2">
                                {skillCategories.flatMap(c => c.skills).map(s => (
                                  <span key={s.id} className="bg-zinc-100 text-[10px] px-3 py-1 rounded-full font-medium text-zinc-700">{s.name}</span>
                                ))}
                              </div>
                            </section>

                            {education.length > 0 && (
                              <section className="space-y-4">
                                <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-l-4 border-blue-600 pl-3">Education</h2>
                                {education.map(edu => (
                                  <div key={edu.id}>
                                    <h3 className="text-sm font-bold">{edu.degree}</h3>
                                    <p className="text-xs text-zinc-500">{edu.school} ({edu.year})</p>
                                  </div>
                                ))}
                              </section>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : selectedTemplate === 'minimal' ? (
                      <div className="space-y-6 font-serif">
                        <header>
                          <h1 className="text-2xl font-bold text-zinc-900">{(previewData || formData).fullName || "Your Name"}</h1>
                          <p className="text-zinc-500 text-sm italic">{(previewData || formData).role}</p>
                          <div className="text-xs text-zinc-400 mt-2">
                            {(previewData || formData).email} • {(previewData || formData).phone}
                          </div>
                        </header>

                        <section className="space-y-2">
                          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b pb-1">Skills</h2>
                          <p className="text-sm text-zinc-700 leading-relaxed">
                            {skillCategories.flatMap(c => c.skills.map(s => s.name)).join(", ")}
                          </p>
                        </section>

                        <section className="space-y-4">
                          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b pb-1">Experience</h2>
                          {experience.map(exp => (
                            <div key={exp.id} className="flex justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-sm font-bold">{exp.role}</h3>
                                <p className="text-xs text-zinc-500 italic">{exp.company}</p>
                                <p className="text-xs text-zinc-600 mt-1">{exp.description}</p>
                              </div>
                              <span className="text-[10px] whitespace-nowrap text-zinc-400">{exp.duration}</span>
                            </div>
                          ))}
                        </section>

                        <section className="space-y-2">
                          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b pb-1">Education</h2>
                          {education.map(edu => (
                            <div key={edu.id} className="flex justify-between text-sm">
                              <span><strong>{edu.degree}</strong>, {edu.school}</span>
                              <span className="text-zinc-400 font-mono text-xs">{edu.year}</span>
                            </div>
                          ))}
                        </section>
                      </div>
                    ) : (
                      /* Default / Professional Layout (Legacy) */
                      <>
                        <header className="flex items-center gap-6 mb-[15px]">
                          {profilePhoto && (
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#ddd] flex-shrink-0">
                              <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className={cn("flex-1")}>
                            <div className={cn("flex flex-col gap-1", !profilePhoto && "items-center text-center")}>
                              <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-2xl font-bold uppercase tracking-tight leading-none"
                              >
                                {(previewData || formData).fullName || "Your Name"}
                              </motion.h1>
                              {((previewData || formData).role) && (
                                <p className="text-[#1A1A1A] font-medium text-sm">{(previewData || formData).role}</p>
                              )}
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-[10px] text-[#8E8E8E] font-medium flex flex-wrap gap-x-3 gap-y-1 justify-center md:justify-start"
                              >
                                <span>{(previewData || formData).phone}</span>
                                <span>{(previewData || formData).email}</span>
                                { (previewData || formData).linkedin && <span>LinkedIn: {(previewData || formData).linkedin}</span> }
                                { (previewData || formData).github && <span>GitHub: {(previewData || formData).github}</span> }
                                { (previewData || formData).leetcode && <span>LeetCode: {(previewData || formData).leetcode}</span> }
                                { (previewData || formData).hackerrank && <span>HackerRank: {(previewData || formData).hackerrank}</span> }
                              </motion.div>
                            </div>
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
                                    <div className="flex justify-between items-baseline mb-[2px]">
                                      <h3 className="text-[13px] font-bold">{proj.title}</h3>
                                      {proj.tech && <span className="text-[10px] text-[#8E8E8E] font-mono">{proj.tech}</span>}
                                    </div>
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
                              <h2 className="text-[14px] font-bold border-b-2 border-[#ddd] pb-[2px] mb-[4px] uppercase tracking-tight">CERTIFICATIONS & ACHIEVEMENTS</h2>
                              <ul className="list-disc ml-[20px] space-y-[1px]">
                                {certificates.map((cert, idx) => (
                                  <li key={idx} className="text-[#333] text-[12px] font-medium">{cert}</li>
                                ))}
                                {achievements && achievements.split('. ').filter(b => b.trim().length > 0).map((bullet, idx) => (
                                  <li key={`ach-${idx}`} className="text-[#333] text-[12px]">{bullet}</li>
                                ))}
                              </ul>
                            </section>
                          )}

                          <section>
                            <h2 className="text-[14px] font-bold border-b-2 border-[#ddd] pb-[2px] mb-[4px] uppercase tracking-tight">SKILLS</h2>
                            <div className="grid grid-cols-2 gap-[4px]">
                              {skillCategories.map((cat) => (
                                <div key={cat.id} className="text-[12px]">
                                  <strong>{cat.name}:</strong> <span className="text-[#444]">{cat.skills.map(s => s.name).join(", ")}</span>
                                </div>
                              ))}
                            </div>
                          </section>

                          {/* Education Section */}
                          <section>
                            <h2 className="text-[14px] font-bold border-b-2 border-[#ddd] pb-[2px] mb-[4px] uppercase tracking-tight">EDUCATION</h2>
                            <div className="space-y-[8px]">
                              {education.map((edu) => (
                                <div key={edu.id} className="flex justify-between items-start">
                                  <div className="text-[12px]">
                                    <strong className="text-[13px]">{edu.degree}</strong>
                                    {edu.percentage && (
                                      <span className="ml-2 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[10px] font-bold text-[#1A1A1A] dark:text-white">
                                        {edu.percentage}
                                      </span>
                                    )}
                                    <br />
                                    <span className="text-[#555] italic">{edu.school}</span>
                                  </div>
                                  <div className="text-right text-[11px] text-[#888] font-mono">{edu.year}</div>
                                </div>
                              ))}
                            </div>
                          </section>

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
                      </>
                    )}
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
