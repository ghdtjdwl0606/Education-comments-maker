import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  RotateCw, 
  BookOpen, 
  Check, 
  HelpCircle, 
  Sliders, 
  Award, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  X, 
  HeartHandshake, 
  GraduationCap, 
  Compass, 
  MailCheck, 
  Zap,
  Printer,
  Languages,
  CheckCircle2
} from 'lucide-react';
import { StudentInput, GeneratedCommentResponse, ToneOption, HomeworkStatus, LengthOption, GradeLevel, GenderPronoun } from '../types';
import { PRESET_KEYWORD_CATEGORIES, PRESET_STUDENT_EXAMPLES } from '../constants/presetKeywords';
import { TONE_DEFINITIONS } from '../constants/toneDefinitions';

interface SingleStudentGeneratorProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenReportCard: (studentData: { name: string; comment: GeneratedCommentResponse; vocabScore: number; hwStatus: string }) => void;
}

export const SingleStudentGenerator: React.FC<SingleStudentGeneratorProps> = ({ onShowToast, onOpenReportCard }) => {
  // Form State
  const [name, setName] = useState('Sarah Kim');
  const [pronoun, setPronoun] = useState<GenderPronoun>('she');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('middle');
  const [keywords, setKeywords] = useState<string[]>([
    'active participation',
    'rich vocabulary retention',
    'confident speaker',
    'leadership in group tasks'
  ]);
  const [customKeywordInput, setCustomKeywordInput] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('attitude');

  // Homework & Vocab
  const [homeworkStatus, setHomeworkStatus] = useState<HomeworkStatus>('perfect');
  const [homeworkRate, setHomeworkRate] = useState<number>(100);
  const [homeworkNote, setHomeworkNote] = useState('');
  
  const [vocabScore, setVocabScore] = useState<number>(95);
  const [vocabNote, setVocabNote] = useState('');

  // Tone & Length
  const [tone, setTone] = useState<ToneOption>('encouraging');
  const [length, setLength] = useState<LengthOption>('medium');
  const [customNote, setCustomNote] = useState('');

  // Generation state
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratedCommentResponse | null>({
    overallComment: "Sarah has shown heartwarming commitment and enthusiasm in English class this term. Throughout our sessions, she has consistently displayed active participation, rich vocabulary retention, confident speaking, and leadership in group tasks, bringing wonderful energy to group discussions and daily learning. Her diligent study habits are clearly reflected in outstanding vocabulary scores and reliable homework completion. With continued encouragement, I am confident she will continue to flourish and build lasting confidence in English.",
    homeworkFeedback: "Always submits homework meticulously and ahead of time, showing exemplary responsibility.",
    vocabFeedback: "Outstanding vocabulary mastery (95%). Demonstrates deep word retention and accurately applies words in context.",
    actionableGoals: "Next Goal: Expand into advanced reading passages and incorporate newly learned idioms into expressive writing.",
    koreanSummary: "[학부모 전달 요약 / 따뜻하고 격려하는 어조] Sarah Kim 학생은 수업 중 [active participation, rich vocabulary retention, confident speaker, leadership in group tasks] 측면에서 두드러진 참여와 성장을 보였습니다. 단어시험 결과(95점) 및 숙제 수행도(완벽)를 반영하여 긍정적인 성취를 격려하고, 앞으로의 실력 향상을 위한 맞춤형 학습 조언을 제공합니다.",
    alternativePhrasings: [
      "It is a genuine pleasure teaching Sarah Kim, who approaches English lessons with curiosity and a commendable focus on active participation, rich vocabulary retention, confident speaking, and leadership in group tasks. With steady guidance, she will reach even greater heights.",
      "Sarah Kim is an earnest learner whose dedication to active participation, rich vocabulary retention, confident speaking, and leadership in group tasks makes our classroom a brighter place. Keep up the fantastic effort!"
    ]
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showKorean, setShowKorean] = useState(true);

  // Load Preset
  const handleLoadPreset = (example: typeof PRESET_STUDENT_EXAMPLES[0]) => {
    setName(example.name);
    setPronoun(example.pronoun);
    setGradeLevel(example.gradeLevel);
    setKeywords(example.keywords);
    setHomeworkStatus(example.homeworkStatus);
    setHomeworkRate(example.homeworkRate);
    setHomeworkNote(example.homeworkNote);
    setVocabScore(example.vocabScore);
    setVocabNote(example.vocabNote);
    setTone(example.tone);
    setLength(example.length);
    setCustomNote(example.customNote);
    onShowToast(`'${example.name}' 예시 프로필을 불러왔습니다.`, 'info');
  };

  // Keyword Toggle
  const toggleKeyword = (kw: string) => {
    if (keywords.includes(kw)) {
      setKeywords(keywords.filter(k => k !== kw));
    } else {
      setKeywords([...keywords, kw]);
    }
  };

  // Add Custom Keyword
  const handleAddCustomKeyword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customKeywordInput.trim();
    if (!trimmed) return;
    if (!keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setCustomKeywordInput('');
    } else {
      onShowToast('이미 추가된 키워드입니다.', 'info');
    }
  };

  // Generate Handler
  const handleGenerate = async () => {
    if (!name.trim()) {
      onShowToast('학생 이름을 입력해주세요.', 'error');
      return;
    }

    if (keywords.length === 0) {
      onShowToast('키워드를 최소 1개 이상 선택하거나 입력해주세요.', 'error');
      return;
    }

    setIsLoading(true);

    const payload: StudentInput = {
      name: name.trim(),
      pronoun,
      gradeLevel,
      keywords,
      homeworkStatus,
      homeworkRate,
      homeworkNote: homeworkNote.trim() || undefined,
      vocabScore,
      vocabNote: vocabNote.trim() || undefined,
      tone,
      length,
      customNote: customNote.trim() || undefined
    };

    try {
      const response = await fetch('/api/generate-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setResult(resData.data);
        onShowToast(`${name} 학생의 맞춤 영문 코멘트가 생성되었습니다!`, 'success');
      } else {
        throw new Error(resData.error || '생성 실패');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      onShowToast('서버 연결 중 오류가 발생하여 내장 엔진으로 코멘트를 생성했습니다.', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy helpers
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    onShowToast(`${label} 클립보드에 복사되었습니다!`, 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleCopyFullReport = () => {
    if (!result) return;
    const fullText = `[Student: ${name} | Vocab: ${vocabScore}/100 | HW: ${homeworkStatus.toUpperCase()}]
${result.overallComment}

[Homework & Study Habits]
${result.homeworkFeedback}

[Vocabulary & Memory Mastery]
${result.vocabFeedback}

[Actionable Goal]
${result.actionableGoals}`;
    handleCopy(fullText, '영문 리포트 전체 (한국어 제외)');
  };

  const handleSwapAlternative = (altText: string) => {
    if (!result) return;
    setResult({
      ...result,
      overallComment: altText
    });
    onShowToast('선택한 대안 문장으로 교체되었습니다.', 'success');
  };

  return (
    <div className="space-y-8">
      
      {/* Quick Example Preset Chips */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs sm:text-sm font-semibold text-slate-800">
              ⚡ 원클릭 예시 프로필 불러오기 (다양한 학생 유형 체험)
            </span>
          </div>
          <span className="text-xs text-slate-500">클릭 시 이름, 점수, 키워드, 톤이 자동 세팅됩니다</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PRESET_STUDENT_EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => handleLoadPreset(ex)}
              className="text-left px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 text-xs font-medium text-slate-700 transition-all shadow-xs flex items-center justify-between group"
            >
              <span className="font-semibold text-slate-800 group-hover:text-indigo-700">{ex.label}</span>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">V:{ex.vocabScore}점</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Student Basic Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">1</span>
              학생 기본 정보
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  학생 이름 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: Sarah Kim, 박민준"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  대명사 (Pronoun)
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPronoun('she')}
                    className={`py-1.5 text-xs font-medium rounded-lg transition-all ${pronoun === 'she' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    She / Her
                  </button>
                  <button
                    type="button"
                    onClick={() => setPronoun('he')}
                    className={`py-1.5 text-xs font-medium rounded-lg transition-all ${pronoun === 'he' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    He / Him
                  </button>
                  <button
                    type="button"
                    onClick={() => setPronoun('neutral')}
                    className={`py-1.5 text-xs font-medium rounded-lg transition-all ${pronoun === 'neutral' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    이름 중심
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  학년 / 학습 단계
                </label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900"
                >
                  <option value="elementary">초등 (Elementary)</option>
                  <option value="middle">중등 (Middle School)</option>
                  <option value="high">고등/성인 (High/Advanced)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Homework & Vocabulary Test Assessment */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">2</span>
                숙제 수행도 &amp; 단어시험 결과
              </span>
              <span className="text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                피드백 자동 생성 반영
              </span>
            </h3>

            {/* Homework Section */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>📖 숙제 (Homework) 수행 상태</span>
                </label>
                <span className="text-xs text-slate-500">완료율: {homeworkRate}%</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'perfect', label: '100% 완벽 제출', sub: '성실·시간엄수', color: 'border-emerald-500 bg-emerald-50/60 text-emerald-800', rate: 100 },
                  { id: 'good', label: '대부분 제출', sub: '80~90% 양호', color: 'border-blue-500 bg-blue-50/60 text-blue-800', rate: 85 },
                  { id: 'inconsistent', label: '지각/미흡', sub: '50~70% 불규칙', color: 'border-amber-500 bg-amber-50/60 text-amber-800', rate: 60 },
                  { id: 'poor', label: '상습 미제출', sub: '관리 및 지도 필요', color: 'border-rose-500 bg-rose-50/60 text-rose-800', rate: 30 },
                ].map((hw) => (
                  <button
                    key={hw.id}
                    type="button"
                    onClick={() => {
                      setHomeworkStatus(hw.id as HomeworkStatus);
                      setHomeworkRate(hw.rate);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      homeworkStatus === hw.id
                        ? `${hw.color} font-bold shadow-xs ring-1 ring-inset`
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">{hw.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{hw.sub}</div>
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={homeworkNote}
                onChange={(e) => setHomeworkNote(e.target.value)}
                placeholder="선택: 숙제 관련 추가 메모 (예: 워크북 유닛 3 오답노트 작성 우수)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
              />
            </div>

            {/* Vocabulary Test Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>📝 단어시험 (Vocabulary Test) 결과</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    vocabScore >= 90 ? 'bg-emerald-100 text-emerald-800' :
                    vocabScore >= 80 ? 'bg-blue-100 text-blue-800' :
                    vocabScore >= 70 ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {vocabScore} / 100점 ({vocabScore >= 90 ? '최우수' : vocabScore >= 80 ? '우수' : vocabScore >= 70 ? '보통' : '보충 필요'})
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={vocabScore}
                  onChange={(e) => setVocabScore(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex gap-1.5">
                    {[100, 95, 85, 75, 60, 45].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setVocabScore(score)}
                        className={`px-2 py-0.5 rounded-md border text-[10px] font-medium transition-all ${
                          vocabScore === score
                            ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {score}점
                      </button>
                    ))}
                  </div>
                  <span>0점 ~ 100점</span>
                </div>
              </div>

              <input
                type="text"
                value={vocabNote}
                onChange={(e) => setVocabNote(e.target.value)}
                placeholder="선택: 단어시험 특이사항 (예: 불규칙 동사 암기 보충 요망, 어휘 적용력 뛰어남)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
              />
            </div>

          </div>

          {/* Section 3: English Keywords Selection */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">3</span>
                영어 키워드 선택 (자연스러운 문장 조합)
              </h3>
              <span className="text-xs text-indigo-600 font-medium">
                선택됨: {keywords.length}개
              </span>
            </div>

            {/* Selected Keywords Pill Container */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 min-h-[46px] flex flex-wrap gap-1.5 items-center">
              {keywords.length === 0 ? (
                <span className="text-xs text-slate-400 italic">
                  아래 카테고리에서 키워드를 클릭하거나 직접 입력해 추가하세요.
                </span>
              ) : (
                keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-100/80 text-indigo-800 border border-indigo-200 shadow-2xs group"
                  >
                    <span>{kw}</span>
                    <button
                      type="button"
                      onClick={() => toggleKeyword(kw)}
                      className="text-indigo-500 hover:text-indigo-900 group-hover:scale-110 transition-transform"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Custom Keyword Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customKeywordInput}
                onChange={(e) => setCustomKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomKeyword();
                  }
                }}
                placeholder="직접 영문 키워드 입력 (예: curious, asks thoughtful questions) 후 Enter"
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
              />
              <button
                type="button"
                onClick={() => handleAddCustomKeyword()}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                추가
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-100">
              {PRESET_KEYWORD_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.nameKo}
                </button>
              ))}
            </div>

            {/* Category Keyword Chips */}
            <div className="flex flex-wrap gap-2 pt-1 max-h-48 overflow-y-auto pr-1">
              {PRESET_KEYWORD_CATEGORIES.find(c => c.id === activeCategory)?.items.map((item, idx) => {
                const isSelected = keywords.includes(item.en);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleKeyword(item.en)}
                    className={`text-left px-2.5 py-1.5 rounded-xl border text-xs transition-all flex flex-col ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-1 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-medium">{item.en}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{item.ko}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Tone & Manner, Length, Additional Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">4</span>
              톤앤매너 (Tone &amp; Manner) 및 분량 설정
            </h3>

            {/* Tone Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {TONE_DEFINITIONS.map((t) => {
                const isSelected = tone === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? `${t.badgeColor} ring-2 ring-indigo-500 font-medium shadow-xs`
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{t.koreanLabel}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <div className="text-[11px] text-slate-600 line-clamp-2 leading-snug">
                      {t.description}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Length & Custom prompt */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">코멘트 분량</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setLength('short')}
                    className={`py-1.5 rounded-lg text-center ${length === 'short' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'}`}
                  >
                    간결 (2문장)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLength('medium')}
                    className={`py-1.5 rounded-lg text-center ${length === 'medium' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'}`}
                  >
                    표준 (3-4문장)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLength('detailed')}
                    className={`py-1.5 rounded-lg text-center ${length === 'detailed' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'}`}
                  >
                    상세 (리포트용)
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">선택: 특이사항 및 지도 조언</label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="예: 다음 달 파이널 스피킹 콘테스트 준비 언급, 가정학습 지도 강조"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                />
              </div>
            </div>

          </div>

          {/* Generate Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGenerate}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RotateCw className="w-5 h-5 animate-spin" />
                <span>영문 코멘트 &amp; 맞춤 피드백 생성 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>자연스러운 영문 코멘트 생성하기</span>
              </>
            )}
          </button>

        </div>

        {/* Right Column: Generated Result Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            
            {/* Result Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/30 flex items-center justify-center text-indigo-300">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">
                    {name || 'Student'} 영문 코멘트 &amp; 리포트
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-300">
                    <span>단어: {vocabScore}점</span>
                    <span>•</span>
                    <span>숙제: {homeworkStatus.toUpperCase()}</span>
                    <span>•</span>
                    <span className="text-indigo-300">{TONE_DEFINITIONS.find(t => t.id === tone)?.koreanLabel}</span>
                  </div>
                </div>
              </div>

              {result && (
                <button
                  type="button"
                  onClick={handleCopyFullReport}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  title="한국어 번역을 제외하고 영문 총평과 세부 피드백만 복사합니다"
                >
                  <Copy className="w-3.5 h-3.5" />
                  영문 전체 복사
                </button>
              )}
            </div>

            {/* Result Body */}
            {result ? (
              <div className="p-5 space-y-5">
                
                {/* 1. Overall Comment Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <span>영문 총평 코멘트 (Overall Comment)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(result.overallComment, '영문 총평 코멘트')}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      복사
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-slate-800 text-sm leading-relaxed font-normal selection:bg-indigo-200">
                    {result.overallComment}
                  </div>
                </div>

                {/* 2. Homework & Vocab Feedbacks */}
                <div className="grid grid-cols-1 gap-2.5">
                  
                  {/* Homework Feedback */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-600 font-bold">
                      <span className="flex items-center gap-1.5 text-slate-800">
                        <span>📖 숙제 피드백 (Homework Feedback)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(result.homeworkFeedback, '숙제 피드백')}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-slate-700 leading-normal">
                      {result.homeworkFeedback}
                    </p>
                  </div>

                  {/* Vocab Feedback */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-600 font-bold">
                      <span className="flex items-center gap-1.5 text-slate-800">
                        <span>📝 단어시험 피드백 (Vocab Feedback)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(result.vocabFeedback, '단어시험 피드백')}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-slate-700 leading-normal">
                      {result.vocabFeedback}
                    </p>
                  </div>

                  {/* Actionable Goal */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-emerald-900 font-bold">
                      <span>🎯 다음 달 목표 &amp; 학습 조언 (Actionable Goal)</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(result.actionableGoals, '학습 조언')}
                        className="text-emerald-600 hover:text-emerald-800"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-emerald-950 font-medium leading-normal">
                      {result.actionableGoals}
                    </p>
                  </div>

                </div>

                {/* 3. Korean Summary / Parent Guide Toggle */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowKorean(!showKorean)}
                    className="w-full px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200/70 text-left flex items-center justify-between text-xs font-bold text-slate-700 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-indigo-600" />
                      <span>한국어 번역 및 학부모 상담 가이드</span>
                    </span>
                    {showKorean ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  {showKorean && (
                    <div className="p-3.5 bg-white text-xs text-slate-700 leading-relaxed border-t border-slate-200">
                      <p>{result.koreanSummary}</p>
                      <div className="mt-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleCopy(result.koreanSummary, '한국어 번역 및 가이드')}
                          className="text-indigo-600 hover:text-indigo-800 text-[11px] font-semibold inline-flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          한국어 가이드 복사
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Alternative Phrasings */}
                {result.alternativePhrasings && result.alternativePhrasings.length > 0 && (
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-600">
                      💡 다른 뉘앙스의 대안 문장 (클릭 시 본문 교체):
                    </span>
                    <div className="space-y-2">
                      {result.alternativePhrasings.map((alt, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/20 transition-all flex flex-col gap-1.5"
                        >
                          <p className="italic text-slate-800">{alt}</p>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 font-medium">대안 #{idx + 1}</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSwapAlternative(alt)}
                                className="text-indigo-600 hover:text-indigo-800 font-semibold"
                              >
                                이 문장으로 교체
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopy(alt, `대안 #${idx + 1}`)}
                                className="text-slate-500 hover:text-slate-800"
                              >
                                복사
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Print Report Card Modal Trigger */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenReportCard({
                        name,
                        comment: result,
                        vocabScore,
                        hwStatus: homeworkStatus
                      });
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    <span>개별 학생 리포트 카드 인쇄 / PDF 미리보기</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-medium text-slate-600">아직 생성된 코멘트가 없습니다.</p>
                <p>좌측 양식을 작성한 후 생성 버튼을 눌러주세요.</p>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
