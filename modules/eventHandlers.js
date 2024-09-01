import { toggleOperatorFocus, doTheMath, modMathResult, modDisplay } from './utils.js';
import { currentValue, calHistory, clearKey } from './globals.js';

//state variables
let temporary = ''; //for multiple digit
let inputs = []; //track on input 1 and input 2
let storedOperator = '';
let total = 0;

//state variables only for equalKey to repeat last action
let opKey = '';
let lastVal = '';

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
    if (storedOperator) {
      temporary = '0'; // 7+8C
    } else {
      allClear(); //7+8=MC 7+8=PC
    }
    if (!inputs.length) allClear();
  }
  if (!temporary) {
    if (!storedOperator && inputs.length) allClear();
    if (storedOperator) {
      toggleOperatorFocus(storedOperator);
      storedOperator = '';
      temporary = `${inputs[inputs.length - 1]}`;
      setCalHistory(); //7=+C 77+C
    }
  }
  setCurrentDisplay();
  setClearDisplay();
}

//setting Display function
function setCurrentDisplay() {
  let currentDisplay;
  temporary ? (currentDisplay = temporary) : total ? (currentDisplay = modMathResult(total)) : (currentDisplay = 0);
  currentValue.textContent = currentDisplay;
  if (currentValue.textContent.startsWith('0.') || currentValue.textContent.includes('e')) return;
  currentValue.textContent = modDisplay(currentDisplay.toString());
}

function setCalHistory() {
  const modInputs = inputs.map((val) => {
    return modDisplay(modMathResult(val).toString());
  });
  const modTemp = modDisplay(temporary);

  if (lastVal.length) {
    const modLastVal = modDisplay(modMathResult(+lastVal).toString());
    if (storedOperator) calHistory.textContent = `${modInputs[modInputs.length - 1]} ${opKey} ${modLastVal}`; //7+8+= +=
    if (!storedOperator) calHistory.textContent = `${modInputs[0]} ${opKey} ${modLastVal}`; //7+8= 7+8==
  } else if (!inputs.length && temporary) {
    calHistory.textContent = `${modTemp} ${storedOperator}`; //7+ + 0+ 7+8=MD
  } else if (inputs.length && temporary) {
    calHistory.textContent = `${modInputs[modInputs.length - 1]} ${storedOperator}`; //.2+. 7+8-M 7+8=M
  } else if (inputs.length && !temporary) {
    if (!storedOperator) calHistory.textContent = `${modInputs[modInputs.length - 1]}`; // 7=+D 7+8-D
    if (storedOperator) calHistory.textContent = `${modInputs[modInputs.length - 1]} ${storedOperator}`; // 7+8 7+8-5 7+8-5D+ 7+8-+ 7+8- 7+8-5+ .2+.3-. .2+.3-.4+
  } else {
    calHistory.textContent = ''; //initialize
  }
}

function setClearDisplay() {
  currentValue.textContent == '0' || opKey ? (clearKey.textContent = 'AC') : (clearKey.textContent = 'C');
}

//modTemporary
function modTemporary(e) {
  if (temporary.startsWith('-') && temporary.length > 2 && temporary.at(1) == '0') {
    if (!temporary.includes('.')) temporary = `-${temporary.slice(2)}`; //-08
    if (temporary.includes('.')) return; //-0.8
  } else if (!temporary.startsWith('-') && temporary.length > 1 && temporary.at(0) == '0') {
    if (!temporary.includes('.')) temporary = temporary.slice(1); //08
    if (temporary.includes('.')) return; //0.8
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
      setCurrentDisplay();
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
      temporary = temporary.slice(0, -1); //89D (-89)D 78-DD
      inputs = [];
    }
    setCalHistory();
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
      storedOperator = ''; //7=+D 7+8-D 7-D
      temporary = `${inputs[inputs.length - 1]}`;
    }
    setCalHistory();
  }
  setCurrentDisplay();
  setClearDisplay();
}

function handleEqual(e) {
  if (opKey && lastVal.length) {
    total = doTheMath(opKey, total, +lastVal);
    setCalHistory(); //7+8==
    inputs = [total];
    setCurrentDisplay();
    setClearDisplay();
  }

  if (!temporary && storedOperator) {
    const lastInput = inputs[inputs.length - 1];
    if (!(storedOperator == '/' && lastInput == 0)) {
      toggleOperatorFocus(storedOperator);
      total = doTheMath(storedOperator, lastInput, lastInput);
      opKey = storedOperator;
      lastVal = `${lastInput}`;
      setCalHistory(); // 7+8+= +=
      storedOperator = '';
      inputs = [total];
      setCurrentDisplay();
      setClearDisplay();
    } else if (storedOperator == '/' && lastInput == 0) {
      toggleOperatorFocus(storedOperator);
      storedOperator = '';
      allClear();
      currentValue.textContent = 'Naughty ❤'; // 0/=
    }
  }

  if (temporary) {
    inputs.push(+temporary);
    temporary = '';
    const lastInput = inputs[inputs.length - 1];
    if (inputs.length > 2) inputs.shift();
    if (!(storedOperator == '/' && lastInput == 0)) {
      if (inputs.length == 1) {
        total = lastInput;
        storedOperator = '';
        setCalHistory(); //7=
      } else if (inputs.length == 2) {
        lastVal = `${lastInput}`;
        opKey = storedOperator;
        total = doTheMath(storedOperator, inputs[0], inputs[1]);
        toggleOperatorFocus(storedOperator);
        storedOperator = '';
        setCalHistory(); //7+8=
      }
      inputs = [total];
      setCurrentDisplay();
      setClearDisplay();
    } else if (storedOperator == '/' && lastInput == 0) {
      toggleOperatorFocus(storedOperator);
      storedOperator = '';
      allClear();
      currentValue.textContent = 'Naughty ❤'; // 7/0=
    }
  }
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
  if (lastVal.length) {
    temporary = (-+lastInput).toString(); //7+8=M
    inputs = [];
    opKey = '';
    lastVal = '';
    total = 0;
  } else if ((!temporary || temporary == '0') && !lastInput) {
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

function handlePercentage(e) {
  const lastInput = inputs[inputs.length - 1];
  if (lastVal.toString().length) {
    temporary = `${modMathResult(lastInput / 100)}`; //7+8=P
    total = 0;
    opKey = '';
    lastVal = '';
    inputs = [];
  } else if (!inputs.length) {
    temporary = `${modMathResult(+temporary / 100)}`; //7PP
  } else if (inputs.length && temporary) {
    temporary = `${modMathResult((lastInput * temporary) / 100)}`;
  } else if (inputs.length && !temporary) {
    temporary = `${modMathResult((lastInput * lastInput) / 100)}`;
  }
  setCalHistory();
  setCurrentDisplay();
  setClearDisplay();
}

function handleClear(e) {
  clearKey.textContent == 'AC' ? allClear() : clearUnit();
}

export {
  allClear,
  clearUnit,
  setCalHistory,
  setCurrentDisplay,
  setClearDisplay,
  modTemporary,
  handleDigitClick,
  handleOperatorClick,
  handleDelete,
  handleEqual,
  handleDecimal,
  handlePositiveMinus,
  handlePercentage,
  handleClear,
};
