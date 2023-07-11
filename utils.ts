const add = (a: number, b: number): number => a + b;

const subtract = (a: number, b: number): number => a - b;

const multiply = (a: number, b: number): number => a * b;

const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error("Cannot divide by zero.");
  }
  return a / b;
};
const equal = (a: number, b: number) => b;
const reversedSign = (a: number): number => -a;

const isNumber = (n: any): boolean => !isNaN(parseFloat(n)) && !isNaN(n - 0);

export { add, subtract, multiply, divide, reversedSign, isNumber, equal };
