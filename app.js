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

//create variable to store final input value, operator, temporary value(e.g 77)
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
  //   currentValue.textContent = sum;
  //   inputs = [sum];
}

//create click event to the digit pad and show it on the display
key7.addEventListener('click', function (e) {
  const value = +e.target.textContent; // number 7
  //show history if inputs[0] has value, and toggle the focused state off when temporary is falsy
  if ((inputs[0] || inputs[0] === 0) && !temporary) {
    calHistory.textContent = `${inputs[0]} ${operator}`;
    plusKey.classList.toggle('focused');
  }
  //store in temp
  temporary += value; //temp: '7777' string
  currentValue.textContent = temporary;
  console.log(inputs, temporary);
});

//[0] //false
//create event to the operator
plusKey.addEventListener('click', function (e) {
  if (!inputs[0] && inputs[0] !== 0) {
    //tap 777 +
    if (temporary) {
      inputs.push(+temporary);
      temporary = '';
    } else {
      //tap +
      temporary = '0';
      inputs.push(+temporary);
      temporary = '';
    }
  } else if (inputs[0] || inputs[0] === 0) {
    //check if therse is history, if no history do nothing
    if (calHistory.textContent) {
      inputs.push(+temporary); //[154, 77]
      if (operator == '+') {
        const sum = plus(inputs); // 154 + 77
        calHistory.textContent = `${inputs[0]} ${operator} ${inputs[1]}`;
        inputs = [sum];
        currentValue.textContent = sum;
      }
    }
    temporary = '';
  }

  plusKey.classList.toggle('focused');
  operator = e.target.textContent; // string '+'
  console.log(inputs, operator, temporary);
});

//create event to end the cal-cycle
equalKey.addEventListener('click', function (e) {
  if (!operator) return;
  if (operator && !temporary) {
    plusKey.classList.toggle('focused');
    operator = '';
    calHistory.textContent = '';
    return;
  }
  //if there is temporary
  inputs.push(+temporary);
  temporary = '';
  console.log(inputs, temporary);
  if (operator == '+') {
    const sum = inputs.reduce((total, value) => {
      return total + value;
    }, 0);
    currentValue.textContent = sum;
    inputs = [sum];
  }
  operator = '';
  calHistory.textContent = '';
  console.log(inputs, temporary);
});
