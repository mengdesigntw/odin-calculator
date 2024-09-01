console.log('hi');
//List to do:
//debug //2+3=+DD 2+3-4+DD

import {
  setCalHistory,
  setCurrentDisplay,
  handleClear,
  handleDelete,
  handleDecimal,
  handleDigitClick,
  handleEqual,
  handleOperatorClick,
  handlePositiveMinus,
  handlePercentage,
} from './modules/eventHandlers.js';
import { pads, clearKey, decimalKey, deleteKey, digits, operators, equalKey, positiveMinusKey, percentageKey } from './modules/globals.js';

setCurrentDisplay();
setCalHistory(); //initialize

pads.forEach((pad) => {
  pad.addEventListener('mousedown', function (e) {
    e.currentTarget.style.boxShadow = '0px 1px 2px rgba(61, 37, 5, 0.25)';
    e.currentTarget.style.filter = 'brightness(0.95)';
  });
  pad.addEventListener('mouseup', function (e) {
    e.currentTarget.style.boxShadow = '1px 2px 4px rgba(61, 37, 5, 0.25)';
    e.currentTarget.style.filter = 'brightness(1)';
  });
  pad.addEventListener('mouseleave', function (e) {
    e.currentTarget.style.boxShadow = '1px 2px 4px rgba(61, 37, 5, 0.25)';
    e.currentTarget.style.filter = 'brightness(1)';
  });
});
clearKey.addEventListener('click', handleClear);
deleteKey.addEventListener('click', handleDelete);
digits.forEach((digit) => digit.addEventListener('click', handleDigitClick));
operators.forEach((opKey) => opKey.addEventListener('click', handleOperatorClick));
equalKey.addEventListener('click', handleEqual);
decimalKey.addEventListener('click', handleDecimal);
positiveMinusKey.addEventListener('click', handlePositiveMinus);
percentageKey.addEventListener('click', handlePercentage);
