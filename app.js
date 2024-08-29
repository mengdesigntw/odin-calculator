console.log('hi');
//List to do:
//modifier key
//percentage key
//show comma when digits hit 4 (%3 == 1)
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

//state variables only for equalKey to repeat last action
let opKey = '';
let lastVal = '';

setCurrentDisplay(0);
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
  setCurrentDisplay(0);
  setCalHistory();
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
      setCalHistory(); //7=+C
    }
  }
  setClearDisplay();
}

//setting Display function
function setCurrentDisplay(val) {
  currentValue.textContent = val;
}

function setCalHistory() {
  if (lastVal.toString().length) {
    if (storedOperator) calHistory.textContent = `${inputs[inputs.length - 1]} ${opKey} ${lastVal}`; //7+8+= +=
    if (!storedOperator) calHistory.textContent = `${inputs[0]} ${opKey} ${lastVal}`; //7+8= 7+8==
  } else if (!inputs.length && temporary) {
    calHistory.textContent = `${temporary} ${storedOperator}`; //7+ + 0+
  } else if (inputs.length && temporary) {
    if (inputs.length == 1 && temporary.startsWith('0.')) {
      if (temporary.length > 2) calHistory.textContent = `${inputs[0]} ${storedOperator} ${temporary}`; //.2+.3-
      if (temporary.length <= 2) calHistory.textContent = `${inputs[0]} ${storedOperator}`; //.2+.
    }
    if (inputs.length == 1 && !temporary.startsWith('0.')) calHistory.textContent = `${inputs[0]} ${storedOperator} ${temporary}`; //7+8-
    if (inputs.length == 2 && temporary.startsWith('0.')) {
      if (temporary.length > 2) calHistory.textContent = `${inputs[1]} ${storedOperator} ${temporary}`; //.2+.3-.4+
      if (temporary.length <= 2) calHistory.textContent = `${inputs[1]} ${storedOperator}`; // .2+.3-.
    }
    if (inputs.length == 2 && !temporary.startsWith('0.')) calHistory.textContent = `${inputs[1]} ${storedOperator} ${temporary}`; //7+8-5+
  } else if (inputs.length && !temporary) {
    if (inputs.length == 1 && storedOperator) calHistory.textContent = `${inputs[0]} ${storedOperator}`; //7+8
    if (inputs.length == 1 && !storedOperator) calHistory.textContent = ''; // 7=+D
    if (inputs.length == 2 && !storedOperator) return; // 7+8-D
    if (inputs.length == 2 && storedOperator) calHistory.textContent = `${inputs[inputs.length - 1]} ${storedOperator}`; //7+8-5 7+8-5D+ 7+8-+
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

//handle Click
function handleDigitClick(e) {
  opKey = '';
  lastVal = '';
 
    if (!temporary && storedOperator) setCalHistory(); //7+8-5 7+8

  temporary += e.target.textContent;
  if (temporary.length > 1 && temporary.at(0) == 0 && !temporary.includes('.')) temporary = temporary.slice(1);
  setCurrentDisplay(temporary);
  if (!storedOperator) {
    inputs = []; //start clean
    total = 0;
    setCalHistory(); //7+8=9
  }
  setClearDisplay();
}

function handleOperatorClick(e) {
  const currentOperator = e.target.textContent;
  opKey = '';
  lastVal = '';
  if (!temporary) {
    toggleOperatorFocus(currentOperator);
    if (inputs.length > 1) {
      toggleOperatorFocus(storedOperator);
      storedOperator = currentOperator;
      setCalHistory(); // 7+8-+
    }
    if (inputs.length == 1) {
      toggleOperatorFocus(storedOperator);
      storedOperator = currentOperator;
      setCalHistory(); // 7=+- 7+-
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
        setCalHistory(); //7+8- 7+8-5+ .2+.3- .2+.3-.4+
        inputs.push(+temporary);
        if (inputs.length > 2) inputs.shift(); //remove the first one
        if (storedOperator !== currentOperator) {
          toggleOperatorFocus(currentOperator);
          toggleOperatorFocus(storedOperator);
        }

        total = doTheMath(storedOperator, inputs[0], inputs[1]);
        setCurrentDisplay(total);
        inputs = [inputs[1], total];

        storedOperator = currentOperator;
      }
      if (!storedOperator) {
        toggleOperatorFocus(currentOperator);
        toggleOperatorFocus(storedOperator);
        storedOperator = currentOperator;
        setCalHistory(); // 7 +
        inputs.push(+temporary);
      }
      temporary = '';
    }
    if (temporary == '0') {
      toggleOperatorFocus(currentOperator);
      toggleOperatorFocus(storedOperator);
      storedOperator = currentOperator;
      if(inputs.length){
        temporary = '';
        setCalHistory(); //7+8-5D+
      }
     if(!inputs.length){
        setCalHistory(); //0+
        inputs.push(+temporary)
        temporary = '';
     }
    }
  }
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
      setCalHistory(); //7=+D 7+8-D
    }
  }
  setClearDisplay();
});

digits.forEach((digit) => digit.addEventListener('click', handleDigitClick));

operators.forEach((opKey) => opKey.addEventListener('click', handleOperatorClick));

equalKey.addEventListener('click', function () {
  if (opKey && lastVal.toString().length) {
    total = doTheMath(opKey, total, lastVal);
    setCalHistory(); //7+8==
  }
  if (storedOperator && !temporary) {
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
    if (inputs.length < 2) {
      total = lastInput;
      storedOperator = '';
      setCalHistory(); //7=
    } else {
      lastVal = lastInput;
      opKey = storedOperator;
      total = doTheMath(storedOperator, inputs[0], inputs[1]);
      toggleOperatorFocus(storedOperator);
      storedOperator = '';
      setCalHistory(); //7+8=
    }
  }
  inputs = [total];
  setCurrentDisplay(total);
  setClearDisplay();
});

decimalKey.addEventListener('click', function (e) {
  opKey = '';
  lastVal = '';
  if (!temporary) {
    temporary = '0.';
    if (!storedOperator) {
      inputs = [];
      total = 0;
      setCalHistory(); //2+3=.
    }
    if (inputs.length) setCalHistory(); //.2+. .2+.3-.
  } else if (!temporary.includes('.')) {
    temporary += e.target.textContent;
  }
  setCurrentDisplay(temporary);
  setClearDisplay();
});

positiveMinusKey.addEventListener('click', function (e) {
  temporary = -+temporary;
  setCurrentDisplay(temporary);
  setClearDisplay();
});
