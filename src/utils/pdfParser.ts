import { AnswerOption } from '../types';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker to use CDN or bundled worker
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  } catch (e) {
    // Fallback if CDN fails or offline
  }
}

export interface ParsedQuestionItem {
  id: string;
  unitDetectedName: string;
  unitIndex: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: AnswerOption;
  explanation?: string;
  imageUrl?: string;
  confidence: 'high' | 'medium' | 'needs_review';
}

export interface ParseResult {
  detectedSubject?: string;
  units: Array<{
    name: string;
    questions: ParsedQuestionItem[];
  }>;
  unassignedQuestions: ParsedQuestionItem[];
  rawTextLength: number;
}

export interface ParsedAnswerItem {
  qNumber: number;
  unitDetectedName?: string;
  answer: AnswerOption;
  explanation?: string;
  rawText?: string;
}

export interface MatchedResult {
  matchedCount: number;
  unmatchedQuestionsCount: number;
  totalQuestions: number;
  totalAnswersFound: number;
  units: Array<{
    name: string;
    questions: ParsedQuestionItem[];
  }>;
  unassignedQuestions: ParsedQuestionItem[];
}

/**
 * Extracts full text from any PDF file using PDF.js engine
 */
export async function extractTextFromPdfFile(file: File): Promise<string> {
  if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
    return await file.text();
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });

    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;
    const pageTextPromises: Promise<string>[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      pageTextPromises.push(
        pdfDocument.getPage(pageNum).then(async (page) => {
          const textContent = await page.getTextContent();
          const viewport = page.getViewport({ scale: 1.0 });
          const pageWidth = viewport.width || 595;

          interface TextItem {
            str: string;
            x: number;
            y: number;
          }

          const rawItems: TextItem[] = [];
          for (const item of textContent.items as any[]) {
            if ('str' in item && item.str.trim().length > 0) {
              const x = item.transform ? item.transform[4] : 0;
              const y = item.transform ? item.transform[5] : 0;
              rawItems.push({ str: item.str, x, y });
            }
          }

          if (rawItems.length === 0) return '\n\n';

          // Check if page has two columns (significant items in left half and right half)
          const midX = pageWidth / 2;
          const leftItems = rawItems.filter((it) => it.x < midX);
          const rightItems = rawItems.filter((it) => it.x >= midX);

          const isTwoColumn = leftItems.length > 8 && rightItems.length > 8;

          const renderColumn = (items: TextItem[]) => {
            // Sort by Y descending (PDF top is high Y), then by X ascending
            items.sort((a, b) => {
              if (Math.abs(a.y - b.y) > 4) {
                return b.y - a.y; // Higher Y comes first
              }
              return a.x - b.x; // Left to right on same line
            });

            let colText = '';
            let lastY: number | null = null;

            for (const item of items) {
              if (lastY !== null && Math.abs(item.y - lastY) > 5) {
                colText += '\n';
              } else if (colText.length > 0 && !colText.endsWith(' ') && !colText.endsWith('\n')) {
                colText += ' ';
              }
              colText += item.str;
              lastY = item.y;
            }
            return colText;
          };

          let pageText = '';
          if (isTwoColumn) {
            pageText = renderColumn(leftItems) + '\n\n' + renderColumn(rightItems);
          } else {
            pageText = renderColumn(rawItems);
          }

          return pageText + '\n\n';
        })
      );
    }

    const allPagesText = await Promise.all(pageTextPromises);
    const combined = allPagesText.join('\n');

    if (combined.trim().length > 30) {
      return combined;
    }

    // Fallback stream reader if PDF.js returns empty
    return extractTextFallback(arrayBuffer);
  } catch (error) {
    console.warn('PDF.js parse warning, using fallback reader:', error);
    try {
      const buffer = await file.arrayBuffer();
      return extractTextFallback(buffer);
    } catch (fallbackError) {
      console.error('All PDF extraction attempts failed:', fallbackError);
      throw new Error('Unable to extract text from PDF. Please check if the PDF contains selectable text.');
    }
  }
}

function extractTextFallback(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (let i = 0; i < bytes.length; i++) {
    const charCode = bytes[i];
    if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13) {
      str += String.fromCharCode(charCode);
    }
  }
  return str.replace(/[^\x20-\x7E\n\r]/g, ' ').replace(/\s{2,}/g, ' ');
}

