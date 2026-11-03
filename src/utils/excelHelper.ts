import * as XLSX from 'xlsx';
import { ExcelStudentRow } from '../types';

/**
 * Parses fraction scores like "12./20", "20./20.", "1./20", "9./12", "85%"
 */
function parseFractionScore(val: any): { earned: number; total: number; percent: number } | null {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  if (!str) return null;

  // Regex matching "12./20", "20./20.", "12/20", "6./12"
  const fractionMatch = str.match(/(\d+(?:\.\d+)?)\s*\.?\s*\/\s*(\d+(?:\.\d+)?)\.?/);
  if (fractionMatch) {
    const earned = parseFloat(fractionMatch[1]);
    const total = parseFloat(fractionMatch[2]);
    if (total > 0) {
      return { earned, total, percent: Math.round((earned / total) * 100) };
    }
  }

  // Percentage like "85%"
  if (str.includes('%')) {
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) return { earned: num, total: 100, percent: Math.round(num) };
  }

  // Plain number
  const num = parseFloat(str);
  if (!isNaN(num) && isFinite(num)) {
    if (num > 25) {
      return { earned: num, total: 100, percent: Math.min(100, Math.round(num)) };
    }
  }

  return null;
}

/**
 * Downloads a template replicating the Academy Multi-Session Grid format from the user's screenshot
 */
