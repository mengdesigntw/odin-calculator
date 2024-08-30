console.log('hi');
//List to do:
//percentage key
//modDisplay logic for minus diplay.
//show custom error message when user try to divide number by 0
//display container overflow

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

//state variables only for equalKey to repeat last action
let opKey = '';
let lastVal = '';

setCurrentDisplay();
setCalHistory(); //initialize

//clear function
function allClear() {
  toggleOperatorFocus(storedOperator);
  temporary = '';
  inputs = [];
  storedOperator = '';
  total = 0;
  opKey = '';
  lastVal = '';
  setCurrentDisplay();
  setCalHistory();
  setClearDisplay();
}

function clearUnit() {
  if (temporary) {
    temporary = '0';
    if (!inputs.length) allClear();
  }
  if (!temporary) {
    if (!storedOperator && inputs.length) allClear();
    if (storedOperator) {
      toggleOperatorFocus(storedOperator);
      storedOperator = '';
      setCalHistory(); //7=+C
    }
  }
  setCurrentDisplay();
  setClearDisplay();
}

//setting Display function
function setCurrentDisplay() {
  let currentDisplay;
  temporary ? (currentDisplay = temporary) : total ? (currentDisplay = total) : (currentDisplay = '0');
  currentValue.textContent = currentDisplay
  if (currentValue.textContent.startsWith('0.')) return;
  modDisplay(currentDisplay.toString());
}

function setCalHistory() {
  if (lastVal.toString().length) {
    if (storedOperator) calHistory.textContent = `${inputs[inputs.length - 1]} ${opKey} ${lastVal}`; //7+8+= +=
    if (!storedOperator) calHistory.textContent = `${inputs[0]} ${opKey} ${lastVal}`; //7+8= 7+8==
  } else if (!inputs.length && temporary) {
    calHistory.textContent = `${temporary} ${storedOperator}`; //7+ + 0+
  } else if (inputs.length && temporary) {
    calHistory.textContent = `${inputs[inputs.length - 1]} ${storedOperator}`; //.2+. 7+8-M
  } else if (inputs.length && !temporary) {
    if (!storedOperator) calHistory.textContent = `${inputs[inputs.length - 1]}`; // 7=+D 7+8-D
    if (storedOperator) calHistory.textContent = `${inputs[inputs.length - 1]} ${storedOperator}`; // 7+8 7+8-5 7+8-5D+ 7+8-+ 7+8- 7+8-5+ .2+.3-. .2+.3-.4+
  } else {
    calHistory.textContent = ''; //initialize
  }
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
  let result = 0;
  if (operator == '+') result = val1 + val2;
  if (operator == '-') result = val1 - val2;
  if (operator == 'x') result = val1 * val2;
  if (operator == '/') result = val1 / val2;
  return parseFloat(result.toFixed(10));
}

function modTemporary(e) {
  if (temporary.startsWith('-') && temporary.length > 2 && temporary.at(1) == '0') {
    if (!temporary.includes('.')) temporary = `-${temporary.slice(2)}`; //-08
    if (temporary.includes('.')) return; //-0.8
  } else if (!temporary.startsWith('-') && temporary.length > 1 && temporary.at(0) == '0') {
    if (!temporary.includes('.')) temporary = temporary.slice(1); //08
    if (temporary.includes('.')) return; //0.8
  }
}

