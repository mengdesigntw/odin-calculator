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
      setCalHistory();
      setCurrentDisplay('Naughty ❤️');
    }
  } else if (inputs.length && temporary) {
    if (!storedOperator) {
      if (!total) {
        setClearDisplay('C'); //G7 G7-0 H7-7 H H0 DF7
        setCalHistory(displayInputs[displayInputs.length - 1], tempOperator);
        setCurrentDisplay(displayTemp);
      } else if (total !== 'NaN' && total !== 'Infinity') {
        setClearDisplay('C'); //H1-7
        setCalHistory(displayTotal, tempOperator);
        setCurrentDisplay(displayTemp);
      } else if (total == 'NaN' || total == 'Infinity') {
        setClearDisplay();
        setCalHistory();
        setCurrentDisplay('Naughty ❤️'); //H1-7m
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
  } else if (!inputs.length && temporary) {
    temporary += e.target.textContent; // A G1
    temporary = modTemporary(temporary); //DF2
  } else if (inputs.length && !temporary) {
    inputs = [];
    temporary = e.target.textContent;
    total = '';
    storedOperator = ''; // H7-1 H7m-1
  } else if (inputs.length && temporary) {
    if (tempOperator) {
      temporary = e.target.textContent;
      if (!total) {
        storedOperator = tempOperator;
        tempOperator = ''; // G7-1 H1
      } else if (total) {
        if (total !== 'NaN' && total !== 'Infinity') {
          storedOperator = tempOperator;
          tempOperator = '';
          inputs = [+total];
          total = ''; //H1-7-1
        } else if (total == 'NaN' || total == 'Infinity') {
          inputs = [];
          tempOperator = '';
          total = ''; //H1-7m-1
        }
      }
    } else if (!tempOperator) {
      temporary += e.target.textContent; //H1-0
      temporary = modTemporary(temporary); //DF7-2-1, H1-3-0
    }
  }
  updateDisplay();
}

function handleModifier() {
  if (!inputs.length && temporary) {
    temporary = modOpposite(temporary); //B G2 E2 C5-2 DF4-2
  } else if (!inputs.length && !temporary) {
    temporary = '-0'; //D2
  } else if (inputs.length && !temporary) {
    inputs = [];
    if (total !== 'NaN' && total !== 'Infinity') {
      temporary = total;
      temporary = modOpposite(temporary);
      total = '';
      storedOperator = ''; //H7-2
    } else if (total !== 'NaN' || total !== 'Infinity') {
      total = '';
      storedOperator = ''; //H7m-2
    }
  } else if (inputs.length && temporary) {
    if (tempOperator) {
      if (!total) {
        temporary = modOpposite(temporary);
        storedOperator = tempOperator;
        tempOperator = ''; //G7-2 H2 DF7-2
      } else if (total) {
        if (total !== 'NaN' && total !== 'Infinity') {
          temporary = modOpposite(temporary);
          storedOperator = tempOperator;
          tempOperator = '';
          inputs = [+total];
          total = ''; //H1-7-2
        } else if (total == 'NaN' || total == 'Infinity') {
          inputs = [];
          tempOperator = '';
          total = '';
          temporary = '';
        }
      }
    } else if (!tempOperator) {
      temporary = modOpposite(temporary); //H1-1 H5-1, H1-3-1 H1-4-1 H5-1-1
    }
  }
  updateDisplay();
}

function handlePercentage() {
  const lastInput = inputs[inputs.length - 1];
  if (!inputs.length && !temporary) {
    //D3
  } else if (!inputs.length && temporary) {
    temporary = `${modMathResult(+temporary / 100)}`; //C G3
  } else if (inputs.length && !temporary) {
    inputs = [];
    storedOperator = '';
    if (total !== 'NaN' && total !== 'Infinity') {
      temporary = total;
      temporary = `${modMathResult(+total / 100)}`;
      total = ''; //H7-3
    } else if (total !== 'NaN' || total !== 'Infinity') {
      total = ''; //H7m-3
    }
  } else if (inputs.length && temporary) {
    if (tempOperator) {
      if (!total) {
        temporary = `${modMathResult((lastInput * +temporary) / 100)}`;
        storedOperator = tempOperator;
        tempOperator = ''; //G7-3 H3
      } else if (total) {
        if (total !== 'NaN' && total !== 'Infinity') {
          temporary = `${modMathResult((+total * +temporary) / 100)}`;
          inputs = [+total];
          total = '';
          storedOperator = tempOperator;
          tempOperator = ''; //H1-7-3
        } else if (total == 'NaN' || total == 'Infinity') {
          inputs = [];
          tempOperator = '';
          total = '';
          temporary = ''; //H1-7m-3
        }
      }
    } else if (!tempOperator) {
      temporary = `${modMathResult((lastInput * +temporary) / 100)}`;
    }
  }
  updateDisplay();
}

function handleClear() {
  if (!inputs.length && !temporary) {
    //D0
  } else if (!inputs.length && temporary) {
    temporary = ''; //D G4
  } else if (inputs.length && !temporary) {
    inputs = [];
    storedOperator = '';
    total = ''; //H7-4 H7m-4
  } else if (inputs.length && temporary) {
    if (tempOperator) {
      if (!total) {
        toggleOperatorFocus(tempOperator);
        tempOperator = '';
        inputs = []; //G7-4 H4
      }
      if (total) {
        total = '';
        inputs = [];
        if (total !== 'NaN' && total !== 'Infinity') {
          toggleOperatorFocus(tempOperator);
          tempOperator = ''; //H1-7-4
        } else if (total == 'NaN' || total == 'Infinity') {
          tempOperator = '';
          temporary = ''; //H1-7m-4
        }
      }
    } else if (!tempOperator) {
      if (temporary !== '0') {
        temporary = '0'; //H1-3
      } else if (temporary == '0') {
        toggleOperatorFocus(storedOperator);
        storedOperator = '';
        temporary = `${inputs[inputs.length - 1]}`;
        inputs = []; //H1-3-3
      }
    }
  }
  updateDisplay();
}

function handleDecimal(e) {
  if (temporary.includes('.')) return; //C4 H3-4
  if (!inputs.length && temporary) {
    if (!temporary.includes('.')) temporary += e.target.textContent; // A E G5
  } else if (!inputs.length && !temporary) {
    temporary = '0.'; //D4
  } else if (inputs.length && !temporary) {
    inputs = [];
    temporary = '0.';
    storedOperator = '';
    total = ''; //H7-5 //H7m-5
  } else if (inputs.length && temporary) {
    if (tempOperator) {
      temporary = '0.';
      if (!total) {
        storedOperator = tempOperator;
        tempOperator = ''; //G7-5 H5
      } else if (total) {
        if (total !== 'NaN' && total !== 'Infinity') {
          storedOperator = tempOperator;
          tempOperator = '';
          inputs = [+total];
          total = ''; //H1-7-5
        } else if (total == 'NaN' || total == 'Infinity') {
          inputs = [];
          tempOperator = '';
          total = ''; //H1-7m-5
        }
      }
    } else if (!tempOperator) {
      if (!temporary.includes('.')) temporary += e.target.textContent; //H1-4
      // else if (temporary.includes('.')) {
      //   return; //H3-4
      // }
    }
  }
  updateDisplay();
}

function handleDelete() {
  if (!inputs.length && temporary) {
    if ((temporary.length == 1 && !temporary.startsWith('-')) || (temporary.length == 2 && temporary.startsWith('-'))) {
      temporary = ''; //F, B5, G6
    } else if ((temporary.length > 1 && !temporary.startsWith('-')) || (temporary.length > 2 && temporary.startsWith('-'))) {
      temporary = temporary.slice(0, -1); //A5,A1-5
    }
  }
  // else if (!inputs.length && !temporary) {}//
  else if (inputs.length && !temporary) {
    inputs = [];
    storedOperator = '';
    total = ''; //H7-6 H7m-6
  } else if (inputs.length && temporary) {
    if (tempOperator) {
      if (!total) {
        toggleOperatorFocus(tempOperator);
        tempOperator = '';
        inputs = []; //G7-6 H7
      } else if (total) {
        if (total !== 'NaN' && total !== 'Infinity') {
          toggleOperatorFocus(tempOperator);
          tempOperator = '';
          total = '';
          inputs = []; //H1-7-6
        } else if (total == 'NaN' || total == 'Infinity') {
          inputs = [];
          tempOperator = '';
          total = '';
          temporary = ''; //H1-7m-6
        }
      }
    } else if (!tempOperator) {
      if ((temporary.length == 1 && !temporary.startsWith('-')) || (temporary.length == 2 && temporary.startsWith('-'))) {
        if (temporary !== '0') {
          temporary = '0'; //H1-5
        } else if (temporary == '0') {
          toggleOperatorFocus(storedOperator);
          storedOperator = '';
          temporary = `${inputs[inputs.length - 1]}`;
          inputs = []; //H1-3-5
        }
      } else if ((temporary.length > 1 && !temporary.startsWith('-')) || (temporary.length > 2 && temporary.startsWith('-'))) {
        temporary = temporary.slice(0, -1); //H3-5
      }
    }
  }
  updateDisplay();
}

function handleEqual() {
  if (!inputs.length) return; //D6
  if (total == 'NaN' || total == 'Infinity') return; //H7m-0 H1-7m-7
  if (inputs.length && !temporary) {
    if (total !== 'NaN' && total !== 'Infinity') {
      inputs[0] = +total;
      total = `${modMathResult(doTheMath(storedOperator, inputs[0], inputs[1]))}`; //H7-0
    }
    // else if (total == 'NaN' || total == 'Infinity') {
    //   return; //H7m-0
    // }
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
      } else if (total) {
        if (total !== 'NaN' && total !== 'Infinity') {
          inputs = [+total, +temporary];
          temporary = '';
          toggleOperatorFocus(tempOperator);
          storedOperator = tempOperator;
          tempOperator = '';
          total = `${modMathResult(doTheMath(storedOperator, inputs[0], inputs[1]))}`;
          updateDisplay(); //H1-7-7
        }
        // else if (total == 'NaN' || total == 'Infinity') {
        //   return; //H1-7m-7
        // }
      }
    } else if (!tempOperator) {
      inputs.push(+temporary);
      temporary = '';
      toggleOperatorFocus(storedOperator);
      total = `${modMathResult(doTheMath(storedOperator, inputs[0], inputs[1]))}`; //H1-6
    }
  }
  updateDisplay();
}

