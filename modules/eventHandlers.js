import { toggleOperatorFocus, doTheMath, modMathResult, modDisplay, modTemporary, modOpposite } from './utils.js';
import { currentValue, calHistory, clearKey } from './globals.js';

//state variables
let temporary = ''; //for multiple digit
let inputs = []; //track on input 1 and input 2
let storedOperator = '';
let tempOperator = '';
let total = '';

function updateDisplay() {
  setClearDisplay();
  setCalHistory();
  setCurrentDisplay();
}

function setClearDisplay() {
  if (!inputs.length && temporary) {
    clearKey.textContent = 'C'; //7 A B C E A5 D2 D4 G2 G3 G5 H4 H6 H7-1 H7-2 G7-4,6
  } else if (inputs.length && !temporary) {
    if (!storedOperator) {
      if (!tempOperator) clearKey.textContent = 'AC'; //G
      if (tempOperator) clearKey.textContent = 'C'; //D7
    } else if (storedOperator) {
      clearKey.textContent = 'AC'; //H7 H7-0
      if (storedOperator == '/' && inputs[1] == 0) clearKey.textContent = 'AC';
    }
  } else if (inputs.length && temporary) {
    if (!storedOperator) {
      if (!total) {
        clearKey.textContent = 'C'; //G7 G7-0 H H0
      } else if (total !== 'NaN' || total !== 'Infinity') {
        clearKey.textContent = 'C'; //H1-7
      } else if (total == 'NaN'|| total == 'Infinity') {
        clearKey.textContent = 'AC';
      }
    } else if (storedOperator) {
      clearKey.textContent = 'C'; //H1,2,3,5 G7-1,2,3,5 ,H1-1, DF7-2-1, DF7-2
    }
  } else if (!inputs.length && !temporary) {
    clearKey.textContent = 'AC'; //default D F G4 G6
  }
}

function setCalHistory() {
  const displayTemp = modDisplay(temporary);
  const displayInputs = inputs.map((val) => modDisplay(val.toString()));
  const displayTotal = modDisplay(total);

  if (!inputs.length && temporary) {
    calHistory.textContent = `${displayTemp}`; //7 A B C E A5 D2 D4 G2 G3 G5 H4 H6 G7-4,6
  } else if (inputs.length && !temporary) {
    if (!storedOperator) {
      if (!tempOperator) calHistory.textContent = `${displayInputs[displayInputs.length - 1]}`; //G
      if (tempOperator) calHistory.textContent = `${displayInputs[displayInputs.length - 1]} ${tempOperator}`; // D7
    } else if (storedOperator) {
      calHistory.textContent = `${displayInputs[0]} ${storedOperator} ${displayInputs[1]}`; //H7 G7-7 H1-6 H7-0 H1-7-7
      if (storedOperator == '/' && inputs[1] == 0) calHistory.textContent = '';
    }
  } else if (inputs.length && temporary) {
    if (!storedOperator) {
      if (!total) {
        calHistory.textContent = `${displayInputs[displayInputs.length - 1]} ${tempOperator}`; //G7 G7-0 H7-7 H H0
      } else if (total !== 'NaN'|| total !== 'Infinity') {
        calHistory.textContent = `${displayTotal} ${tempOperator}`; //H1-7, H1-7-0
      } else if (total == 'NaN'|| total == 'Infinity') {
        calHistory.textContent = '';
      }
    } else if (storedOperator) {
      calHistory.textContent = `${displayInputs[displayInputs.length - 1]} ${storedOperator}`; //DF7-2, H1,2,3,5 G7-1,2,3,5 ,H1-0,1,2, H1-7-1
    }
  } else if (!inputs.length && !temporary) {
    calHistory.textContent = ''; //default D F G4 G6 H7-4
  }
}

