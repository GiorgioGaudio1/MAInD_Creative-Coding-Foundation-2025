const CONTAINER = document.getElementById("container");


fetch('./assets/data/MOCK_DATA.json')
  .then(response => response.json()) 
  .then(data => displayData(data)) 
  .catch(error => console.error('Error:', error));



function displayData (data) {
    console.log(data);


    const FILTERED_DATA = data.filter((person) => person.age >= 20 && person.age < 39);
    FILTERED_DATA.sort((a,b) => a.age - b.age);

    for(let person of FILTERED_DATA){


        const PERSON_BOX = document.createElement("li");
        const PERSON_INFO = document.createElement("div");
        const PERSON_BAR = document.createElement("div");


        PERSON_BOX.textContent = `${person.first_name} ${person.last_name} ${person.age} ${person.gender}`;

        const BAR_WIDTH = person.age * 5;
        PERSON_BAR.style.width = `${person.age *5}px`;
        PERSON_BAR.className = "bar";

        let BAR_COLOR= 'gray'

        if (person.gender == 'Male'){
            BAR_COLOR = 'blue';
        }
        else if (person.gender == 'Female'){
            BAR_COLOR = 'pink';
        }
        else {
            BAR_COLOR = 'orange';
        }

        PERSON_BAR.style.backgroundColor = BAR_COLOR;

        PERSON_BOX.appendChild(PERSON_INFO);
        PERSON_BOX.appendChild(PERSON_BAR);

    
        CONTAINER.appendChild(PERSON_BOX)
    
    

        
    }


}

  function displayError(error) {
    console.error(error)
  }