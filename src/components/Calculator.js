import React, { useState } from "react";
import { NumberButton } from './NumberButton';
import { OperationButton } from './OperationButton';
import { EqualsButton } from './EqualsButton';
import { ClearButton } from './ClearButton';

export function Calculator(props) {
  let [ stack, setStack ] = useState([]);
  let [ doesStackHoldResult, setDoesStackHoldResult ] = useState(false)
  function pushToStack(value) {
    if (!isNaN(value)) { // DIGIT
      setStack((prevStack) => {
        if (doesStackHoldResult) {
          return [value];
        }
        
        if (prevStack.length === 0) {
          setDoesStackHoldResult(false);
          return [value];
        } else {
          if (!isNaN(prevStack[prevStack.length-1])) {
            return [...prevStack.slice(0, -1), prevStack[prevStack.length-1] + (value)]
          } else {
            return [...prevStack, value]
          }
        }
      })
    } else { // OPERATION
      setStack((prevStack) => {
        setDoesStackHoldResult(false);
        if (prevStack.length === 0) {
          return [];
        } else {
          if (/^[+\-*/]$/.test(prevStack[prevStack.length-1])) {
            return [...prevStack]
          } else {
            return [...prevStack, value]
          }
        }
      })
    }
  }

  function clearStack() {
    if (stack.length === 0) {
      setResult("")
    }
    setStack([]);
    setDoesStackHoldResult(false)
  }

  function simpleOp(opType, num1, num2) {
    switch(opType) {
      case "+":
        return parseFloat(num1) + parseFloat(num2);
      case "-":
        return parseFloat(num1) - parseFloat(num2);
      case "*":
        return parseFloat(num1) * parseFloat(num2);
      case "/":
        return parseFloat(num1) / parseFloat(num2);
      default:
        return null;
    }
  }

  let [ result, setResult ] = useState(0);
  function calculate() {
    let inputNumbers = []
    let inputOperations = []
    stack.forEach((symbol, index) => {index%2===0
      ? inputNumbers.push(symbol)
      : inputOperations.push(symbol)
    })
    // console.log(inputNumbers, inputOperations);
    let foundIndex;
    let value;
    ["/","*","+","-"].forEach((opType) => {
      foundIndex = inputOperations.findIndex(item => item === opType);
      while (foundIndex !== -1) {
        console.log(inputNumbers, inputOperations);
        value = simpleOp(opType, inputNumbers[foundIndex], inputNumbers[foundIndex+1]);
        inputNumbers.splice(foundIndex,2,value.toString());
        inputOperations.splice(foundIndex,1);
        foundIndex = inputOperations.findIndex(item => item === opType);
      }
    });
    setResult(inputNumbers[0]);
    setStack([inputNumbers[0]])
    setDoesStackHoldResult(true)
  }

  
  const numbers = ["0","1","2","3","4","5","6","7","8","9"];
  const operations = ['+','-','*','/']//.concat(['^','(',')']);
  return (
    <div className="Calculator">
      <div className="Numbers">
        {numbers.map(number => <NumberButton key={number} value={number} onClick={pushToStack} />)}
      </div>
      <div className="Operations">
        {operations.map(op => <OperationButton key={op} value={op} onClick={pushToStack} />)}
      </div>
      <ClearButton onClick={clearStack}/>
      <EqualsButton onClick={calculate}/>
      <p>Display: {stack.map(symbol => symbol + " ")}</p>
      <p>Result: {result}</p>
    </div>
  )
}