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

//create variable to store input value and operator
let inputs = [];
let operator = '';
currentValue.textContent = inputs[0] || 0;
calHistory.textContent = '';

//create click event to the digit pad and show it on the display
key7.addEventListener('click', function (e) {
  const value = +e.target.textContent; // number 7
  currentValue.textContent = value;
  //show history if inputs[0] has value
  if (inputs[0] || inputs[0] == 0) {
    calHistory.textContent = `${inputs[0]} ${operator}`;
    plusKey.classList.toggle('focused');
  }
  inputs.push(value);
  console.log(inputs);
});

//create event to the operator
plusKey.addEventListener('click', function (e) {
  const value = e.target.textContent;
  operator = value; // string '+'
  if (!inputs[0]) inputs.push(0);
  plusKey.classList.toggle('focused');
  console.log(inputs, operator)
});

//create event to end the cal-cycle
equalKey.addEventListener('click', function (e) {
  if (!operator) return;
  if ((operator = '+')) {
    const sum = inputs.reduce((total, value) => {
      return total + value;
    }, 0);
    currentValue.textContent = sum;
    inputs = [sum];
  }
  calHistory.textContent = '';
  console.log(inputs)
});
