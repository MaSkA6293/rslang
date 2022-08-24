import React from 'react';
import { groupType, pageType } from '../../types';

export type option = { value: string; modifyColor: string; title: string };

export interface IComplexityProps {
  change: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  color: string;
}

export interface IOptionComplexity {
  value: string;
  title: string;
  modifyColor: string;
}

export const options: option[] = [
  { value: '0', modifyColor: 'chapter__item-A1', title: 'A1' },
  { value: '1', modifyColor: 'chapter__item-A2', title: 'A2' },
  { value: '2', modifyColor: 'chapter__item-B1', title: 'B1' },
  { value: '3', modifyColor: 'chapter__item-B2', title: 'B2' },
  { value: '4', modifyColor: 'chapter__item-C1', title: 'C1' },
  { value: '5', modifyColor: 'chapter__item-C2', title: 'C2' },
];

export const colorsOfLevels = [
  ['rgba(115, 252, 3, 0.8)', 'rgba(115, 252, 3, 0.3)'],
  ['rgba(0, 184, 3, 0.8)', 'rgba(0, 184, 3, 0.3)'],
  ['rgba(245, 242, 88, 0.8)', 'rgba(245, 242, 88, 0.3)'],
  ['rgba(255, 255, 0, 0.8)', 'rgba(255, 255, 0, 0.3)'],
  ['rgba(255, 119, 0, 0.8)', 'rgba(255, 119, 0, 0.3)'],
  ['rgba(255, 0, 0, 0.8)', 'rgba(255, 0, 0, 0.3)'],
];

export interface ICard {
  id: string;
  group: groupType;
  page: pageType;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}