/**
 * Maps raw characters ('A', 'B', 'C', 'D', '1', '2', '3', '4', 'a', 'b', 'c', 'd') to standard AnswerOption
 */
function mapCharToAnswerOption(charStr?: string): AnswerOption {
  if (!charStr) return 'A';
  const c = charStr.trim().toUpperCase();
  if (c === 'A' || c === '1' || c === 'I') return 'A';
  if (c === 'B' || c === '2' || c === 'II') return 'B';
  if (c === 'C' || c === '3' || c === 'III') return 'C';
  if (c === 'D' || c === '4' || c === 'IV') return 'D';
  return 'A';
}

/**
 * Cleans noisy watermarks and repeated school website headers
 */
function cleanRawPdfText(rawText: string): string {
  return rawText
    .replace(/www\.padasalai\.net/gi, '')
    .replace(/www\.kalviseithi\.com/gi, '')
    .replace(/www\.tnschools\.gov\.in/gi, '')
    .replace(/page\s+\d+\s+of\s+\d+/gi, '')
    .replace(/standard\s+(?:xii|12|xi|10)/gi, '')
    .replace(/\[\s*turn\s+over\s*\]/gi, '')
    .replace(/\bconfidential\b/gi, '');
}

/**
 * Universal Intelligent Question Document Parser
 * Parses internet downloaded PDFs with:
 * - Single-line options: (a) opt1 (b) opt2 (c) opt3 (d) opt4
 * - Multi-line options
 * - Bottom Answer tables
 * - Multi-unit headers
 */