function setCurrentDisplay() {
  const displayTemp = modDisplay(temporary);
  const displayInputs = inputs.map((val) => modDisplay(val.toString()));
  const displayTotal = modDisplay(total);

  if (!inputs.length && temporary) {
    currentValue.textContent = `${displayTemp}`; //7 A B C E A5 D2 D4 G2 G3 G5 H4 H6 G7-4,6
  } else if (inputs.length && !temporary) {
    if (!storedOperator) {
      if (!tempOperator) currentValue.textContent = `${displayInputs[displayInputs.length - 1]}`; //G
      if (tempOperator) currentValue.textContent = `${displayInputs[displayInputs.length - 1]}`; //
    } else if (storedOperator) {
      currentValue.textContent = `${displayTotal}`; //H7 H7-0
      if (storedOperator == '/' && inputs[1] == 0) currentValue.textContent = 'Naughty ❤️';
    }
  } else if (inputs.length && temporary) {
    if (!storedOperator) {
      if (!total) currentValue.textContent = `${displayTemp}`; //G7 G7-0 H7-7 H H0
      if (total !== 'NaN'|| total !== 'Infinity') {
        currentValue.textContent = `${displayTemp}`; //H1-7
      } else if (total == 'NaN'|| total == 'Infinity') {
        currentValue.textContent = 'Naughty ❤️';
      }
    } else if (storedOperator) {
      currentValue.textContent = `${displayTemp}`; //H1,2,3,5 G7-1,2,3,5 H1-0,1 DF7-2
    }
  } else if (!inputs.length && !temporary) {
    currentValue.textContent = '0'; // default D F G4 G6
  }
}

