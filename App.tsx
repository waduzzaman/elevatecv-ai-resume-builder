
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Settings, 
  Layout, 
  Download, 
  Plus, 
  Trash2, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  FileText,
  Eye,
  Trophy,
  CreditCard,
  ShieldCheck,
  Star,
  Lock,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { ResumeData, Section, Experience, Education, Skill, TemplateType } from './types';
import { Button } from './components/ui/Button';
import { Input, TextArea } from './components/ui/Input';
import { generateSummary, enhanceBulletPoint, suggestSkills } from './services/gemini';
import { exportToDocx } from './services/docx-export';

const INITIAL_DATA: ResumeData = {
  contact: {
    fullName: 'Alexander Sterling',
    email: 'a.sterling@exec.com',
    phone: '+1 415 555 0123',
    location: 'San Francisco, CA',
    website: 'sterling.design',
    linkedin: 'linkedin.com/in/alexsterling',
  },
  summary: 'Strategic technology leader with 10+ years of experience in architecting high-performance distributed systems. Proven track record of scaling engineering teams from 5 to 50 while maintaining agile excellence and product-market fit.',
  experiences: [
    {
      id: '1',
      company: 'Quantum Systems',
      position: 'VP of Engineering',
      startDate: '2021-06',
      endDate: 'Present',
      description: 'Overseeing the technical roadmap for the core cloud infrastructure.',
      highlights: [
        'Reduced infrastructure costs by 35% through strategic migration to serverless architecture.',
        'Implemented AI-driven code review processes that increased deployment velocity by 50%.',
      ]
    }
  ],
  education: [
    {
      id: '1',
      school: 'Stanford University',
      degree: 'Master of Science',
      fieldOfStudy: 'Computer Science',
      graduationDate: '2019-05',
    }
  ],
  skills: [
    { id: '1', name: 'Strategic Planning', level: 'Expert' },
    { id: '2', name: 'Cloud Architecture', level: 'Expert' },
    { id: '3', name: 'Team Leadership', level: 'Expert' },
  ],
  template: 'classic'
};