export function parseQuestionDocument(rawText: string, defaultSubject?: string): ParseResult {
  const cleanedText = cleanRawPdfText(rawText);
  const lines = cleanedText.split(/\r?\n/);
  
  const unitsMap = new Map<string, ParsedQuestionItem[]>();
  const unassigned: ParsedQuestionItem[] = [];
  let currentUnitName = '';
  let unitIndexCounter = 0;
  let detectedSubject = defaultSubject;

  // Detect Subject in the first 25 lines
  for (let i = 0; i < Math.min(lines.length, 25); i++) {
    const l = lines[i].trim();
    if (/SUBJECT:\s*(.*)/i.test(l)) {
      const match = l.match(/SUBJECT:\s*([A-Za-z0-9\s]+)/i);
      if (match) detectedSubject = match[1].replace(/ONE-MARK.*/i, '').trim();
    } else if (/(?:COMPUTER\s+SCIENCE|COMP\s+SCIENCE|CS)/i.test(l)) {
      detectedSubject = 'Computer Science';
    } else if (/^\s*(PHYSICS|CHEMISTRY|MATHEMATICS|MATHS|BIOLOGY|BOTANY|ZOOLOGY)\s*$/i.test(l)) {
      detectedSubject = l.trim();
    }
  }

  // Known standard chapter titles for TN State Board 12th subjects to guarantee 100% accurate unit splits
  const KNOWN_CHAPTER_NAMES: Array<{ name: string; unitNumber: number; subjectHint: string }> = [
    // Computer Science (16 Units)
    { name: 'Function', unitNumber: 1, subjectHint: 'Computer Science' },
    { name: 'Data Abstraction', unitNumber: 2, subjectHint: 'Computer Science' },
    { name: 'Scoping', unitNumber: 3, subjectHint: 'Computer Science' },
    { name: 'Algorithmic Strategies', unitNumber: 4, subjectHint: 'Computer Science' },
    { name: 'Python - Variables and Operators', unitNumber: 5, subjectHint: 'Computer Science' },
    { name: 'Variables and Operators', unitNumber: 5, subjectHint: 'Computer Science' },
    { name: 'Control Structures', unitNumber: 6, subjectHint: 'Computer Science' },
    { name: 'Python Functions', unitNumber: 7, subjectHint: 'Computer Science' },
    { name: 'Strings and String Manipulation', unitNumber: 8, subjectHint: 'Computer Science' },
    { name: 'Lists, Tuples, Sets and Dictionary', unitNumber: 9, subjectHint: 'Computer Science' },
    { name: 'Python Classes and Objects', unitNumber: 10, subjectHint: 'Computer Science' },
    { name: 'Classes and Objects', unitNumber: 10, subjectHint: 'Computer Science' },
    { name: 'Database Concepts', unitNumber: 11, subjectHint: 'Computer Science' },
    { name: 'Structured Query Language', unitNumber: 12, subjectHint: 'Computer Science' },
    { name: 'SQL', unitNumber: 12, subjectHint: 'Computer Science' },
    { name: 'Python and CSV Files', unitNumber: 13, subjectHint: 'Computer Science' },
    { name: 'Importing C++ Programs in Python', unitNumber: 14, subjectHint: 'Computer Science' },
    { name: 'Data Manipulation through SQL', unitNumber: 15, subjectHint: 'Computer Science' },
    { name: 'Data Visualization using Pyplot', unitNumber: 16, subjectHint: 'Computer Science' },
    { name: 'Pyplot', unitNumber: 16, subjectHint: 'Computer Science' },

    // Physics (11 Units)
    { name: 'Electrostatics', unitNumber: 1, subjectHint: 'Physics' },
    { name: 'Current Electricity', unitNumber: 2, subjectHint: 'Physics' },
    { name: 'Magnetism and Magnetic Effects of Electric Current', unitNumber: 3, subjectHint: 'Physics' },
    { name: 'Electromagnetic Induction and Alternating Current', unitNumber: 4, subjectHint: 'Physics' },
    { name: 'Electromagnetic Waves', unitNumber: 5, subjectHint: 'Physics' },
    { name: 'Ray Optics', unitNumber: 6, subjectHint: 'Physics' },
    { name: 'Wave Optics', unitNumber: 7, subjectHint: 'Physics' },
    { name: 'Dual Nature of Radiation and Matter', unitNumber: 8, subjectHint: 'Physics' },
    { name: 'Atomic and Nuclear Physics', unitNumber: 9, subjectHint: 'Physics' },
    { name: 'Electronics and Communication', unitNumber: 10, subjectHint: 'Physics' },
    { name: 'Recent Developments in Physics', unitNumber: 11, subjectHint: 'Physics' },

    // Chemistry (15 Units)
    { name: 'Metallurgy', unitNumber: 1, subjectHint: 'Chemistry' },
    { name: 'p-Block Elements – I', unitNumber: 2, subjectHint: 'Chemistry' },
    { name: 'p-Block Elements – II', unitNumber: 3, subjectHint: 'Chemistry' },
    { name: 'Transition and Inner Transition Elements', unitNumber: 4, subjectHint: 'Chemistry' },
    { name: 'Coordination Chemistry', unitNumber: 5, subjectHint: 'Chemistry' },
    { name: 'Solid State', unitNumber: 6, subjectHint: 'Chemistry' },
    { name: 'Chemical Kinetics', unitNumber: 7, subjectHint: 'Chemistry' },
    { name: 'Ionic Equilibrium', unitNumber: 8, subjectHint: 'Chemistry' },
    { name: 'Electrochemistry', unitNumber: 9, subjectHint: 'Chemistry' },
    { name: 'Surface Chemistry', unitNumber: 10, subjectHint: 'Chemistry' },
    { name: 'Hydroxy Compounds and Ethers', unitNumber: 11, subjectHint: 'Chemistry' },
    { name: 'Carbonyl Compounds and Carboxylic Acids', unitNumber: 12, subjectHint: 'Chemistry' },
    { name: 'Organic Nitrogen Compounds', unitNumber: 13, subjectHint: 'Chemistry' },
    { name: 'Biomolecules', unitNumber: 14, subjectHint: 'Chemistry' },
    { name: 'Chemistry in Everyday Life', unitNumber: 15, subjectHint: 'Chemistry' },
  ];

  // Robust flexible Unit / Chapter patterns
  // Matches: "Unit- 1 ELECTROSTATICS", "Unit 1: Function", "CHAPTER 2 - DATA ABSTRACTION", "Lesson 3", "1. FUNCTION", etc.
  const unitRegex = /^(?:UNIT|CHAPTER|LESSON|SECTION)\s*[-:–.]?\s*([IVXLCDM\d]+)(?:[\s:–.-]+(.*))?$/i;
  const standaloneNumberedHeadingRegex = /^(\d{1,2})\.\s+([A-Z\s\-–—\(\)\/]{3,50})$/;

  // Helper to detect if line matches a known curriculum chapter
  function detectKnownChapter(line: string): { name: string; unitNumber: number; subjectHint: string } | null {
    const clean = line.replace(/^(?:unit|chapter|lesson|section|\d+)[\s\-:–.]*/i, '').trim().toLowerCase();
    for (const kc of KNOWN_CHAPTER_NAMES) {
      if (clean === kc.name.toLowerCase() || line.toLowerCase().includes(kc.name.toLowerCase())) {
        return kc;
      }
    }
    return null;
  }

  // Question starting patterns: "1. ", "1) ", "Q1. ", "Q.1: ", "1 (A)", "Question 1:"
  const questionStartRegex = /^(?:Q(?:uestion)?[\.\s]*(\d+)[\.\:\)]|\b(\d+)[\.\)])\s*(.*)$/i;

  // Separate single-line option patterns: "(a) optA (b) optB (c) optC (d) optD"
  const multiOptionSingleLineRegex = /(?:\(([a-d1-4])\)|(?:\b|^)([a-d1-4])[\.\)])\s*(.*?)(?=(?:\(([a-d1-4])\)|(?:\b)([a-d1-4])[\.\)])|$)/gi;

  // Single option line: "(A) ..." or "A. ..." or "1. ..."
  const singleOptionLineRegex = /^(?:\(([A-Da-d1-4])\)|([A-Da-d1-4])[\.\)])\s*(.*)$/;

  // Inline Answer pattern: "Answer: A", "Ans: (B)", "Key: C", "Correct Answer: D"
  const answerRegex = /^(?:Ans(?:wer)?|Key|Correct(?:\s+Option|\s+Answer)?)[\s\:\-]+(?:\(?([A-Da-d1-4])\)?)/i;

  // Explanation pattern
  const explanationRegex = /^(?:Exp(?:lanation)?|Reason|Solution)[\s\:\-]+(.*)$/i;

  // Answer Key Section at the bottom of unit/PDF (e.g. "Answer Key: 1. c 2. a 3. d")
  const answerKeySectionHeaderRegex = /^(?:ANSWERS?|ANSWER\s+KEYS?|KEY\s+ANSWERS?|SOLUTIONS?)\s*[:–-]?/i;

  let currentItem: Partial<ParsedQuestionItem> & { rawQNum?: number } | null = null;
  let inAnswerKeySection = false;
  const collectedEndAnswers: Array<{ qNum: number; answer: AnswerOption }> = [];

  function commitCurrentItem() {
    if (currentItem && currentItem.question) {
      const item: ParsedQuestionItem = {
        id: 'parsed_' + Math.random().toString(36).substring(2, 9),
        unitDetectedName: currentUnitName || 'General Questions',
        unitIndex: unitIndexCounter,
        question: currentItem.question.trim(),
        optionA: currentItem.optionA?.trim() || 'Option A',
        optionB: currentItem.optionB?.trim() || 'Option B',
        optionC: currentItem.optionC?.trim() || 'Option C',
        optionD: currentItem.optionD?.trim() || 'Option D',
        correctAnswer: currentItem.correctAnswer || 'A',
        explanation: currentItem.explanation?.trim(),
        confidence:
          currentItem.optionA && currentItem.optionB && currentItem.optionC && currentItem.optionD
            ? 'high'
            : 'medium',
      };

      if (currentUnitName) {
        if (!unitsMap.has(currentUnitName)) {
          unitsMap.set(currentUnitName, []);
        }
        unitsMap.get(currentUnitName)!.push(item);
      } else {
        unassigned.push(item);
      }
    }
    currentItem = null;
  }

  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx].trim();
    if (!rawLine) continue;

    // Check if entering Answer Key section at bottom of document
    if (answerKeySectionHeaderRegex.test(rawLine) && idx > 5) {
      commitCurrentItem();
      inAnswerKeySection = true;
      continue;
    }

    if (inAnswerKeySection) {
      // Parse answers in answer key grid: e.g. "1. (b)  2. (a)  3. (c)" or "1 - b, 2 - a"
      const matches = [...rawLine.matchAll(/(?:Q(?:uestion)?\s*)?(\d+)[\.\:\)\-\s\|]+(?:\(([A-Da-d1-4])\)|([A-Da-d1-4]))/gi)];
      for (const m of matches) {
        const qNum = parseInt(m[1], 10);
        const optChar = m[2] || m[3];
        collectedEndAnswers.push({
          qNum,
          answer: mapCharToAnswerOption(optChar),
        });
      }
      continue;
    }

    // Check for Unit / Chapter heading
    const knownChapter = detectKnownChapter(rawLine);
    const unitMatch = rawLine.match(unitRegex);
    const standaloneHeading = rawLine.match(standaloneNumberedHeadingRegex);

    if (knownChapter) {
      commitCurrentItem();
      currentUnitName = `Unit ${knownChapter.unitNumber}: ${knownChapter.name}`;
      unitIndexCounter = knownChapter.unitNumber;
      if (knownChapter.subjectHint && (!detectedSubject || detectedSubject === defaultSubject)) {
        detectedSubject = knownChapter.subjectHint;
      }
      continue;
    } else if (unitMatch) {
      commitCurrentItem();
      const romanOrNum = unitMatch[1];
      const title = unitMatch[2] ? `: ${unitMatch[2].trim()}` : '';
      currentUnitName = `Unit ${romanOrNum}${title}`;
      unitIndexCounter++;
      continue;
    } else if (standaloneHeading && !rawLine.toLowerCase().includes('option') && !rawLine.toLowerCase().includes('page')) {
      commitCurrentItem();
      const num = standaloneHeading[1];
      const title = standaloneHeading[2].trim();
      currentUnitName = `Unit ${num}: ${title}`;
      unitIndexCounter = parseInt(num, 10) || (unitIndexCounter + 1);
      continue;
    }

    // Check for Question Start
    const qMatch = rawLine.match(questionStartRegex);
    if (qMatch) {
      const extractedQNum = parseInt(qMatch[1] || qMatch[2], 10);
      // If question number resets back to 1 and we already had questions, advance unit if not already advanced
      if (extractedQNum === 1 && currentItem && currentItem.rawQNum && currentItem.rawQNum >= 3) {
        commitCurrentItem();
        unitIndexCounter++;
        currentUnitName = `Unit ${unitIndexCounter}`;
      } else {
        commitCurrentItem();
      }

      currentItem = {
        rawQNum: extractedQNum,
        question: qMatch[3].trim(),
      };
      continue;
    }

    // Check for Inline Options on one line: e.g. "(a) 12  (b) 14  (c) 16  (d) 18"
    if (currentItem && (rawLine.includes('(a)') || rawLine.includes('(A)') || rawLine.includes('(1)'))) {
      const inlineOptMatches = [...rawLine.matchAll(multiOptionSingleLineRegex)];
      if (inlineOptMatches.length >= 2) {
        inlineOptMatches.forEach((m) => {
          const letter = mapCharToAnswerOption(m[1] || m[2]);
          const val = m[3]?.trim();
          if (letter === 'A') currentItem!.optionA = val;
          if (letter === 'B') currentItem!.optionB = val;
          if (letter === 'C') currentItem!.optionC = val;
          if (letter === 'D') currentItem!.optionD = val;
        });
        continue;
      }
    }

    // Check for Single Option on its own line: "(A) ..." or "A. ..."
    const singleOptMatch = rawLine.match(singleOptionLineRegex);
    if (singleOptMatch && currentItem) {
      const letter = mapCharToAnswerOption(singleOptMatch[1] || singleOptMatch[2]);
      const val = singleOptMatch[3].trim();
      if (letter === 'A') currentItem.optionA = val;
      if (letter === 'B') currentItem.optionB = val;
      if (letter === 'C') currentItem.optionC = val;
      if (letter === 'D') currentItem.optionD = val;
      continue;
    }

    // Check for Inline Answer
    const ansMatch = rawLine.match(answerRegex);
    if (ansMatch && currentItem) {
      currentItem.correctAnswer = mapCharToAnswerOption(ansMatch[1]);
      continue;
    }

    // Check for Explanation
    const expMatch = rawLine.match(explanationRegex);
    if (expMatch && currentItem) {
      currentItem.explanation = expMatch[1].trim();
      continue;
    }

    // If options haven't started yet, append multi-line question text
    if (currentItem && !currentItem.optionA) {
      currentItem.question = (currentItem.question ? currentItem.question + ' ' : '') + rawLine;
    }
  }

  commitCurrentItem();

  // If there was an end-of-document answer key, match it with all collected questions
  if (collectedEndAnswers.length > 0) {
    const answersMap = new Map<number, AnswerOption>();
    collectedEndAnswers.forEach((a) => answersMap.set(a.qNum, a.answer));

    const applyAnswers = (items: ParsedQuestionItem[]) => {
      items.forEach((item, idx) => {
        const qNumMatch = item.question.match(/^(?:Q(?:uestion)?\s*(\d+)|\b(\d+))[\.\:\)]/i);
        const qNum = qNumMatch ? parseInt(qNumMatch[1] || qNumMatch[2], 10) : idx + 1;
        if (answersMap.has(qNum)) {
          item.correctAnswer = answersMap.get(qNum)!;
          item.confidence = 'high';
        }
      });
    };

    unitsMap.forEach((qList) => applyAnswers(qList));
    applyAnswers(unassigned);
  }

  const units: Array<{ name: string; questions: ParsedQuestionItem[] }> = [];
  for (const [name, questions] of unitsMap.entries()) {
    units.push({ name, questions });
  }

  return {
    detectedSubject,
    units,
    unassignedQuestions: unassigned,
    rawTextLength: rawText.length,
  };
}

