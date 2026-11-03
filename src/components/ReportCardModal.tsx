import React from 'react';
import { X, Printer, Download, Award, CheckCircle2, Copy } from 'lucide-react';
import { GeneratedCommentResponse } from '../types';

interface ReportCardModalProps {
  data: {
    name: string;
    comment: GeneratedCommentResponse;
    vocabScore: number;
    hwStatus: string;
  } | null;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({ data, onClose, onShowToast }) => {
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyEnglish = () => {
    const text = `ENGLISH PROGRESS REPORT
Student: ${data.name}
Evaluation Date: ${new Date().toLocaleDateString()}
Vocabulary Test: ${data.vocabScore} / 100
Homework Consistency: ${data.hwStatus}

OVERALL COMMENT:
${data.comment.overallComment}

HOMEWORK & STUDY HABITS:
${data.comment.homeworkFeedback}

VOCABULARY MASTERY:
${data.comment.vocabFeedback}

NEXT GOALS:
${data.comment.actionableGoals}`;

    navigator.clipboard.writeText(text);
    onShowToast('영문 리포트 내용(한국어 제외)이 클립보드에 복사되었습니다.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      
      {/* Container */}
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 border border-slate-200">
        
        {/* Action Header (Hidden in Print) */}
        <div className="print:hidden bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-bold tracking-tight">
              공식 영문 학생 평가 리포트 (Official Progress Report)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyEnglish}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>텍스트 복사</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>인쇄 / PDF 저장</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate / Report Card Body */}
        <div className="p-8 sm:p-10 space-y-6 bg-gradient-to-b from-slate-50/50 to-white print:p-6">
          
          {/* Header of Report */}
          <div className="border-b-2 border-indigo-600 pb-6 flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-indigo-600">
                Official Student Progress Evaluation
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                English Language Progress Report
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Individualized Achievement, Attitude, &amp; Competency Assessment
              </p>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono">
              <div>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div>Academy / School Academic Term</div>
            </div>
          </div>

          {/* Student Profile Info Bar */}
          <div className="grid grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Student Name</span>
              <span className="text-base font-bold text-slate-900">{data.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Vocabulary Test Score</span>
              <span className="text-base font-bold text-indigo-700">{data.vocabScore} / 100</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Homework Performance</span>
              <span className="text-base font-bold text-slate-900">{data.hwStatus}</span>
            </div>
          </div>

          {/* 1. Overall English Remark */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>Overall Evaluation &amp; Classroom Engagement</span>
            </h3>
            <div className="p-5 rounded-2xl bg-indigo-50/30 border border-indigo-100 text-slate-800 text-sm leading-relaxed font-serif">
              "{data.comment.overallComment}"
            </div>
          </div>

          {/* 2. Specific Competency Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Homework Feedback */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5">
              <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px] block">
                Homework &amp; Independent Study
              </span>
              <p className="text-slate-700 leading-normal">
                {data.comment.homeworkFeedback}
              </p>
            </div>

            {/* Vocab Feedback */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5">
              <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px] block">
                Vocabulary Retention &amp; Usage
              </span>
              <p className="text-slate-700 leading-normal">
                {data.comment.vocabFeedback}
              </p>
            </div>

          </div>

          {/* 3. Actionable Goals */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 text-xs space-y-1">
            <span className="font-bold text-emerald-900 uppercase tracking-wide text-[10px] block">
              Strategic Learning Objectives &amp; Recommendations
            </span>
            <p className="text-emerald-950 font-medium leading-normal">
              {data.comment.actionableGoals}
            </p>
          </div>

          {/* 4. Korean Guidance for Parents */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 text-xs space-y-1.5 text-slate-700">
            <span className="font-bold text-slate-800 block text-[11px]">
              [학부모 전달 요약 / Korean Translation &amp; Advice]
            </span>
            <p className="leading-relaxed">
              {data.comment.koreanSummary}
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              <span className="font-semibold text-slate-700">Lead English Instructor</span>
              <div className="mt-4 border-b border-slate-300 w-36"></div>
            </div>
            <div className="text-right">
              <span className="font-semibold text-slate-700">Academic Director Approval</span>
              <div className="mt-4 border-b border-slate-300 w-36 ml-auto"></div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