const App: React.FC = () => {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [activeSection, setActiveSection] = useState<Section>('contact');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [pendingExport, setPendingExport] = useState<'pdf' | 'docx' | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('resume-data-v4');
    const paidStatus = localStorage.getItem('has-paid');
    if (saved) setData(JSON.parse(saved));
    if (paidStatus === 'true') setHasPaid(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('resume-data-v4', JSON.stringify(data));
  }, [data]);

  const updateContact = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handleExportClick = (type: 'pdf' | 'docx') => {
    if (!hasPaid) {
      setPendingExport(type);
      setShowPaymentModal(true);
    } else {
      if (type === 'pdf') window.print();
      else exportToDocx(data);
    }
  };

  const processPayment = () => {
    setHasPaid(true);
    localStorage.setItem('has-paid', 'true');
    setShowPaymentModal(false);
    if (pendingExport === 'pdf') window.print();
    if (pendingExport === 'docx') exportToDocx(data);
  };

  const sections: { id: Section; label: string; icon: any }[] = [
    { id: 'contact', label: 'Contact Info', icon: User },
    { id: 'summary', label: 'Profile Summary', icon: Layout },
    { id: 'experience', label: 'Work History', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Expertise & Skills', icon: Settings },
  ];

  const templates: { id: TemplateType; label: string }[] = [
    { id: 'standard', label: 'Standard' },
    { id: 'classic', label: 'Executive' },
    { id: 'modern', label: 'Modern' },
    { id: 'minimal', label: 'Minimalist' },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Navigation Sidebar */}
      <nav className="w-20 lg:w-72 bg-slate-900 h-screen sticky top-0 flex flex-col p-4 lg:p-6 no-print z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="hidden lg:block text-white font-bold text-xl tracking-tight">ElevateCV</span>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`w-full flex items-center gap-4 px-3 py-3.5 rounded-xl transition-all group ${
                activeSection === sec.id 
                  ? 'bg-white/10 text-white border border-white/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <sec.icon className={`w-5 h-5 ${activeSection === sec.id ? 'text-indigo-400' : 'group-hover:text-indigo-400'}`} />
              <span className="hidden lg:block font-semibold text-sm">{sec.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 space-y-3">
          <div className="group relative">
            <Button className="w-full lg:gap-2 justify-center py-6" variant="ai">
              <Download size={18} /> <span className="hidden lg:inline">Download</span>
            </Button>
            <div className="absolute bottom-full left-0 w-full bg-white rounded-xl shadow-xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all mb-2 z-50 overflow-hidden">
               <button onClick={() => handleExportClick('pdf')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-semibold text-slate-700 border-b border-slate-100 flex justify-between items-center">
                 PDF Document {!hasPaid && <Lock size={12} className="text-slate-400" />}
               </button>
               <button onClick={() => handleExportClick('docx')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-semibold text-slate-700 flex justify-between items-center">
                 Word (.docx) {!hasPaid && <Lock size={12} className="text-slate-400" />}
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Editor */}
      <main className="flex-1 flex flex-col no-print h-screen overflow-hidden">
        <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">{sections.find(s => s.id === activeSection)?.label}</h2>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex bg-slate-100 p-1 rounded-lg border border-slate-200">
               {templates.map(t => (
                 <button 
                   key={t.id}
                   onClick={() => setData(prev => ({...prev, template: t.id}))}
                   className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${data.template === t.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   {t.label}
                 </button>
               ))}
             </div>
             <button className="lg:hidden p-2 text-slate-500" onClick={() => setShowPreviewMobile(true)}>
               <Eye size={20} />
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10">
          <div className="max-w-3xl mx-auto pb-20">
            {activeSection === 'contact' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <Input label="Full Name" value={data.contact.fullName} onChange={e => updateContact('fullName', e.target.value)} placeholder="John Doe" />
                  <Input label="Email" type="email" value={data.contact.email} onChange={e => updateContact('email', e.target.value)} placeholder="john@example.com" />
                  <Input label="Phone" value={data.contact.phone} onChange={e => updateContact('phone', e.target.value)} placeholder="+1 234 567 890" />
                  <Input label="Location" value={data.contact.location} onChange={e => updateContact('location', e.target.value)} placeholder="City, State" />
                  <Input label="LinkedIn" value={data.contact.linkedin} onChange={e => updateContact('linkedin', e.target.value)} placeholder="linkedin.com/in/username" />
                  <Input label="Portfolio / Website" value={data.contact.website} onChange={e => updateContact('website', e.target.value)} placeholder="yourwebsite.com" />
                </div>
              </div>
            )}

            {activeSection === 'summary' && (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-800 uppercase tracking-widest">Executive Profile</span>
                  <Button size="sm" variant="ai" onClick={async () => {
                    setIsGenerating(true);
                    const res = await generateSummary(data.experiences[0]?.position || "Professional", "several", data.skills.map(s => s.name));
                    setData(prev => ({ ...prev, summary: res }));
                    setIsGenerating(false);
                  }} isLoading={isGenerating}>
                    <Sparkles size={14} /> AI Rewrite
                  </Button>
                </div>
                <TextArea 
                  className="h-48" 
                  label="Biography"
                  value={data.summary} 
                  onChange={e => setData(prev => ({ ...prev, summary: e.target.value }))} 
                  placeholder="Describe your professional career in 3-4 sentences..."
                />
              </div>
            )}

            {activeSection === 'experience' && (
              <div className="space-y-6">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative group animate-in slide-in-from-bottom-2">
                    <button 
                      onClick={() => setData(prev => ({ ...prev, experiences: prev.experiences.filter(e => e.id !== exp.id) }))} 
                      className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <Input label="Job Title" value={exp.position} onChange={e => setData(prev => ({...prev, experiences: prev.experiences.map(ex => ex.id === exp.id ? {...ex, position: e.target.value} : ex)}))} />
                      <Input label="Company" value={exp.company} onChange={e => setData(prev => ({...prev, experiences: prev.experiences.map(ex => ex.id === exp.id ? {...ex, company: e.target.value} : ex)}))} />
                      <Input label="Start Date" type="month" value={exp.startDate} onChange={e => setData(prev => ({...prev, experiences: prev.experiences.map(ex => ex.id === exp.id ? {...ex, startDate: e.target.value} : ex)}))} />
                      <Input label="End Date" type="month" value={exp.endDate} onChange={e => setData(prev => ({...prev, experiences: prev.experiences.map(ex => ex.id === exp.id ? {...ex, endDate: e.target.value} : ex)}))} placeholder="Leave blank for Present" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Key Accomplishments</label>
                      {exp.highlights.map((h, i) => (
                        <div key={i} className="flex gap-3">
                          <Input value={h} onChange={e => {
                            const newH = [...exp.highlights];
                            newH[i] = e.target.value;
                            setData(prev => ({...prev, experiences: prev.experiences.map(ex => ex.id === exp.id ? {...ex, highlights: newH} : ex)}));
                          }} placeholder="e.g. Optimized database queries by 40%..." />
                          <Button size="sm" variant="secondary" className="h-11 px-3" onClick={async () => {
                            setIsGenerating(true);
                            const enhanced = await enhanceBulletPoint(h, exp.position);
                            const newH = [...exp.highlights];
                            newH[i] = enhanced;
                            setData(prev => ({...prev, experiences: prev.experiences.map(ex => ex.id === exp.id ? {...ex, highlights: newH} : ex)}));
                            setIsGenerating(false);
                          }} isLoading={isGenerating}>
                            <Sparkles size={14} />
                          </Button>
                          <button 
                            onClick={() => {
                              const newH = exp.highlights.filter((_, idx) => idx !== i);
                              setData(prev => ({...prev, experiences: prev.experiences.map(ex => ex.id === exp.id ? {...ex, highlights: newH} : ex)}));
                            }}
                            className="text-slate-300 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => setData(prev => ({...prev, experiences: prev.experiences.map(ex => ex.id === exp.id ? {...ex, highlights: [...ex.highlights, '']} : ex)}))} 
                        className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        <Plus size={14} /> Add Bullet Point
                      </button>
                    </div>
                  </div>
                ))}
                <Button variant="secondary" className="w-full h-20 border-dashed border-2 flex flex-col gap-1" onClick={() => setData(prev => ({...prev, experiences: [...prev.experiences, { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', highlights: [''], description: '' }] }))}>
                  <div className="flex items-center gap-2 text-slate-600 font-bold"><Plus size={18} /> Add Employment History</div>
                  <div className="text-[10px] text-slate-400 font-medium">Include roles from the last 10 years</div>
                </Button>
              </div>
            )}

            {activeSection === 'education' && (
              <div className="space-y-6">
                {data.education.map(edu => (
                  <div key={edu.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative group animate-in slide-in-from-bottom-2">
                    <button 
                      onClick={() => setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== edu.id) }))} 
                      className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Institution / School" value={edu.school} onChange={e => setData(prev => ({...prev, education: prev.education.map(ed => ed.id === edu.id ? {...ed, school: e.target.value} : ed)}))} placeholder="e.g. University of California" />
                      <Input label="Degree" value={edu.degree} onChange={e => setData(prev => ({...prev, education: prev.education.map(ed => ed.id === edu.id ? {...ed, degree: e.target.value} : ed)}))} placeholder="e.g. B.S. or M.A." />
                      <Input label="Field of Study" value={edu.fieldOfStudy} onChange={e => setData(prev => ({...prev, education: prev.education.map(ed => ed.id === edu.id ? {...ed, fieldOfStudy: e.target.value} : ed)}))} placeholder="e.g. Computer Science" />
                      <Input label="Graduation Date" type="month" value={edu.graduationDate} onChange={e => setData(prev => ({...prev, education: prev.education.map(ed => ed.id === edu.id ? {...ed, graduationDate: e.target.value} : ed)}))} />
                    </div>
                  </div>
                ))}
                <Button variant="secondary" className="w-full h-20 border-dashed border-2 flex flex-col gap-1" onClick={() => setData(prev => ({...prev, education: [...prev.education, { id: Date.now().toString(), school: '', degree: '', fieldOfStudy: '', graduationDate: '' }] }))}>
                   <div className="flex items-center gap-2 text-slate-600 font-bold"><Plus size={18} /> Add Academic Credential</div>
                   <div className="text-[10px] text-slate-400 font-medium">Add degrees, certifications, or workshops</div>
                </Button>
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Trophy className="text-indigo-500" size={20} />
                    <span className="text-sm font-bold text-slate-800 uppercase tracking-widest">Skill Inventory</span>
                  </div>
                  <Button size="sm" variant="ai" onClick={async () => {
                    setIsGenerating(true);
                    const suggested = await suggestSkills(data.experiences[0]?.position || "Professional");
                    const newSkills: Skill[] = suggested.map((s: string) => ({ id: Math.random().toString(), name: s, level: 'None' }));
                    setData(prev => ({ ...prev, skills: [...prev.skills, ...newSkills] }));
                    setIsGenerating(false);
                  }} isLoading={isGenerating}>
                    <Sparkles size={14} className="mr-2" /> Suggest with AI
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.skills.map((skill) => (
                    <div key={skill.id} className="flex flex-col gap-2 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-200 transition-all group">
                      <div className="flex justify-between items-start">
                        <Input 
                          value={skill.name} 
                          className="bg-transparent border-none p-0 h-auto font-bold text-slate-700 shadow-none focus-visible:ring-0" 
                          onChange={e => setData(prev => ({
                            ...prev, 
                            skills: prev.skills.map(s => s.id === skill.id ? { ...s, name: e.target.value } : s)
                          }))}
                        />
                        <button 
                          onClick={() => setData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== skill.id) }))} 
                          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <select 
                        value={skill.level}
                        onChange={e => setData(prev => ({
                          ...prev,
                          skills: prev.skills.map(s => s.id === skill.id ? {...s, level: e.target.value as any} : s)
                        }))}
                        className="text-[10px] font-bold text-slate-500 bg-transparent border-none outline-none appearance-none cursor-pointer uppercase tracking-wider"
                      >
                        <option value="None">Level: Unset</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  ))}
                  <button 
                    onClick={() => setData(prev => ({ ...prev, skills: [...prev.skills, { id: Date.now().toString(), name: '', level: 'None' }] }))}
                    className="flex flex-col items-center justify-center p-4 h-24 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-400 transition-all"
                  >
                    <Plus size={20} />
                    <span className="text-[11px] font-bold uppercase mt-1">Add Skill</span>
                  </button>
                </div>
              </div>
            )}
            
            <footer className="mt-12 flex justify-between pt-8 border-t border-slate-200">
              <Button variant="ghost" onClick={() => {
                const idx = sections.findIndex(s => s.id === activeSection);
                if (idx > 0) setActiveSection(sections[idx-1].id);
              }} disabled={activeSection === 'contact'}><ChevronLeft size={18} className="mr-2" /> Previous Step</Button>
              <Button onClick={() => {
                const idx = sections.findIndex(s => s.id === activeSection);
                if (idx < sections.length - 1) setActiveSection(sections[idx+1].id);
              }} disabled={activeSection === 'skills'}>Continue <ChevronRight size={18} className="ml-2" /></Button>
            </footer>
          </div>
        </div>
      </main>

      {/* Preview Pane */}
      <aside className={`fixed inset-0 lg:static lg:block flex-1 bg-slate-200/50 h-screen overflow-y-auto z-[60] lg:z-10 no-print transition-transform duration-300 ${showPreviewMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 lg:p-12 xl:p-20">
          <div className="lg:hidden flex justify-end mb-4">
            <Button variant="secondary" onClick={() => setShowPreviewMobile(false)}>Close Editor</Button>
          </div>
          <div className="max-w-[800px] mx-auto shadow-2xl ring-1 ring-slate-900/5 rounded-sm overflow-hidden bg-white">
            <ResumePreview data={data} />
          </div>
        </div>
      </aside>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8 text-center bg-indigo-50 border-b border-indigo-100">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-indigo-100">
                <ShieldCheck className="text-indigo-600 w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Export Premium Resume</h3>
              <p className="text-slate-500 mt-2 font-medium">One-time payment for lifetime unlimited exports in all formats.</p>
            </div>
            <div className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl">
                  <CheckCircle2 className="text-green-500" size={18} /> No Subscriptions, Pay Once
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl">
                  <CheckCircle2 className="text-green-500" size={18} /> High-Resolution PDF & Native DOCX
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl">
                  <CheckCircle2 className="text-green-500" size={18} /> AI Assistant Priority Access
                </div>
              </div>
              
              <div className="bg-slate-900 rounded-2xl p-6 mb-8 text-white shadow-xl shadow-indigo-900/10">
                 <div className="flex justify-between items-center mb-6">
                   <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Premium Bundle</span>
                   <span className="text-3xl font-black">$19.99</span>
                 </div>
                 <div className="space-y-3">
                   <div className="flex bg-white/10 rounded-xl border border-white/10 p-4 items-center gap-3 group focus-within:border-white/20">
                     <CreditCard size={18} className="text-slate-400" />
                     <span className="text-sm font-medium text-slate-300">Secure Payment Gateway</span>
                   </div>
                 </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowPaymentModal(false)}>Keep Free Preview</Button>
                <Button variant="ai" className="flex-[2] py-6 text-base" onClick={processPayment}>Unlock & Export Now</Button>
              </div>
              <p className="text-center text-[10px] text-slate-400 mt-6 font-bold uppercase tracking-widest">Powered by Stripe Connect</p>
            </div>
          </div>
        </div>
      )}

      {/* Print Only Version */}
      <div className="hidden print-only fixed inset-0 bg-white z-[9999] p-0 m-0">
        <div className="w-[210mm] mx-auto bg-white p-0 m-0">
          <ResumePreview data={data} isPrint />
        </div>
      </div>
    </div>
  );
};

const ResumePreview: React.FC<{ data: ResumeData, isPrint?: boolean }> = ({ data, isPrint }) => {
  const template = data.template;

  if (template === 'standard') {
    return (
      <div className={`bg-white text-slate-800 ${isPrint ? 'p-0 w-full' : 'p-12 md:p-16 min-h-[1123px] flex flex-col'}`}>
        <div className="border-b-2 border-slate-800 pb-6 mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase">{data.contact.fullName || 'YOUR FULL NAME'}</h1>
          <div className="flex flex-wrap gap-x-4 text-sm font-medium">
            {data.contact.email && <span>{data.contact.email}</span>}
            {data.contact.phone && <span>| {data.contact.phone}</span>}
            {data.contact.location && <span>| {data.contact.location}</span>}
            {data.contact.linkedin && <span>| {data.contact.linkedin}</span>}
          </div>
        </div>
        <div className="space-y-8">
           {data.summary && (
             <section>
               <h2 className="text-lg font-bold border-b border-slate-200 mb-2 uppercase tracking-wide">Professional Profile</h2>
               <p className="text-[14px] leading-relaxed opacity-90">{data.summary}</p>
             </section>
           )}
           {data.experiences.length > 0 && (
             <section>
               <h2 className="text-lg font-bold border-b border-slate-200 mb-4 uppercase tracking-wide">Employment History</h2>
               {data.experiences.map(exp => (
                 <div key={exp.id} className="mb-6">
                   <div className="flex justify-between font-bold text-sm">
                     <span>{exp.position}</span>
                     <span className="tabular-nums uppercase">{exp.startDate} — {exp.endDate || 'Present'}</span>
                   </div>
                   <div className="italic text-sm text-slate-600 mb-2">{exp.company}</div>
                   <ul className="list-disc ml-5 text-[13.5px] space-y-1.5 opacity-85">
                     {exp.highlights.filter(h => h.trim() !== '').map((h, i) => <li key={i}>{h}</li>)}
                   </ul>
                 </div>
               ))}
             </section>
           )}
           <div className="grid grid-cols-2 gap-8">
             {data.education.length > 0 && (
               <section>
                 <h2 className="text-lg font-bold border-b border-slate-200 mb-3 uppercase tracking-wide">Education</h2>
                 {data.education.map(edu => (
                   <div key={edu.id} className="mb-4">
                     <div className="flex justify-between text-[13.5px] font-bold">
                       <span>{edu.school}</span>
                       <span className="text-[11px] text-slate-500 uppercase">{edu.graduationDate}</span>
                     </div>
                     <p className="text-[12px] text-slate-600 italic">{edu.degree} in {edu.fieldOfStudy}</p>
                   </div>
                 ))}
               </section>
             )}
             {data.skills.length > 0 && (
               <section>
                 <h2 className="text-lg font-bold border-b border-slate-200 mb-3 uppercase tracking-wide">Expertise</h2>
                 <p className="text-[13.5px] leading-relaxed font-medium text-slate-700">
                   {data.skills.map(s => s.name).join(", ")}
                 </p>
               </section>
             )}
           </div>
        </div>
      </div>
    );
  }

  if (template === 'minimal') {
    return (
      <div className={`bg-white text-slate-900 ${isPrint ? 'p-0 w-full' : 'p-20 min-h-[1123px] flex flex-col'}`}>
        <header className="mb-16">
          <h1 className="text-5xl font-light tracking-tighter mb-4 text-slate-950">{data.contact.fullName || 'NAME'}</h1>
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-indigo-500" />
            <p className="text-indigo-600 font-black tracking-widest text-[10px] uppercase">
              {data.experiences[0]?.position || 'PROFESSIONAL'}
            </p>
          </div>
        </header>
        <div className="grid grid-cols-4 gap-12">
          <div className="col-span-1 space-y-12">
             <div className="space-y-6">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Connection</h3>
               <div className="text-[11px] space-y-3 font-bold text-slate-600 leading-tight">
                 <p className="break-all">{data.contact.email}</p>
                 <p>{data.contact.phone}</p>
                 <p>{data.contact.location}</p>
                 <p className="text-indigo-600 break-all">{data.contact.website}</p>
               </div>
             </div>
             <div className="space-y-6">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Competencies</h3>
               <div className="flex flex-col gap-2.5 text-[11px] font-black text-slate-800 uppercase tracking-wider">
                 {data.skills.map(s => <span key={s.id}>{s.name}</span>)}
               </div>
             </div>
          </div>
          <div className="col-span-3 space-y-12">
             <section>
               <p className="text-[17px] font-medium leading-relaxed text-slate-700">{data.summary}</p>
             </section>
             <section className="space-y-12">
               <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.3em]">Trajectory</h3>
               {data.experiences.map(exp => (
                 <div key={exp.id} className="relative">
                   <h3 className="text-xl font-black mb-1 text-slate-900">{exp.position}</h3>
                   <div className="flex justify-between items-center mb-6">
                     <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest">{exp.company}</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{exp.startDate} – {exp.endDate || 'Now'}</p>
                   </div>
                   <ul className="space-y-4 text-[14px] leading-relaxed font-medium text-slate-600">
                     {exp.highlights.map((h, i) => (
                       <li key={i} className="flex gap-3">
                         <span className="text-indigo-300 font-black">/</span>
                         <span>{h}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               ))}
             </section>
          </div>
        </div>
      </div>
    );
  }

  const isClassic = template === 'classic';
  return (
    <div className={`bg-white transition-all duration-500 ${isPrint ? 'p-0 w-full' : 'p-12 md:p-16 min-h-[1123px] flex flex-col'}`}>
      <div className={isClassic ? "resume-serif" : "font-sans"}>
        <div className="text-center mb-12 border-b-2 border-slate-900 pb-10">
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900">{data.contact.fullName || 'NAME'}</h1>
          <div className="flex justify-center flex-wrap gap-4 mt-4 text-[13px] font-bold text-slate-500">
             <span>{data.contact.email?.toUpperCase()}</span>
             <span>|</span>
             <span>{data.contact.phone}</span>
             <span>|</span>
             <span>{data.contact.location?.toUpperCase()}</span>
          </div>
        </div>
        <div className="space-y-12">
          {data.summary && (
            <section>
              <h2 className="font-black text-sm border-b-2 border-slate-900 uppercase tracking-[0.2em] mb-4 text-slate-900">Objective</h2>
              <p className="text-[14.5px] leading-relaxed italic text-slate-800">{data.summary}</p>
            </section>
          )}
          <section>
            <h2 className="font-black text-sm border-b-2 border-slate-900 uppercase tracking-[0.2em] mb-6 text-slate-900">Experience</h2>
            <div className="space-y-10">
              {data.experiences.map(exp => (
                <div key={exp.id}>
                   <div className="flex justify-between font-black text-lg text-slate-900">
                     <span>{exp.position}</span>
                     <span className="text-sm uppercase tracking-wider">{exp.startDate} - {exp.endDate || 'Now'}</span>
                   </div>
                   <div className="text-indigo-700 text-xs font-black uppercase tracking-widest mb-3">{exp.company}</div>
                   <ul className="list-disc ml-5 text-[14px] leading-relaxed space-y-2 text-slate-800">
                     {exp.highlights.filter(h => h.trim() !== '').map((h, i) => <li key={i}>{h}</li>)}
                   </ul>
                </div>
              ))}
            </div>
          </section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {data.education.length > 0 && (
               <section>
                 <h2 className="font-black text-sm border-b-2 border-slate-900 uppercase tracking-[0.2em] mb-4 text-slate-900">Academic</h2>
                 <div className="space-y-6">
                   {data.education.map(edu => (
                     <div key={edu.id}>
                       <h3 className="font-black text-slate-900 text-sm mb-1">{edu.school}</h3>
                       <p className="text-[13px] font-bold text-slate-600 italic">{edu.degree} / {edu.fieldOfStudy}</p>
                       <p className="text-[11px] font-black text-slate-400 mt-1 uppercase tracking-wider">{edu.graduationDate}</p>
                     </div>
                   ))}
                 </div>
               </section>
             )}
             {data.skills.length > 0 && (
               <section>
                 <h2 className="font-black text-sm border-b-2 border-slate-900 uppercase tracking-[0.2em] mb-4 text-slate-900">Inventory</h2>
                 <div className="flex flex-wrap gap-2">
                   {data.skills.map(s => (
                     <span key={s.id} className="bg-slate-50 border border-slate-200 text-[11px] font-black text-slate-700 px-2.5 py-1 uppercase tracking-wide rounded">
                       {s.name}
                     </span>
                   ))}
                 </div>
               </section>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
