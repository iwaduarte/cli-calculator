import inquirer from "inquirer";
import { add, multiply, divide, subtract, isNumber, equal, reversedSign } from "./utils";

interface State {
  lastOperation: string;
  partialResult: number;
  displayResult: boolean;
  lastNumber: number;
}

const initialStateProp: State = {
  lastOperation: "+",
  lastNumber: 0,
  partialResult: 0,
  displayResult: false,
};

const state = { shouldExit: false, initial: initialStateProp };

const operators: { [key: string]: (a: number, b: number) => number } = {
  "+": add,
  "-": subtract,
  "*": multiply,
  "/": divide,
  "=": equal,
  "!": reversedSign,
};

const parseExpression = (input: string): string[] => {
  const numbers = input.split(/[^0-9.]+/);
  const expression = input.replace(/[0-9]+/g, "#");
  const operators = expression.split("#").filter((operator) => operator);

  return numbers.reduce((acc: string[], curr: string, index: number): string[] => {
    curr.trim() && acc.push(curr.trim());
    operators[index] && acc.push(operators[index].trim());
    return acc;
  }, []);
};

const iterateAndCalc = (expression: string[], initialState: State = initialStateProp): State =>
  expression.reduce((accumulator, arg, index): State => {
    const { lastOperation, partialResult, lastNumber } = accumulator;
    const isValidNumber = isNumber(arg);
    if (!isValidNumber && !operators[arg]) throw Error("Invalid Argument. Try again.");
    if (arg === "c") return { lastOperation: "+", partialResult: 0, displayResult: false, lastNumber: 0 };

    const newPartialResult = isValidNumber ? operators[lastOperation](partialResult, Number(arg)) : partialResult;
    const newLastOperation = isValidNumber ? lastOperation : arg;

    return {
      partialResult: newPartialResult,
      lastOperation: newLastOperation,
      displayResult: arg === "=",
      lastNumber: isValidNumber ? Number(arg) : lastNumber,
    };
  }, initialState);
const calculate = (input: string, initialState: State) => {
  const expressionArr: string[] = parseExpression(input);
  console.log(expressionArr);
  const { displayResult, partialResult, lastOperation, lastNumber } = iterateAndCalc(expressionArr, initialState);

  return { displayResult, partialResult, lastOperation, lastNumber };
};
const init = async () => {
  console.log(`Welcome to your CLI-Calculator :).\
        \n\n- Put your operations and press "Enter" and the result will be saved. \n- For displaying results type "=" and "Enter".\
        \n- For some operations you should use the notation as follow: \nAC (clear) -> "c", (+/-) (reversed sign ) -> "!", X (multiplication) -> *, ÷ (division) -> "/"\
        \n\nFor leaving the application type .exit\
        `);
  while (!state.shouldExit) {
    const { input } = await inquirer.prompt([
      {
        type: "input",
        name: "input",
        message: `\n>`,
      },
    ]);

    if (input.includes(".exit")) {
      state.shouldExit = true;
      continue;
      //process.exit(1)
    }

    try {
      const { displayResult, partialResult, lastNumber, lastOperation } = calculate(input, state.initial);
      console.log(`> ${displayResult ? partialResult : lastNumber}\n`);
      state.initial = { displayResult, partialResult, lastNumber, lastOperation };
    } catch (error: any) {
      console.log(`${error.message}`);
      continue;
    }
  }
};

init().then();