export function generateAcademyMatrixTemplate(): void {
  const headers = [
    'Student Name',
    'Class',
    'Assessment Category',
    'Day 1',
    'Day 2',
    'Day 3',
    'Day 4',
    'Day 5',
    'Day 6',
    'Day 7',
    'Day 8'
  ];

  const rows: (string | number)[][] = [
    headers,
    // Student 1: Jenny (Exact sample from image)
    ['Jenny', 'C2', 'Vocab', '', '12./20', '1./20', '20./20.', '18./20', '16./20', '19./20', '16./20'],
    ['Jenny', 'C2', 'Review Test', '', '6./12', '5./12.', '9./12', '8./12', '10./12', '8./12', '7./12'],
    ['Jenny', 'C2', 'Presentation Quality', 'B', 'B', 'A', 'A', 'A', 'A', 'A', 'A'],
    ['Jenny', 'C2', 'Writing HW (A,B,C...)', '', '', 'B', '', '', 'B', '', 'A'],
    ['Jenny', 'C2', 'Revised Essay HW (O,X)', '', '', '', 'B', '', '', 'B', ''],
    ['Jenny', 'C2', 'VOCAB Writing HW (O,X)', '', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['Jenny', 'C2', 'Daily comments', 'Hello! Good start', '', 'The student is very active and eager to learn', '', 'The student asks great questions', '', 'Focused participation', ''],
    ['Jenny', 'C2', "Parents or CM's Comments", '', '', '', '', '', '', '', ''],

    // Student 2: Kevin
    ['Kevin', 'C2', 'Vocab', '18./20', '19./20', '20./20.', '19./20', '20./20.', '17./20', '18./20', '20./20.'],
    ['Kevin', 'C2', 'Review Test', '10./12', '11./12', '10./12', '12./12', '11./12', '10./12', '11./12', '12./12'],
    ['Kevin', 'C2', 'Presentation Quality', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'],
    ['Kevin', 'C2', 'Writing HW (A,B,C...)', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'],
    ['Kevin', 'C2', 'Revised Essay HW (O,X)', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['Kevin', 'C2', 'VOCAB Writing HW (O,X)', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['Kevin', 'C2', 'Daily comments', 'Exemplary vocabulary and reading fluency', '', 'Active discussion leader', '', 'Flawless sentence construction', '', '', ''],
    ['Kevin', 'C2', "Parents or CM's Comments", '', '', '', '', '', '', '', ''],

    // Student 3: Alex
    ['Alex', 'C1', 'Vocab', '10./20', '11./20', '14./20', '15./20', '14./20', '16./20', '15./20', '17./20'],
    ['Alex', 'C1', 'Review Test', '5./12', '6./12', '7./12', '8./12', '7./12', '9./12', '8./12', '9./12'],
    ['Alex', 'C1', 'Presentation Quality', 'C', 'B', 'B', 'B', 'A', 'B', 'A', 'A'],
    ['Alex', 'C1', 'Writing HW (A,B,C...)', 'B', '', 'B', '', 'A', '', 'B', ''],
    ['Alex', 'C1', 'Revised Essay HW (O,X)', 'O', 'X', 'O', 'O', 'O', 'X', 'O', 'O'],
    ['Alex', 'C1', 'VOCAB Writing HW (O,X)', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['Alex', 'C1', 'Daily comments', 'Shows notable growth in confidence', '', 'Overcoming hesitation when speaking', '', 'Grammar foundation improving', '', '', ''],
    ['Alex', 'C1', "Parents or CM's Comments", '', '', '', '', '', '', '', '']
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet['!cols'] = [
    { wch: 16 }, // Student Name
    { wch: 10 }, // Class
    { wch: 28 }, // Assessment Category
    { wch: 12 }, // Day 1
    { wch: 12 }, // Day 2
    { wch: 12 }, // Day 3
    { wch: 12 }, // Day 4
    { wch: 12 }, // Day 5
    { wch: 12 }, // Day 6
    { wch: 12 }, // Day 7
    { wch: 12 }  // Day 8
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '세션별_성적_매트릭스');
  XLSX.writeFile(workbook, 'Academy_Grade_Matrix_Format_Sample.xlsx');
}

/**
 * Downloads standard flat single-row template
 */
export function generateSampleExcelTemplate(): void {
  const sampleData = [
    {
      '학생이름 (Student Name)': 'Sarah Kim (김서아)',
      '숙제 수행도 (Homework)': '100% 완료 (우수)',
      '단어시험 점수 (Vocab Score)': 98,
      '키워드 및 특징 (Keywords)': 'active participation, confident speaking, natural intonation, reads fluently',
      '선호 어조 (Tone)': 'encouraging',
      '반/그룹 (Class)': 'TOEFL Junior A반'
    },
    {
      '학생이름 (Student Name)': 'Minjun Park (박민준)',
      '숙제 수행도 (Homework)': '85% 대부분 제출',
      '단어시험 점수 (Vocab Score)': 72,
      '키워드 및 특징 (Keywords)': 'attentive listener, solid grammar, needs vocabulary reinforcement, eager to learn',
      '선호 어조 (Tone)': 'constructive',
      '반/그룹 (Class)': '중등 심화 B반'
    },
    {
      '학생이름 (Student Name)': 'David Lee (이다윗)',
      '숙제 수행도 (Homework)': '50% 미흡/지각',
      '단어시험 점수 (Vocab Score)': 95,
      '키워드 및 특징 (Keywords)': 'high potential, quick comprehension, excellent retention, needs homework consistency',
      '선호 어조 (Tone)': 'diplomatic',
      '반/그룹 (Class)': '초등 고학년 파워반'
    },
    {
      '학생이름 (Student Name)': 'Chloe Jung (정채원)',
      '숙제 수행도 (Homework)': '100% 성실 제출',
      '단어시험 점수 (Vocab Score)': 100,
      '키워드 및 특징 (Keywords)': 'leadership in discussions, rich vocabulary, flawless spelling, role model',
      '선호 어조 (Tone)': 'enthusiastic',
      '반/그룹 (Class)': 'TOEFL Junior A반'
    },
    {
      '학생이름 (Student Name)': 'Lucas Han (한승우)',
      '숙제 수행도 (Homework)': '60% 지각/누락',
      '단어시험 점수 (Vocab Score)': 62,
      '키워드 및 특징 (Keywords)': 'shy in speaking, creative writing ideas, requires step-by-step guidance, polite attitude',
      '선호 어조 (Tone)': 'encouraging',
      '반/그룹 (Class)': '중등 기초 C반'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  worksheet['!cols'] = [
    { wch: 22 },
    { wch: 20 },
    { wch: 15 },
    { wch: 45 },
    { wch: 16 },
    { wch: 20 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '학생명단_코멘트양식');
  XLSX.writeFile(workbook, 'English_Comment_Template_EduComment.xlsx');
}

/**
 * Intelligent parser for the Academy Multi-Session Grid format (as shown in the user's screenshot)
 */
function parseAcademyMatrix(raw2D: any[][]): ExcelStudentRow[] {
  interface StudentBlock {
    name: string;
    classGroup: string;
    vocabScores: number[];
    vocabDetails: string[];
    reviewTestScores: number[];
    presentations: string[];
    writingHwGrades: string[];
    revisedEssayHw: string[];
    vocabWritingHw: string[];
    dailyComments: string[];
    parentComments: string[];
  }

  const studentMap = new Map<string, StudentBlock>();
  let currentStudent = '';
  let currentClass = '';

  for (let r = 0; r < raw2D.length; r++) {
    const row = raw2D[r];
    if (!row || row.length === 0) continue;

    // Scan the first 4 columns to find the category/metric name
    let category = '';
    let categoryColIdx = -1;

    for (let c = 0; c < Math.min(row.length, 5); c++) {
      const cellVal = String(row[c] || '').trim();
      if (!cellVal) continue;

      if (/^vocab$/i.test(cellVal) || /단어/i.test(cellVal) || (/vocab/i.test(cellVal) && !/hw|writing/i.test(cellVal))) {
        category = 'vocab';
        categoryColIdx = c;
        break;
      } else if (/review\s*test|리뷰|위클리|monthly/i.test(cellVal)) {
        category = 'review_test';
        categoryColIdx = c;
        break;
      } else if (/presentation/i.test(cellVal) || /발표/i.test(cellVal)) {
        category = 'presentation';
        categoryColIdx = c;
        break;
      } else if (/writing\s*hw/i.test(cellVal) || /라이팅/i.test(cellVal)) {
        category = 'writing_hw';
        categoryColIdx = c;
        break;
      } else if (/revised\s*essay|essay\s*hw|에세이/i.test(cellVal)) {
        category = 'revised_essay';
        categoryColIdx = c;
        break;
      } else if (/vocab.*hw|vocab.*writing/i.test(cellVal) || /보카.*과제/i.test(cellVal)) {
        category = 'vocab_writing_hw';
        categoryColIdx = c;
        break;
      } else if (/daily\s*comment|데일리|코멘트|수업\s*메모/i.test(cellVal)) {
        category = 'daily_comments';
        categoryColIdx = c;
        break;
      } else if (/parent|counsel|학부모/i.test(cellVal)) {
        category = 'parents_comments';
        categoryColIdx = c;
        break;
      }
    }

    if (!category || categoryColIdx === -1) {
      continue;
    }

    // Now look before categoryColIdx to find student name & class
    for (let c = 0; c < categoryColIdx; c++) {
      const cellVal = String(row[c] || '').trim();
      if (!cellVal) continue;

      // Check if it looks like a class code (e.g. C1, C2, A반, B반, Level 3)
      if (/^[A-Z]\d+$/i.test(cellVal) || /반$|level|class|grade/i.test(cellVal)) {
        currentClass = cellVal;
      } else if (!/student|name|학생|이름|no|번호|class|반/i.test(cellVal)) {
        // It's a student name!
        currentStudent = cellVal;
      }
    }

    if (!currentStudent) {
      currentStudent = 'Student';
    }

    // Get or initialize student block
    if (!studentMap.has(currentStudent)) {
      studentMap.set(currentStudent, {
        name: currentStudent,
        classGroup: currentClass,
        vocabScores: [],
        vocabDetails: [],
        reviewTestScores: [],
        presentations: [],
        writingHwGrades: [],
        revisedEssayHw: [],
        vocabWritingHw: [],
        dailyComments: [],
        parentComments: []
      });
    }

    const block = studentMap.get(currentStudent)!;
    if (currentClass && !block.classGroup) {
      block.classGroup = currentClass;
    }

    // Extract values from session columns (columns after categoryColIdx)
    const sessionCells = row.slice(categoryColIdx + 1);

    for (const cell of sessionCells) {
      if (cell === null || cell === undefined) continue;
      const str = String(cell).trim();
      if (!str) continue;

      switch (category) {
        case 'vocab': {
          const parsed = parseFractionScore(str);
          if (parsed) {
            block.vocabScores.push(parsed.percent);
            block.vocabDetails.push(str);
          }
          break;
        }
        case 'review_test': {
          const parsed = parseFractionScore(str);
          if (parsed) {
            block.reviewTestScores.push(parsed.percent);
          }
          break;
        }
        case 'presentation': {
          if (/[A-D][+-]?/i.test(str)) {
            block.presentations.push(str.toUpperCase());
          }
          break;
        }
        case 'writing_hw': {
          if (/[A-D][+-]?|[OX]/i.test(str)) {
            block.writingHwGrades.push(str.toUpperCase());
          }
          break;
        }
        case 'revised_essay': {
          if (/[A-D][+-]?|[OX]/i.test(str)) {
            block.revisedEssayHw.push(str.toUpperCase());
          }
          break;
        }
        case 'vocab_writing_hw': {
          if (/[OX]/i.test(str) || /완료|제출/i.test(str)) {
            block.vocabWritingHw.push(str.toUpperCase());
          }
          break;
        }
        case 'daily_comments': {
          if (str.length > 3 && !/hello/i.test(str)) {
            block.dailyComments.push(str);
          }
          break;
        }
        case 'parents_comments': {
          if (str.length > 3) {
            block.parentComments.push(str);
          }
          break;
        }
      }
    }
  }

  // Convert each student block into rich ExcelStudentRow
  const results: ExcelStudentRow[] = [];
  let index = 0;

  for (const [studentName, data] of studentMap.entries()) {
    index++;

    // Calculate Vocab Score
    let avgVocab = 85;
    if (data.vocabScores.length > 0) {
      const sum = data.vocabScores.reduce((a, b) => a + b, 0);
      avgVocab = Math.round(sum / data.vocabScores.length);
    }

    // Review Test Score
    let avgReviewTest = 0;
    if (data.reviewTestScores.length > 0) {
      const sum = data.reviewTestScores.reduce((a, b) => a + b, 0);
      avgReviewTest = Math.round(sum / data.reviewTestScores.length);
    }

    // Presentation Quality Summary
    let presQualityStr = '';
    const aCount = data.presentations.filter(p => p.startsWith('A')).length;
    if (data.presentations.length > 0) {
      if (aCount >= data.presentations.length * 0.7) {
        presQualityStr = 'A (최우수 발표력)';
      } else if (aCount > 0) {
        presQualityStr = 'A/B (발표력 우수 및 지속 향상)';
      } else {
        presQualityStr = `${data.presentations[data.presentations.length - 1]}등급`;
      }
    }

    // Homework Evaluation
    const totalVocabHw = data.vocabWritingHw.length;
    const oVocabHwCount = data.vocabWritingHw.filter(h => h === 'O' || /완료|제출/.test(h)).length;
    const vocabHwRate = totalVocabHw > 0 ? Math.round((oVocabHwCount / totalVocabHw) * 100) : 100;

    let hwSummary = '';
    if (vocabHwRate === 100 && totalVocabHw > 0) {
      hwSummary = `100% 완료 (단어숙제 ${totalVocabHw}회 전회 O 성실 제출)`;
    } else if (vocabHwRate >= 80) {
      hwSummary = `${vocabHwRate}% 성실 제출 (양호)`;
    } else {
      hwSummary = `${vocabHwRate}% 미흡/보충 필요`;
    }

    if (data.writingHwGrades.length > 0) {
      hwSummary += `, 라이팅 과제 [${data.writingHwGrades.slice(0, 3).join(',')}]`;
    }

    // Synthesize Rich Pedagogical Keywords
    const keywordList: string[] = [];

    // Presentation feedback
    if (aCount >= 3) {
      keywordList.push('confident speaker', 'natural intonation', 'clear presentation delivery');
    } else if (data.presentations.length > 0) {
      keywordList.push('improving speaking courage', 'active participation in dialogue');
    }

    // Vocab & memory
    if (avgVocab >= 90) {
      keywordList.push('rich vocabulary retention', 'flawless spelling accuracy');
    } else if (avgVocab >= 75) {
      keywordList.push('solid vocabulary acquisition', 'applies new words in context');
    } else {
      keywordList.push('benefits from spaced repetition', 'needs steady vocabulary reinforcement');
    }

    // Review test
    if (avgReviewTest >= 75) {
      keywordList.push('strong review test comprehension', 'solid grammatical foundation');
    } else if (avgReviewTest > 0) {
      keywordList.push('steady review test progress', 'persistent effort and grit');
    }

    // Homework diligence
    if (vocabHwRate === 100) {
      keywordList.push('consistent study habits', 'exemplary homework responsibility');
    }

    // Incorporate daily comments
    if (data.dailyComments.length > 0) {
      const dailySummary = data.dailyComments.join('; ');
      if (dailySummary.toLowerCase().includes('active') || dailySummary.includes('적극')) {
        keywordList.push('active learner');
      }
      if (dailySummary.toLowerCase().includes('focus') || dailySummary.includes('집중')) {
        keywordList.push('high classroom focus');
      }
    }

    // Remove duplicates
    const uniqueKeywords = Array.from(new Set(keywordList)).slice(0, 5);
    const keywordsStr = uniqueKeywords.join(', ') || 'active participation, diligent effort';

    results.push({
      id: `matrix-${Date.now()}-${index}`,
      name: studentName,
      classGroup: data.classGroup || 'C2',
      vocabScore: avgVocab,
      homeworkStatus: hwSummary,
      homeworkRate: vocabHwRate,
      keywords: keywordsStr,
      sessionCount: Math.max(data.vocabScores.length, data.presentations.length, data.vocabWritingHw.length, 1),
      reviewTestScore: avgReviewTest || undefined,
      presentationQuality: presQualityStr || undefined,
      vocabWritingHwStatus: totalVocabHw > 0 ? `${oVocabHwCount}/${totalVocabHw} O` : undefined,
      dailyCommentsSummary: data.dailyComments.join(' | ') || undefined,
      formatType: 'matrix' as const,
      status: 'pending' as const
    });
  }

  return results;
}

/**
 * Universal file parser supporting both:
 * 1. Academy Multi-Session Grid format (user screenshot)
 * 2. Standard Flat Student Table format
 */
export async function parseUploadedExcel(file: File): Promise<ExcelStudentRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // 1. Check if this is an Academy Matrix Format (using raw 2D array)
        const raw2D: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        let isMatrixFormat = false;
        for (let r = 0; r < Math.min(raw2D.length, 20); r++) {
          const rowStr = (raw2D[r] || []).join(' ').toLowerCase();
          if (
            (rowStr.includes('vocab') || rowStr.includes('voca')) &&
            (rowStr.includes('review') || rowStr.includes('presentation') || rowStr.includes('daily comment') || rowStr.includes('writing hw'))
          ) {
            isMatrixFormat = true;
            break;
          }
        }

        if (isMatrixFormat) {
          const matrixResults = parseAcademyMatrix(raw2D);
          if (matrixResults.length > 0) {
            resolve(matrixResults);
            return;
          }
        }

        // 2. Standard Flat Table fallback
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          resolve([]);
          return;
        }

        const rows: ExcelStudentRow[] = rawJson.map((row, index) => {
          const nameKey = Object.keys(row).find(k => 
            /이름|학생|성명|name|student/i.test(k)
          );
          const rawName = nameKey ? String(row[nameKey]).trim() : `Student ${index + 1}`;

          const hwKey = Object.keys(row).find(k => 
            /숙제|과제|homework|hw|과제수행|assignment/i.test(k)
          );
          const rawHw = hwKey ? String(row[hwKey]).trim() : '100% 제출';

          const vocabKey = Object.keys(row).find(k => 
            /단어|보카|voca|vocab|test|시험|점수|단어점수/i.test(k)
          );
          let rawVocab = 85;
          if (vocabKey && row[vocabKey] !== undefined && row[vocabKey] !== '') {
            const parsed = parseFractionScore(row[vocabKey]);
            if (parsed) {
              rawVocab = parsed.percent;
            } else {
              const numOnly = parseInt(String(row[vocabKey]).replace(/[^0-9]/g, ''), 10);
              if (!isNaN(numOnly)) rawVocab = Math.min(100, Math.max(0, numOnly));
            }
          }

          const kwKey = Object.keys(row).find(k => 
            /키워드|특징|메모|코멘트|keyword|notes|characteristics|tags/i.test(k)
          );
          const rawKw = kwKey ? String(row[kwKey]).trim() : 'active participation, diligent learner';

          const classKey = Object.keys(row).find(k => 
            /반|학급|그룹|class|group|grade/i.test(k)
          );
          const rawClass = classKey ? String(row[classKey]).trim() : '';

          const toneKey = Object.keys(row).find(k => 
            /어조|톤|tone|manner/i.test(k)
          );
          const rawTone = toneKey ? String(row[toneKey]).toLowerCase().trim() : undefined;

          return {
            id: `row-${Date.now()}-${index}`,
            name: rawName,
            homeworkStatus: rawHw,
            vocabScore: rawVocab,
            keywords: rawKw,
            classGroup: rawClass,
            tone: rawTone,
            formatType: 'standard' as const,
            status: 'pending' as const
          };
        }).filter(r => r.name.length > 0);

        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Exports results to Excel
 */
export function exportResultsToExcel(rows: ExcelStudentRow[], filename = 'EduComment_Student_Feedback_Results.xlsx'): void {
  const exportData = rows.map((r, i) => ({
    '번호 (No)': i + 1,
    '학생이름 (Student Name)': r.name,
    '반/그룹 (Class)': r.classGroup || '-',
    '단어시험 점수 (Vocab Score)': r.vocabScore,
    '리뷰테스트 점수 (Review Test)': r.reviewTestScore ? `${r.reviewTestScore}점` : '-',
    '발표 평가 (Presentation)': r.presentationQuality || '-',
    '숙제 수행도 (Homework)': r.homeworkStatus,
    '키워드 (Keywords)': r.keywords,
    '영문 총평 코멘트 (English Overall Comment)': r.generatedComment || '생성 대기 중',
    '숙제 피드백 (HW Feedback)': r.homeworkFeedback || '-',
    '단어시험 피드백 (Vocab Feedback)': r.vocabFeedback || '-',
    '다음 목표 (Actionable Goal)': r.actionableGoals || '-',
    '한국어 번역/가이드 (Korean Translation)': r.koreanSummary || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  worksheet['!cols'] = [
    { wch: 8 },  // No
    { wch: 20 }, // Name
    { wch: 14 }, // Class
    { wch: 14 }, // Vocab Score
    { wch: 16 }, // Review Test
    { wch: 18 }, // Presentation
    { wch: 24 }, // Homework
    { wch: 32 }, // Keywords
    { wch: 60 }, // English Comment
    { wch: 35 }, // HW Feedback
    { wch: 35 }, // Vocab Feedback
    { wch: 35 }, // Goal
    { wch: 60 }  // Korean Summary
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '학생_영문코멘트_결과');
  XLSX.writeFile(workbook, filename);
}
