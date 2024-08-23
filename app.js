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

// const operators = document.querySelectorAll('.operator')

const key7 = document.querySelector('#key7');

//state variables
let temporary = '';
let inputs = [];
let operator = '';
currentValue.textContent = inputs[0] || 0;
calHistory.textContent = '';

//plus function
function plus(arr) {
  const sum = arr.reduce((total, value) => {
    return total + value;
  }, 0);
  return sum;
}

///////DIGIT//////
key7.addEventListener('click', function (e) {
  temporary += e.target.textContent; //string
  currentValue.textContent = temporary;
  if (operator) {
    calHistory.textContent = `${inputs[inputs.length - 1]} ${operator}`;
    if (temporary.length == 1) plusKey.classList.toggle('focused');   //only when first entry
  } else {
    inputs = []; //start clean
  }
});

///OPERATOR////
plusKey.addEventListener('click', function (e) {
  if (temporary) {
    inputs.push(+temporary);
    plusKey.classList.toggle('focused');
    if (inputs.length > 2) inputs.shift(); //remove the first one
    if (operator == '+') {
      const sum = plus(inputs);
      inputs.push(sum);
      inputs.shift();
      calHistory.textContent = `${inputs[0]} ${operator}`;
      currentValue.textContent = inputs[1];
    }
  }
  if (!temporary) {
    if (!inputs.length) {
      inputs.push(0); //initiate a 0
      plusKey.classList.toggle('focused');
    } else if (!operator) { // 7 = +
      plusKey.classList.toggle('focused');
    }
  }
  temporary = '';
  operator = e.target.textContent;
});

equalKey.addEventListener('click', function (e) {
  if (operator && !temporary) plusKey.classList.toggle('focused');
  if (temporary) {
    inputs.push(+temporary); // '7'
    temporary = '';
    if (inputs.length > 2) inputs.shift();
  }
  if (operator == '+') {
    const sum = plus(inputs);
    inputs = [sum];
    currentValue.textContent = sum;
  }
  operator = '';
  calHistory.textContent = '';
});
