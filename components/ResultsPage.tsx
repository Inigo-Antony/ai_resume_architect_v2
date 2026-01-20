import React from 'react';
import type { AnalysisResult, EditingField, StructuredResume, StructuredCoverLetter, Experience, Education, SkillSet } from '../types';
import { DownloadIcon, WandIcon, LightbulbIcon } from '../constants';
import ScoreGauge from './ScoreGauge';

interface ResultsPageProps {
  result: AnalysisResult;
  onEditManually: (field: EditingField) => void;
  onImproveWithAI: () => void;
}

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
    <div className="relative group flex flex-col items-center">
        {children}
        <div className="absolute bottom-full mb-2 w-max max-w-xs px-3 py-1.5 text-sm text-center font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
        </div>
    </div>
);

const BoldableText: React.FC<{text: string, className?: string}> = ({ text, className }) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <p className={className}>
            {parts.map((part, i) => 
                part.startsWith('**') && part.endsWith('**') ? 
                <strong key={i} className="text-indigo-600 font-bold bg-indigo-100/80 px-1 py-0.5 rounded-sm">{part.slice(2, -2)}</strong> : 
                part
            )}
        </p>
    );
};

const StructuredResumeComponent: React.FC<{resume: StructuredResume}> = ({ resume }) => (
    <div className="font-sans text-slate-800 text-sm space-y-4 p-2">
        <div className="text-center">
            <h3 className="text-xl font-bold tracking-wider uppercase">{resume.contactInfo.name}</h3>
            <p className="text-xs text-slate-600 space-x-2">
                <span>{resume.contactInfo.email}</span>
                <span>|</span>
                <span>{resume.contactInfo.phone}</span>
                {resume.contactInfo.linkedin && (
                    <>
                        <span>|</span>
                        <a href={resume.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">LinkedIn</a>
                    </>
                )}
                 <span>|</span>
                <span>{resume.contactInfo.address}</span>
            </p>
        </div>

        <div>
            <h4 className="font-bold text-sm uppercase tracking-widest border-b-2 border-slate-200 pb-1 mb-2">Summary</h4>
            <BoldableText text={resume.summary} className="text-sm" />
        </div>

        {resume.experience.length > 0 && <div>
            <h4 className="font-bold text-sm uppercase tracking-widest border-b-2 border-slate-200 pb-1 mb-2">Work Experience</h4>
            <div className="space-y-3">
                {resume.experience.map((exp, i) => (
                    <div key={i}>
                        <div className="flex justify-between items-baseline">
                            <h5 className="font-bold"><BoldableText text={exp.title} /> at {exp.company}</h5>
                            <p className="text-xs font-medium text-slate-500">{exp.dates}</p>
                        </div>
                        <p className="text-xs font-semibold text-slate-600 mb-1">{exp.location}</p>
                        <ul className="list-disc list-outside pl-5 space-y-1">
                            {exp.description.map((d, j) => <li key={j}><BoldableText text={d} /></li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </div>}

        {resume.projects.length > 0 && <div>
            <h4 className="font-bold text-sm uppercase tracking-widest border-b-2 border-slate-200 pb-1 mb-2">Projects</h4>
            <div className="space-y-3">
                {resume.projects.map((proj, i) => (
                    <div key={i}>
                         <div className="flex justify-between items-baseline">
                            <h5 className="font-bold"><BoldableText text={proj.title} /></h5>
                            <p className="text-xs font-medium text-slate-500">{proj.dates}</p>
                        </div>
                        <p className="text-xs font-semibold text-slate-600 mb-1">{proj.company}</p>
                        <ul className="list-disc list-outside pl-5 space-y-1">
                            {proj.description.map((d, j) => <li key={j}><BoldableText text={d} /></li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </div>}
        
         {resume.education.length > 0 && <div>
            <h4 className="font-bold text-sm uppercase tracking-widest border-b-2 border-slate-200 pb-1 mb-2">Education</h4>
            <div className="space-y-3">
                {resume.education.map((edu, i) => (
                    <div key={i}>
                         <div className="flex justify-between items-baseline">
                            <h5 className="font-bold"><BoldableText text={edu.degree} /> - {edu.institution}</h5>
                            <p className="text-xs font-medium text-slate-500">{edu.dates}</p>
                        </div>
                        <ul className="list-disc list-outside pl-5 space-y-1">
                           {edu.details.map((d,j) => <li key={j}><BoldableText text={d} /></li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </div>}

        {resume.publications && resume.publications.length > 0 && <div>
            <h4 className="font-bold text-sm uppercase tracking-widest border-b-2 border-slate-200 pb-1 mb-2">Publications</h4>
             <div className="space-y-3">
                {resume.publications.map((pub, i) => (
                    <div key={i}>
                         <div className="flex justify-between items-baseline">
                            <h5 className="font-bold"><BoldableText text={pub.title} /></h5>
                            <p className="text-xs font-medium text-slate-500">{pub.dates}</p>
                        </div>
                        <p className="text-xs font-semibold text-slate-600 mb-1">{pub.company}</p>
                        <ul className="list-disc list-outside pl-5 space-y-1">
                           {pub.description.map((d,j) => <li key={j}><BoldableText text={d} /></li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </div>}

        {resume.skills.length > 0 && <div>
            <h4 className="font-bold text-sm uppercase tracking-widest border-b-2 border-slate-200 pb-1 mb-2">Skills</h4>
            <div className="space-y-1">
                {resume.skills.map((skillSet, i) => (
                    <div key={i} className="flex">
                        <p className="font-bold w-32">{skillSet.category}:</p>
                        <p><BoldableText text={skillSet.skills.join(', ')} /></p>
                    </div>
                ))}
            </div>
        </div>}
    </div>
);

const StructuredCoverLetterComponent: React.FC<{cl: StructuredCoverLetter}> = ({ cl }) => (
    <div className="font-serif text-slate-800 text-sm space-y-4 p-2">
        <div className="text-right">
            <h3 className="text-lg font-bold">{cl.contactInfo.name}</h3>
            <p>{cl.contactInfo.address}</p>
            <p>{cl.contactInfo.email}</p>
        </div>
        <div>
            <p>{cl.date}</p>
        </div>
        <div>
            <p>{cl.recipientName}</p>
            <p>{cl.recipientCompany}</p>
        </div>
        <div>
            <p className="font-bold">Dear {cl.recipientName},</p>
        </div>
        <div className="space-y-3">
            {cl.body.map((p, i) => <BoldableText key={i} text={p} className="text-justify" />)}
        </div>
        <div>
            <p>{cl.closing}</p>
            <p>{cl.contactInfo.name}</p>
        </div>
    </div>
);


const ResultsPage: React.FC<ResultsPageProps> = ({ result, onEditManually, onImproveWithAI }) => {
  const downloadAsDoc = (content: StructuredResume | StructuredCoverLetter | string, filename: string) => {
    const boldFormatter = (text: string) => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const style = `
        <style>
            body { font-family: 'Times New Roman', Times, serif; line-height: 1.4; font-size: 12pt; }
            h1 { font-size: 18pt; font-weight: bold; margin-bottom: 0; text-align: center; }
            h2 { font-size: 14pt; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 2px; margin-top: 1em; margin-bottom: 0.5em; }
            h3 { font-size: 12pt; font-weight: bold; margin-bottom: 0; }
            p, li { margin-top: 0; margin-bottom: 0.5em; }
            ul { margin: 0; padding-left: 20px; }
            .header-info { text-align: center; font-size: 10pt; margin-bottom: 1em; }
            .job-title { display: flex; justify-content: space-between; }
            .job-title em { font-size: 10pt; }
        </style>
    `;

    let htmlBody = '';
    if (typeof content === 'string') {
        htmlBody = content.replace(/\n/g, '<br>');
    } else if ('summary' in content) { // It's a resume
        const resume = content as StructuredResume;
        htmlBody += `<h1>${resume.contactInfo.name}</h1><div class="header-info">${resume.contactInfo.email} | ${resume.contactInfo.phone} | ${resume.contactInfo.linkedin} | ${resume.contactInfo.address}</div>`;
        htmlBody += `<h2>Summary</h2><p>${boldFormatter(resume.summary)}</p>`;
        
        const sectionToHtml = (title, items, itemFormatter) => {
            if (!items || items.length === 0) return '';
            return `<h2>${title}</h2>` + items.map(itemFormatter).join('');
        };
        
        htmlBody += sectionToHtml('Work Experience', resume.experience, item => `<div><div class="job-title"><h3>${boldFormatter(item.title)} at ${item.company}</h3><em>${item.dates}</em></div><p><em>${item.location}</em></p><ul>${item.description.map(d => `<li>${boldFormatter(d)}</li>`).join('')}</ul></div>`);
        htmlBody += sectionToHtml('Projects', resume.projects, item => `<div><div class="job-title"><h3>${boldFormatter(item.title)}</h3><em>${item.dates}</em></div><p><em>${item.company}</em></p><ul>${item.description.map(d => `<li>${boldFormatter(d)}</li>`).join('')}</ul></div>`);
        htmlBody += sectionToHtml('Education', resume.education, item => `<div><div class="job-title"><h3>${boldFormatter(item.degree)}, ${item.institution}</h3><em>${item.dates}</em></div><ul>${item.details.map(d => `<li>${boldFormatter(d)}</li>`).join('')}</ul></div>`);
        if(resume.publications) htmlBody += sectionToHtml('Publications', resume.publications, item => `<div><h3>${boldFormatter(item.title)} - ${item.company} (${item.dates})</h3><p>${item.description.map(d => boldFormatter(d)).join('<br>')}</p></div>`);
        if(resume.skills) htmlBody += `<h2>Skills</h2>` + resume.skills.map(s => `<p><strong>${s.category}:</strong> ${boldFormatter(s.skills.join(', '))}</p>`).join('');

    } else { // It's a cover letter
        const cl = content as StructuredCoverLetter;
        htmlBody += `<p style="text-align: right;">${cl.contactInfo.name}<br>${cl.contactInfo.address}<br>${cl.contactInfo.email}</p><br/>`;
        htmlBody += `<p>${cl.date}</p><br/>`;
        htmlBody += `<p>${cl.recipientName}<br>${cl.recipientCompany}</p><br/>`;
        htmlBody += `<p><strong>Dear ${cl.recipientName},</strong></p>`;
        htmlBody += cl.body.map(p => `<p>${boldFormatter(p)}</p>`).join('');
        htmlBody += `<p>${cl.closing}<br/><br/>${cl.contactInfo.name}</p>`;
    }

    const htmlContent = `<!DOCTYPE html><html><head>${style}</head><body>${htmlBody}</body></html>`;
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


  return (
    <div className="space-y-6">
      {/* Top Section: Score and Analysis */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex justify-around items-center space-x-4 md:col-span-1 md:border-r md:border-slate-200 md:pr-6">
                <Tooltip text={result.scoreJustification}>
                    <ScoreGauge score={result.suitabilityScore} label="Compatibility" />
                </Tooltip>
                 <Tooltip text={result.qualityScoreJustification}>
                    <ScoreGauge score={result.qualityScore} label="Quality" color="text-teal-500" />
                </Tooltip>
            </div>
            <div className="md:col-span-2 space-y-3">
                 <h3 className="text-lg font-bold text-slate-700">Keyword Analysis</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-slate-600 mb-2">Hard Skills</h4>
                        <div className="flex flex-wrap gap-2">{result.hardSkills.map(skill => <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>)}</div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-600 mb-2">Soft Skills</h4>
                        <div className="flex flex-wrap gap-2">{result.softSkills.map(skill => <span key={skill} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>)}</div>
                    </div>
                 </div>
                 {result.clarifyingQuestions.length > 0 && <>
                    <h3 className="text-lg font-bold text-slate-700 pt-2">Next Steps</h3>
                    <p className="text-sm text-slate-600">Answer the clarifying questions below to further improve your score.</p>
                 </>}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Revised Resume</h3>
          <div className="flex-grow h-[70vh] overflow-y-auto p-2 border rounded-md bg-slate-50/50">
            {typeof result.revisedResume === 'string' 
                ? <pre className="whitespace-pre-wrap font-sans text-sm p-2">{result.revisedResume}</pre> 
                : <StructuredResumeComponent resume={result.revisedResume} />
            }
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
             <button onClick={() => downloadAsDoc(result.revisedResume, 'Revised-Resume.doc')} className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors font-semibold">
                <DownloadIcon /><span>Download</span>
            </button>
             <button onClick={onImproveWithAI} className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                <LightbulbIcon /><span>Improve with AI</span>
            </button>
            <button onClick={() => onEditManually('resume')} className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                <WandIcon /><span>Edit Manually</span>
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Draft Cover Letter</h3>
          <div className="flex-grow h-[70vh] overflow-y-auto p-2 border rounded-md bg-slate-50/50">
             {typeof result.draftCoverLetter === 'string' 
                ? <pre className="whitespace-pre-wrap font-sans text-sm p-2">{result.draftCoverLetter}</pre> 
                : <StructuredCoverLetterComponent cl={result.draftCoverLetter} />
            }
          </div>
           <div className="mt-4 grid grid-cols-3 gap-3">
             <button onClick={() => downloadAsDoc(result.draftCoverLetter, 'Cover-Letter.doc')} className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors font-semibold">
                <DownloadIcon /><span>Download</span>
            </button>
             <button onClick={onImproveWithAI} className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                <LightbulbIcon /><span>Improve with AI</span>
            </button>
            <button onClick={() => onEditManually('coverLetter')} className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                <WandIcon /><span>Edit Manually</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;