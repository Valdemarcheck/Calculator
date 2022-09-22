
function operate(operator, num1, num2 = null) {
    let result = 0;
    switch (operator) {
        case '%':
            result = num1 / 100;
            break;
        case '√':
            result = Math.sqrt(num1);
            break;
        case '+':
            result = num1 + num2;
            console.log(result)
            break;
        case '-':
            result = num1 - num2;
            console.log(result)
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
    }
    return parseFloat(result.toFixed(10));
}

const REGEX = new RegExp(`([+\-\/*^])`, 'g');
const allowedOperands = ['+', '-', '/', '*', '^'];

function doOperation(expr) {
    if (typeof expr === 'object') expr = expr[0];

    let exprNums = expr.split(/[+\-\/*^]/g);
    if (exprNums.length > 2) {
        exprNums.splice(0, 1);
        exprNums[0] = exprNums[0]*-1+'';
        expr = expr.slice(1, -1);
    };

    let exprSign = expr.match(/[+\-\/*^]/g)[0];

    text = operate(exprSign, Number(exprNums[0]), Number(exprNums[1]))+'';
    if (Number(text) >= Infinity || text === 'NaN')  text = '∞';
    textObj.textContent = text;
}

// get screen text
let textObj = document.querySelector('.screen-text');
let text = '';

textObj.addEventListener('change', () => {
    if (textObj.value.length < 1) textObj.value = 'what';
});

// get all buttons number and operation buttons
const numberBtns = Array.from(document.querySelectorAll('.number'));
const operationBtns = Array.from(document.querySelectorAll('.operations > button'));
const clearBtn = document.querySelector('.clear')

const resultBtn = document.querySelector('.result');
const deleteBtn = document.querySelector('.delete');
const percentBtn = document.querySelector('.percent');
const sqrtBtn = document.querySelector('.sqrt');

// delete one character when DELETE button is pressed
deleteBtn.addEventListener('click', () => {
    text = text.slice(0, -1);
    textObj.textContent = text;
});

// clear screen text when CLEAR button is pressed
clearBtn.addEventListener('click', () => {
    text = '';
    textObj.textContent = text;
});

// add ability for certain buttons to append their textContent value
// onto the calculator screen
numberBtns.map(btn => btn.addEventListener('click', () => {
    text += btn.textContent;
    textObj.textContent = text;
}));

// calculate results of an expression when the RESULT button was clicked
resultBtn.addEventListener('click', () => {
    if(text.length > 1) {
        if (text.match(/(\d+[+\-\/*^]\d+)/)) doOperation(text);
        else if (text.match(/(\d+[+\-\/*^])/)) text = text.slice(0, -1); 
        textObj.textContent = text;
    }
}); 

// perform a percent operation when a PERCENT button was clicked
percentBtn.addEventListener('click', () => {
    let textRaw = text + '%'; // how the text looks before application
    if(textRaw.length > 1 && textRaw.match(/(\d+%)/)) {
        let number = textRaw.split('%')[0];
        text = operate('%', number);
        textObj.textContent = text;
    }
});

// perform a sqrt operation when a SQRT button was clicked
sqrtBtn.addEventListener('click', () => {
    if (text.match(/(\d+[+\-\/*^])/)) {
        text = text.slice(0, -1);
    }
    if(text.match(/(\d+)/) || text.match(/(\d+\.\d+)/)) {
        let number = Number(text);
        text = operate('√', number)+'';
        textObj.textContent = text;
    }
});

// perform corresponding operation when a certain operation button was clicked (+, -, * or /)
operationBtns.map(btn => btn.addEventListener('click', () => {
    let textRaw = text + btn.textContent; // how the text looks before application
    if(textRaw === '-' || textRaw.length > 1) { // check whether the length of the screen text is less than 1
        // check if textRaw ends with 2 operation signs in a row
        if(textRaw.match(/([+\-\/*^]{2})/)) {
            text = text.slice(0, -1); // delete previous sign and apply a new one
            text += btn.textContent;
            textObj.textContent = text;
        } else { // else dissect screen text onto numbers and a sign, and perform a certain operation depending on that sign
            let expr = text.match(/(\d+[+\-\/*^]\d+)/g);
            // check if there are 2 numbers and a sign among them, and then perform calculations
            if (expr) doOperation(expr);
            text += btn.textContent;
            textObj.textContent = text;
        }
    }
}));
