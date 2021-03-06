import React, { useState } from "react";
import { NumberButton } from './NumberButton';
import { OperationButton } from './OperationButton';
import { EqualsButton } from './EqualsButton';
import { ClearButton } from './ClearButton';
import { NegativeSignButton } from "./NegativeSignButton";

export function Calculator(props) {
  let [ stack, setStack ] = useState([]);
  let [ doesStackHoldResult, setDoesStackHoldResult ] = useState(false);
  let [ resultHistory, setResultHistory ] = useState([]);
  let [ savedResults, setSavedResults ] = useState([]);

  function pushToStack(value) {
    if (!isNaN(value)) { // DIGIT
      setStack((prevStack) => {
        if (doesStackHoldResult) {
          setDoesStackHoldResult(false)
          return [value];
        }
        if (prevStack.length === 0) { // stack is empty
          return [value];
        }

        if (!isNaN(prevStack[prevStack.length-1])) { // final stack item is a number
          return [...prevStack.slice(0, -1), prevStack[prevStack.length-1] + (value)];
        } else if (prevStack[prevStack.length-1] === "_") { // final stack item is (-)
          return [...prevStack.slice(0, -1), "-" + (value)];
        } else { // final stack item is an operation
          return [...prevStack, value];
        }
      })
    } else if (value === "_") { // (-) NEGATIVE
      setStack((prevStack) => {
        if (prevStack.length === 0) { // stack is empty
          return [value];
        }
        
        if (/^[+\-*/]$/.test(prevStack[prevStack.length-1])) { // final stack item is an operation
          return [...prevStack, value]
        } else { // final stack item is a number or (-)
          return prevStack
        }  
      })
    } else if (value === ".") { // DECIMAL POINT
      setStack((prevStack) => {
        if (doesStackHoldResult) {
          return prevStack;
        }
        if (prevStack.length === 0) { // stack is empty
          return [];
        }
        if (!isNaN(prevStack[prevStack.length-1]) && Number.isInteger(parseFloat(prevStack[prevStack.length-1]))) { // final stack item is a INTEGER
          return [...prevStack.slice(0, -1), prevStack[prevStack.length-1] + (value)]
        } else { // final stack item is an operation or (-)
          return prevStack
        }  
      })
    } else { // OPERATION
      setStack((prevStack) => {
        if (prevStack.length === 0) { // stack is empty
          return [];
        } 
        setDoesStackHoldResult(false);
        if (!isNaN(prevStack[prevStack.length-1])) { // final stack item is a number
          return [...prevStack, value]
        } else { // final stack item is an operation or (-) or decimal point
          return prevStack
        }
      })
    }
  }

  function clearStack() {
    if (stack.length === 0) {
      setResultHistory([])
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
  
  function calculate() {
    if (isNaN(stack[stack.length-1])) {
      return;
    }
    let inputNumbers = []
    let inputOperations = []
    stack.forEach((symbol, index) => {index%2===0
      ? inputNumbers.push(symbol)
      : inputOperations.push(symbol)
    })
    let foundIndex;
    let value;
    ["/","*","+","-"].forEach((opType) => {
      foundIndex = inputOperations.findIndex(item => item === opType);
      while (foundIndex !== -1) {
        value = simpleOp(opType, inputNumbers[foundIndex], inputNumbers[foundIndex+1]);
        inputNumbers.splice(foundIndex,2,value.toString());
        inputOperations.splice(foundIndex,1);
        foundIndex = inputOperations.findIndex(item => item === opType);
      }
    });
    setResultHistory((prevResultHistory) => {
      let history = prevResultHistory;
      while (history.length >= 10) {
        history.shift()
      }
      return [...history, inputNumbers[0]]
    });
    setStack([inputNumbers[0]])
    setDoesStackHoldResult(true)
  }
  
  const numbers = [".","0","1","2","3","4","5","6","7","8","9"].reverse();
  const operations = ['+','-','*','/'].reverse()//.concat(['^','(',')']);
  return (
    <>
      <div className="Calculator">
        <div className="Display">
          <h2>{stack.map(symbol => symbol + " ")}</h2>
        </div>
        <div className="TopButtons">
          <ClearButton onClick={clearStack}/>
          <NegativeSignButton onClick={pushToStack}/>
        </div>
        <div className="Numbers">
          {numbers.map(number => <NumberButton key={number} value={number} onClick={pushToStack} />)}
          {/* <OperationButton id="DecimalPointButton" value="." onClick={pushToStack} /> */}
        </div>
        <div className="Operations">
          {operations.map(op => <OperationButton key={op} value={op} onClick={pushToStack} />)}
          <EqualsButton onClick={calculate}/>
        </div>
      </div>
      <h2>Result History</h2>
      <div className="resultHistory">
        {resultHistory.map((result, index) => 
          <div key={index}>
            <button 
              className="resultButton" value={result} key={index}
              onClick={(event) => {
                setStack([event.target.value]);
                setDoesStackHoldResult(true);
                setResultHistory(prevResultHistory => prevResultHistory.slice(0, 1+index))
              }}
            >{result}
            </button>
            
            <button className="saveResultButton"
              onClick={() => {
                setSavedResults((prevSavedResults) => [...prevSavedResults, result])
              }}
            >SAVE
            </button>
          </div>)}
      </div>
      
      <h2>Saved Variables</h2>
      <div className="savedResults">
        {savedResults.map((result, index) => (
          <div className="savedResult" key={index}>
            <input placeholder="name" type="text"/>
            <p>{result}</p>
            <button value={index} onClick={() =>
              setSavedResults(prevSavedResults => prevSavedResults.filter((item,idx) => index !== idx))
            }>REMOVE</button>
          </div>
        ))}
      </div>
      
    </>
  )
}