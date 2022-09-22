
//FUNCTIONALITY

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
    if (Number(text) >= Infinity || text === 'NaN')  text = '∞';
    textObj.textContent = text;
}

// get screen text
let textObj = document.querySelector('.screen-text');
let text = '';

// get all number and operand buttons
const numberBtns = Array.from(document.querySelectorAll('.number'));
const operandBtns = Array.from(document.querySelectorAll('.operations > .basic'));
const trigoBtns = document.querySelectorAll('.section > .basic');
const factorialBtn = document.querySelector('.factorial');
const clearBtn = document.querySelector('.clear')
const resultBtn = document.querySelector('.result');
const deleteBtn = document.querySelector('.delete');
const percentBtn = document.querySelector('.percent');
const sqrtBtn = document.querySelector('.sqrt');
const reverseSignBtn = document.querySelector('.plus-minus');

// operands that work only with a single number(like 956 or -15), not two (like 19+5 or -1.5/5)
const specialOperands = [percentBtn, sqrtBtn, factorialBtn, ...trigoBtns];
specialOperands.map(btn => btn.addEventListener('click', () => {
    if (text.match(/(-?\d+[+\-\/*^])/)) {
        text = text.slice(0, -1);
    }
    if(text.match(/(-?\d+)/) || text.match(/(-?\d+\.\d+)/)) {
        let number = Number(text);
        text = operate(btn.textContent, number);
        textObj.textContent = text;
    }
}));

// delete one character when DELETE button is pressed
deleteBtn.addEventListener('click', () => {
    text = text.slice(0, -1);
    if (text === '') text = '...';
    textObj.textContent = text;
});

// clear screen text when CLEAR button is pressed
clearBtn.addEventListener('click', () => {
    text = '...';
    textObj.textContent = text;
});

// calculate results of an expression when the RESULT button was clicked
resultBtn.addEventListener('click', () => {
    if(text.length > 1) {
        if (text.match(/(\d+[+\-\/*^]\d+)/)) doOperation(text);
        else if (text.match(/(\d+[+\-\/*^])/)) text = text.slice(0, -1); 
        textObj.textContent = text;
    }
}); 

// reverse the sign of the number when clicked (from negative to positive and vice versa)
reverseSignBtn.addEventListener('click', () => {
    if (text.match(/(-?\d+[+\-\/*^]?)/)) {
        text = (text[0] === '-') ? text.slice(1) : '-' + text;
        textObj.textContent = text;
    }
});

// add ability for certain buttons to append their textContent value
// onto the calculator screen
numberBtns.map(btn => btn.addEventListener('click', () => {
    if (text === '...' || Number(text) === 0) text = '';
    text += btn.textContent;
    textObj.textContent = text;
}));

// perform corresponding operand when a certain operand button was clicked (+, -, * or /)
operandBtns.map(btn => btn.addEventListener('click', () => {
    let textRaw = text + btn.textContent; // how the text looks like after appending an operand sign
    if(textRaw.length > 1) { // execute if the length textRaw is more than 1
        // check if textRaw ends with 2 operand signs in a row
        if(textRaw.match(/([+\-\/*^]{2})/)) {
            text = text.slice(0, -1); // delete previous sign and apply a new one
            text += btn.textContent;
            textObj.textContent = text;
        } else if (textRaw !== '-') { // else dissect screen text onto numbers and a sign, and perform a certain operand depending on that sign
            let expr = text.match(/(\d+[+\-\/*^]\d+)/g);
            if (expr) doOperation(expr); // check if expr is valid (match() didn't return undefined), perform calculations if so
            textObj.textContent = text;
        }
    }
}));

// EXTRAS FUNCTIONALITY

// STYLES AND ANIMATIONS

const extras = document.querySelector('.extras'); // initially hide extras panel
extras.style.display = 'none';
extras.classList.toggle('comeBack');

const extrasBtn = document.querySelector('.extras-unlock');

// toggle between hidden and showing when clicking the button
extrasBtn.addEventListener('click', () => {
    let state = extras.style.display;
    (state === "none") ? state = "block" : state = "none";
    extras.style.display = state;
});