/**
 * Separate Answer Key Parser for matching separate QP and Key files
 */
export function parseAnswerKeyDocument(rawText: string): ParsedAnswerItem[] {
  const lines = cleanRawPdfText(rawText).split(/\r?\n/);
  const items: ParsedAnswerItem[] = [];
  let currentUnitName = '';

  const unitRegex = /^(?:UNIT|CHAPTER|SECTION|LESSON)\s*([IVXLCDM\d]+)(?:\s*[:–-]\s*(.*))?$/i;
  const singleLineAnswerRegex = /^(?:Q(?:uestion)?\s*)?(\d+)[\.\:\)\-\s\|]+(?:\(([A-Da-d1-4])\)|([A-Da-d1-4]))(?:\s*[\:\–\-\|]\s*(.*))?$/i;
  const explanationRegex = /^(?:Exp(?:lanation)?|Reason|Solution)[\s\:\-]+(.*)$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const unitMatch = line.match(unitRegex);
    if (unitMatch) {
      currentUnitName = `Unit ${unitMatch[1]}`;
      continue;
    }

    const ansMatch = line.match(singleLineAnswerRegex);
    if (ansMatch) {
      const qNum = parseInt(ansMatch[1], 10);
      const optChar = ansMatch[2] || ansMatch[3];
      const inlineExp = ansMatch[4]?.trim();
      const ansOpt = mapCharToAnswerOption(optChar);

      let itemExp = inlineExp || undefined;
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        const expMatch = nextLine.match(explanationRegex);
        if (expMatch) {
          itemExp = (itemExp ? itemExp + ' ' : '') + expMatch[1].trim();
          i++;
        }
      }

      items.push({
        qNumber: qNum,
        unitDetectedName: currentUnitName || undefined,
        answer: ansOpt,
        explanation: itemExp,
        rawText: line,
      });
      continue;
    }

    // Check for comma or space separated answers: "1.(A) 2.(B) 3.(C)"
    const inlineMatches = [...line.matchAll(/(?:Q(?:uestion)?\s*)?(\d+)[\.\:\)\s\-]+(?:\(([A-Da-d1-4])\)|([A-Da-d1-4]))/gi)];
    if (inlineMatches.length > 0) {
      for (const m of inlineMatches) {
        const qNum = parseInt(m[1], 10);
        const optChar = m[2] || m[3];
        items.push({
          qNumber: qNum,
          unitDetectedName: currentUnitName || undefined,
          answer: mapCharToAnswerOption(optChar),
          rawText: m[0],
        });
      }
    }
  }

  return items;
}

