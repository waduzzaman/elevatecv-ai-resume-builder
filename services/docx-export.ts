
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import saveAs from "file-saver";
import { ResumeData } from "../types";

export async function exportToDocx(data: ResumeData) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: data.contact.fullName.toUpperCase(), bold: true, size: 32 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ 
                text: `${data.contact.email} | ${data.contact.phone} | ${data.contact.location}`,
                size: 20 
              }),
            ],
          }),

          // Summary
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
            children: [new TextRun({ text: "PROFESSIONAL SUMMARY", bold: true, size: 24 })],
          }),
          new Paragraph({
            spacing: { before: 100 },
            children: [new TextRun({ text: data.summary, size: 22 })],
          }),

          // Experience
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
            children: [new TextRun({ text: "WORK EXPERIENCE", bold: true, size: 24 })],
          }),
          ...data.experiences.flatMap((exp) => [
            new Paragraph({
              spacing: { before: 150 },
              children: [
                new TextRun({ text: exp.position, bold: true, size: 22 }),
                new TextRun({ text: `\t${exp.startDate} - ${exp.endDate || "Present"}`, bold: true, size: 22 }),
              ],
              tabStops: [{ type: "right", position: 9000 }],
            }),
            new Paragraph({
              children: [new TextRun({ text: exp.company, italics: true, size: 20 })],
            }),
            ...exp.highlights.map(h => 
              new Paragraph({
                text: h,
                bullet: { level: 0 },
                spacing: { before: 50 }
              })
            )
          ]),

          // Education
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
            children: [new TextRun({ text: "EDUCATION", bold: true, size: 24 })],
          }),
          ...data.education.map(edu => 
            new Paragraph({
              spacing: { before: 100 },
              children: [
                new TextRun({ text: `${edu.school}: ${edu.degree} in ${edu.fieldOfStudy}`, size: 22 }),
                new TextRun({ text: `\t${edu.graduationDate}`, size: 22 }),
              ],
              tabStops: [{ type: "right", position: 9000 }],
            })
          ),

          // Skills
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
            children: [new TextRun({ text: "SKILLS", bold: true, size: 24 })],
          }),
          new Paragraph({
            spacing: { before: 100 },
            children: [new TextRun({ text: data.skills.map(s => s.name).join(", "), size: 22 })],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.contact.fullName.replace(/\s/g, "_")}_Resume.docx`);
}