function modInteger(str) {
  const integerStr = str;
  let arr = [];
  if (integerStr.length > 3) {
    if (integerStr.length % 3 !== 0) {
      if (integerStr.length % 3 == 1) arr.push(integerStr.slice(0, 1));
      if (integerStr.length % 3 == 2) arr.push(integerStr.slice(0, 2));
      for (i = -1; i >= -integerStr.length; i--) {
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
      for (i = -1; i >= -integerStr.length; i--) {
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
  return str
}

function modDisplay(str) {
  const currentDisplay = str;
  if (currentDisplay.includes('.')) {
    const idx = currentDisplay.indexOf('.');
    const integerStr = currentDisplay.slice(0, idx);
    const decimalStr = currentDisplay.slice(idx, currentDisplay.length);
    currentValue.textContent = modInteger(integerStr).concat(decimalStr);
  } else {
    currentValue.textContent = modInteger(str);
  }
}

//handle Click
function handleDigitClick(e) {
  opKey = '';
  lastVal = '';
  if (storedOperator) setCalHistory(); //7+8-5 7+8
  temporary += e.target.textContent;
  modTemporary(e);
  if (!storedOperator) {
    inputs = []; //start clean
    total = 0;
    setCalHistory(); //7+8=9
  }
  setCurrentDisplay();
  setClearDisplay();
}

function handleOperatorClick(e) {
  const currentOperator = e.target.textContent;
  opKey = '';
  lastVal = '';
  if (!temporary) {
    toggleOperatorFocus(currentOperator);
    if (inputs.length >= 1) {
      toggleOperatorFocus(storedOperator);
      storedOperator = currentOperator;
      setCalHistory(); // 7+8-+ // 7=+- 7+-
    }
    if (!inputs.length) {
      temporary = '0';
      storedOperator = currentOperator;
      setCalHistory(); //+
      inputs.push(+temporary);
      temporary = '';
    }
  }
  if (temporary) {
    if (temporary !== '0') {
      if (temporary == '0.') temporary = '0';
      if (storedOperator) {
        inputs.push(+temporary);
        if (inputs.length > 2) inputs.shift(); //remove the first one
        if (storedOperator !== currentOperator) {
          toggleOperatorFocus(currentOperator);
          toggleOperatorFocus(storedOperator);
        }
        total = doTheMath(storedOperator, inputs[0], inputs[1]);
        inputs = [inputs[1], total];
        storedOperator = currentOperator;
        temporary = '';
        setCurrentDisplay();
        setCalHistory(); //7+8- 7+8-5+ .2+.3- .2+.3-.4+
      }
      if (!storedOperator) {
        toggleOperatorFocus(currentOperator);
        toggleOperatorFocus(storedOperator);
        storedOperator = currentOperator;
        setCalHistory(); // 7 +
        inputs.push(+temporary);
        temporary = '';
      }
    }
    if (temporary == '0') {
      toggleOperatorFocus(currentOperator);
      toggleOperatorFocus(storedOperator);
      storedOperator = currentOperator;
      if (inputs.length) {
        temporary = '';
        setCalHistory(); //7+8-5D+
      }
      if (!inputs.length) {
        setCalHistory(); //0+
        inputs.push(+temporary);
        temporary = '';
      }
    }
  }
  setClearDisplay();
}

function handleDelete(e) {
  if (opKey) allClear();
  if (temporary) {
    if ((!temporary.startsWith('-') && temporary.length == 1) || (temporary.startsWith('-') && temporary.length == 2)) {
      temporary = '0'; //8D (-8)D
      if (!inputs.length) allClear();
    }
    if ((!temporary.startsWith('-') && temporary.length > 1) || (temporary.startsWith('-') && temporary.length > 2)) {
      temporary = temporary.slice(0, -1); //89D (-89)D
    }
  }
  if (!temporary) {
    if (!storedOperator && inputs.length) {
      const lastInput = inputs[inputs.length - 1].toString(); // '7'
      if (lastInput.length == 1) allClear(); //2+3=+DD 2+3-4+DD
      if (lastInput.length > 1) temporary = lastInput.slice(0, -1); //7+89=+DD 7+8-DD
      inputs = [];
      total = 0;
    }
    if (storedOperator) {
      toggleOperatorFocus(storedOperator);
      storedOperator = ''; //7=+D 7+8-D
    }
  }
  setCurrentDisplay();
  setCalHistory();
  setClearDisplay();
}

function handleEqual(e) {
  if (opKey && lastVal.toString().length) {
    total = doTheMath(opKey, total, lastVal);
    setCalHistory(); //7+8==
  }
  if (!temporary && storedOperator) {
    const lastInput = inputs[inputs.length - 1];
    toggleOperatorFocus(storedOperator);
    total = doTheMath(storedOperator, lastInput, lastInput);
    opKey = storedOperator;
    lastVal = lastInput;
    setCalHistory(); // 7+8+= +=
    storedOperator = '';
  }
  if (temporary) {
    inputs.push(+temporary);
    temporary = '';
    const lastInput = inputs[inputs.length - 1];
    if (inputs.length > 2) inputs.shift();
    if (inputs.length == 1) {
      total = lastInput;
      storedOperator = '';
      setCalHistory(); //7=
    }
    if (inputs.length == 2) {
      lastVal = lastInput;
      opKey = storedOperator;
      total = doTheMath(storedOperator, inputs[0], inputs[1]);
      toggleOperatorFocus(storedOperator);
      storedOperator = '';
      setCalHistory(); //7+8=
    }
  }
  inputs = [total];
  setCurrentDisplay();
  setClearDisplay();
}

function handleDecimal(e) {
  opKey = '';
  lastVal = '';
  if (!temporary) {
    temporary = '0.'; //. .2+. .2+.3-.
    if (!storedOperator) {
      inputs = [];
      total = 0; // 2+3=.
    }
  } else if (!temporary.includes('.')) {
    temporary += e.target.textContent; //M.
  }
  setCalHistory();
  setCurrentDisplay();
  setClearDisplay();
}

function handlePositiveMinus() {
  const lastInput = inputs[inputs.length - 1];
  if ((!temporary || temporary == '0') && !lastInput) {
    temporary = '-0'; //M 0M
  } else if (!temporary && lastInput) {
    temporary = (-+lastInput).toString(); //7+M 7+8-M
  } else if (temporary == '0' && lastInput) {
    temporary = '-0'; // 7+8DM
  } else {
    temporary = (-+temporary).toString(); //7M 7+89DM
  }
  setCalHistory();
  setCurrentDisplay();
  setClearDisplay();
}

clearKey.addEventListener('click', function (e) {
  clearKey.textContent == 'AC' ? allClear() : clearUnit();
});
deleteKey.addEventListener('click', handleDelete);
digits.forEach((digit) => digit.addEventListener('click', handleDigitClick));
operators.forEach((opKey) => opKey.addEventListener('click', handleOperatorClick));
equalKey.addEventListener('click', handleEqual);
decimalKey.addEventListener('click', handleDecimal);
positiveMinusKey.addEventListener('click', handlePositiveMinus);
