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
}


key7.addEventListener('click', function (e) {
//store the value in temporary as string and concat
//then show it on currentValue
temporary += +e.target.textContent
currentValue.textContent = temporary

//if there's stored operator, then show inputs[0] and stored operator on the history. 
//also toggle the operator focus off only when first entry
if(operator) {
    calHistory.textContent = `${inputs[0]} ${operator}`;
    if(temporary.length == 1) plusKey.classList.toggle('focused')
} else {
    inputs = []
}
console.log(inputs, operator, temporary);
  
});


plusKey.addEventListener('click', function (e) {
  //when there is temporary then push to the inputs, then clear temporary.
  //and toggole the focus on.

  //if there's stored operator, display cal history with previous input and operator
  //then do the math and re-assign the value to input and display in currentValue

  //after above done, re-assign '+' to operator
  if (temporary) {
    inputs.push(+temporary);
    temporary = '';
    plusKey.classList.toggle('focused');
    if (operator == '+') {
      calHistory.textContent = `${inputs[0]} ${operator}`;
      const sum = plus(inputs);
      inputs = [sum];
      currentValue.textContent = inputs[0];
    }
    operator = e.target.textContent;
  }
  //when there is no temporary then do nothing
  // unless the intitial [] is also empty, then push a 0 as the first input
  //and toggle on focus on
  //assign '+' to operator
  if (!temporary && !inputs.length) {
    inputs.push(0);
    plusKey.classList.toggle('focused');
    operator = e.target.textContent;
  }
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
  console.log(inputs, operator, temporary);
});