function handleDigits(e) {
  if (!inputs.length && !temporary) {
    temporary = e.target.textContent; //start here
    updateDisplay();
  } else if (!inputs.length && temporary) {
    temporary += e.target.textContent; // A
    temporary = modTemporary(temporary); //DF2
    updateDisplay();
  } else if (inputs.length && !temporary) {
    if (!tempOperator) {
      if (!total) {
        inputs = [];
        temporary = e.target.textContent; //G1
        updateDisplay();
      } else if (total) {
        inputs = [];
        temporary = e.target.textContent;
        total = '';
        storedOperator = '';
        updateDisplay(); // H7-1
      }
    } else if (tempOperator) {
      storedOperator = tempOperator;
      tempOperator = '';
      temporary = e.target.textContent;
      updateDisplay(); //
    }
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
    temporary = modOpposite(temporary); //B E2 C5-2 DF4-2
    updateDisplay();
  } else if (!inputs.length && !temporary) {
    temporary = '-0';
    updateDisplay(); //D2
  } else if (inputs.length && !temporary) {
    if (!tempOperator) {
      if (!total) {
        temporary = `${inputs[inputs.length - 1]}`;
        inputs = [];
        temporary = modOpposite(temporary);
        updateDisplay(); //G2
      } else if (total) {
        inputs = [];
        temporary = total;
        temporary = modOpposite(temporary);
        total = '';
        storedOperator = '';
        updateDisplay(); //H7-2
      }
    } else if (tempOperator) {
      temporary = `${inputs[inputs.length - 1]}`;
      temporary = modOpposite(temporary); //
      storedOperator = tempOperator;
      tempOperator = '';
      updateDisplay();
    }
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
    temporary = `${modMathResult(+temporary / 100)}`; //C
    updateDisplay();
  } else if (!inputs.length && !temporary) {
    return; //D3
  } else if (inputs.length && !temporary) {
    if (!tempOperator) {
      if (!total) {
        temporary = `${lastInput}`;
        inputs = []; //G3
        temporary = `${modMathResult(+temporary / 100)}`;
        updateDisplay();
      } else if (total) {
        inputs = [];
        temporary = total;
        temporary = `${modMathResult(+total / 100)}`;
        total = '';
        storedOperator = '';
        updateDisplay(); //H7-3
      }
    } else if (tempOperator) {
      temporary = `${lastInput}`;
      temporary = `${modMathResult((lastInput * lastInput) / 100)}`;
      storedOperator = tempOperator;
      tempOperator = '';
      updateDisplay(); //
    }
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
    temporary = ''; //D
    updateDisplay();
  } else if (!inputs.length && !temporary) {
    updateDisplay(); //D0
  } else if (inputs.length && !temporary) {
    if (!tempOperator) {
      if (!total) {
        inputs = [];
        updateDisplay(); //G4
      } else if (total) {
        inputs = [];
        storedOperator = '';
        total = '';
        updateDisplay(); //H7-4
      }
    } else if (tempOperator) {
      toggleOperatorFocus(tempOperator);
      tempOperator = '';
      temporary = `${inputs[inputs.length - 1]}`;
      inputs = [];
      updateDisplay(); //
    }
  } else if (inputs.length && temporary) {
    if (tempOperator) {
      if (!total) {
        toggleOperatorFocus(tempOperator);
        tempOperator = '';
        inputs =[]
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
      temporary += e.target.textContent; // A E
      updateDisplay();
    } else if (temporary.includes('.')) {
      return; //C4
    }
  } else if (!inputs.length && !temporary) {
    temporary = '0.'; //D4
    updateDisplay();
  } else if (inputs.length && !temporary) {
    if (!tempOperator) {
      if (!total) {
        inputs = [];
        temporary = '0.';
        updateDisplay(); //G5
      } else if (total) {
        inputs = [];
        temporary = '0.';
        storedOperator = '';
        total = '';
        updateDisplay(); //H7-5
      }
    } else if (tempOperator) {
      storedOperator = tempOperator;
      tempOperator = '';
      temporary = '0.';
      updateDisplay(); //
    }
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
      temporary = ''; //F&B5
      updateDisplay();
    } else if ((temporary.length > 1 && !temporary.startsWith('-')) || (temporary.length > 2 && temporary.startsWith('-'))) {
      temporary = temporary.slice(0, -1); //A5&A1-5
      updateDisplay();
    }
  } else if (!inputs.length && !temporary) {
    return; //D5
  } else if (inputs.length && !temporary) {
    if (!tempOperator) {
      if (!total) {
        inputs = []; //G6
        updateDisplay();
      } else if (total) {
        inputs = [];
        storedOperator = '';
        total = '';
        updateDisplay(); //H7-6
      }
    } else if (tempOperator) {
      toggleOperatorFocus(tempOperator);
      tempOperator = '';
      temporary = `${inputs[inputs.length - 1]}`;
      inputs = [];
      updateDisplay(); //
    }
  } else if (inputs.length && temporary) {
    if (tempOperator) {
      if (!total) {
        toggleOperatorFocus(tempOperator);
        tempOperator = '';
        inputs = []
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
    inputs.push(+temporary); //G
    temporary = '';
    updateDisplay();
  } else if (!inputs.length && !temporary) {
    return; //D6
  } else if (inputs.length && !temporary) {
    if (!tempOperator) {
      if (!total) return; //G0
      if (total) {
        inputs[0] = +total;
        total = `${modMathResult(doTheMath(storedOperator, inputs[0], inputs[1]))}`;
        updateDisplay(); //H7-0
      }
    } else if (tempOperator) {
      const lastInput = inputs[inputs.length - 1];
      inputs.push(lastInput);
      toggleOperatorFocus(tempOperator);
      storedOperator = tempOperator;
      tempOperator = '';
      total = `${modMathResult(doTheMath(storedOperator, inputs[0], inputs[1]))}`;
      updateDisplay(); //
      if (storedOperator == '/' && inputs[1] == 0) {
        storedOperator = '';
        total = '';
        inputs = [];
      }
    }
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
        if (storedOperator == '/' && inputs[1] == 0) {
          storedOperator = '';
          total = '';
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
    inputs.push(+temporary); //H
    tempOperator = e.target.textContent;
    toggleOperatorFocus(tempOperator);
    updateDisplay();
  } else if (!inputs.length && !temporary) {
    inputs.push(0);
    tempOperator = e.target.textContent;
    toggleOperatorFocus(tempOperator);
    updateDisplay(); //D7
  } else if (inputs.length && !temporary) {
    if (!tempOperator) {
      if (!total) {
        tempOperator = e.target.textContent;
        temporary = `${inputs[inputs.length - 1]}`;
        toggleOperatorFocus(tempOperator);
        updateDisplay(); //G7
      } else if (total) {
        inputs = [+total];
        temporary = `${inputs[inputs.length - 1]}`;
        tempOperator = e.target.textContent;
        toggleOperatorFocus(tempOperator);
        storedOperator = '';
        total = '';
        updateDisplay(); //H7-7
      }
    } else if (tempOperator) {
      toggleOperatorFocus(tempOperator);
      tempOperator = e.target.textContent;
      toggleOperatorFocus(tempOperator);
      updateDisplay(); //
    }
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
      if (total == 'NaN'|| total == 'Infinity') {
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
