console.log('ciao')

const HOBBIES = ["judo", "calcio", "lettura", "programmazione", "musica"];

console.log(HOBBIES.length);
console.log(HOBBIES[0]);


const PERSON = {
    name: "Mario",
    lastname : "Rossi",
    hobbies : HOBBIES
    }

    console.log(PERSON.lastname);
    console.log(PERSON.hobbies);

    const CONTAINER = document.getElementById("container");




    for (hobby of PERSON.hobbies) {

        const ITEM = document.createElement("li");
        console.log(hobby);
        ITEM.textContent = hobby;
        // ITEM.innerHTML= = hobby;

        CONTAINER.appendChild(ITEM);
    }


    const CONTAINER = document.getElementById("container");


fetch('/assets/data/data.json')
  .then(response => response.json()) 
  .then(data => console.log(data)) 
  .catch(error => console.error('Error:', error));