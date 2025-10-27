// let greetings = "Hi";
// let numberA = 4;
// let numberB = 2;
// let myNumber = "1";

// let greetNumber = greetings + numberA;

// let sum = numberA * numberB;
// let sumB = numberB + myNumber;

// console.log(greetings);
// console.log(numberA);
// console.log(greetNumber);
// console.log(sum);

// console.log(sumB);  


// let number = 0

// number+= 1
// number+= 2
// number+= 3
// number+= 4



// // number = number + 1
// // number = number + 1
// // number = number + 1
// // number = number + 1

// console.log(number)


const BUTTON = document.getElementById("button");
const BOX= document.getElementById("result");
const INPUT = document.getElementById("userInput");
// console.log(BUTTON);



let number = 0;

BUTTON.addEventListener("click", () => {

    let userInput = INPUT.value;
    console.log(userInput);

    let boxInput = document.createElement("p");
    boxInput.textContent = userInput;

    BOX.appendChild(boxInput);

})


// BUTTON.addEventListener("click", () => {
//     number += 1;

//     BOX.innerHTML = number
//     // console.log("Ciao");
// });



