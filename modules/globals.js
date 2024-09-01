//create variables for nodes
const currentValue = document.querySelector('.current');
const calHistory = document.querySelector('.history');
const clearKey = document.querySelector('#clear');
const positiveMinusKey = document.querySelector('#positive-minus');
const percentageKey = document.querySelector('#percentage');
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

export {
  currentValue,
  calHistory,
  clearKey,
  positiveMinusKey,
  percentageKey,
  divideKey,
  multiplyKey,
  minusKey,
  plusKey,
  decimalKey,
  deleteKey,
  equalKey,
  operators,
  digits,
  pads,
};