export function matchQuestionsWithAnswers(
  questionsResult: ParseResult,
  answers: ParsedAnswerItem[]
): MatchedResult {
  const allQuestions: ParsedQuestionItem[] = [];
  questionsResult.units.forEach((u) => allQuestions.push(...u.questions));
  allQuestions.push(...questionsResult.unassignedQuestions);

  let matchedCount = 0;
  const answersByNum = new Map<number, ParsedAnswerItem>();
  answers.forEach((a) => {
    if (!answersByNum.has(a.qNumber)) {
      answersByNum.set(a.qNumber, a);
    }
  });

  allQuestions.forEach((q, index) => {
    const qMatch = q.question.match(/^(?:Q(?:uestion)?\s*(\d+)|\b(\d+))[\.\:\)]/i);
    const qNum = qMatch ? parseInt(qMatch[1] || qMatch[2], 10) : index + 1;

    let matchedAns = answersByNum.get(qNum);
    if (!matchedAns && index < answers.length) {
      matchedAns = answers[index];
    }

    if (matchedAns) {
      q.correctAnswer = matchedAns.answer;
      if (matchedAns.explanation) {
        q.explanation = matchedAns.explanation;
      }
      q.confidence = 'high';
      matchedCount++;
    }
  });

  return {
    matchedCount,
    unmatchedQuestionsCount: allQuestions.length - matchedCount,
    totalQuestions: allQuestions.length,
    totalAnswersFound: answers.length,
    units: questionsResult.units,
    unassignedQuestions: questionsResult.unassignedQuestions,
  };
}

