console.log('hi');
//List to do:


//create variables for nodes
const currentValue = document.querySelector('.current');
const calHistory = document.querySelector('.history');
const clearKey = document.querySelector('#clear');
const positiveMinusKey = document.querySelector('#positive-minus');
const getPercentageKey = document.querySelector('#percentage');
const divideKey = document.querySelector('#divide');
const multiplyKey = document.querySelector('#multiply');
const minusKey = document.querySelector('#minus');
const plusKey = document.querySelector('#plus');
const decimalKey = document.querySelector('#decimal');
const deleteKey = document.querySelector('#delete');
const equalKey = document.querySelector('#equal');

const operators = Array.from(document.querySelectorAll('.operator'));
const digits = Array.from(document.querySelectorAll('.digit'));

//state variables
let temporary = ''; //for multiple digit
let inputs = []; //track on input 1 and input 2
let storedOperator = '';
let total = 0;
setCurrentDisplay(0);
setCalHistory(); //initialize

function setCurrentDisplay(val) {
  currentValue.textContent = val;
}

function setCalHistory(val1 = '', operator = '', val2 = '') {
  calHistory.textContent = `${val1} ${operator} ${val2}`;
}

function toggleOperatorFocus(operator) {
  if (operator == '+') plusKey.classList.toggle('focused');
  if (operator == '-') minusKey.classList.toggle('focused');
  if (operator == 'x') multiplyKey.classList.toggle('focused');
  if (operator == '/') divideKey.classList.toggle('focused');
}

//Math function
function doTheMath(operator, val1, val2) {
  if (operator == '+') return val1 + val2;
  if (operator == '-') return val1 - val2;
  if (operator == 'x') return val1 * val2;
  if (operator == '/') return val1 / val2;
}

function handleDigitClick(e) {
  temporary += e.target.textContent; //string
  if (temporary.length > 1 && temporary.at(0) == 0) temporary = temporary.slice(1);
  setCurrentDisplay(temporary);
  if (storedOperator) {
    setCalHistory(inputs[inputs.length - 1], storedOperator);
  } else { //start clean
    inputs = [];
    setCalHistory();
  }
}

function handleOperatorClick(e) {
  const currentOperator = e.target.textContent;
  if (temporary) {
    inputs.push(+temporary);
    if (inputs.length > 2) inputs.shift(); //remove the first one
    if (!storedOperator || storedOperator !== currentOperator) {
      toggleOperatorFocus(currentOperator);
      toggleOperatorFocus(storedOperator);
    }
    if (storedOperator) {
      total = doTheMath(storedOperator, inputs[0], inputs[1]);
      setCalHistory(inputs[0], storedOperator, inputs[1]);
      setCurrentDisplay(total);
      inputs = [inputs[1], total];
    }
  }
  if (!temporary) {
    toggleOperatorFocus(currentOperator);
    if(inputs.length && !storedOperator) { // 7 = +
        setCalHistory();
    } else { // 7 = +
        toggleOperatorFocus(storedOperator);
    }
    if (!inputs.length) {
      inputs.push(0); //initiate a 0
    }
  }
  temporary = '';
  storedOperator = currentOperator;
}

digits.forEach((digit) => digit.addEventListener('click', handleDigitClick));
operators.forEach((opKey) => opKey.addEventListener('click', handleOperatorClick));

//state variables only for equalKey to repeat last action
let opKey = '';
let lastVal = null;

equalKey.addEventListener('click', function (e) {
  if (opKey && lastVal) {
    total = doTheMath(opKey, total, lastVal);
  }
  if (storedOperator && !temporary) {
    const lastInput = inputs[inputs.length - 1];
    toggleOperatorFocus(storedOperator);
    total = doTheMath(storedOperator, lastInput, lastInput);
    opKey = storedOperator;
    lastVal = lastInput;
  }
  if (temporary) {
    inputs.push(+temporary); // '7'
    temporary = '';
    const lastInput = inputs[inputs.length - 1];
    if (inputs.length > 2) inputs.shift(); // if 3
    if (inputs.length < 2) { // if 1
      total = lastInput;
    } else {
      lastVal = lastInput;
      opKey = storedOperator;
      total = doTheMath(storedOperator, inputs[0], inputs[1]);
      toggleOperatorFocus(storedOperator);
    }
  }

  //display logic
  opKey && typeof lastVal == 'number' ? setCalHistory(inputs[0], opKey, lastVal) : setCalHistory();

  inputs = [total];
  setCurrentDisplay(total);
  storedOperator = '';
});
