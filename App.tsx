import React, { useState } from 'react';
import { EnglishPhrase, AppState } from './types';
import { generateDailyPhrases, DailyData } from './services/geminiService';
import PhraseCard from './components/PhraseCard';
import Quiz from './components/Quiz';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.WELCOME);
  const [phrases, setPhrases] = useState<EnglishPhrase[]>([]);
  const [quote, setQuote] = useState<{ en: string; ko: string } | null>(null);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const startLearning = async () => {
    setState(AppState.LOADING);
    try {
      const data: DailyData = await generateDailyPhrases();
      setPhrases(data.phrases);
      setQuote(data.motivationalQuote);
      setState(AppState.LEARNING);
    } catch (error) {
      alert("데이터를 가져오지 못했습니다.");
      setState(AppState.WELCOME);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  if (state === AppState.WELCOME) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-5xl font-black mb-4">Daily <span className="text-indigo-600">Mastery</span></h1>
        <p className="text-slate-400 mb-12">하루 5문장 영어 마스터</p>
        <button onClick={startLearning} className="w-full max-w-sm py-5 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-xl active:scale-95">학습 시작하기</button>
      </div>
    );
  }

  if (state === AppState.LOADING) {
    return <div className="min-h-screen flex items-center justify-center font-bold">AI가 문장을 준비 중입니다...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4">
      {state === AppState.LEARNING && phrases.length > 0 && (
        <PhraseCard 
          phrase={phrases[currentPhraseIndex]} 
          currentIndex={currentPhraseIndex}
          isFirst={currentPhraseIndex === 0}
          isLast={currentPhraseIndex === 4}
          onNext={() => currentPhraseIndex < 4 ? setCurrentPhraseIndex(prev => prev + 1) : setState(AppState.TESTING)}
          onPrev={() => setCurrentPhraseIndex(prev => prev - 1)}
          onShowToast={showToast}
        />
      )}
      {state === AppState.TESTING && (
        <Quiz phrases={phrases} onFinish={(score) => { setFinalScore(score); setState(AppState.FINISHED); }} />
      )}
      {state === AppState.FINISHED && (
        <div className="text-center p-12 bg-white rounded-3xl shadow-xl mt-20">
          <h2 className="text-3xl font-black mb-4">학습 완료!</h2>
          <p className="text-4xl font-black text-indigo-600 mb-8">{finalScore} / 5</p>
          <button onClick={() => window.location.reload()} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold">다시 하기</button>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-full text-sm font-bold shadow-2xl animate-toast">
          {toast}
        </div>
      )}
    </div>
  );
};

export default App;
