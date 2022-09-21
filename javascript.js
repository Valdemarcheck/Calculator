
// math functions
function sum(a,b) {
    return a+b;
}
function subtract(a,b) {
    return a-b;
}
function multiply(a,b) {
    return a*b;
}
function divide(a,b) {
    return a/b;
}
function operate(operator, num1, num2) {
    switch (operator) {
        case '+':
            sum(num1, num2);
            break;
        case '-':
            subtract(num1, num2);
            break;
        case '*':
            multiply(num1, num2);
            break;
        case '/':
            divide(num1, num2);
            break;
    }
}

// get screen text and put numbers there
let textObj = document.querySelector('.screen-text');
let text = '';
const numberBtns = [...document.querySelectorAll('.numbers > button')];

numberBtns.map(btn => btn.addEventListener('click', () => {
    text += btn.textContent;
    textObj.textContent = text;
}));
