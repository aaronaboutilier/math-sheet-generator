// EquationGenerator.ts

import { Equation, EquationOptions, EquationOperator } from "../types/EquationTypes";

export class EquationGenerator {
  private options: EquationOptions;
  private allowedNumbers: number[];

  constructor(options: EquationOptions) {
    this.options = options;
    const { minNumber, maxNumber, exclusionNumbers } = options;

    // Generate the list of allowed numbers by excluding any user-specified exclusions
    const range: number[] = [];
    for (let num = minNumber; num <= maxNumber; num++) {
      range.push(num);
    }
    // Filter out excluded numbers
    this.allowedNumbers = range.filter(num => {
      return !exclusionNumbers?.includes(num);
    });

    if (this.allowedNumbers.length === 0) {
      throw new Error("No numbers available after applying exclusions.");
    }
  }

  /**
   * Returns a random element from the allowedNumbers array.
   */
  private getRandomNumber(): number {
    const idx = Math.floor(Math.random() * this.allowedNumbers.length);
    return this.allowedNumbers[idx];
  }

  /**
   * Returns a random element from a provided array.
   * @param arr - Array to pick from
   */
  private randomFrom<T>(arr: T[]): T {
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
  }

  /**
   * Generates the final list of equations according to the user's "rows" and "columns" config,
   * while applying filters to avoid trivial or undesired results.
   */
  public generateEquations(): Equation[] {
    const equations: Equation[] = [];
    const { rows, columns, minAbsoluteAnswer } = this.options;

    // Collect the allowed operators
    const operators: EquationOperator[] = [];
    if (this.options.useAddition) {
      operators.push(EquationOperator.ADD);
    }
    if (this.options.useSubtraction) {
      operators.push(EquationOperator.SUBTRACT);
    }
    if (this.options.useMultiplication) {
      operators.push(EquationOperator.MULTIPLY);
    }
    if (this.options.useDivision) {
      operators.push(EquationOperator.DIVIDE);
    }

    // If no operators were chosen, we can't generate anything
    if (operators.length === 0) {
      return [];
    }

    const totalEquations = rows * columns;

    // Keep generating until we have enough equations
    while (equations.length < totalEquations) {
      const eq = this.generateOneEquation(operators);

      // ------------------------------------------------------------------
      //   Below: Filters to skip certain equations that are "too simple"
      // ------------------------------------------------------------------

      // Example filter: Skip if |answer| < some threshold
      const threshold = minAbsoluteAnswer ?? 3; // e.g. default to 3 if not specified
      if (Math.abs(eq.answer) < threshold) {
        continue;
      }

      // Skip if answer is 0 or ±1 (often trivial)
      if (eq.answer === 0 || Math.abs(eq.answer) === 1) {
        continue;
      }

      // Skip subtracting a negative (which yields a double negative in the expression)
      if (eq.operator === EquationOperator.SUBTRACT && eq.rightOperand < 0) {
        continue;
      }

      // If all checks pass, accept it
      equations.push(eq);
    }

    return equations;
  }

  /**
   * Generate a single random equation (a, operator, b) with an answer.
   */
  private generateOneEquation(operators: EquationOperator[]): Equation {
    const op = this.randomFrom(operators);
    let a: number;
    let b: number;

    switch (op) {
      case EquationOperator.ADD: {
        a = this.getRandomNumber();
        b = this.getRandomNumber();
        break;
      }
      case EquationOperator.SUBTRACT: {
        const num1 = this.getRandomNumber();
        const num2 = this.getRandomNumber();
        // If you want to ensure the result is non-negative, order them:
        a = Math.max(num1, num2);
        b = Math.min(num1, num2);
        break;
      }
      case EquationOperator.MULTIPLY: {
        a = this.getRandomNumber();
        b = this.getRandomNumber();
        break;
      }
      case EquationOperator.DIVIDE: {
        // Filter out zero from allowedNumbers for b
        const nonZeroNumbers = this.allowedNumbers.filter(n => n !== 0);
        if (nonZeroNumbers.length === 0) {
          // fallback if we have no non-zero numbers
          a = 0;
          b = 1;
        } else {
          b = this.randomFrom(nonZeroNumbers);
          // Force integer-division scenario by picking a multiple of b
          const factor = this.getRandomNumber();
          a = factor * b;
        }
        break;
      }
      default: {
        // Fallback in case we missed something
        a = this.getRandomNumber();
        b = this.getRandomNumber();
      }
    }

    const answer = this.evaluate(a, b, op);
    return {
      leftOperand: a,
      rightOperand: b,
      operator: op,
      answer
    };
  }

  /**
   * Evaluate a single equation
   */
  private evaluate(a: number, b: number, op: EquationOperator): number {
    switch (op) {
      case EquationOperator.ADD:
        return a + b;
      case EquationOperator.SUBTRACT:
        return a - b;
      case EquationOperator.MULTIPLY:
        return a * b;
      case EquationOperator.DIVIDE:
        // We already handle b == 0 above, but just in case
        if (b === 0) {
          return 0;
        }
        return a / b;
      default:
        return 0;
    }
  }
}
