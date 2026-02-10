export interface Dialogue { a: string; b: string; }
export interface ExtendedExample { en: string; ko: string; }
export interface LearningTips { extendedExamples: ExtendedExample[]; mnemonic: string; relatedVocab: string[]; }
export interface EnglishPhrase { id: string; phrase: string; meaning: string; context: string; dialogue: Dialogue; learningTips: LearningTips; }
export enum AppState { WELCOME = 'WELCOME', LOADING = 'LOADING', LEARNING = 'LEARNING', TESTING = 'TESTING', FINISHED = 'FINISHED' }
