console.log('hi');

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
let temporary = '';
let inputs = [];
let operator = '';
currentValue.textContent = inputs[0] || 0;
calHistory.textContent = '';

function toggleOperatorFocus(operator) {
  if (operator == '+') plusKey.classList.toggle('focused');
  if (operator == '-') minusKey.classList.toggle('focused');
  if (operator == 'x') multiplyKey.classList.toggle('focused');
  if (operator == '/') divideKey.classList.toggle('focused');
}

//Math function
function doTheMath(operator, arr) {
  if (operator == '+') return arr.reduce((total, value) => total + value, 0);
  if (operator == '-') return arr.reduce((total, value) => total - value);
  if (operator == 'x') return arr.reduce((total, value) => total * value, 1);
  if (operator == '/') return arr.reduce((total, value) => total / value);

}

function handleDigitClick(e) {
  temporary += e.target.textContent; //string
  currentValue.textContent = temporary;
  if (operator) {
    calHistory.textContent = `${inputs[inputs.length - 1]} ${operator}`;
    if (temporary.length == 1) toggleOperatorFocus(operator); //only when first entry
  } else {
    inputs = []; //start clean
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
      const result = doTheMath(operator, inputs); //plus(inputs);
      inputs.push(result);
      inputs.shift();
      calHistory.textContent = `${inputs[0]} ${operator}`;
      currentValue.textContent = inputs[1];
    }
  }
  if (!temporary) {
    if (!inputs.length) {
      inputs.push(0); //initiate a 0
      toggleOperatorFocus(e.target.textContent);
    } else if (!operator) {
      // 7 = +
      toggleOperatorFocus(e.target.textContent);
    }
  }
  temporary = '';
  operator = e.target.textContent;
}

digits.forEach((digit) => digit.addEventListener('click', handleDigitClick));
operators.forEach((opKey) => opKey.addEventListener('click', handleOperatorClick));


equalKey.addEventListener('click', function (e) {
  if (operator && !temporary) toggleOperatorFocus(operator);
  if (temporary) {
    inputs.push(+temporary); // '7'
    temporary = '';
    if (inputs.length > 2) inputs.shift();
  }
  if (operator) {
    const result = doTheMath(operator, inputs); //debug: pay attention on focus operator and history operator 
    inputs = [result];
    currentValue.textContent = result;
  }
  operator = '';
  calHistory.textContent = '';
});
