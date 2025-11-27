// // Method A
// // for APIs requiring the API key as an url parameter

// const MY_API_KEY = "80d1993378fa9e47ffc9c7fec53fe1d2" // here add your API key
// const API_URL = "https://api.openweathermap.org/data/2.5/forecast?lat=45.9&lon=8.96&units=metric&appid=" + MY_API_KEY

// fetch(API_URL)
//   .then(response => response.json()) 
//   .then(data => showData (data))
//   .catch(error => console.log(error))

//   function displayData(data) {
//     console.log(data)

//     const FORECAST = data.list
//     console.log(FORECAST)

//     for (let item of FORECAST) {
//       const DATE = item .dt_txt;
//       const TEMP = item.main.temp;

//       }

//   }
  
//   const CONTAINER = document.getElementById ("container")

//     function showData(data){
//       // console.log(data)
//       const weatherData = data.list
//       console.log(weatherData)

//       for (let item of weatherData){
      
//         const temperature = item.main.temp
//         console.log(temperature)

//         const listItem = document.createElement("li")
//         listItem.textContent = item.main.temp
//         CONTAINER.appendChild(listItem)
//       }
//     }
  

//   function displayError(error){
//     console.error("Error fetching data:", error)
// }


const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;
console.log(width, height);

const size = 200;

// posizione iniziale del cerchio
let circlePos = 0;

function draw() {
  circlePos += 0.5; // corretto

  ctx.clearRect(0, 0, width, height);
  // pulisco tutto

  ctx.fillStyle = "white";
  ctx.clearRect(0, 0, width, height);

  // quadrato blu centrato
  ctx.fillStyle = "blue";
  ctx.fillRect(width / 2 - size / 2, height / 2 - size / 2, size, size);

  // testo
  ctx.fillStyle = "black";
  ctx.font = "48px serif";
  ctx.fillText("Ciao", 100, 100);

  // cerchio arancione che si muove
  ctx.save();
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.arc(width / 2 + circlePos, height / 2, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  requestAnimationFrame(draw);
}

draw();