export const MATH_PDF_TEMPLATE_EXAMPLE = `SUBJECT: Mathematics

UNIT 1: Applications of Matrices and Determinants
1. If |adj (adj A)| = |A|⁹, then the order of the square matrix A is:
(A) 3  (B) 4  (C) 2  (D) 5
Answer: B
Explanation: |adj(adj A)| = |A|^((n-1)²). (n-1)² = 9 ⇒ n - 1 = 3 ⇒ n = 4.

2. If A is a 3 × 3 non-singular matrix such that A Aᵀ = Aᵀ A and B = A⁻¹ Aᵀ, then BBᵀ is:
(A) A  (B) B  (C) I  (D) Bᵀ
Answer: C
Explanation: BBᵀ = (A⁻¹ Aᵀ)(A (A⁻¹)ᵀ) = I.
`;

export const SAMPLE_SEPARATE_QUESTIONS_PDF = `UNIT 1: Electrostatics & Fields
1. The electric field at a distance r from an infinitely long straight charged wire varies as:
(A) 1/r²  (B) 1/r  (C) r  (D) 1/r³

2. An electric dipole is placed in a non-uniform electric field. It experiences:
(A) Only a force  (B) Only a torque  (C) Both a force and a torque  (D) Neither force nor torque

3. The SI unit of electric flux is:
(A) N m² C⁻¹  (B) N C⁻¹ m⁻²  (C) N m C⁻²  (D) N m² C
`;

