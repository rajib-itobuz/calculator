const items = document.querySelectorAll(".item");
const input = document.getElementById("input-bar");
const output = document.getElementById("output");

const nonInputValues = ["AC", "DEL", "/", "*", "-", "+", "="];
const displayValue = [];
let currentAns = 0;
let eqPressed = 0;

const parseInput = (e) => {
  const buttonValue = e.target.textContent;

  // normal digits
  if (!nonInputValues.includes(buttonValue)) {
    if (!(buttonValue === "." && input.value.includes(buttonValue))) {
      input.value += buttonValue;
    }
  }

  if (nonInputValues.includes(buttonValue)) {
    const isNan = input.value.trim() === "";
    const currInp = parseFloat(input.value);

    // - digits
    if (isNan && buttonValue == "-") {
      input.value += "-";
    }

    if (!isNan) {
      switch (buttonValue) {
        case "*":
          eqPressed = 0;
          displayValue.push(currInp, "*");
          break;
        case "-":
          eqPressed = 0;
          displayValue.push(currInp, "-");
          break;
        case "+":
          eqPressed = 0;
          displayValue.push(currInp, "+");
          break;
        case "/":
          eqPressed = 0;
          displayValue.push(currInp, "/");
          break;
        case "=":
          eqPressed++;
          if (eqPressed === 1) {
            console.log(displayValue);
            displayValue.push(currInp);
            calcValue();
            setTimeout(() => {
              // input.value = currentAns.toFixed(2);
              output.innerText = currentAns.toFixed(2);
            }, 100);
          } else {
            const lastElements = displayValue.slice(-2);
            displayValue.push(...lastElements);
            calcValue();
            setTimeout(() => {
              output.innerText = currentAns;
            }, 100);
          }
          break;
      }

      if (buttonValue !== "DEL" && buttonValue !== "=") {
        input.value = "";
        currentInput = "";
      }
      output.innerText = displayValue.join("");
    } else if (buttonValue === "AC") {
      displayValue.splice(0);
      output.innerHTML = "";
    } else if (buttonValue === "DEL") {
      if (currentAns !== "Infinity" && currentAns !== "-Infinity") {
        input.value = input.value.substring(0, input.value.length - 1);
      }
    }
  }
};

const calcValue = () => {
  currentAns = displayValue[0];
  for (let index = 0; index < displayValue.length; index += 2) {
    switch (displayValue[index + 1]) {
      case "*":
        currentAns *= displayValue[index + 2];
        break;
      case "+":
        currentAns += displayValue[index + 2];
        break;
      case "-":
        currentAns -= displayValue[index + 2];
        break;
      case "/":
        currentAns /= displayValue[index + 2];
        break;
    }
  }
};

items.forEach((e) => {
  e.setAttribute("onclick", "parseInput(event)");
});
