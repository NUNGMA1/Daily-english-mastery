import React from 'react';
import { EnglishPhrase } from '../types';
import { playPronunciation } from '../services/geminiService';

const PhraseCard: React.FC<any> = ({ phrase, onNext, onPrev, isFirst, isLast, currentIndex }) => (
  <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-xl animate-fade-up">
    <div className="text-indigo-600 font-bold mb-4">{currentIndex + 1} / 5</div>
    <h2 className="text-3xl font-black mb-2">{phrase.phrase}</h2>
    <p className="text-xl text-slate-600 mb-8">{phrase.meaning}</p>
    <div className="bg-slate-50 p-4 rounded-xl mb-8">
      <p className="text-sm font-bold text-slate-400 mb-2 uppercase">상황</p>
      <p className="font-medium">{phrase.context}</p>
    </div>
    <div className="flex gap-4">
      {!isFirst && <button onClick={onPrev} className="flex-1 py-4 bg-slate-100 rounded-xl font-bold">이전</button>}
      <button onClick={onNext} className="flex-[2] py-4 bg-indigo-600 text-white rounded-xl font-bold">{isLast ? '테스트 시작' : '다음'}</button>
    </div>
  </div>
);
export default PhraseCard;
