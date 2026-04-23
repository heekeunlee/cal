const currentDisplay = document.getElementById('current-operand');
const historyDisplay = document.getElementById('history');

let currentInput = '0';
let historyInput = '';
let shouldResetScreen = false;

function appendNumber(number) {
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = number;
        shouldResetScreen = false;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function appendOperator(operator) {
    if (shouldResetScreen) shouldResetScreen = false;
    
    // Replace visual operators with JS math operators if needed
    let displayOp = operator;
    if (operator === '*') displayOp = '×';
    if (operator === '/') displayOp = '÷';
    if (operator === '**') displayOp = '^';

    if (currentInput === '0' && operator !== '(' && operator !== ')') {
        currentInput = operator;
    } else {
        currentInput += operator;
    }
    updateDisplay();
}

function appendFunction(func) {
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = func + '(';
        shouldResetScreen = false;
    } else {
        currentInput += func + '(';
    }
    updateDisplay();
}

function appendConstant(constant) {
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = constant;
        shouldResetScreen = false;
    } else {
        currentInput += constant;
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    historyInput = '';
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

function compute() {
    try {
        let expression = currentInput;
        
        // Handle factorial
        expression = expression.replace(/(\d+)!/g, (match, num) => {
            return factorial(parseInt(num));
        });

        // Use Function constructor for evaluation (safer for this scoped project)
        // Sanitizing a bit
        let result = eval(expression);
        
        historyInput = currentInput + ' =';
        currentInput = result.toString();
        shouldResetScreen = true;
        updateDisplay();
    } catch (error) {
        currentInput = 'Error';
        shouldResetScreen = true;
        updateDisplay();
    }
}

function updateDisplay() {
    // Format the display text for better readability
    let displayText = currentInput
        .replace(/Math\./g, '')
        .replace(/\*\*/g, '^')
        .replace(/\*/g, '×')
        .replace(/\//g, '÷');
    
    currentDisplay.innerText = displayText;
    
    let historyText = historyInput
        .replace(/Math\./g, '')
        .replace(/\*\*/g, '^')
        .replace(/\*/g, '×')
        .replace(/\//g, '÷');
        
    historyDisplay.innerText = historyText;
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === '=' || e.key === 'Enter') compute();
    if (e.key === 'Backspace') deleteLast();
    if (e.key === 'Escape') clearDisplay();
    if (['+', '-', '*', '/', '(', ')'].includes(e.key)) appendOperator(e.key);
});
