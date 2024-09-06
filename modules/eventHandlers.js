import {
  toggleOperatorFocus,
  doTheMath,
  modMathResult,
  modDisplay,
  modTemporary,
  modOpposite,
  setCalHistory,
  setClearDisplay,
  setCurrentDisplay,
} from './utils.js';

//state variables
let temporary = ''; //for multiple digit
let inputs = []; //track on input 1 and input 2
let storedOperator = '';
let tempOperator = '';
let total = '';

function updateDisplay() {
  const displayTemp = modDisplay(temporary);
  const displayInputs = inputs.map((val) => modDisplay(val.toString()));
  const displayTotal = modDisplay(total);

  if (!inputs.length && temporary) {
    setClearDisplay('C'); //7 A B C E G G1 A5 D2 D4 G2 G3 G5 H4 H6 H7-1 H7-2 G7-4,6
    setCalHistory(displayTemp);
    setCurrentDisplay(displayTemp);
  } else if (inputs.length && !temporary) {
    setClearDisplay(); //H7 G7-7 H1-6 H7-0 H1-7-7
    setCalHistory(displayInputs[0], storedOperator, displayInputs[1]);
    setCurrentDisplay(displayTotal);
    if (total == 'NaN' || total == 'Infinity') {
      setClearDisplay();
      setCalHistory();
      setCurrentDisplay('Naughty ❤️');
    }
  } else if (inputs.length && temporary) {
    if (!storedOperator) {
      if (!total) {
        setClearDisplay('C'); //G7 G7-0 H7-7 H H0 DF7
        setCalHistory(displayInputs[displayInputs.length - 1], tempOperator);
        setCurrentDisplay(displayTemp);
      } else if (total !== 'NaN' || total !== 'Infinity') {
        setClearDisplay('C'); //H1-7
        setCalHistory(displayTotal, tempOperator);
        setCurrentDisplay(displayTemp);
      } else if (total == 'NaN' || total == 'Infinity') {
        setClearDisplay();
        setCalHistory();
        setCurrentDisplay('Naughty ❤️');
      }
    } else if (storedOperator) {
      setClearDisplay('C'); //DF7-2, H1,2,3,5 G7-1,2,3,5 ,H1-0,1,2, H1-7-1
      setCalHistory(displayInputs[displayInputs.length - 1], storedOperator);
      setCurrentDisplay(displayTemp);
    }
  } else if (!inputs.length && !temporary) {
    setClearDisplay(); //default D F G4 G6 H7-4
    setCalHistory();
    setCurrentDisplay();
  }
}

function handleDigits(e) {
  if (!inputs.length && !temporary) {
    temporary = e.target.textContent; //start here
    updateDisplay();
  } else if (!inputs.length && temporary) {
    temporary += e.target.textContent; // A G1
    temporary = modTemporary(temporary); //DF2
    updateDisplay();
  } else if (inputs.length && !temporary) {
    inputs = [];
    temporary = e.target.textContent;
    total = '';
    storedOperator = '';
    updateDisplay(); // H7-1
  } else if (inputs.length && temporary) {
    if (tempOperator) {
      if (!total) {
        temporary = e.target.textContent;
        storedOperator = tempOperator;
        tempOperator = '';
        updateDisplay(); // G7-1 H1
      } else if (total) {
        temporary = e.target.textContent;
        storedOperator = tempOperator;
        tempOperator = '';
        inputs = [+total];
        total = '';
        updateDisplay(); //H1-7-1
      }
    } else if (!tempOperator) {
      temporary += e.target.textContent; //H1-0
      temporary = modTemporary(temporary); //DF7-2-1, H1-3-0
      updateDisplay();
    }
  }
}

function handleModifier() {
  if (!inputs.length && temporary) {
    temporary = modOpposite(temporary); //B G2 E2 C5-2 DF4-2
    updateDisplay();
  } else if (!inputs.length && !temporary) {
    temporary = '-0';
    updateDisplay(); //D2
  } else if (inputs.length && !temporary) {
    inputs = [];
    temporary = total;
    temporary = modOpposite(temporary);
    total = '';
    storedOperator = '';
    updateDisplay(); //H7-2
  } else if (inputs.length && temporary) {
    if (tempOperator) {
      if (!total) {
        temporary = modOpposite(temporary);
        storedOperator = tempOperator;
        tempOperator = '';
        updateDisplay(); //G7-2 H2 DF7-2
      } else if (total) {
        temporary = modOpposite(temporary);
        storedOperator = tempOperator;
        tempOperator = '';
        inputs = [+total];
        total = '';
        updateDisplay(); //H1-7-2
      }
    } else if (!tempOperator) {
      temporary = modOpposite(temporary);
      updateDisplay(); //H1-1 H5-1, H1-3-1 H1-4-1 H5-1-1
    }
  }
}