function handleOperator(e) {
  if (!inputs.length && temporary) {
    inputs.push(+temporary); //H G7
    tempOperator = e.target.textContent;
    toggleOperatorFocus(tempOperator);
  } else if (!inputs.length && !temporary) {
    inputs.push(0);
    tempOperator = e.target.textContent;
    toggleOperatorFocus(tempOperator);
    temporary = `${inputs[inputs.length - 1]}`; //DF7
  } else if (inputs.length && !temporary) {
    tempOperator = e.target.textContent;
    toggleOperatorFocus(tempOperator);
    storedOperator = '';
    total = '';
    if (total !== 'NaN' && total !== 'Infinity') {
      inputs = [+total];
      temporary = `${inputs[inputs.length - 1]}`; //H7-7
    } else if (total == 'NaN' || total == 'Infinity') {
      inputs = [0];
      temporary = `${inputs[inputs.length - 1]}`; //H7m-7
    }
  } else if (inputs.length && temporary) {
    if (tempOperator) {
      if (!total) {
        toggleOperatorFocus(tempOperator);
        tempOperator = e.target.textContent;
        toggleOperatorFocus(tempOperator); //G7-0 H0
      } else if (total) {
        if (total !== 'NaN' && total !== 'Infinity') {
          toggleOperatorFocus(tempOperator);
          tempOperator = e.target.textContent;
          toggleOperatorFocus(tempOperator); //H1-7-0
        } else if (total == 'NaN' || total == 'Infinity') {
          inputs = [0];
          temporary = `${inputs[inputs.length - 1]}`;
          tempOperator = e.target.textContent;
          toggleOperatorFocus(tempOperator);
          total = ''; //H1-7m-0
        }
      }
    } else if (!tempOperator) {
      inputs.push(+temporary);
      toggleOperatorFocus(storedOperator);
      tempOperator = e.target.textContent;
      toggleOperatorFocus(tempOperator);
      total = `${modMathResult(doTheMath(storedOperator, inputs[0], inputs[1]))}`;
      temporary = total;
      storedOperator = ''; //H1-7
      if (total == 'NaN' || total == 'Infinity') toggleOperatorFocus(tempOperator); //H1-7m
    }
  }
  updateDisplay();
}

export { updateDisplay, handleDigits, handleOperator, handleDelete, handleEqual, handleDecimal, handleModifier, handlePercentage, handleClear };
