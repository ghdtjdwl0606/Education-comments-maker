import { ToneMeta } from '../types';

export const TONE_DEFINITIONS: ToneMeta[] = [
  {
    id: 'encouraging',
    label: 'Encouraging & Warm',
    koreanLabel: '따뜻하고 격려하는 톤',
    description: '노력과 성장을 칭찬하며, 학생에게 자신감과 안정감을 불어넣는 따스한 어조',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    iconName: 'HeartHandshake',
    exampleExcerpt: '"Sarah has shown heartwarming commitment... With continued encouragement, she will flourish."'
  },
  {
    id: 'academic',
    label: 'Academic & Professional',
    koreanLabel: '전문적·학술적 톤',
    description: '공식 성적표나 진학 상담에 최적화된 객관적이고 품격 있는 학업 중심 어조',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    iconName: 'GraduationCap',
    exampleExcerpt: '"Demonstrates solid academic progress across core competencies with exemplary retention."'
  },
  {
    id: 'constructive',
    label: 'Constructive & Growth-Oriented',
    koreanLabel: '성장 중심·건설적 조언',
    description: '학생의 장점을 인정하면서도, 다음 단계로 도약하기 위한 구체적인 개선점 제시',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
    iconName: 'Compass',
    exampleExcerpt: '"Possesses tremendous potential. Establishing a structured routine for assignments is essential."'
  },
  {
    id: 'enthusiastic',
    label: 'Enthusiastic & Upbeat',
    koreanLabel: '열정적·칭찬 가득한 톤',
    description: '생동감 넘치고 에너지가 넘치며, 저학년이나 긍정적 자극이 필요한 학생에게 제격',
    badgeColor: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100',
    iconName: 'Sparkles',
    exampleExcerpt: '"A stellar presence in our classroom! Superb work and contagious enthusiasm—keep shining!"'
  },
  {
    id: 'diplomatic',
    label: 'Diplomatic & Parent-Report',
    koreanLabel: '학부모 전달용 정중한 톤',
    description: '가정과의 소통과 연계를 중시하며, 정중하고 균형 잡힌 학부모 가정통신문 스타일',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    iconName: 'MailCheck',
    exampleExcerpt: '"We appreciate your partnership at home. With ongoing support, she will achieve great success."'
  },
  {
    id: 'concise',
    label: 'Concise & Crisp',
    koreanLabel: '핵심 요약형 톤',
    description: '글자 수 제한이 있는 시스템이나 간결한 리포트 작성을 위한 핵심 2~3문장 압축 어조',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200',
    iconName: 'Zap',
    exampleExcerpt: '"Exhibits consistent effort in class with strong vocabulary scores. Daily review is advised."'
  }
];
