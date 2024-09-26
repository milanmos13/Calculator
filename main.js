const calculator = document.querySelector('.calculator')
const keys = calculator.querySelector('.calc_keys')
const display = document.querySelector('.calc_display')


const getKeyType = (key) => {
    const { action } = key.dataset
    if (!action) return 'number'
    if (
      action === 'add' ||
      action === 'subtract' ||
      action === 'multiply' ||
      action === 'divide'
    ) return 'operator'
    return action
}
  
const calculate = (n1, operator, n2) => {
    const firstNum = parseFloat(n1)
    const secondNum = parseFloat(n2)
    if (operator === 'add') return firstNum + secondNum
    if (operator === 'subtract') return firstNum - secondNum
    if (operator === 'multiply') return firstNum * secondNum
    if (operator === 'divide') return firstNum / secondNum
  }
  
  

const createResultString = (key, displayedNum, state) => {
    const keyType = getKeyType(key)
    const keyContent = key.textContent
    const { action } = key.dataset
    const {
        firstValue,
        modValue,
        operator,
        previousKeyType
    } = state
    if (keyType === 'number') { 
        return displayedNum === '0' ||
        previousKeyType === 'operator' ||
        previousKeyType === 'calculate'
        ? keyContent
        : displayedNum + keyContent}
    if (keyType === 'decimal') { 
        if (!displayedNum.includes('.')) return displayedNum + '.'
        if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.'
        return displayedNum }
    if (action === 'calculate') {
        const firstValue = calculator.dataset.firstValue
        const operator = calculator.dataset.operator
        const modValue = calculator.dataset.modValue
    
        return firstValue
            ? previousKeyType === 'calculate'
            ? calculate(displayedNum, operator, modValue)
            : calculate(firstValue, operator, displayedNum)
            : displayedNum
    }
    if (keyType === 'operator') { 
        const firstValue = calculator.dataset.firstValue
        const operator = calculator.dataset.operator
        return firstValue &&
          operator &&
          previousKeyType !== 'operator' &&
          previousKeyType !== 'calculate'
          ? calculate(firstValue, operator, displayedNum)
          : displayedNum
    }
    if (action === 'clear') {
        if (key.textContent === 'AC') {
            calculator.dataset.firstValue = ''
            calculator.dataset.modValue = ''
            calculator.dataset.operator = ''
            calculator.dataset.previousKeyType = ''
        } else {
            key.textContent = 'AC'
        }
        
        display.textContent = 0
        calculator.dataset.previousKeyType = 'clear'
        return 0
    }
          
}
  
const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
    const keyType = getKeyType(key)
    const {
        firstValue,
        modValue,
        operator,
        previousKeyType
    } = calculator.dataset
    calculator.dataset.previousKeyType = keyType
    if (keyType === 'operator') {
        key.classList.add('is-depressed')
        calculator.dataset.operator = key.dataset.action
        calculator.dataset.firstValue = firstValue &&
          operator &&
          previousKeyType !== 'operator' &&
          previousKeyType !== 'calculate'
          ? calculatedValue
          : displayedNum
    }
      
    if (keyType === 'clear') {
        if (key.textContent === 'AC') {
          calculator.dataset.firstValue = ''
          calculator.dataset.modValue = ''
          calculator.dataset.operator = ''
          calculator.dataset.previousKeyType = ''
        } else {
          key.textContent = 'AC'
        }
      }
      
      if (keyType !== 'clear') {
        const clearButton = calculator.querySelector('[data-action=clear]')
        clearButton.textContent = 'CE'
      }
      
    if (keyType === 'calculate') {
        calculator.dataset.modValue = firstValue && previousKeyType === 'calculate'
          ? modValue
          : displayedNum
    }
      
      
    // Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))
}

const updateVisualState = (key, calculator) => {
    const keyType = getKeyType(key)
    Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))

    if (keyType === 'operator') key.classList.add('is-depressed')
        
    

    if (keyType === 'clear' && key.textContent !== 'AC') {
      key.textContent = 'AC'
    }
  
    if (keyType !== 'clear') {
      const clearButton = calculator.querySelector('[data-action=clear]')
      clearButton.textContent = 'CE'
    }
    Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))

}
  

keys.addEventListener('click', e => {
    if (e.target.matches('button')) {
        const key = e.target
        const displayedNum = display.textContent
    
        // Pure functions
        const resultString = createResultString(key, displayedNum, calculator.dataset)
    
        // Update states
        display.textContent = resultString
        updateCalculatorState(key, calculator, resultString, displayedNum)
        updateVisualState(key, calculator)
    }
})