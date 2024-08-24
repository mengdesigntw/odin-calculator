console.log('hi');
//List to do:
//type in 0 behavior

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
let operator = '';
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
  setCurrentDisplay(temporary);
  if (operator) {
    setCalHistory(inputs[inputs.length - 1], operator);
    if (temporary.length == 1) toggleOperatorFocus(operator); //only when first entry
  } else {
    //start clean
    inputs = []; 
    setCalHistory()
  }
}

function handleOperatorClick(e) {
  if (temporary) {
    inputs.push(+temporary);
    if (inputs.length > 2) inputs.shift(); //remove the first one
    if (!operator) {
      toggleOperatorFocus(e.target.textContent);
    } else {
      toggleOperatorFocus(e.target.textContent);
      total = doTheMath(operator, inputs[0], inputs[1]);
      setCalHistory(inputs[0], operator, inputs[1]);
      setCurrentDisplay(total);
      inputs = [inputs[1], total];
    }
  }
  if (!temporary) {
    if (!inputs.length) {
      inputs.push(0); //initiate a 0
      toggleOperatorFocus(e.target.textContent);
    } else if (!operator) {
      // 7 = +
      toggleOperatorFocus(e.target.textContent);
      setCalHistory()
    } else {
        //7 + -
        toggleOperatorFocus(e.target.textContent)
        toggleOperatorFocus(operator)
    }
  }
  temporary = '';
  operator = e.target.textContent;
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
  if (operator && !temporary) {
    const lastInput = inputs[inputs.length - 1];
    toggleOperatorFocus(operator);
    total = doTheMath(operator, lastInput, lastInput);
    opKey = operator;
    lastVal = lastInput;
  }
  if (temporary) {
    inputs.push(+temporary); // '7'
    temporary = '';
    const lastInput = inputs[inputs.length - 1];
    if (inputs.length > 2) inputs.shift(); // if 3
    if (inputs.length < 2) {
      // if 1
      total = lastInput;
    } else {
      lastVal = lastInput;
      opKey = operator;
      total = doTheMath(operator, inputs[0], inputs[1]);
    }
  }

  //display logic
  opKey && lastVal ? setCalHistory('', opKey, lastVal) : setCalHistory();

  inputs = [total];
  setCurrentDisplay(total);
  operator = '';
});
