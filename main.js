const app = (() => {
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  const showCalculate = $(".screen #caculation");
  const showResult = $(".screen #result");
  const allButton = $$(".caculator__action .list .item");
  const theme = $$(".theme__content i");
  const ui = $(".caculator");
  var time = $(".time");
  var network = $("#network");
  var battery = $("#battery");
  var date = new Date(),
    hours,
    minutes;

  var signal = new AbortController().signal;
  var batteryPromise = navigator.getBattery();
  var batteryIcon = {
    0: "empty",
    10: "quarter",
    40: "half",
    70: "three-quarters",
    90: "full",
  };

  changeTheme(theme);

  handleCalculation();

  // Get/Render Network
  if (signal.aborted) {
    network.innerHTML = '<i class="fas fa-sigle"></i>';
  }
  // Get/Render Battery
  batteryPromise.then((data) => {
    var batteryIconStatus = data.level * 100;
    for (var i = batteryIconStatus; i >= 0; i--) {
      if (batteryIcon[i]) {
        battery.innerHTML = `${batteryIconStatus}% <i class="fas fa-battery-${batteryIcon[i]}">`;
        break;
      }
    }
  });

  const statusBar = () => {
    // Get/Render time
    date = new Date();
    hours = date.getHours();
    minutes = date.getMinutes();
    time.innerText = `${hours}:${minutes}`;
  };

  statusBar();

  setInterval(statusBar, 30000);

  function changeTheme(themes) {
    Array.from(themes).forEach((theme) => {
      if (date.getHours() < 18) {
        if (theme.id == "light") {
          theme.classList.add("active");
          var friend = theme.nextElementSibling || theme.previousElementSibling;
          friend.classList.remove("active");
          ui.style.backgroundColor = "#ffffff";
          ui.style.color = "#000000";
        }
      }
      theme.onclick = () => {
        theme.classList.add("active");
        var friend = theme.nextElementSibling || theme.previousElementSibling;
        friend.classList.remove("active");
        const theme_active = $(".theme__content .active");
        if (theme_active.id == "light") {
          ui.style.backgroundColor = "#ffffff";
          ui.style.color = "#000000";
        } else {
          ui.style.color = "#ffffff";
          ui.style.backgroundColor = "#22252d";
        }
      };
    });
  }

  function handleCalculation() {
    var result;
    var number = "";
    var regex = /[0-9.%]/;
    var calculation;

    Array.from(allButton).forEach((button) => {
      button.onclick = () => {
        if (!button.classList.contains("tool")) {
          showCalculate.innerText += `${button.innerText}`;
        } else {
          if (button.id == "equa") {
            Array.from(showCalculate.innerText).forEach((letter, index) => {
              if (regex.test(letter)) {
                if (letter == "%") {
                  number /= 100;
                } else {
                  number += letter;
                }
              } else {
                calculation = letter;
                if (calculation == "-" && index == 0) {
                  number = "-";
                } else if (!result) {
                  result = parseFloat(number);
                  number = "";
                } else {
                  switch (letter) {
                    case "+":
                      result += parseFloat(number);
                      number = "";
                      break;
                    case "-":
                      result -= parseFloat(number);
                      number = "";
                      break;

                    case "x":
                      result *= parseFloat(number);
                      number = "";
                      break;
                    case "/":
                      result /= parseFloat(number);
                      number = "";
                      break;
                    default:
                      result = parseFloat(number);
                      break;
                  }
                }
              }
            });
            switch (calculation) {
              case "+":
                result += parseFloat(number);
                number = "";

                break;
              case "-":
                result -= parseFloat(number);
                number = "";
                break;
              case "x":
                result *= parseFloat(number);
                number = "";
                break;
              case "/":
                result /= parseFloat(number);
                number = "";
                break;
              default:
                result = parseFloat(number);
                break;
            }

            if (result || result == 0) {
              showResult.innerText = result.toFixed(2);
              showCalculate.innerText = "";
              result = 0;
              number = "";
            } else {
              alert("Có lẽ bạn đã nhập sai gì đó, vui lòng kiểm tra lại");
            }
          } else if (button.id == "ac") {
            number = "";
            result = 0;
            showResult.innerText = result;
            showCalculate.innerText = "";
          } else if (button.id == "del") {
            showCalculate.innerText = showCalculate.innerText.slice(0, -1);
          } else {
            showCalculate.innerText = showResult.innerText;
            showResult.innerText = 0;
          }
        }
      };
    });
  }
})();
