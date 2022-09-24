// check user's platform (PC or mobile)
let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
// choose an event type for buttons that is appropriate to the platform
let eventType = (isMobile) ? 'touchend' : 'click';

const operandsRe = RegExp(/[*\/\-+^]/g);

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
    return parseFloat(result.toFixed(10));
}

function validateNum(num) {
    let numPoints = num.match(/\./g);
    let numDissect = num.split('');
    if (numPoints.length > 1) {
        let indexOfFirstPoint = numDissect.indexOf('.', numDissect.indexOf('.')) + 2;
        numDissect.splice(indexOfFirstPoint);
    }
    return numDissect.join('');
}

function validate(str) {

    let strDissect = str.split('');
    let strOperands = [];
    let strNums = [];
    let strCopy = '';
    
    // remove all chaining operands
    for(let i = 0; i < strDissect.length; i++) {
        if(strDissect[i+1] !== undefined && strDissect[i].match(operandsRe) && strDissect[i+1].match(operandsRe)) {
            strDissect.splice(i, 1);
            i--;
        }
    };

    // cut off the first operand of the expression, unless it's a '-' sign
    if(strDissect[0].match(operandsRe) || strDissect[0] === '.' && strDissect[0] !== '-') strDissect.shift();

    // cut off the last operand of the expression, but if it's' a '.' sign, append 0
    if(strDissect.at(-1) !== '.') {
        if(strDissect.at(-1).match(operandsRe)) strDissect.pop();
    }
    else strDissect.push('0');

    // get a valid version of the expression as a string
    strCopy = strDissect.join('');

    // execute only if there is an operand in a string
    if (strDissect.some(char => char.match(operandsRe))) { 

        strOperands = strCopy.match(operandsRe); // a list of all operands

        // make a list of all number in the expression
        strNums = strCopy.split(operandsRe);
        // check if every number is valid, if not - return it's validated version
        for(let i = 0; i < strNums.length; i++) { 
            if(!Number(strNums[i]) && Number(strNums[i]) !== 0) {
                strNums[i] = validateNum(strNums[i]);
            };
        }

        let strFinal = ''; // final version of a string
        for(let i = 0; i < strNums.length; i++) {
            strFinal += strNums[i];
            if (strOperands[i]) strFinal += strOperands[i];
        }
        
        return strFinal;
    }
    return strCopy;
}

function solve(str) {
    console.log(str);
    let strOperands = str.match(operandsRe);
    let strNums = str.split(operandsRe);
    let validExpr = [];
    let i = 1;
    strNums = strNums.map(num => num = Number(num));
    
    
    for(let i = 0; i < strNums.length; i++) {
        validExpr.push(strNums[i]);
        if (strOperands[i]) validExpr.push(strOperands[i]);
    }

    while(true) {
        validExpr[0] = operate(validExpr[i], validExpr[i-1], validExpr[i+1]);
        validExpr.splice(i, 2);
        if(validExpr.length === 1) break;
    }
    return validExpr;
}

// get screen text
let textObj = document.querySelector('.screen-text');
let text = '';

// get all number and operand buttons
const numberBtns = Array.from(document.querySelectorAll('.number'));
const operandBtns = Array.from(document.querySelectorAll('.operations > .basic'));
const trigoBtns = document.querySelectorAll('.section > .basic');
const logarithmBtns = document.querySelectorAll('.log');

// special operands
const factorialBtn = document.querySelector('.factorial');
const sqrtBtn = document.querySelector('.sqrt');
const percentBtn = document.querySelector('.percent');
const reverseSignBtn = document.querySelector('.plus-minus');

// not operands and number buttons, with unique functionality
const pointBtn = document.querySelector('.point');
const clearBtn = document.querySelector('.clear');
const resultBtn = document.querySelector('.result');
const deleteBtn = document.querySelector('.delete');

resultBtn.addEventListener('click', () => {
   text = validate(text);
   text = solve(text);
   textObj.textContent = text;
});

clearBtn.addEventListener('click', () => {
    location.reload();
});

deleteBtn.addEventListener('click', () => {
    text = text.slice(0, -1);
    textObj.textContent = text;
});

pointBtn.addEventListener('click', () => {
    text += '.';
    textObj.textContent = text;
});

operandBtns.forEach(btn => btn.addEventListener('click', () => {
    text += btn.textContent;
    textObj.textContent = text;
}));

numberBtns.forEach(btn => btn.addEventListener('click', () => {
    text += btn.textContent;
    textObj.textContent = text;
}));