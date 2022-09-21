
function operate(operator, num1, num2) {
    switch (operator) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            return num1 / num2;
    }
}

// get screen text
let textObj = document.querySelector('.screen-text');
let text = '';

// get all buttons except "Reset"
const btns = [...document.querySelectorAll('.action-section button')];

const numberBtns = btns.splice(0, 11);
const clearBtn = btns.splice(0, 1);
const operationBtns = btns.splice(0, 5);
const equalBtn = [operationBtns.pop()];

clearBtn[0].addEventListener('click', () => {
    text = '';
    textObj.textContent = text;
});

// add ability for certain buttons to append their textContent value
// onto the calculator screen
numberBtns.map(btn => btn.addEventListener('click', () => {
    text += btn.textContent;
    textObj.textContent = text;
}));

operationBtns.map(btn => btn.addEventListener('click', () => {
    let textRaw = text + btn.textContent;
    if(textRaw.match(/([+\-\/*]{2})/)){
        text = Number(text.slice(0, text.length - 1)).toFixed(2);
        text += btn.textContent;
        textObj.textContent = text;
    } else {
        let expr = text.match(/(\d+[+\-\/*]\d+)+/g);
        if (expr) {
            let exprNums = expr[0].split(/([+*\-\/])/);
            let exprSign = expr[0].match(/([+*\-\/])/);
            text = Number(operate(exprSign[0], Number(exprNums[0]), Number(exprNums[2]))).toFixed(2);
        }
        text += btn.textContent;
        textObj.textContent = text;
    }
}));
