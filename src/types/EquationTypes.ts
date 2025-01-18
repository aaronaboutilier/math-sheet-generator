// types/EquationTypes.ts

export enum EquationOperator {
  ADD = 'ADD',
  SUBTRACT = 'SUBTRACT',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
}

export interface Equation {
  leftOperand: number;
  operator: EquationOperator;
  rightOperand: number;
  answer: number;
}

/** The available per-equation layouts. */
export type EquationLayout = 'stacked' | 'inline';

/** Options for generating and displaying equations */
export interface EquationOptions {
  rows: number;
  columns: number;
  useAddition: boolean;
  useSubtraction: boolean;
  useMultiplication: boolean;
  useDivision: boolean;
  /** Determines the per-equation layout: stacked (vertical) or inline */
  equationLayout: EquationLayout;
  /** Whether to show answers or leave blanks */
  showAnswers: boolean;
  /** Font family for the preview (e.g., "Arial", "Times New Roman") */
  fontFamily: string;
  /** Font size in pixels for the preview */
  fontSize: number;
  /** Minimum number for generated equations */
  minNumber: number;
  /** Maximum number for generated equations */
  maxNumber: number;
  /** Numbers to exclude from the number range */
  exclusionNumbers?: number[];
  /** Gap options (if used in the Preview) */
  rowGap: number;
  columnGap: number;
  minAbsoluteAnswer?: number; 
}
