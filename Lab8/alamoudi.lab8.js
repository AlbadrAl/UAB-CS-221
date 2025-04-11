const buttons = document.querySelectorAll('button');
const resultsDiv = document.getElementById('results');

const choices = ['rock','paper','scissors'];

function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return "It's a tie!";
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) return "You win!";
    return "Computer wins!";
}

buttons.forEach(button => {
    button.addEventListener('click', () =>{
        const playerChoice = button.id;
        const computerChoice = choices[Math.floor(Math.random()* 3)];
        
        const result = determineWinner(playerChoice, computerChoice);
        resultsDiv.innerHTML = `
            You chose <strong>${playerChoice}</strong><br>
            Computer chose <strong>${computerChoice}</strong><br>
            <strong>${result}</strong>
        `;
    });
});