function handlePercentage() {
  const lastInput = inputs[inputs.length - 1];
  if (!inputs.length && temporary) {
    temporary = `${modMathResult(+temporary / 100)}`; //C G3
    updateDisplay();
  } else if (!inputs.length && !temporary) {
    updateDisplay(); //D3
  } else if (inputs.length && !temporary) {
    inputs = [];
    temporary = total;
    temporary = `${modMathResult(+total / 100)}`;
    total = '';
    storedOperator = '';
    updateDisplay(); //H7-3
  } else if (inputs.length && temporary) {
    if (tempOperator) {
      if (!total) {
        temporary = `${modMathResult((lastInput * +temporary) / 100)}`;
        storedOperator = tempOperator;
        tempOperator = '';
        updateDisplay(); //G7-3 H3
      } else if (total) {
        temporary = `${modMathResult((+total * +temporary) / 100)}`;
        inputs = [+total];
        total = '';
        storedOperator = tempOperator;
        tempOperator = '';
        updateDisplay(); //H1-7-3
      }
    } else if (!tempOperator) {
      temporary = `${modMathResult((lastInput * +temporary) / 100)}`;
      updateDisplay();
    }
  }
}

function handleClear() {
  if (!inputs.length && temporary) {
    temporary = ''; //D G4
    updateDisplay();
  } else if (!inputs.length && !temporary) {
    updateDisplay(); //D0
  } else if (inputs.length && !temporary) {
    inputs = [];
    storedOperator = '';
    total = '';
    updateDisplay(); //H7-4
  } else if (inputs.length && temporary) {
    if (tempOperator) {
      if (!total) {
        toggleOperatorFocus(tempOperator);
        tempOperator = '';
        inputs = [];
        updateDisplay(); //G7-4 H4
      }
      if (total) {
        toggleOperatorFocus(tempOperator);
        tempOperator = '';
        total = '';
        inputs = [];
        updateDisplay(); //H1-7-4
      }
    } else if (!tempOperator) {
      if (temporary !== '0') {
        temporary = '0';
        updateDisplay(); //H1-3
      } else if (temporary == '0') {
        toggleOperatorFocus(storedOperator);
        storedOperator = '';
        temporary = `${inputs[inputs.length - 1]}`;
        inputs = [];
        updateDisplay(); //H1-3-3
      }
    }
  }
}

function handleDecimal(e) {
  if (!inputs.length && temporary) {
    if (!temporary.includes('.')) {
      temporary += e.target.textContent; // A E G5
      updateDisplay();
    } else if (temporary.includes('.')) {
      return; //C4
    }
  } else if (!inputs.length && !temporary) {
    temporary = '0.'; //D4
    updateDisplay();
  } else if (inputs.length && !temporary) {
    inputs = [];
    temporary = '0.';
    storedOperator = '';
    total = '';
    updateDisplay(); //H7-5
  } else if (inputs.length && temporary) {
    if (tempOperator) {
      if (!total) {
        temporary = '0.';
        storedOperator = tempOperator;
        tempOperator = '';
        updateDisplay(); //G7-5 H5
      } else if (total) {
        temporary = '0.';
        storedOperator = tempOperator;
        tempOperator = '';
        inputs = [+total];
        total = '';
        updateDisplay(); //H1-7-5
      }
    } else if (!tempOperator) {
      if (!temporary.includes('.')) {
        temporary += e.target.textContent;
        updateDisplay(); //H1-4
      } else if (temporary.includes('.')) {
        return; //H3-4
      }
    }
  }
}

function handleDelete() {
  if (!inputs.length && temporary) {
    if ((temporary.length == 1 && !temporary.startsWith('-')) || (temporary.length == 2 && temporary.startsWith('-'))) {
      temporary = ''; //F, B5, G6
      updateDisplay();
    } else if ((temporary.length > 1 && !temporary.startsWith('-')) || (temporary.length > 2 && temporary.startsWith('-'))) {
      temporary = temporary.slice(0, -1); //A5,A1-5
      updateDisplay();
    }
  } else if (!inputs.length && !temporary) {
    updateDisplay();
  } else if (inputs.length && !temporary) {
    inputs = [];
    storedOperator = '';
    total = '';
    updateDisplay(); //H7-6
  } else if (inputs.length && temporary) {
    if (tempOperator) {
      if (!total) {
        toggleOperatorFocus(tempOperator);
        tempOperator = '';
        inputs = [];
        updateDisplay(); //G7-6 H7
      } else if (total) {
        toggleOperatorFocus(tempOperator);
        tempOperator = '';
        total = '';
        inputs = [];
        updateDisplay(); //H1-7-6
      }
    } else if (!tempOperator) {
      if ((temporary.length == 1 && !temporary.startsWith('-')) || (temporary.length == 2 && temporary.startsWith('-'))) {
        if (temporary !== '0') {
          temporary = '0';
          updateDisplay(); //H1-5
        } else if (temporary == '0') {
          toggleOperatorFocus(storedOperator);
          storedOperator = '';
          temporary = `${inputs[inputs.length - 1]}`;
          inputs = [];
          updateDisplay(); //H1-3-5
        }
      } else if ((temporary.length > 1 && !temporary.startsWith('-')) || (temporary.length > 2 && temporary.startsWith('-'))) {
        temporary = temporary.slice(0, -1);
        updateDisplay(); //H3-5
      }
    }
  }
}

