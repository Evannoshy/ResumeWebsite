// ─── PDF Generation Utility ──────────────────────────────────────
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { ResumeSections } from '../types';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateClassicHTML(sections: ResumeSections): string {
  const { personal, education, experience, projects, skills } = sections;

  const educationHTML = education.map((edu) => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <strong>${escapeHtml(edu.school)}</strong>
          <div class="subtitle">${escapeHtml(edu.degree)}${edu.field ? ` in ${escapeHtml(edu.field)}` : ''}</div>
        </div>
        <div class="date">${escapeHtml(edu.startYear)} — ${escapeHtml(edu.endYear)}</div>
      </div>
      ${edu.gpa ? `<div class="detail">GPA: ${escapeHtml(edu.gpa)}</div>` : ''}
      ${edu.highlights.length > 0 ? `<ul>${edu.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('');

  const experienceHTML = experience.map((exp) => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <strong>${escapeHtml(exp.role)}</strong>
          <div class="subtitle">${escapeHtml(exp.company)}</div>
        </div>
        <div class="date">${escapeHtml(exp.startDate)} — ${exp.current ? 'Present' : escapeHtml(exp.endDate)}</div>
      </div>
      ${exp.bullets.length > 0 ? `<ul>${exp.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('');

  const projectsHTML = projects.map((proj) => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <strong>${escapeHtml(proj.title)}</strong>
          ${proj.techStack.length > 0 ? `<div class="subtitle">${proj.techStack.map(t => escapeHtml(t)).join(' · ')}</div>` : ''}
        </div>
        ${proj.link ? `<div class="date"><a href="${escapeHtml(proj.link)}">Link</a></div>` : ''}
      </div>
      <div class="detail">${escapeHtml(proj.description)}</div>
      ${proj.bullets.length > 0 ? `<ul>${proj.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('');

  const allSkills = [
    ...skills.technical.map(s => escapeHtml(s)),
    ...skills.soft.map(s => escapeHtml(s)),
  ];
  const languagesStr = skills.languages.map(l => escapeHtml(l)).join(', ');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.45;
    color: #1a1a1a;
    padding: 40px 50px;
  }
  h1 { font-size: 22pt; font-weight: 600; margin-bottom: 4px; letter-spacing: -0.5px; }
  .contact { font-size: 9.5pt; color: #555; margin-bottom: 20px; }
  .contact a { color: #555; text-decoration: none; }
  .summary { font-size: 10pt; color: #444; margin-bottom: 20px; line-height: 1.5; }
  h2 {
    font-size: 11pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1.5px solid #1a1a1a;
    padding-bottom: 4px;
    margin-top: 18px;
    margin-bottom: 10px;
  }
  .entry { margin-bottom: 12px; }
  .entry-header { display: flex; justify-content: space-between; align-items: flex-start; }
  .subtitle { font-size: 10pt; color: #555; margin-top: 1px; }
  .date { font-size: 9.5pt; color: #666; white-space: nowrap; }
  .detail { font-size: 10pt; color: #444; margin-top: 3px; }
  ul { margin-top: 4px; padding-left: 18px; }
  li { margin-bottom: 2px; font-size: 10pt; }
  .skills-list { font-size: 10pt; line-height: 1.6; }
</style>
</head>
<body>
  <h1>${escapeHtml(personal.name || 'Your Name')}</h1>
  <div class="contact">
    ${[personal.email, personal.phone, personal.linkedin].filter(Boolean).map(c => escapeHtml(c)).join(' · ')}
  </div>
  ${personal.summary ? `<div class="summary">${escapeHtml(personal.summary)}</div>` : ''}

  ${education.length > 0 ? `<h2>Education</h2>${educationHTML}` : ''}
  ${experience.length > 0 ? `<h2>Experience</h2>${experienceHTML}` : ''}
  ${projects.length > 0 ? `<h2>Projects</h2>${projectsHTML}` : ''}
  ${allSkills.length > 0 ? `<h2>Skills</h2><div class="skills-list">${allSkills.join(' · ')}</div>` : ''}
  ${languagesStr ? `<h2>Languages</h2><div class="skills-list">${languagesStr}</div>` : ''}
</body>
</html>`;
}

function generateModernHTML(sections: ResumeSections): string {
  // Modern template uses same data but with a two-column layout and accent color
  const html = generateClassicHTML(sections);
  return html.replace(
    'border-bottom: 1.5px solid #1a1a1a;',
    'border-bottom: 2px solid #2D5BFF; color: #2D5BFF;'
  ).replace(
    "font-size: 22pt; font-weight: 600;",
    "font-size: 22pt; font-weight: 600; color: #2D5BFF;"
  );
}

export async function generateResumePDF(
  sections: ResumeSections,
  template: 'classic' | 'modern' = 'classic'
): Promise<string> {
  const html = template === 'modern' ? generateModernHTML(sections) : generateClassicHTML(sections);

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  return uri;
}

export async function shareResumePDF(uri: string): Promise<void> {
  await shareAsync(uri, {
    UTI: '.pdf',
    mimeType: 'application/pdf',
  });
}
