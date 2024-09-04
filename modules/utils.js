import { plusKey, divideKey, minusKey, multiplyKey } from './globals.js';

function toggleOperatorFocus(operator) {
  if (operator == '+') plusKey.classList.toggle('focused');
  if (operator == '-') minusKey.classList.toggle('focused');
  if (operator == 'x') multiplyKey.classList.toggle('focused');
  if (operator == '/') divideKey.classList.toggle('focused');
}
//Math function
function doTheMath(operator, val1, val2) {
  let result = 0;
  if (operator == '+') result = val1 + val2;
  if (operator == '-') result = val1 - val2;
  if (operator == 'x') result = val1 * val2;
  if (operator == '/') result = val1 / val2;
  return result;
}

//moddisplay
function modMathResult(val) {
  return parseFloat(val.toPrecision(13));
}

function modInteger(str) {
  const integerStr = str;
  let arr = [];
  if (integerStr.length > 3) {
    if (integerStr.length % 3 !== 0) {
      if (integerStr.length % 3 == 1) arr.push(integerStr.slice(0, 1));
      if (integerStr.length % 3 == 2) arr.push(integerStr.slice(0, 2));
      for (let i = -1; i >= -integerStr.length; i--) {
        if (i == -3) {
          const seg = integerStr.slice(i);
          arr.splice(1, 0, seg);
        } else if (i % 3 == 0) {
          const seg = integerStr.slice(i, i + 3);
          arr.splice(1, 0, seg);
        }
      }
    }
    if (integerStr.length % 3 == 0) {
      for (let i = -1; i >= -integerStr.length; i--) {
        if (i == -3) {
          const seg = integerStr.slice(i);
          arr.unshift(seg);
        } else if (i % 3 == 0) {
          const seg = integerStr.slice(i, i + 3);
          arr.unshift(seg);
        }
      }
    }
    return arr.toString();
  }
  return str;
}

function modDisplay(str) {
  let currentDisplay = str;
  if (!currentDisplay.startsWith('-')) {
    if (currentDisplay.includes('.')) {
      const idx = currentDisplay.indexOf('.');
      const integerStr = currentDisplay.slice(0, idx);
      const decimalStr = currentDisplay.slice(idx, currentDisplay.length);
      return modInteger(integerStr).concat(decimalStr);
    } else {
      return modInteger(currentDisplay);
    }
  }
  if (currentDisplay.startsWith('-')) {
    //-1234
    currentDisplay = currentDisplay.slice(1); //remove '-'
    if (currentDisplay.includes('.')) {
      const idx = currentDisplay.indexOf('.');
      const integerStr = currentDisplay.slice(0, idx);
      const decimalStr = currentDisplay.slice(idx, currentDisplay.length);
      return `-${modInteger(integerStr).concat(decimalStr)}`;
    } else {
      return `-${modInteger(currentDisplay)}`;
    }
  }
}

function modOpposite(str) {
  if (!str.startsWith('-')) {
    return `-${str}`; //0, 0., 0.0, 7, 7. ,7.7
  } else if (str.startsWith('-')) {
    if (!str.includes('.')) return `${-+str}`; //-0,-7
    if (str.includes('.')) {
      if (str.endsWith('.')) return `${-+str}.`; //-0. -7.
      if (!str.endsWith('.')) return `${str.slice(1)}`; //-0.0, -7.7
    }
  }
}

//modTemporary
function modTemporary(str) {
  if (str.startsWith('-') && str.length > 2 && str.at(1) == '0') {
    if (!str.includes('.')) return `-${str.slice(2)}`; //-08
    if (str.includes('.')) return str; //-0.8
  } else if (!str.startsWith('-') && str.length > 1 && str.at(0) == '0') {
    if (!str.includes('.')) return str.slice(1); //08
    if (str.includes('.')) return str; //0.8
  } else {
    return str;
  }
}

export { toggleOperatorFocus, doTheMath, modMathResult, modInteger, modDisplay, modTemporary, modOpposite };
