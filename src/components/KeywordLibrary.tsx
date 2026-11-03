import React, { useState } from 'react';
import { BookOpen, Search, Copy, Check, Sparkles, Filter, BookmarkPlus } from 'lucide-react';
import { PRESET_KEYWORD_CATEGORIES } from '../constants/presetKeywords';

interface KeywordLibraryProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onSelectKeyword?: (keyword: string) => void;
}

export const KeywordLibrary: React.FC<KeywordLibraryProps> = ({ onShowToast, onSelectKeyword }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  // Extra high-frequency pedagogical phrases
  const teachingPhrases = [
    {
      category: 'Speaking & Confidence',
      en: 'Speaks with increasing confidence and uses varied sentence starters.',
      ko: '스피킹 시 자신감이 크게 향상되었으며, 다양한 문장 시작 표현을 사용함.'
    },
    {
      category: 'Vocabulary & Tests',
      en: 'Consistently demonstrates mastery on weekly vocabulary assessments through diligent pre-study.',
      ko: '사전 예습을 통해 매주 치러지는 단어 시험에서 꾸준히 우수한 성적을 거둠.'
    },
    {
      category: 'Homework & Responsibility',
      en: 'Takes commendable pride in assignment quality, always submitting homework with thoughtful detail.',
      ko: '과제 완성도에 큰 자부심을 가지며, 언제나 꼼꼼하고 성실하게 숙제를 제출함.'
    },
    {
      category: 'Attitude & Participation',
      en: 'Brightens the classroom environment with enthusiasm and actively supports peers during discussions.',
      ko: '열정적인 태도로 교실 분위기를 밝게 만들며 토론 시 동료 학생들을 적극 배려함.'
    },
    {
      category: 'Reading & Analysis',
      en: 'Demonstrates deep analytical comprehension when navigating challenging non-fiction passages.',
      ko: '고난도 비문학 지문을 읽을 때 깊이 있는 분석적 독해 능력을 발휘함.'
    },
    {
      category: 'Writing & Structure',
      en: 'Organizes paragraphs logically with effective transition words and solid grammatical accuracy.',
      ko: '적절한 접속사와 탄탄한 문법 정확도를 활용하여 논리적으로 문단을 구성함.'
    },
    {
      category: 'Growth & Next Steps',
      en: 'Encouraged to embrace higher-level lexical challenges to further refine nuance and expression.',
      ko: '더욱 세련된 뉘앙스와 표현력을 기르기 위해 심화 어휘에 도전하도록 권장함.'
    }
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyword(text);
    onShowToast(`'${text}' 복사 완료!`, 'success');
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const filteredCategories = PRESET_KEYWORD_CATEGORIES.filter(cat => {
    if (selectedCategory !== 'all' && cat.id !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>원어민 교사용 영문 평가 키워드 &amp; 필수 문장 뱅크</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            자연스러운 영문 코멘트를 위한 핵심 어휘 &amp; 상용구 모음
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            원하는 키워드를 클릭하여 복사하거나 바로 코멘트 생성기에 활용하세요. 태도, 단어시험, 숙제, 스피킹, 문법 등 영역별 전문 표현이 수록되어 있습니다.
          </p>

          {/* Search bar */}
          <div className="mt-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="키워드 검색 (예: vocabulary, participation, grammar, 단어, 숙제, 발표)..."
              className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          전체 카테고리 보기
        </button>
        {PRESET_KEYWORD_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.nameKo} ({cat.items.length})
          </button>
        ))}
      </div>

      {/* Keyword Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map(cat => {
          const matchedItems = cat.items.filter(item => 
            item.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.ko.includes(searchTerm)
          );

          if (matchedItems.length === 0 && searchTerm) return null;

          return (
            <div key={cat.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">{cat.nameKo}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">{cat.nameEn}</span>
                </div>

                <div className="space-y-2 mt-3">
                  {matchedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
                    >
                      <div className="pr-2">
                        <div className="text-xs font-semibold text-slate-800">{item.en}</div>
                        <div className="text-[10px] text-slate-500">{item.ko}</div>
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        {onSelectKeyword && (
                          <button
                            type="button"
                            onClick={() => onSelectKeyword(item.en)}
                            className="p-1 rounded-md text-indigo-600 hover:bg-indigo-100 transition-colors"
                            title="생성기에 추가"
                          >
                            <BookmarkPlus className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCopy(item.en)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                          title="영문 복사"
                        >
                          {copiedKeyword === item.en ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                총 {matchedItems.length}개 표현
              </div>
            </div>
          );
        })}
      </div>

      {/* Useful Complete Sentence Templates Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            실전 리포트 완성형 문장 템플릿 (Master Report Sentences)
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          단어시험 성적 우수, 숙제 독려, 수업 참여도 등 자주 쓰는 실전 원어민 코멘트 문장입니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {teachingPhrases.map((phrase, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {phrase.category}
                </span>
                <p className="text-xs font-medium text-slate-800 mt-2 leading-relaxed">
                  "{phrase.en}"
                </p>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  {phrase.ko}
                </p>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleCopy(phrase.en)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3 h-3 text-slate-500" />
                  문장 복사
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
