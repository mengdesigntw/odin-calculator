console.log('hi');
//List to do:
//show comma when digits hit 4 (%3 == 1)
//decimal logic
//show custom error message when user try to divide number by 0

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
const pads = Array.from(document.querySelectorAll('.pad'));

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

//clear function
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
  setClearDisplay();
}

function clearUnit() {
  if (temporary) {
    setCurrentDisplay(0);
    temporary = '0';
    if (!inputs.length) allClear();
  }
  if (!temporary) {
    if (!storedOperator && inputs.length) allClear();
    if (storedOperator) {
      toggleOperatorFocus(storedOperator);
      storedOperator = '';
    }
  }
  setClearDisplay();
}

//setting Display function
function setCurrentDisplay(val) {
  currentValue.textContent = val;
}

function setCalHistory(val1 = '', operator = '', val2 = '') {
  calHistory.textContent = `${val1} ${operator} ${val2}`;
}

function setClearDisplay() {
  currentValue.textContent == '0' || opKey ? (clearKey.textContent = 'AC') : (clearKey.textContent = 'C');
}

function toggleOperatorFocus(operator) {
  if (operator == '+') plusKey.classList.toggle('focused');
  if (operator == '-') minusKey.classList.toggle('focused');
  if (operator == 'x') multiplyKey.classList.toggle('focused');
  if (operator == '/') divideKey.classList.toggle('focused');
}

pads.forEach((pad) => {
  pad.addEventListener('mousedown', function (e) {
    e.target.style.boxShadow = '0px 1px 2px rgba(61, 37, 5, 0.25)';
    e.target.style.filter = 'brightness(0.95)';
  });
  pad.addEventListener('mouseup', function (e) {
    e.target.style.boxShadow = '1px 2px 4px rgba(61, 37, 5, 0.25)';
    e.target.style.filter = 'brightness(1)';
  });
});

//Math function
function doTheMath(operator, val1, val2) {
  if (operator == '+') return val1 + val2;
  if (operator == '-') return val1 - val2;
  if (operator == 'x') return val1 * val2;
  if (operator == '/') return val1 / val2;
}

//handle Click
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
    total = 0;
  }
  setClearDisplay();
}

function handleOperatorClick(e) {
  const currentOperator = e.target.textContent;
  opKey = '';
  lastVal = null;
  if (!temporary) {
    toggleOperatorFocus(currentOperator);
    if (!inputs.length) inputs.push(0); //initiate a 0
    if (inputs.length >= 1) {
      setCalHistory(inputs[inputs.length - 1], currentOperator);
      toggleOperatorFocus(storedOperator);
      if (inputs.length == 1 && !storedOperator) setCalHistory();
    }
  }

  if (temporary) {
    if (temporary == '0') {
      toggleOperatorFocus(currentOperator);
      toggleOperatorFocus(storedOperator);
      setCalHistory(inputs[inputs.length - 1], currentOperator);
    }
    if (temporary !== '0') {
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
  }
  temporary = '';
  storedOperator = currentOperator;
  setClearDisplay();
}

clearKey.addEventListener('click', function (e) {
  clearKey.textContent == 'AC' ? allClear() : clearUnit();
});
deleteKey.addEventListener('click', function (e) {
  if (opKey) allClear();
  if (temporary) {
    if (temporary.length == 1) {
      setCurrentDisplay(0);
      temporary = '0';
      if (!inputs.length) allClear();
    }
    if (temporary.length > 1) {
      temporary = temporary.slice(0, -1);
      setCurrentDisplay(temporary);
    }
  }
  if (!temporary) {
    if (!storedOperator && inputs.length) {
      const lastInput = inputs[inputs.length - 1].toString(); // '7'
      if (lastInput.length == 1) {
        setCurrentDisplay(0);
        if (inputs.length == 1) allClear();
      }
      if (lastInput.length > 1) {
        temporary = lastInput.slice(0, -1);
        setCurrentDisplay(temporary);
        if (inputs.length == 2) allClear();
      }
      inputs = [];
      total = 0;
    }
    if (storedOperator) {
      toggleOperatorFocus(storedOperator);
      storedOperator = '';
    }
  }
  setClearDisplay();
});

digits.forEach((digit) => digit.addEventListener('click', handleDigitClick));

operators.forEach((opKey) => opKey.addEventListener('click', handleOperatorClick));

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
  setClearDisplay();
});