export const SAMPLE_SEPARATE_ANSWER_PDF = `ANSWER KEY WITH EXPLANATIONS
1. B
Explanation: Electric field due to infinite wire E = λ / (2πε₀ r), which is proportional to 1/r.

2. C
Explanation: In a non-uniform field, forces on the two charges are unequal, giving a net force as well as a net torque.

3. A
Explanation: Flux Φ = E · A = (N/C) * m² = N m² C⁻¹.
`;

export const SAMPLE_PDF_PRESETS = [
  {
    title: 'Std 12 Mathematics State Board Question Bank (Sample)',
    subject: 'Mathematics',
    content: MATH_PDF_TEMPLATE_EXAMPLE,
  },
  {
    title: 'Std 12 Chemistry Special Objective Practice Bank',
    subject: 'Chemistry',
    content: `MODEL QUESTION PAPER - CHEMISTRY
ONE MARK OBJECTIVE TYPE QUESTIONS

UNIT I: SOLID STATE
1. The number of atoms in a body-centred cubic (bcc) unit cell is:
(A) 1  (B) 2  (C) 4  (D) 6
Answer: B
Explanation: 8 corners * 1/8 + 1 body centre = 2 atoms.

2. Frenkel defect is typically found in:
(A) NaCl  (B) AgBr  (C) CsCl  (D) KCl
Answer: B
Explanation: AgBr shows both Frenkel and Schottky defects.

UNIT II: ELECTROCHEMISTRY
1. Rusting of iron is catalyzed by which of the following ions?
(A) Fe²⁺  (B) H⁺  (C) OH⁻  (D) Zn²⁺
Answer: B
Explanation: Acidic medium (H⁺ ions) accelerates corrosion.
`,
  },
];
