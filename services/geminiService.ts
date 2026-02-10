import { GoogleGenAI, Type, Modality } from "@google/genai";
import { EnglishPhrase } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface DailyData { phrases: EnglishPhrase[]; motivationalQuote: { en: string; ko: string; }; }

export async function generateDailyPhrases(): Promise<DailyData> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "영어 회화 5문장과 명언 생성 (JSON)",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          phrases: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: {type: Type.STRING}, phrase: {type: Type.STRING}, meaning: {type: Type.STRING}, context: {type: Type.STRING}, dialogue: {type: Type.OBJECT, properties: {a: {type: Type.STRING}, b: {type: Type.STRING}}, required: ["a", "b"]}, learningTips: {type: Type.OBJECT, properties: {extendedExamples: {type: Type.ARRAY, items: {type: Type.OBJECT, properties: {en: {type: Type.STRING}, ko: {type: Type.STRING}}, required: ["en", "ko"]}}, mnemonic: {type: Type.STRING}, relatedVocab: {type: Type.ARRAY, items: {type: Type.STRING}}}, required: ["extendedExamples", "mnemonic", "relatedVocab"]}}, required: ["id", "phrase", "meaning", "context", "dialogue", "learningTips"] } },
          motivationalQuote: { type: Type.OBJECT, properties: { en: {type: Type.STRING}, ko: {type: Type.STRING} }, required: ["en", "ko"] }
        },
        required: ["phrases", "motivationalQuote"]
      }
    }
  });
  return JSON.parse(response.text);
}

export async function checkMastery(target: string, input: string, meaning: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Evaluate: Target "${target}", Input "${input}". Return JSON {isCorrect, feedback, suggestion}`,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text);
}

export async function playPronunciation(text: string): Promise<void> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } }
  });
  const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (data) {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = Uint8Array.from(atob(data), c => c.charCodeAt(0)).buffer;
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
  }
}
