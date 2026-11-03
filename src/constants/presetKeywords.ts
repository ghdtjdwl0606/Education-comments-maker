export interface KeywordItem {
  en: string;
  ko: string;
}

export interface KeywordCategory {
  id: string;
  nameKo: string;
  nameEn: string;
  color: string;
  items: KeywordItem[];
}

export const PRESET_KEYWORD_CATEGORIES: KeywordCategory[] = [
  {
    id: 'attitude',
    nameKo: '수업 태도 & 참여도',
    nameEn: 'Attitude & Engagement',
    color: 'emerald',
    items: [
      { en: 'active participation', ko: '적극적인 수업 참여' },
      { en: 'attentive listener', ko: '주의 깊은 경청' },
      { en: 'eager to share ideas', ko: '자신의 생각을 열정적으로 발표함' },
      { en: 'leadership in group tasks', ko: '모둠 활동에서의 리더십' },
      { en: 'positive learning attitude', ko: '긍정적인 학습 태도' },
      { en: 'enthusiastic and energetic', ko: '열정적이고 활기찬 자세' },
      { en: 'respectful classroom demeanor', ko: '예의 바른 수업 예절' },
      { en: 'needs encouragement to speak up', ko: '자신감 북돋움이 필요함' },
      { en: 'easily distracted at times', ko: '가끔 집중이 흐트러질 때가 있음' },
      { en: 'quiet but deeply focused', ko: '조용하지만 깊이 집중함' }
    ]
  },
  {
    id: 'vocab',
    nameKo: '어휘력 & 단어 암기',
    nameEn: 'Vocabulary & Spelling',
    color: 'blue',
    items: [
      { en: 'rich vocabulary retention', ko: '풍부한 단어 기억력' },
      { en: 'rapid word acquisition', ko: '새로운 단어의 빠른 습득' },
      { en: 'applies new words in context', ko: '문맥에 맞게 새 단어를 응용함' },
      { en: 'spelling accuracy', ko: '철자 정확도' },
      { en: 'expanding word bank', ko: '지속적으로 어휘량 확장 중' },
      { en: 'consistently prepares for vocab tests', ko: '단어 시험을 꾸준히 성실하게 준비함' },
      { en: 'struggles with spelling irregular forms', ko: '불규칙 형태 철자 복습 필요' },
      { en: 'needs spaced repetition review', ko: '주기적인 누적 단어 복습 권장' },
      { en: 'excellent memory for idioms', ko: '숙어 및 관용구 암기력 우수' }
    ]
  },
  {
    id: 'speaking',
    nameKo: '말하기 & 발음',
    nameEn: 'Speaking & Pronunciation',
    color: 'amber',
    items: [
      { en: 'confident speaker', ko: '자신감 있는 스피킹' },
      { en: 'natural intonation and rhythm', ko: '자연스러운 억양과 리듬감' },
      { en: 'clear and expressive delivery', ko: '명확하고 표현력 있는 전달' },
      { en: 'fluent conversational ability', ko: '유창한 대화 구사력' },
      { en: 'expanding sentence complexity', ko: '문장 구조를 점점 다양하게 발전시킴' },
      { en: 'hesitates when forming sentences', ko: '문장 말할 때 다소 머뭇거림' },
      { en: 'pauses to mentally translate', ko: '머릿속으로 번역하느라 멈춤' },
      { en: 'shows great courage when speaking', ko: '틀리는 것을 두려워하지 않는 용기' }
    ]
  },
  {
    id: 'reading_grammar',
    nameKo: '독해 & 문법',
    nameEn: 'Reading & Grammar',
    color: 'purple',
    items: [
      { en: 'strong reading comprehension', ko: '뛰어난 독해 이해력' },
      { en: 'reads fluently with expression', ko: '표현력을 살려 유창하게 읽음' },
      { en: 'grasps main ideas and inferences', ko: '주제 파악 및 행간 추론 능력 탁월' },
      { en: 'solid grammatical foundation', ko: '탄탄한 기초 문법 지식' },
      { en: 'accurate tense usage', ko: '정확한 시제 활용' },
      { en: 'analyzes complex sentence structures', ko: '복잡한 문장 구조를 분석해냄' },
      { en: 'minor subject-verb agreement slips', ko: '주어-동사 수일치 실수 주의' },
      { en: 'benefits from reading aloud', ko: '소리 내어 읽기가 큰 도움이 됨' }
    ]
  },
  {
    id: 'growth',
    nameKo: '성장 & 학습 습관',
    nameEn: 'Growth & Study Habits',
    color: 'rose',
    items: [
      { en: 'notable progress this semester', ko: '이번 학기 눈부신 성장' },
      { en: 'highly receptive to feedback', ko: '선생님의 피드백을 적극 수용함' },
      { en: 'persistent effort and grit', ko: '포기하지 않는 끈기와 노력' },
      { en: 'self-motivated independent learner', ko: '스스로 학습하는 자기주도성' },
      { en: 'great potential for higher levels', ko: '상위 레벨 진급 잠재력 충분' },
      { en: 'benefits from steady routine', ko: '일정한 학습 루틴 유지가 핵심' },
      { en: 'shows growing curiosity', ko: '배움에 대한 호기심이 날로 커짐' }
    ]
  }
];

