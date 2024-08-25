console.log('hi');
//List to do:
//show comma when digits hit 4 (%3 == 1)
//decimal logic
//show custom error message when user try to divide number by 0
//delete logic (only when user inputs or operator key is focus)
//ac or c

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
const pads =Array.from(document.querySelectorAll('.pad'))

//state variables
let temporary = ''; //for multiple digit
let inputs = []; //track on input 1 and input 2
let storedOperator = '';
let total = 0;
setCurrentDisplay(0);
setCalHistory(); //initialize

//state variables only for equalKey to repeat last action
let opKey = '';
let lastVal = null;

function allClear() {
  toggleOperatorFocus(storedOperator);
  temporary = '';
  inputs = [];
  storedOperator = '';
  total = 0;
  setCurrentDisplay(0);
  setCalHistory();
  opKey = '';
  lastVal = null;
}

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
  opKey = '';
  lastVal = null;
  temporary += e.target.textContent; //string
  if (temporary.length > 1 && temporary.at(0) == 0) temporary = temporary.slice(1);
  setCurrentDisplay(temporary);
  if (storedOperator) {
    setCalHistory(inputs[inputs.length - 1], storedOperator);
  } else {
    //start clean
    inputs = [];
    setCalHistory();
  }
}

clearKey.addEventListener('click', allClear);

function handleOperatorClick(e) {
  const currentOperator = e.target.textContent;
  opKey = '';
  lastVal = null;
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
    if (inputs.length && !storedOperator) {
      setCalHistory();
    } else {
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
pads.forEach((pad) => {
    pad.addEventListener('mousedown', function(e){
       e.target.style.boxShadow = '0px 1px 2px rgba(61, 37, 5, 0.25)'
       e.target.style.filter = 'brightness(0.95)'
    })
    pad.addEventListener('mouseup', function(e){
        e.target.style.boxShadow = '1px 2px 4px rgba(61, 37, 5, 0.25)'
        e.target.style.filter = 'brightness(1)'
     })
})

equalKey.addEventListener('click', function () {
  if (opKey && lastVal) {
    total = doTheMath(opKey, total, lastVal);
    setCalHistory(inputs[0], opKey, lastVal);
  }
  if (storedOperator && !temporary) {
    const lastInput = inputs[inputs.length - 1];
    toggleOperatorFocus(storedOperator);
    total = doTheMath(storedOperator, lastInput, lastInput);
    opKey = storedOperator;
    lastVal = lastInput;
    setCalHistory(lastVal, opKey, lastVal);
  }
  if (temporary) {
    inputs.push(+temporary);
    temporary = '';
    const lastInput = inputs[inputs.length - 1];
    if (inputs.length > 2) inputs.shift(); // if 3
    if (inputs.length < 2) {
      // if 1
      total = lastInput;
      setCalHistory();
    } else {
      lastVal = lastInput;
      opKey = storedOperator;
      total = doTheMath(storedOperator, inputs[0], inputs[1]);
      toggleOperatorFocus(storedOperator);
      setCalHistory(inputs[0], opKey, lastVal);
    }
  }

  inputs = [total];
  setCurrentDisplay(total);
  storedOperator = '';
});
