const items = document.querySelectorAll(".item");
const input = document.getElementById("input-bar");
const output = document.getElementById("output");
const themeChangeButton = document.getElementById("themeChange");

const nonInputValues = ["AC", "DEL", "/", "*", "-", "+", "=", "!", "^", "π"];
const expression = [];
let eqPressed = 0;
const operators = ["^", "*", "/", "-", "+", "!"];

const parseInput2 = (e) => {
  const buttonValue = e.target.textContent;

  // normal digits
  if (!nonInputValues.includes(buttonValue)) {
    if (!(buttonValue === "." && input.value.includes(buttonValue))) {
      input.value += buttonValue;
    }
  } else {
    const isNan = input.value.trim() === "";
    const currInp = parseFloat(input.value);

    // - digits
    if (isNan && buttonValue == "-") {
      eqPressed = 0;
      input.value += "-";
    }

    if (!isNan && !["AC", "DEL", "=", "π"].includes(buttonValue)) {
      eqPressed = 0;
      expression.push(currInp, buttonValue);
      input.value = "";
    } else if (!["AC", "DEL", "=", "-", "^", "=", "π"].includes(buttonValue)) {
      eqPressed = 0;
      expression.push(buttonValue);
      input.value = "";
    }

    if (buttonValue === "=") {
      eqPressed++;
      input.value = "";
      const lastValues = expression.slice(-2);

      if (eqPressed === 1) {
        if (!isNan && currInp > 0) expression.push(currInp);
        else if (!isNan && currInp < 0) expression.push("+", currInp);

        const postfixExp = convertToPostfix();
        const value = calculateInfix(postfixExp);

        setTimeout(() => {
          if (typeof value != "boolean") {
            output.innerText = value;
          } else {
            output.innerText = "Err";
          }
        }, 100);
      } else {
        expression.push(...lastValues);

        const postfixExp = convertToPostfix();
        const value = calculateInfix(postfixExp);

        setTimeout(() => {
          if (typeof value != "boolean") {
            output.innerText = value;
          } else {
            output.innerText = "Err";
          }
        }, 100);
      }
    }

    if (buttonValue === "AC") {
      eqPressed = 0;
      expression.splice(0);
      output.innerHTML = "";
      input.value = "";
    }

    if (buttonValue === "π") {
      expression.push(3.14);
      eqPressed = 0;
    }

    if (buttonValue === "DEL") {
      eqPressed = 0;
      if (input.value !== "") {
        input.value = input.value.substring(0, input.value.length - 1);
      } else if (input.value == "") {
        if (expression.length > 1) {
          const lastExpression = expression.pop();

          if (lastExpression.length > 1) {
            const modifiedLastExpression = lastExpression.substring(
              0,
              lastExpression.length - 1
            );
            expression.push(modifiedLastExpression);
          }
        }
      }
    }
  }

  output.innerText = expression.join(" ");
};

const changeTheme = (e) => {
  const classList = document.body.classList;

  if (classList.contains("theme-light"))
    classList.replace("theme-light", "theme-dark");
  else classList.replace("theme-dark", "theme-light");
};

// calculate precedence of operators
var precedence = (e) => {
  switch (e) {
    case "^":
    case "!":
      return 5;
    case "%":
      return 4;
    case "*":
    case "/":
      return 2;
    case "+":
    case "-":
      return 1;
    default:
      return 0;
  }
};

// convert to postfix inorder to calculate in computer way
const convertToPostfix = () => {
  const postfixStack = [];
  const operatorStack = [];

  for (i in expression) {
    const current = expression[i];

    if (typeof current === "number") {
      postfixStack.push(current);
    } else if (operators.includes(current)) {
      while (
        operatorStack.length > 0 &&
        precedence(current) <= precedence(operatorStack.at(-1))
      ) {
        postfixStack.push(operatorStack.pop());
      }
      operatorStack.push(current);
    }
  }

  operatorStack.reverse().forEach((e) => postfixStack.push(e));
  return postfixStack;
};

// now calculate infix value using stack
const calculateInfix = (postfixArray) => {
  const infixStack = [];
  console.log(postfixArray);

  postfixArray.forEach((e) => {
    if (typeof e === "number") {
      infixStack.push(e);
    } else {
      const val1 = infixStack.pop();
      const val2 = infixStack.pop();

      console.log(e, val1, val2);

      switch (e) {
        case "*":
          infixStack.push(val2 * val1);
          break;
        case "/":
          infixStack.push(val2 / val1);
          break;
        case "-":
          infixStack.push(val2 - val1);
          break;
        case "+":
          infixStack.push(val2 + val1);
          break;
        case "!":
          let element = val1;
          if (val1 > 0) {
            for (let index = 1; index < val1; index++) {
              element *= index;
            }
          } else if (val1 == 0) {
            element = 1;
          }
          infixStack.push(val2, element);
          break;
        case "^":
          const expValue = val2 ** val1;
          infixStack.push(expValue);
          break;
      }
    }
  });

  return infixStack.length === 1 ? infixStack.pop() : false;
};

items.forEach((e) => {
  e.setAttribute("onclick", "parseInput2(event)");
});

addEventListener("keyup", (event) => {
  if (
    [
      "Enter",
      "Backspace",
      " ",
      "/",
      "*",
      "-",
      "+",
      "=",
      "!",
      "^",
      ".",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
    ].includes(event.key)
  ) {
    if (event.key === " ") parseInput2({ target: { textContent: "AC" } });
    else if (event.key === "Backspace")
      parseInput2({ target: { textContent: "DEL" } });
    else if (event.key === "Enter")
      parseInput2({ target: { textContent: "=" } });
    else {
      parseInput2({ target: { textContent: event.key } });
    }
  }
});