export const PRESET_STUDENT_EXAMPLES = [
  {
    label: '🌟 완벽 우수 모범생 (Sarah)',
    name: 'Sarah Kim',
    pronoun: 'she' as const,
    gradeLevel: 'middle' as const,
    keywords: ['active participation', 'leadership in group tasks', 'rich vocabulary retention', 'confident speaker'],
    homeworkStatus: 'perfect' as const,
    homeworkRate: 100,
    homeworkNote: 'Workbook and grammar essays completed with full diligence',
    vocabScore: 98,
    vocabNote: 'Missed only 1 question across all weekly tests',
    tone: 'encouraging' as const,
    length: 'detailed' as const,
    customNote: 'Always helps peers and acts as a positive classroom role model.'
  },
  {
    label: '💡 잠재력 높지만 숙제 미흡 (David)',
    name: 'David Lee',
    pronoun: 'he' as const,
    gradeLevel: 'elementary' as const,
    keywords: ['high potential', 'rapid word acquisition', 'clear and expressive delivery', 'benefits from steady routine'],
    homeworkStatus: 'inconsistent' as const,
    homeworkRate: 65,
    homeworkNote: 'Submits 2-3 days late occasionally, lacks daily consistency',
    vocabScore: 92,
    vocabNote: 'Learns words rapidly in class but forgets without homework reinforcement',
    tone: 'constructive' as const,
    length: 'medium' as const,
    customNote: 'Needs warm encouragement to maintain a fixed 30-minute daily study time at home.'
  },
  {
    label: '🌱 성실하지만 소심한 노력파 (Chloe)',
    name: 'Chloe Min',
    pronoun: 'she' as const,
    gradeLevel: 'middle' as const,
    keywords: ['attentive listener', 'solid grammatical foundation', 'needs encouragement to speak up', 'persistent effort and grit'],
    homeworkStatus: 'perfect' as const,
    homeworkRate: 100,
    homeworkNote: 'Handwriting is very neat and assignments are always on time',
    vocabScore: 84,
    vocabNote: 'Consistently studies and scores in the 80s',
    tone: 'encouraging' as const,
    length: 'detailed' as const,
    customNote: 'Needs extra confidence boosting for oral presentation and answering in front of class.'
  },
  {
    label: '🚀 활기차고 에너지 넘치는 학생 (Lucas)',
    name: 'Lucas Han',
    pronoun: 'he' as const,
    gradeLevel: 'elementary' as const,
    keywords: ['enthusiastic and energetic', 'eager to share ideas', 'expanding word bank', 'easily distracted at times'],
    homeworkStatus: 'good' as const,
    homeworkRate: 85,
    homeworkNote: 'Submits most assignments with creative illustrations',
    vocabScore: 78,
    vocabNote: 'Spelling mistakes in longer words, but meanings are grasped',
    tone: 'enthusiastic' as const,
    length: 'medium' as const,
    customNote: 'Keep his joyful excitement for English alive while helping him build focus.'
  }
];
