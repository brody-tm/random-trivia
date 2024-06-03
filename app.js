function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function getQuestions() {
    const response = await fetch("https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple");
    const questions = await response.json();
    return questions;
}

const questionHeader = document.getElementById("question-header");
const questionText = document.getElementById("question-text");
const aButton = document.getElementById("a-button");
const bButton = document.getElementById("b-button");
const cButton = document.getElementById("c-button");
const dButton = document.getElementById("d-button");
const result = document.getElementById("result");
const finalScore = document.getElementById("final-score");
const scoreMessage = document.getElementById("score-message");


let numCorrect = 0;

async function main() {
    const game = await getQuestions();
    const questions = game.results;
    for (let i = 0; i < questions.length; i++) {
        const element = questions[i];
        const question = element.question;
        const correctAnswer = element.correct_answer;
        const incorrectAnswers = element.incorrect_answers;
        let allAnswers = [];
        allAnswers.push(correctAnswer);
        for (let j = 0; j < incorrectAnswers.length; j++) {
            allAnswers.push(incorrectAnswers[j]);
        }
        shuffleArray(allAnswers);
        const answerKey = {
            "A": allAnswers[0],
            "B": allAnswers[1],
            "C": allAnswers[2],
            "D": allAnswers[3],
        };
        questionHeader.innerHTML = "Question " + (i + 1);
        questionText.innerHTML = question;
        aButton.innerHTML = answerKey["A"];
        bButton.innerHTML = answerKey["B"];
        cButton.innerHTML = answerKey["C"];
        dButton.innerHTML = answerKey["D"];

        const answerPromise = new Promise((resolve) => {
            const handleButtonClick = (key) => {
                if (answerKey[key] == correctAnswer) {
                    result.innerHTML = "Correct!";
                    numCorrect = numCorrect + 1;
                } else {
                    result.innerHTML = "Incorrect.";
                }
                aButton.removeEventListener("click", handleClickA);
                bButton.removeEventListener("click", handleClickB);
                cButton.removeEventListener("click", handleClickC);
                dButton.removeEventListener("click", handleClickD);
                setTimeout(resolve, 1000);
            };

            const handleClickA = () => handleButtonClick("A");
            const handleClickB = () => handleButtonClick("B");
            const handleClickC = () => handleButtonClick("C");
            const handleClickD = () => handleButtonClick("D");

            aButton.addEventListener("click", handleClickA);
            bButton.addEventListener("click", handleClickB);
            cButton.addEventListener("click", handleClickC);
            dButton.addEventListener("click", handleClickD);
        });

        await answerPromise;

        result.innerHTML = "";
    }
    
    scoreMessage.innerHTML = ("Your final score: ")
    finalScore.innerHTML = (numCorrect + "/10")
    
    if (numCorrect > 8) {
        finalScore.style.color = "green";
    } else if (numCorrect > 5) {
        finalScore.style.color = "yellow";
    } else {
        finalScore.style.color = "red";
    }
}

main();
