function playGame() {
  let userin= prompt("Choose Rock, Paper, or Scissors:").toLowerCase();
  
  while (userin!== "rock" && userin!== "paper" && userin!== "scissors") {
    userin = prompt("Invalid input.").toLowerCase();
  }
  const choices = ["rock", "paper", "scissors"];
  const computerOp = choices[Math.floor(Math.random() * 3)];
  
  let result;
  
  if (userin=== computerOp) {
    result= "TIE";
  } else if(
    (userin=== "rock" && computerOp === "scissors")||
    (userin === "paper" && computerOp=== "rock") ||
    (userin==="scissors" && computerOp=== "paper")
  ) {
    result = "YOU WON";
  } else {
    result  = "COMPUTER WON";
  }
  
  console.log(result);
  
  alert(`You chose: ${userin}\nComputer chose: ${computerOp}\nResult: ${result}`);

  if (confirm(`${result}`)) {
    playGame();
  }
}
playGame();