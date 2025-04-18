window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {
   // TODO: Complete the function
   const cInput = document.getElementById("cInput");
   const fInput = document.getElementById("fInput");
   const convertButton = document.getElementById("convertButton");
   const errorMessage = document.getElementById("errorMessage");
   const weatherImage = document.getElementById("weatherImage");

   convertButton.addEventListener("click", function() {

      //Error
      errorMessage.textContent = "";
      
      if (cInput.value !== "") {
         const celsius = parseFloat(cInput.value);
         
         if (isNaN(celsius)) {
            errorMessage.textContent= "Enter a number";
         } else {
            //Celsius to Fahrenheit
            fInput.value = convertCtoF(celsius);
            
            //update imgs
            const fahrenheit= parseFloat(fInput.value);
            if (fahrenheit < 32) {
               weatherImage.src= "images/cold.png";
            } else if (fahrenheit<= 50) {
               weatherImage.src= "images/cool.png";
            } else {
               weatherImage.src= "images/warm.png";
            }
         }
         
      } else if (fInput.value !== "") {
         const fahrenheit = parseFloat(fInput.value);
         
         if (isNaN(fahrenheit)) {
            errorMessage.textContent= "Enter a number";
         } else {
            //Fahrenheit to celsius
            cInput.value = convertFtoC(fahrenheit);
            
            if (fahrenheit < 32) {
               weatherImage.src = "images/cold.png";
            } else if (fahrenheit <= 50) {
               weatherImage.src = "images/cool.png";
            } else {
               weatherImage.src = "images/warm.png";
            }
         }
      }
   });
   
   cInput.addEventListener("input", function() {
      if (cInput.value !== "") {
         fInput.value = "";
      }
   });
   
   fInput.addEventListener("input", function() {
      if (fInput.value !== "") {
         cInput.value = "";
      }
   });
}

function convertCtoF(degreesCelsius) {
}

function convertCtoF(degreesCelsius) {
   // TODO: Complete the function
   return degreesCelsius * 9/5+ 32;
}

function convertFtoC(degreesFahrenheit) {
   // TODO: Complete the function
   return (degreesFahrenheit - 32) * 5/9;
}
