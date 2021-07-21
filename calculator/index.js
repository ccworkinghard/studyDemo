// 获取标签
let input = document.getElementById("input");
let number = document.querySelectorAll(".numbers div");
let operator = document.querySelectorAll(".operators div");
let result = document.getElementById("result");
let clear = document.getElementById("clear");
let resultDisplayed = false;

// 在输入框里显示数字
for(let i=0; i< number.length; i++){
  number[i].addEventListener("click", function(e){
    let currentString = input.innerHTML;
    let lastChar = currentString[currentString.length - 1];

    // 如果没有显示运算结果，继续添加字符串
    if(resultDisplayed === false){
      input.innerHTML += e.target.innerHTML;
    }else if(resultDisplayed === true && lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷"){
      // 如果显示了结果并且又点击了运算符，继续添加
      resultDisplayed = false;
      input.innerHTML +=e.target.innerHTML;
    }else{
      // 如果显示了结果 接着又点击了数字，清楚显示重新添加显示字符串
      resultDisplayed = false;
      input.innerHTML = "";
      input.innerHTML += e.target.innerHTML;
    }
  });
}

// 在输入框里显示运算符
for(let i=0; i< operator.length; i++){
  operator[i].addEventListener("click",function(e){
    let currentStrin = input.innerHTML;
    let lastChar = currentStrin[currentStrin.length - 1];

    // 如果输入的最后一个字符是运算符，则将其替换为当前按下的字符
    if(lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷"){
      let newString = currentStrin.substring(0, currentStrin.length-1) + e.target.innerHTML;
      input.innerHTML = newString;
    }else if(currentStrin.length == 0){
      console.log("enter a number first");
    }else{
      input.innerHTML += e.target.innerHTML;
    }
  });
}

// 获取运算结果
result.addEventListener("click", function(){
  let inputString = input.innerHTML;
  // 将显示框的式子的数字组成数组
  let numbers = inputString.split(/\+|\-|\×|\÷/g);
  // 将显示框的式子的符号组成数组
  let operators = inputString.replace(/[0-9]|\./g, "").split("");

  // console.log(inputString);
  // console.log(operators)
  // console.log(numbers)
  // console.log("-------------------")
  // 除
  // 得到运算符的下标
  let divide = operators.indexOf("÷");
  while(divide != -1){
    // 得到对应运算符左右数字
    numbers.splice(divide, 2, numbers[divide] / numbers[divide + 1]);
    operators.splice(divide, 1);
    divide = operators.indexOf("÷")
  }

  // 乘
  let multiply = operators.indexOf("×");
  while(multiply != -1){
    numbers.splice(multiply, 2, numbers[multiply] * numbers[multiply + 1]);
    operators.splice(multiply, 1);
    multiply = operators.indexOf("×");
  }

  // 减
  var subtract = operators.indexOf("-");
  while (subtract != -1) {
    numbers.splice(subtract, 2, numbers[subtract] - numbers[subtract + 1]);
    operators.splice(subtract, 1);
    subtract = operators.indexOf("-");
  }

  // 加
  var add = operators.indexOf("+");
  while (add != -1) {
    numbers.splice(add, 2, parseFloat(numbers[add]) + parseFloat(numbers[add + 1]));
    operators.splice(add, 1);
    add = operators.indexOf("+");
  }

  input.innerHTML = numbers[0]; 

  resultDisplayed = true;
})

// 清楚输入框内容
clear.addEventListener("click", function() {
  input.innerHTML = "";
})