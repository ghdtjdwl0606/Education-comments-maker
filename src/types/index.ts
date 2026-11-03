export type ToneOption = 
  | 'encouraging' 
  | 'academic' 
  | 'constructive' 
  | 'enthusiastic' 
  | 'diplomatic' 
  | 'concise';

export type LengthOption = 'short' | 'medium' | 'detailed';

export type GradeLevel = 'elementary' | 'middle' | 'high';

export type GenderPronoun = 'neutral' | 'he' | 'she';

export type HomeworkStatus = 'perfect' | 'good' | 'inconsistent' | 'poor';

export interface StudentInput {
  id?: string;
  name: string;
  pronoun?: GenderPronoun;
  gradeLevel?: GradeLevel;
  keywords: string[];
  homeworkStatus: HomeworkStatus;
  homeworkRate?: number; // 0-100%
  homeworkNote?: string;
  vocabScore: number; // 0-100
  vocabMaxScore?: number;
  vocabNote?: string;
  tone: ToneOption;
  length: LengthOption;
  customNote?: string;
}

export interface GeneratedCommentResponse {
  overallComment: string;
  homeworkFeedback: string;
  vocabFeedback: string;
  actionableGoals: string;
  koreanSummary: string;
  alternativePhrasings?: string[];
}

export interface ExcelStudentRow {
  id: string;
  name: string;
  homeworkStatus: string;
  homeworkRate?: number;
  vocabScore: number;
  keywords: string;
  classGroup?: string;
  tone?: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  generatedComment?: string;
  homeworkFeedback?: string;
  vocabFeedback?: string;
  actionableGoals?: string;
  koreanSummary?: string;
  errorMessage?: string;

  // Multi-Session Matrix Details (from Academy grade tracking format)
  sessionCount?: number;
  reviewTestScore?: number;
  presentationQuality?: string;
  vocabWritingHwStatus?: string;
  dailyCommentsSummary?: string;
  formatType?: 'matrix' | 'standard';
}

export interface ToneMeta {
  id: ToneOption;
  label: string;
  koreanLabel: string;
  description: string;
  badgeColor: string;
  iconName: string;
  exampleExcerpt: string;
}
