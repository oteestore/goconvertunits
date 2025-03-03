import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface CalculatorProps {
  className?: string;
}

const Calculator: React.FC<CalculatorProps> = ({ className = "" }) => {
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [isRadians, setIsRadians] = useState(false);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const clearDisplay = () => {
    setDisplay("0");
    setWaitingForOperand(false);
  };

  const clearAll = () => {
    setDisplay("0");
    setOperation(null);
    setPrevValue(null);
    setWaitingForOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const result = calculate(prevValue, inputValue, operation);
      setDisplay(String(result));
      setPrevValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return a / b;
      case "^":
        return Math.pow(a, b);
      default:
        return b;
    }
  };

  const calculateResult = () => {
    if (!operation || prevValue === null) return;

    const inputValue = parseFloat(display);
    const result = calculate(prevValue, inputValue, operation);
    setDisplay(String(result));
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  const calculatePercentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const calculateSin = () => {
    const value = parseFloat(display);
    const angle = isRadians ? value : (value * Math.PI) / 180;
    setDisplay(String(Math.sin(angle)));
    setWaitingForOperand(true);
  };

  const calculateCos = () => {
    const value = parseFloat(display);
    const angle = isRadians ? value : (value * Math.PI) / 180;
    setDisplay(String(Math.cos(angle)));
    setWaitingForOperand(true);
  };

  const calculateTan = () => {
    const value = parseFloat(display);
    const angle = isRadians ? value : (value * Math.PI) / 180;
    setDisplay(String(Math.tan(angle)));
    setWaitingForOperand(true);
  };

  const calculateInverseSin = () => {
    const value = parseFloat(display);
    const result = Math.asin(value);
    setDisplay(String(isRadians ? result : (result * 180) / Math.PI));
    setWaitingForOperand(true);
  };

  const calculateInverseCos = () => {
    const value = parseFloat(display);
    const result = Math.acos(value);
    setDisplay(String(isRadians ? result : (result * 180) / Math.PI));
    setWaitingForOperand(true);
  };

  const calculateInverseTan = () => {
    const value = parseFloat(display);
    const result = Math.atan(value);
    setDisplay(String(isRadians ? result : (result * 180) / Math.PI));
    setWaitingForOperand(true);
  };

  const calculateLog = () => {
    const value = parseFloat(display);
    setDisplay(String(Math.log10(value)));
    setWaitingForOperand(true);
  };

  const calculateLn = () => {
    const value = parseFloat(display);
    setDisplay(String(Math.log(value)));
    setWaitingForOperand(true);
  };

  const calculatePower = (power: number) => {
    const value = parseFloat(display);
    setDisplay(String(Math.pow(value, power)));
    setWaitingForOperand(true);
  };

  const calculateExp = () => {
    const value = parseFloat(display);
    setDisplay(String(Math.exp(value)));
    setWaitingForOperand(true);
  };

  const calculateFactorial = () => {
    const value = parseInt(display);
    if (value < 0) {
      setDisplay("Error");
      return;
    }
    let result = 1;
    for (let i = 2; i <= value; i++) {
      result *= i;
    }
    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const calculatePi = () => {
    setDisplay(String(Math.PI));
    setWaitingForOperand(true);
  };

  const calculateE = () => {
    setDisplay(String(Math.E));
    setWaitingForOperand(true);
  };

  const calculateRandom = () => {
    setDisplay(String(Math.random()));
    setWaitingForOperand(true);
  };

  const calculateReciprocal = () => {
    const value = parseFloat(display);
    setDisplay(String(1 / value));
    setWaitingForOperand(true);
  };

  const memoryRecall = () => {
    if (memory !== null) {
      setDisplay(String(memory));
      setWaitingForOperand(true);
    }
  };

  const memoryAdd = () => {
    const value = parseFloat(display);
    setMemory((memory || 0) + value);
    setWaitingForOperand(true);
  };

  const memorySubtract = () => {
    const value = parseFloat(display);
    setMemory((memory || 0) - value);
    setWaitingForOperand(true);
  };

  return (
    <Card className={`w-full bg-white p-4 rounded-lg shadow-sm ${className}`}>
      <div className="mb-4">
        <div className="bg-gray-800 text-white p-3 rounded-md text-right text-xl h-12 flex items-center justify-between">
          <div className="flex items-center">
            <label className="inline-flex items-center mr-2">
              <input
                type="radio"
                checked={!isRadians}
                onChange={() => setIsRadians(false)}
                className="form-radio h-3 w-3"
              />
              <span className="ml-1 text-xs">Deg</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={isRadians}
                onChange={() => setIsRadians(true)}
                className="form-radio h-3 w-3"
              />
              <span className="ml-1 text-xs">Rad</span>
            </label>
          </div>
          <span className="flex-grow text-right">{display}</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1">
        {/* Row 1 */}
        <Button
          variant="outline"
          size="sm"
          onClick={calculateSin}
          className="text-primary"
        >
          sin
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={calculateCos}
          className="text-primary"
        >
          cos
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={calculateTan}
          className="text-primary"
        >
          tan
        </Button>
        <Button variant="secondary" size="sm" onClick={() => inputDigit("7")}>
          7
        </Button>
        <Button variant="secondary" size="sm" onClick={() => inputDigit("8")}>
          8
        </Button>

        {/* Row 2 */}
        <Button
          variant="outline"
          size="sm"
          onClick={calculateInverseSin}
          className="text-primary"
        >
          sin<sup>-1</sup>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={calculateInverseCos}
          className="text-primary"
        >
          cos<sup>-1</sup>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={calculateInverseTan}
          className="text-primary"
        >
          tan<sup>-1</sup>
        </Button>
        <Button variant="secondary" size="sm" onClick={() => inputDigit("4")}>
          4
        </Button>
        <Button variant="secondary" size="sm" onClick={() => inputDigit("5")}>
          5
        </Button>

        {/* Row 3 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => calculatePower(2)}
          className="text-primary"
        >
          x<sup>2</sup>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => calculatePower(3)}
          className="text-primary"
        >
          x<sup>3</sup>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => performOperation("^")}
          className="text-primary"
        >
          x<sup>y</sup>
        </Button>
        <Button variant="secondary" size="sm" onClick={() => inputDigit("1")}>
          1
        </Button>
        <Button variant="secondary" size="sm" onClick={() => inputDigit("2")}>
          2
        </Button>

        {/* Row 4 */}
        <Button
          variant="outline"
          size="sm"
          onClick={calculateLn}
          className="text-primary"
        >
          ln
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={calculateLog}
          className="text-primary"
        >
          log
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={calculateReciprocal}
          className="text-primary"
        >
          1/x
        </Button>
        <Button variant="secondary" size="sm" onClick={() => inputDigit("0")}>
          0
        </Button>
        <Button variant="secondary" size="sm" onClick={inputDecimal}>
          .
        </Button>

        {/* Row 5 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputDigit("(")}
          className="text-primary"
        >
          (
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputDigit(")")}
          className="text-primary"
        >
          )
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={calculateFactorial}
          className="text-primary"
        >
          n!
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={calculateRandom}
          className="text-primary"
        >
          RND
        </Button>
        <Button variant="secondary" size="sm" onClick={clearAll}>
          AC
        </Button>

        {/* Row 6 */}
        <Button variant="secondary" size="sm" onClick={() => inputDigit("9")}>
          9
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => performOperation("+")}
        >
          +
        </Button>
        <Button variant="secondary" size="sm" onClick={() => inputDigit("6")}>
          6
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => performOperation("-")}
        >
          -
        </Button>
        <Button variant="secondary" size="sm" onClick={() => inputDigit("3")}>
          3
        </Button>

        {/* Row 7 */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => performOperation("×")}
        >
          ×
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => performOperation("÷")}
        >
          ÷
        </Button>
        <Button variant="secondary" size="sm" onClick={calculateExp}>
          EXP
        </Button>
        <Button variant="secondary" size="sm" onClick={memoryRecall}>
          MR
        </Button>
        <Button variant="default" size="sm" onClick={calculateResult}>
          =
        </Button>
      </div>
    </Card>
  );
};

export default Calculator;
