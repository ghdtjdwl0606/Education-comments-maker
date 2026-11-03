import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  Sparkles, 
  Copy, 
  Trash2, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Eye, 
  Layers, 
  ArrowRight,
  PlusCircle,
  HelpCircle,
  Table,
  Check,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { ExcelStudentRow, ToneOption, LengthOption, GeneratedCommentResponse } from '../types';
import { 
  generateSampleExcelTemplate, 
  generateAcademyMatrixTemplate, 
  parseUploadedExcel, 
  exportResultsToExcel 
} from '../utils/excelHelper';
import { TONE_DEFINITIONS } from '../constants/toneDefinitions';

interface ExcelBatchGeneratorProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenReportCard: (studentData: { name: string; comment: GeneratedCommentResponse; vocabScore: number; hwStatus: string }) => void;
  rows: ExcelStudentRow[];
  setRows: React.Dispatch<React.SetStateAction<ExcelStudentRow[]>>;
}

export const ExcelBatchGenerator: React.FC<ExcelBatchGeneratorProps> = ({
  onShowToast,
  onOpenReportCard,
  rows,
  setRows
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  // Global Batch Settings
  const [batchTone, setBatchTone] = useState<ToneOption>('encouraging');
  const [batchLength, setBatchLength] = useState<LengthOption>('medium');

  // Preview Modal for Single Row
  const [previewRow, setPreviewRow] = useState<ExcelStudentRow | null>(null);

  // Upload Handlers
  const handleFileUpload = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      onShowToast('엑셀(.xlsx, .xls) 또는 .csv 파일만 업로드 가능합니다.', 'error');
      return;
    }

    setIsProcessingFile(true);
    try {
      const parsedRows = await parseUploadedExcel(file);
      if (parsedRows.length === 0) {
        onShowToast('엑셀 파일에서 학생 데이터를 찾을 수 없습니다. 양식을 확인해주세요.', 'error');
      } else {
        setRows(parsedRows);
        const matrixCount = parsedRows.filter(r => r.formatType === 'matrix').length;
        if (matrixCount > 0) {
          onShowToast(`학원 세션별 매트릭스 양식 감지 완료! ${parsedRows.length}명의 학생 데이터를 분석했습니다.`, 'success');
        } else {
          onShowToast(`총 ${parsedRows.length}명의 학생 데이터를 성공적으로 불러왔습니다!`, 'success');
        }
      }
    } catch (err: any) {
      console.error('File parsing error:', err);
      onShowToast('엑셀 파일을 읽는 중 오류가 발생했습니다: ' + (err?.message || ''), 'error');
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Quick Load Demo Data (Including Jenny from the user's uploaded image!)
  const handleLoadDemoData = (type: 'matrix' | 'flat' = 'matrix') => {
    if (type === 'matrix') {
      const matrixRows: ExcelStudentRow[] = [
        {
          id: 'demo-jenny',
          name: 'Jenny',
          classGroup: 'C2',
          vocabScore: 82,
          homeworkStatus: '100% 완료 (VOCAB HW 7회 전회 O, Writing HW B/A)',
          homeworkRate: 100,
          keywords: 'confident speaker, natural intonation, clear presentation delivery, solid vocabulary acquisition, 100% vocab homework completion',
          sessionCount: 8,
          presentationQuality: 'A (발표력 우수 및 지속 향상)',
          reviewTestScore: 65,
          vocabWritingHwStatus: '7/7 O',
          dailyCommentsSummary: 'The student is very active and eager to learn; asks great questions; focused participation',
          formatType: 'matrix',
          tone: 'encouraging',
          status: 'pending'
        },
        {
          id: 'demo-kevin',
          name: 'Kevin',
          classGroup: 'C2',
          vocabScore: 95,
          homeworkStatus: '100% 완벽 제출 (Writing HW 전회 A, Essay O)',
          homeworkRate: 100,
          keywords: 'rich vocabulary retention, flawless spelling accuracy, strong review test comprehension, active discussion leader',
          sessionCount: 8,
          presentationQuality: 'A (최우수 발표력)',
          reviewTestScore: 92,
          vocabWritingHwStatus: '8/8 O',
          dailyCommentsSummary: 'Exemplary vocabulary and reading fluency; active discussion leader',
          formatType: 'matrix',
          tone: 'academic',
          status: 'pending'
        },
        {
          id: 'demo-alex',
          name: 'Alex',
          classGroup: 'C1',
          vocabScore: 73,
          homeworkStatus: '85% 성실 제출 (VOCAB HW 8/8 O, Essay 일부 지각)',
          homeworkRate: 85,
          keywords: 'steady review test progress, persistent effort and grit, improving speaking courage, solid vocabulary acquisition',
          sessionCount: 8,
          presentationQuality: 'B/A (발표 자신감 점진적 향상)',
          reviewTestScore: 63,
          vocabWritingHwStatus: '8/8 O',
          dailyCommentsSummary: 'Shows notable growth in confidence; overcoming hesitation when speaking',
          formatType: 'matrix',
          tone: 'constructive',
          status: 'pending'
        }
      ];
      setRows(matrixRows);
      onShowToast('이미지 형식의 학원 세션 매트릭스 샘플(Jenny 외 2명)이 로드되었습니다!', 'info');
    } else {
      const sampleRows: ExcelStudentRow[] = [
        {
          id: 'demo-1',
          name: 'Sarah Kim (김서아)',
          homeworkStatus: '100% 성실 제출',
          vocabScore: 98,
          keywords: 'active participation, confident speaking, natural intonation, reads fluently',
          classGroup: 'TOEFL Junior A반',
          tone: 'encouraging',
          formatType: 'standard',
          status: 'pending'
        },
        {
          id: 'demo-2',
          name: 'Minjun Park (박민준)',
          homeworkStatus: '85% 대부분 제출',
          vocabScore: 74,
          keywords: 'attentive listener, solid grammar, needs vocabulary reinforcement, eager to learn',
          classGroup: '중등 심화 B반',
          tone: 'constructive',
          formatType: 'standard',
          status: 'pending'
        },
        {
          id: 'demo-3',
          name: 'David Lee (이다윗)',
          homeworkStatus: '50% 미흡/지각',
          vocabScore: 95,
          keywords: 'high potential, quick comprehension, excellent retention, needs homework consistency',
          classGroup: '초등 고학년 파워반',
          tone: 'diplomatic',
          formatType: 'standard',
          status: 'pending'
        }
      ];
      setRows(sampleRows);
      onShowToast('일반 학생 명단 샘플 데이터가 로드되었습니다!', 'info');
    }
  };

  // Generate Single Row
  const handleGenerateRow = async (rowId: string) => {
    const target = rows.find(r => r.id === rowId);
    if (!target) return;

    setRows(prev => prev.map(r => r.id === rowId ? { ...r, status: 'generating' } : r));

    try {
      const kwArray = target.keywords.split(',').map(s => s.trim()).filter(Boolean);
      let hwStatus: any = 'good';
      const hwLower = target.homeworkStatus.toLowerCase();
      if (hwLower.includes('100') || hwLower.includes('완벽')) hwStatus = 'perfect';
      else if (hwLower.includes('미흡') || hwLower.includes('지각') || hwLower.includes('50') || hwLower.includes('60')) hwStatus = 'inconsistent';
      else if (hwLower.includes('미제출') || hwLower.includes('poor')) hwStatus = 'poor';

      // Build extra context string if it's from academy matrix
      let customNote = '';
      if (target.formatType === 'matrix') {
        const details = [];
        if (target.presentationQuality) details.push(`Presentation Quality: ${target.presentationQuality}`);
        if (target.reviewTestScore) details.push(`Review Test Average: ${target.reviewTestScore}%`);
        if (target.dailyCommentsSummary) details.push(`Teacher Daily Observation: "${target.dailyCommentsSummary}"`);
        customNote = details.join('; ');
      }

      const res = await fetch('/api/generate-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: target.name,
          keywords: kwArray,
          homeworkStatus: hwStatus,
          homeworkRate: target.homeworkRate,
          vocabScore: target.vocabScore,
          tone: (target.tone as any) || batchTone,
          length: batchLength,
          gradeLevel: 'middle',
          customNote: customNote || undefined
        })
      });

      const resData = await res.json();
      if (resData.success && resData.data) {
        setRows(prev => prev.map(r => r.id === rowId ? {
          ...r,
          status: 'completed',
          generatedComment: resData.data.overallComment,
          homeworkFeedback: resData.data.homeworkFeedback,
          vocabFeedback: resData.data.vocabFeedback,
          actionableGoals: resData.data.actionableGoals,
          koreanSummary: resData.data.koreanSummary,
        } : r));
        onShowToast(`${target.name} 코멘트 생성 완료`, 'success');
      } else {
        throw new Error(resData.error || '생성 실패');
      }
    } catch (err: any) {
      setRows(prev => prev.map(r => r.id === rowId ? { ...r, status: 'error', errorMessage: err?.message } : r));
      onShowToast(`${target.name} 생성 중 오류가 발생했습니다.`, 'error');
    }
  };

  // Batch Generate All
  const handleBatchGenerateAll = async () => {
    if (rows.length === 0) {
      onShowToast('먼저 엑셀 파일을 업로드하거나 샘플 데이터를 로드해주세요.', 'error');
      return;
    }

    setIsBatchGenerating(true);
    setProgressPercent(0);

    let completedCount = 0;
    for (const r of rows) {
      await handleGenerateRow(r.id);
      completedCount++;
      setProgressPercent(Math.round((completedCount / rows.length) * 100));
    }

    setIsBatchGenerating(false);
    onShowToast(`전체 ${rows.length}명의 코멘트 작성이 완료되었습니다!`, 'success');
  };

  // Download Exported Excel
  const handleDownloadExcel = () => {
    if (rows.length === 0) {
      onShowToast('내보낼 데이터가 없습니다.', 'error');
      return;
    }
    exportResultsToExcel(rows, `EduComment_영어코멘트_완성본_${new Date().toISOString().slice(0, 10)}.xlsx`);
    onShowToast('완성된 엑셀 파일이 다운로드되었습니다!', 'success');
  };

  // Copy All as Table
  const handleCopyTable = () => {
    if (rows.length === 0) return;
    const header = ['이름', '반', '단어점수', '리뷰테스트', '발표평가', '숙제', '영문 코멘트', '숙제 피드백', '단어 피드백', '한국어 번역'].join('\t');
    const body = rows.map(r => [
      r.name,
      r.classGroup || '',
      r.vocabScore,
      r.reviewTestScore ? `${r.reviewTestScore}점` : '-',
      r.presentationQuality || '-',
      r.homeworkStatus,
      (r.generatedComment || '').replace(/\t/g, ' '),
      (r.homeworkFeedback || '').replace(/\t/g, ' '),
      (r.vocabFeedback || '').replace(/\t/g, ' '),
      (r.koreanSummary || '').replace(/\t/g, ' ')
    ].join('\t')).join('\n');

    navigator.clipboard.writeText(`${header}\n${body}`);
    onShowToast('엑셀/구글시트에 붙여넣을 수 있는 표 형태로 전체 복사되었습니다!', 'success');
  };

  // Delete row
  const handleDeleteRow = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  // Clear all
  const handleClearAll = () => {
    if (window.confirm('전체 목록을 삭제하시겠습니까?')) {
      setRows([]);
      onShowToast('목록이 초기화되었습니다.', 'info');
    }
  };

  // Analytics
  const avgVocab = rows.length > 0
    ? Math.round(rows.reduce((acc, r) => acc + (r.vocabScore || 0), 0) / rows.length)
    : 0;
  const completedCount = rows.filter(r => r.status === 'completed').length;
  const matrixFormatCount = rows.filter(r => r.formatType === 'matrix').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Upload Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Upload Dropzone (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                  <span>엑셀 파일 업로드 &amp; 양식 자동 분석</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  <strong>학원 세션별 매트릭스 양식(Vocab, Review Test, Presentation, HW, Daily comments)</strong> 및 일반 명단 양식을 모두 자동 인식합니다.
                </p>
              </div>

              {/* Sample Template Downloads */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={generateAcademyMatrixTemplate}
                  className="px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs whitespace-nowrap"
                  title="사용자 업로드 이미지와 동일한 세션별 성적 매트릭스 엑셀 파일 다운로드"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" />
                  <span>📸 이미지 매트릭스 양식</span>
                </button>

                <button
                  type="button"
                  onClick={generateSampleExcelTemplate}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>기본 명단 양식</span>
                </button>
              </div>
            </div>

            {/* Dropzone Box */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-600 bg-indigo-50/80 scale-[1.01]'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-800">
                  {isProcessingFile ? '엑셀 데이터 구조를 분석 중입니다...' : '클릭하거나 엑셀 파일을 여기로 끌어다 놓으세요'}
                </div>
                <div className="text-xs text-slate-500">
                  세션별 성적 매트릭스(Jenny 양식) 또는 표준 학생 목록 (.xlsx, .xls, .csv)
                </div>
              </div>
            </div>
          </div>

          {/* Quick Demo Buttons */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs text-slate-500">
              준비된 엑셀 파일이 없으시다면 원클릭으로 바로 테스트해보세요:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleLoadDemoData('matrix')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Jenny 양식 샘플(3명) 불러오기</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoadDemoData('flat')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                <span>기본 명단 샘플</span>
              </button>
            </div>
          </div>

        </div>

        {/* Analytical Metric Overview (4 cols) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Class Analysis Overview</span>
              {matrixFormatCount > 0 && (
                <span className="text-[10px] font-bold bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-2 py-0.5 rounded-full">
                  매트릭스 양식 감지됨
                </span>
              )}
            </div>
            <h4 className="text-lg font-bold mt-1">학급 성취도 종합 요약</h4>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <div className="text-xs text-indigo-200">총 학생 수</div>
                <div className="text-2xl font-bold mt-0.5">{rows.length}명</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <div className="text-xs text-indigo-200">단어 평균 점수</div>
                <div className="text-2xl font-bold mt-0.5">{avgVocab}점</div>
              </div>
            </div>

            <div className="mt-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-xs text-indigo-200 mb-1">
                <span>코멘트 작성 완료율</span>
                <span className="font-bold text-white">{completedCount} / {rows.length} ({rows.length ? Math.round((completedCount/rows.length)*100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${rows.length ? (completedCount/rows.length)*100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-indigo-200/80 leading-relaxed">
            💡 <strong>12./20, 20./20. 분수 점수</strong>, <strong>발표 A/B 등급</strong>, <strong>숙제 O/X</strong>, <strong>Daily Comments</strong>가 자동으로 합산되어 자연스러운 영문 총평으로 변환됩니다.
          </div>
        </div>

      </div>

      {/* Batch Generation Control Bar */}
      {rows.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Tone & Length Overrides */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">공통 톤앤매너:</span>
              <select
                value={batchTone}
                onChange={(e) => setBatchTone(e.target.value as ToneOption)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-800"
              >
                {TONE_DEFINITIONS.map(t => (
                  <option key={t.id} value={t.id}>{t.koreanLabel} ({t.label})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">분량:</span>
              <select
                value={batchLength}
                onChange={(e) => setBatchLength(e.target.value as LengthOption)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-800"
              >
                <option value="short">간결 (2문장)</option>
                <option value="medium">표준 (3-4문장)</option>
                <option value="detailed">상세 (종합 리포트)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isBatchGenerating}
              onClick={handleBatchGenerateAll}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all"
            >
              {isBatchGenerating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>일괄 생성 중 ({progressPercent}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>🚀 전원 코멘트 일괄 생성 ({rows.length}명)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadExcel}
              className="py-2.5 px-3.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>📥 엑셀 결과 저장 (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={handleCopyTable}
              className="py-2.5 px-3.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Copy className="w-4 h-4 text-slate-600" />
              <span>📋 표 전체 복사</span>
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="목록 비우기"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Students Data Table */}
      {rows.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4 w-48">학생 / 반</th>
                  <th className="py-3.5 px-4 w-40">단어 &amp; 리뷰테스트</th>
                  <th className="py-3.5 px-4 w-36">발표 &amp; 숙제 상태</th>
                  <th className="py-3.5 px-4 w-52">추출된 키워드/특징</th>
                  <th className="py-3.5 px-4">생성된 영문 코멘트 &amp; 피드백</th>
                  <th className="py-3.5 px-4 w-28 text-center">동작</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {rows.map((row, idx) => {
                  const isDone = row.status === 'completed';
                  const isGen = row.status === 'generating';
                  const isErr = row.status === 'error';

                  return (
                    <tr 
                      key={row.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isDone ? 'bg-indigo-50/15' : ''
                      }`}
                    >
                      {/* No */}
                      <td className="py-4 px-4 text-center font-semibold text-slate-400">
                        {idx + 1}
                      </td>

                      {/* Name & Class */}
                      <td className="py-4 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span>{row.name}</span>
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
                          {row.formatType === 'matrix' && (
                            <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.2 rounded">
                              Matrix
                            </span>
                          )}
                        </div>
                        {row.classGroup && (
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                            Level: <span className="font-semibold text-slate-600">{row.classGroup}</span>
                            {row.sessionCount ? ` (${row.sessionCount}회차 분석)` : ''}
                          </div>
                        )}
                      </td>

                      {/* Vocab & Review Test */}
                      <td className="py-4 px-4 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-medium">단어:</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                            row.vocabScore >= 90 ? 'bg-emerald-100 text-emerald-800' :
                            row.vocabScore >= 80 ? 'bg-blue-100 text-blue-800' :
                            row.vocabScore >= 70 ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {row.vocabScore}점
                          </span>
                        </div>
                        {row.reviewTestScore !== undefined && (
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="text-[10px] text-slate-400 font-medium">리뷰:</span>
                            <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                              {row.reviewTestScore}점
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Presentation & Homework */}
                      <td className="py-4 px-4 space-y-1">
                        {row.presentationQuality && (
                          <div className="text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
                            <span>🗣️ 발표:</span>
                            <span className="bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded">
                              {row.presentationQuality}
                            </span>
                          </div>
                        )}
                        <div className="text-slate-800 font-medium text-[11px] line-clamp-2">
                          📖 {row.homeworkStatus}
                        </div>
                      </td>

                      {/* Keywords */}
                      <td className="py-4 px-4">
                        <div className="text-slate-600 font-mono text-[11px] line-clamp-2">
                          {row.keywords}
                        </div>
                        {row.dailyCommentsSummary && (
                          <div className="mt-1 text-[10px] text-slate-500 italic flex items-center gap-1 line-clamp-1" title={row.dailyCommentsSummary}>
                            <MessageSquare className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span>{row.dailyCommentsSummary}</span>
                          </div>
                        )}
                      </td>

                      {/* Generated Comment / Feedback preview */}
                      <td className="py-4 px-4">
                        {isDone ? (
                          <div className="space-y-1.5 max-w-xl">
                            <p className="text-slate-800 font-normal leading-relaxed line-clamp-2">
                              {row.generatedComment}
                            </p>
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                                HW: {row.homeworkFeedback?.slice(0, 30)}...
                              </span>
                              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                                단어: {row.vocabFeedback?.slice(0, 30)}...
                              </span>
                            </div>
                          </div>
                        ) : isGen ? (
                          <div className="flex items-center gap-2 text-indigo-600 font-medium animate-pulse">
                            <RotateCw className="w-4 h-4 animate-spin" />
                            <span>코멘트 작성 중...</span>
                          </div>
                        ) : isErr ? (
                          <div className="text-rose-600 text-xs flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>생성 실패 (재시도 클릭)</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">
                            생성 대기 중 (우측 버튼 클릭)
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {isDone ? (
                            <>
                              <button
                                type="button"
                                onClick={() => setPreviewRow(row)}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                title="상세 리포트 보기"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const fullReport = [
                                    `[Student: ${row.name}${row.classGroup ? ` | Class: ${row.classGroup}` : ''}]`,
                                    row.generatedComment || '',
                                    row.homeworkFeedback ? `\n[Homework & Study Habits]\n${row.homeworkFeedback}` : '',
                                    row.vocabFeedback ? `\n[Vocabulary Mastery]\n${row.vocabFeedback}` : '',
                                    row.actionableGoals ? `\n[Actionable Goal]\n${row.actionableGoals}` : ''
                                  ].filter(Boolean).join('\n');

                                  navigator.clipboard.writeText(fullReport);
                                  onShowToast(`${row.name} 영문 종합 리포트(총평+숙제+단어+목표)가 복사되었습니다!`, 'success');
                                }}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                title="영문 종합 리포트 복사 (총평 + 숙제 + 단어 + 목표)"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleGenerateRow(row.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                title="재생성"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleGenerateRow(row.id)}
                              disabled={isGen}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-2xs"
                            >
                              생성
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(row.id)}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="행 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <FileSpreadsheet className="w-12 h-12 mx-auto text-slate-300" />
          <h4 className="text-base font-bold text-slate-700">등록된 학생 데이터가 없습니다</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            학원의 세션별 성적 매트릭스 엑셀 파일(Vocab, Review Test, Presentation, HW 기록)을 올리시거나, 상단의 'Jenny 양식 샘플 불러오기'를 눌러 테스트해보세요!
          </p>
        </div>
      )}

      {/* Row Detail Preview Modal */}
      {previewRow && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{previewRow.name} 종합 리포트</h3>
                  {previewRow.classGroup && (
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                      Level: {previewRow.classGroup}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                  <span>단어: <strong>{previewRow.vocabScore}점</strong></span>
                  {previewRow.reviewTestScore && <span>• 리뷰: <strong>{previewRow.reviewTestScore}점</strong></span>}
                  {previewRow.presentationQuality && <span>• 발표: <strong>{previewRow.presentationQuality}</strong></span>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewRow(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100"
              >
                닫기
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs">
              
              {/* Overall Comment Card */}
              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900">영문 총평 코멘트 (English Comment)</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(previewRow.generatedComment || '');
                      onShowToast('영문 총평이 복사되었습니다.', 'success');
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <Copy className="w-3 h-3" />
                    <span>총평 복사</span>
                  </button>
                </div>
                <p className="text-slate-800 leading-relaxed text-sm font-normal">
                  {previewRow.generatedComment}
                </p>
              </div>

              {/* HW & Vocab Feedback Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">📖 숙제 및 과제 피드백</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(previewRow.homeworkFeedback || '');
                        onShowToast('숙제 피드백이 복사되었습니다.', 'success');
                      }}
                      className="text-slate-500 hover:text-slate-800"
                      title="숙제 피드백 복사"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-slate-700 leading-normal">{previewRow.homeworkFeedback}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">📝 단어 및 어휘력 피드백</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(previewRow.vocabFeedback || '');
                        onShowToast('단어 피드백이 복사되었습니다.', 'success');
                      }}
                      className="text-slate-500 hover:text-slate-800"
                      title="단어 피드백 복사"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-slate-700 leading-normal">{previewRow.vocabFeedback}</p>
                </div>
              </div>

              {/* Actionable Goals Card */}
              {previewRow.actionableGoals && (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900">🎯 다음 학습 목표 (Actionable Goal)</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(previewRow.actionableGoals || '');
                        onShowToast('다음 학습 목표가 복사되었습니다.', 'success');
                      }}
                      className="text-emerald-700 hover:text-emerald-900"
                      title="학습 목표 복사"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-emerald-950 font-medium">{previewRow.actionableGoals}</p>
                </div>
              )}

              {/* Korean Summary Card */}
              {previewRow.koreanSummary && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">🇰🇷 한국어 번역 / 학부모 전달 가이드</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(previewRow.koreanSummary || '');
                        onShowToast('한국어 상담 가이드가 복사되었습니다.', 'success');
                      }}
                      className="text-slate-500 hover:text-slate-800"
                      title="한국어 가이드 복사"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{previewRow.koreanSummary}</p>
                </div>
              )}

              {/* Daily Comments Summary */}
              {previewRow.dailyCommentsSummary && (
                <div className="p-3 bg-indigo-50/30 rounded-xl border border-indigo-100">
                  <span className="font-bold text-indigo-900 block mb-0.5">💬 강사 세션별 메모 (Daily Comments)</span>
                  <p className="text-indigo-950 font-normal">{previewRow.dailyCommentsSummary}</p>
                </div>
              )}

            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-slate-100 pt-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  if (previewRow.generatedComment) {
                    onOpenReportCard({
                      name: previewRow.name,
                      comment: {
                        overallComment: previewRow.generatedComment,
                        homeworkFeedback: previewRow.homeworkFeedback || '',
                        vocabFeedback: previewRow.vocabFeedback || '',
                        actionableGoals: previewRow.actionableGoals || '',
                        koreanSummary: previewRow.koreanSummary || ''
                      },
                      vocabScore: previewRow.vocabScore,
                      hwStatus: previewRow.homeworkStatus
                    });
                    setPreviewRow(null);
                  }
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>리포트 카드 인쇄 뷰</span>
              </button>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(previewRow.generatedComment || '');
                    onShowToast('영문 총평 코멘트가 복사되었습니다.', 'success');
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center gap-1"
                >
                  <span>총평만 복사</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const fullText = [
                      `[Student: ${previewRow.name}${previewRow.classGroup ? ` | Class: ${previewRow.classGroup}` : ''}]`,
                      previewRow.generatedComment || '',
                      previewRow.homeworkFeedback ? `\n[Homework & Study Habits]\n${previewRow.homeworkFeedback}` : '',
                      previewRow.vocabFeedback ? `\n[Vocabulary Mastery]\n${previewRow.vocabFeedback}` : '',
                      previewRow.actionableGoals ? `\n[Actionable Goal]\n${previewRow.actionableGoals}` : ''
                    ].filter(Boolean).join('\n');

                    navigator.clipboard.writeText(fullText);
                    onShowToast('영문 종합 리포트(총평+숙제+단어+목표)가 복사되었습니다!', 'success');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>영문 전체 복사 (총평+숙제+단어+목표)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
