import React, { useState } from 'react';
import { Header } from './components/Header';
import { SingleStudentGenerator } from './components/SingleStudentGenerator';
import { ExcelBatchGenerator } from './components/ExcelBatchGenerator';
import { KeywordLibrary } from './components/KeywordLibrary';
import { ReportCardModal } from './components/ReportCardModal';
import { Toast } from './components/Toast';
import { ExcelStudentRow, GeneratedCommentResponse } from './types';
import { Sparkles, FileSpreadsheet, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'library'>('single');
  const [batchRows, setBatchRows] = useState<ExcelStudentRow[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [reportCardData, setReportCardData] = useState<{
    name: string;
    comment: GeneratedCommentResponse;
    vocabScore: number;
    hwStatus: string;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        batchCount={batchRows.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {activeTab === 'single' && (
          <SingleStudentGenerator
            onShowToast={showToast}
            onOpenReportCard={(data) => setReportCardData(data)}
          />
        )}

        {activeTab === 'batch' && (
          <ExcelBatchGenerator
            onShowToast={showToast}
            onOpenReportCard={(data) => setReportCardData(data)}
            rows={batchRows}
            setRows={setBatchRows}
          />
        )}

        {activeTab === 'library' && (
          <KeywordLibrary
            onShowToast={showToast}
            onSelectKeyword={(kw) => {
              setActiveTab('single');
              showToast(`'${kw}' 키워드를 복사했습니다.`, 'info');
            }}
          />
        )}

      </main>

      {/* Printable / View Report Card Modal */}
      <ReportCardModal
        data={reportCardData}
        onClose={() => setReportCardData(null)}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Global Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">EduComment AI</span>
            <span>•</span>
            <span>영어 교사용 학생 코멘트 &amp; 숙제/단어시험 피드백 자동 생성기</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>엑셀 일괄 분석 &amp; 톤앤매너 지원</span>
            </span>
            <span>•</span>
            <span>Gemini 3.8 Flash &amp; 내장 오프라인 엔진 탑재</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
