
// BUG: it's possible to get ∞ with ROOT because it doesn't cut off operands sometimes
// BUG: ^ can vanish the second part of the expression
// BUG: you can stack dots with zeros
// BUG: you can put zeros after a number in a decimal
// BUG: 0. + 0 = 0, not 0.0

// check user's platform (PC or mobile)
let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
// choose an event type for buttons that is appropriate to the platform
let eventType = (isMobile) ? 'touchend' : 'click';

// function with all basic operations
function operate(operator, num1, num2 = null) {
    let result = 0;
    switch (operator) {
        case '!':
            if (num1 % 1 !== 0)  {
                result = 0;
            } else {
                result = 1;
                for(let i = num1; i > 1; i--) {
                    result *= i;
                }
            }
            break;
        case '%':
            result = num1 / 100;
            break;
        case '√':
            result = Math.sqrt(num1);
            break;
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            result = num1 / num2;
            break;
        case '^':
            result = num1 ** num2;
            break;
        case 'sin()':
            result = Math.sin(num1);
            break;
        case 'cos()':
            result = Math.cos(num1);
            break;
        case 'tg()':
            result = Math.tan(num1);
            break;
        case 'ctg()':
            result = 1 / Math.tan(num1);
            break;
        case 'log10':
            result = Math.log10(num1);
            break;
        case 'log2':
            result = Math.log2(num1);
            break;
    }
    return parseFloat(result.toFixed(10))+'';
}

// performs a certain operation and sets screen text to the result of it
function doOperation(expr) {
    if (typeof expr === 'object') expr = expr[0];

    let exprNums = expr.split(/[+\-\/*^]/g);
    if (exprNums.length > 2) {
        exprNums.splice(0, 1);
        exprNums[0] = exprNums[0]*-1+'';
        expr = expr.slice(1);
    };

    let exprSign = expr.match(/[+\-\/*^]/g)[0];

    text = operate(exprSign, Number(exprNums[0]), Number(exprNums[1]));
    if (!isFinite(text)) text = '∞'; // check if text == Infinity or NaN
    textObj.textContent = text;
}

// get screen text
let textObj = document.querySelector('.screen-text');
let text = '';

// get all number and operand buttons
const numberBtns = Array.from(document.querySelectorAll('.number'));
const operandBtns = Array.from(document.querySelectorAll('.operations > .basic'));
const trigoBtns = document.querySelectorAll('.section > .basic');
const logarithmBtns = document.querySelectorAll('.log');

const factorialBtn = document.querySelector('.factorial');
const sqrtBtn = document.querySelector('.sqrt');
const percentBtn = document.querySelector('.percent');
const reverseSignBtn = document.querySelector('.plus-minus');

const pointBtn = document.querySelector('.point');
const clearBtn = document.querySelector('.clear');
const resultBtn = document.querySelector('.result');
const deleteBtn = document.querySelector('.delete');

// operands that work only with a single number(like 956 or -15), not two (like 19+5 or -1.5/5)
const specialOperands = [percentBtn, sqrtBtn, 
    factorialBtn, ...trigoBtns, ...logarithmBtns];
specialOperands.map(btn => btn.addEventListener(eventType, () => {
    if (text.match(/(-?\d+[+\-\/*^])/)) {
        text = text.slice(0, -1);
    }
    if(text.match(/(-?\d+)/) || text.match(/(-?\d+\.\d+)/)) {
        let number = Number(text);
        // if a function is a logarithm, set buttonText to 'log' + logarithm base
        // otherwise just set it to button's textContent
        let buttonText = (!btn.textContent.match('log')) ? btn.textContent : 'log' + btn.textContent.match(/(\d+)/g);
        text = operate(buttonText, number);
        if (!isFinite(text)) text = '∞'; // check if text == Infinity or NaN
        textObj.textContent = text;
    }
}));

// append a dot if the last character is a number
pointBtn.addEventListener(eventType, () => {
    // execute ONLY if the string isn't empty
    if (text.length !== 0) {
        // execute if the last character of expression is a number (and explicitly check for zero because otherwise it returns 'false')
        if (Number(text[text.length-1]) || text[text.length-1] === '0') { 
            // dissect an expression to get all numbers
            let textSplit = text.split(/[+\-\/*^]/g);
            console.log(textSplit);
            // execute if the last number of expression is an Integer (doesn't include '.' inside of it) and is not '0.0'
            if (Number(textSplit[textSplit.length-1]) % 1 === 0 && text.slice(-1, -2) !== '.0') { 
                text += '.';
            }
        } else { // else replace the last sign with a dot (because it is 100% an operand)
            text = text.slice(0, text.length - 1) + '.'
        }
        textObj.textContent = text;
    }
});

// delete one character when DELETE button is pressed
deleteBtn.addEventListener(eventType, () => {
    text = text.slice(0, -1);
    textObj.textContent = text;
});

// clear screen text when CLEAR button is pressed
clearBtn.addEventListener(eventType, () => {
    text = '';
    textObj.textContent = text;
});

// calculate results of an expression when the RESULT button was clicked
resultBtn.addEventListener(eventType, () => {
    if(text.length > 1) {
        if (text.match(/(\d+[+\-\/*^]\d+)/)) doOperation(text);
        else if (text.match(/(\d+[+\-\/*^])/)) text = text.slice(0, -1); 
        textObj.textContent = text;
    }
}); 

// reverse the sign of the number when clicked (from negative to positive and vice versa)
reverseSignBtn.addEventListener(eventType, () => {
    if (text.match(/(-?\d+[+\-\/*^]?)/)) {
        text = (text[0] === '-') ? text.slice(1) : '-' + text;
        textObj.textContent = text;
    }
});

// add ability for certain buttons to append their textContent value
// onto the calculator screen
numberBtns.map(btn => btn.addEventListener(eventType, () => {
    // clear screen text if it equals ∞ or 0
    if (text === '∞' || text === '0') text = '';
    text += btn.textContent;
    textObj.textContent = text;
}));

// perform corresponding operand when a certain operand button was clicked (+, -, * or /)
operandBtns.map(btn => btn.addEventListener(eventType, () => {
    let textRaw = text + btn.textContent; // how the text will look after appending an operand sign
    
    if(textRaw.length > 1) {
        // execute this if textRaw ends with 2 operands in a row or the last sign is a point ('.')
        // also check for ∞ sign to replace it
        if(textRaw.match(/([+\-\/*^]{2})/) || (text[text.length - 1] === '.' || text === '∞')) { 
            text = text.slice(0, -1); // delete previous sign and apply a new one
            text += btn.textContent;
            textObj.textContent = text;
        } else  { // else dissect screen text onto numbers and a sign, and perform a certain operand depending on that sign
            let expr = text.match(/(\d+[+\-\/*^]\d+)/g);
            if (expr) doOperation(expr); // check if expr is valid (match() didn't return undefined), perform calculations if so
            text += btn.textContent;
            textObj.textContent = text;
        }
    }
}));

// extras panel setup
const extras = document.querySelector('.extras'); // initially hide extras panel
extras.style.display = 'none';

const extrasBtn = document.querySelector('.extras-unlock');

// toggle between hidden and showing when clicking the button
extrasBtn.addEventListener(eventType, () => {
    let state = extras.style.display;
    (state === "none") ? state = "block" : state = "none";
    extras.style.display = state;
});