function handleEqual() {
  if (!inputs.length && temporary) {
    return; //G G0
    inputs.push(+temporary); //G
    temporary = '';
    updateDisplay();
  } else if (!inputs.length && !temporary) {
    return; //D6
  } else if (inputs.length && !temporary) {
    inputs[0] = +total;
    total = `${modMathResult(doTheMath(storedOperator, inputs[0], inputs[1]))}`;
    updateDisplay(); //H7-0
  } else if (inputs.length && temporary) {
    if (tempOperator) {
      if (!total) {
        inputs.push(+temporary);
        temporary = '';
        toggleOperatorFocus(tempOperator);
        storedOperator = tempOperator;
        tempOperator = '';
        total = `${modMathResult(doTheMath(storedOperator, inputs[0], inputs[1]))}`;
        updateDisplay(); //G7-7 H7
        if (total == 'NaN' || total == 'Infinity') {
          storedOperator = '';
          total = '';
          inputs = [];
        }
      } else if (total) {
        inputs = [+total, +temporary];
        temporary = '';
        toggleOperatorFocus(tempOperator);
        storedOperator = tempOperator;
        tempOperator = '';
        total = `${modMathResult(doTheMath(storedOperator, inputs[0], inputs[1]))}`;
        updateDisplay(); //H1-7-7
      }
    } else if (!tempOperator) {
      inputs.push(+temporary);
      temporary = '';
      toggleOperatorFocus(storedOperator);
      total = `${modMathResult(doTheMath(storedOperator, inputs[0], inputs[1]))}`;
      updateDisplay(); //H1-6
      if (total == 'NaN' || total == 'Infinity') {
        total = '';
        inputs = [];
        storedOperator = '';
      }
    }
  }
}

function handleOperator(e) {
  if (!inputs.length && temporary) {
    inputs.push(+temporary); //H G7
    tempOperator = e.target.textContent;
    toggleOperatorFocus(tempOperator);
    updateDisplay();
  } else if (!inputs.length && !temporary) {
    inputs.push(0);
    tempOperator = e.target.textContent;
    toggleOperatorFocus(tempOperator);
    temporary = `${inputs[inputs.length - 1]}`;
    updateDisplay(); //DF7
  } else if (inputs.length && !temporary) {
    inputs = [+total];
    temporary = `${inputs[inputs.length - 1]}`;
    tempOperator = e.target.textContent;
    toggleOperatorFocus(tempOperator);
    storedOperator = '';
    total = '';
    updateDisplay(); //H7-7
  } else if (inputs.length && temporary) {
    if (tempOperator) {
      if (!total) {
        toggleOperatorFocus(tempOperator);
        tempOperator = e.target.textContent;
        toggleOperatorFocus(tempOperator);
        updateDisplay(); //G7-0 H0
      } else if (total) {
        toggleOperatorFocus(tempOperator);
        tempOperator = e.target.textContent;
        toggleOperatorFocus(tempOperator);
        updateDisplay(); //H1-7-0
      }
    } else if (!tempOperator) {
      inputs.push(+temporary);
      toggleOperatorFocus(storedOperator);
      tempOperator = e.target.textContent;
      toggleOperatorFocus(tempOperator);
      total = `${modMathResult(doTheMath(storedOperator, inputs[0], inputs[1]))}`;
      temporary = total;
      storedOperator = '';
      updateDisplay(); //H1-7
      if (total == 'NaN' || total == 'Infinity') {
        temporary = '';
        total = '';
        toggleOperatorFocus(tempOperator);
        tempOperator = '';
        inputs = [];
      }
    }
  }
}

export { updateDisplay, handleDigits, handleOperator, handleDelete, handleEqual, handleDecimal, handleModifier, handlePercentage, handleClear };
