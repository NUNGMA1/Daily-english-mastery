import React, { useState } from 'react';
import { checkMastery } from '../services/geminiService';

const Quiz: React.FC<any> = ({ phrases, onFinish }) => {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<any>(null);

  const submit = async () => {
    const res = await checkMastery(phrases[idx].phrase, input, phrases[idx].meaning);
    setFeedback(res);
    if (res.isCorrect) setScore(s => s + 1);
  };

  return (
    <div className="bg-white rounded-3xl p-8 w-full max-w-xl">
      <h2 className="text-2xl font-bold mb-8">문장을 영어로 써보세요</h2>
      <p className="text-xl font-bold mb-4">{phrases[idx].meaning}</p>
      <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full p-4 border rounded-xl mb-4" rows={3} />
      {!feedback ? (
        <button onClick={submit} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold">확인</button>
      ) : (
        <div>
          <p className="mb-4 font-bold text-indigo-600">{feedback.feedback}</p>
          <button onClick={() => { setIdx(i => i + 1); setInput(''); setFeedback(null); if(idx === 4) onFinish(score); }} className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold">다음</button>
        </div>
      )}
    </div>
  );
};
export default Quiz;
