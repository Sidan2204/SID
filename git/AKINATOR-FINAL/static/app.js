document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM Loaded");

    // Start button in theme_selection.html
    const startButton = document.querySelector("#start-button");
    if (startButton) {
        startButton.addEventListener("click", startGame);
    }

    // Answer buttons in playgame.html
    document.querySelectorAll(".answer-button").forEach(button => {
        button.addEventListener("click", function () {
            const answer = this.getAttribute("data-answer");
            console.log("Answer clicked:", answer);
            sendAnswer(answer);
        });
    });

    // Restart button in result.html
    const restartButton = document.querySelector("#restart-button");
    if (restartButton) {
        restartButton.addEventListener("click", restartGame);
    }

    // Start the game if we're on playgame.html
    if (document.getElementById("question")) {
        shuffleQuestions();
        askQuestion();
    }

    // Show results if we're on result.html
    if (document.getElementById("result")) {
        showFinalResult();
    }
});

// ✅ Point System
const POINTS = {
    "yes": 2,
    "no": 2,
    "probably": 1,
    "probably_not": 1,
    "dont_know": 0
};

let currentQuestionIndex = 0;
const questions = [
    { question: "Is your character real?", key: "human" },

    { question: "Is your character female?", key: "Female" },

    { question: "Is your character a YouTuber?", key: "youtuber" },

    { question: "Is your character in a movie?", key: "movie" },

    { question: "Is your character fictional?", key: "fictional" },

    { question: "Is your character an inventor?", key: "inventor" },

    { question: "Is your character Indian?", key: "indian" },

    { question: "Is your character alive?", key: "alive" },

    { question: "Is your character an actor?", key: "actor" },

    { question: "Is your character linked with a specific sport?", key: "sport" },

    { question: "Is your character linked with politics?", key: "politician" },

    { question: "Is your character an artist?", key: "art" },

    { question: "Is your character related to SpaceX?", key: "space" },

    { question: "Does your character have a deep connection with the fruit apple?", key: "apple" },

    { question: "Does your character have a famous mustache?", key: "mustache" },

    { question: "Is your character known for being a scientist?", key: "scientist" },

    { question: "Is your character linked with music?", key: "musician" },

    { question: "Has your character ever been a president or prime minister?", key: "leader" },

    { question: "Is your character known for being very rich?", key: "rich" },

    { question: "Is your character famous for comedy?", key: "comedian" },

    { question: "Is your character from a video game?", key: "video_game" },

    { question: "Is your character often seen wearing a hat or cap?", key: "hat" },

    { question: "Is your character a superhero?", key: "superhero" },

    { question: "Does your character have a special catchphrase?", key: "catchphrase" },

    { question: "Does your character a activist?", key: "activist" }
];

const characters = [
    { name: "Shahrukh Khan", human: true, Female: false, youtuber: false, movie: true, fictional: false, actor: true, musician: false, politician: false, scientist: false, sport: true, indian: true, alive: true, mustache: true, leader: false, art: true, comedian: false, video_game: false, hat: false, superhero: false, catchphrase: false, rich: true, inventor: false, space: false, apple: false, activist: false, score: 0 },

    { name: "Priyanka Chopra", human: true, Female: true, youtuber: false, movie: true, fictional: false, actor: true, musician: true, politician: false, scientist: false, sport: false, indian: true, alive: true, mustache: false, leader: false, art: true, comedian: false, video_game: false, hat: false, superhero: false, catchphrase: false, rich: true, inventor: false, space: false, apple: false, activist: true, score: 0 },

    { name: "Chris Hemsworth", human: true, Female: false, youtuber: false, movie: true, fictional: false, actor: true, musician: false, politician: false, scientist: false, sport: false, indian: false, alive: true, mustache: true, leader: false, art: true, comedian: false, video_game: false, hat: false, superhero: false, catchphrase: false, rich: true, inventor: false, space: false, apple: false, activist: false, score: 0 },

    { name: "Ariana Grande", human: true, Female: true, youtuber: false, movie: true, fictional: false, actor: false, musician: true, politician: false, scientist: false, sport: false, indian: false, alive: true, mustache: false, leader: false, art: true, comedian: false, video_game: false, hat: false, superhero: false, catchphrase: false, rich: true, inventor: false, space: false, apple: false, activist: false, score: 0 },

    { name: "CV Raman", human: true, Female: false, youtuber: false, movie: true, fictional: false, actor: false, musician: false, politician: false, scientist: true, sport: false, indian: true, alive: false, mustache: false, leader: false, art: false, comedian: false, video_game: false, hat: false, superhero: false, catchphrase: false, rich: false, inventor: true, space: false, apple: false, activist: false, score: 0 },

    { name: "Isaac Newton", human: true, Female: false, youtuber: false, movie: true, fictional: false, actor: false, musician: false, politician: false, scientist: true, sport: false, indian: false, alive: false, mustache: false, art: false, leader: false, comedian: false, video_game: false, hat: false, superhero: false, catchphrase: false, rich: false, inventor: true, space: false, apple: true, activist: false, score: 0 },

    { name: "Marie Curie", human: true, Female: true, youtuber: false, movie: false, fictional: false, actor: false, musician: false, politician: false, scientist: true, sport: false, indian: false, alive: false, mustache: false, art: false, leader: false, comedian: false, video_game: false, hat: false, superhero: false, catchphrase: false, rich: false, inventor: true, space: false, apple: false, activist: false, score: 0 },

    { name: "PewDiePie", human: true, Female: false, movie: true, fictional: false, actor: false, musician: false, politician: false, scientist: false, sport: false, youtuber: true, indian: false, alive: true, art: true, mustache: false, leader: false, comedian: true, video_game: false, hat: false, superhero: false, catchphrase: true, rich: true, inventor: false, space: false, apple: false, activist: false, score: 0 },

    { name: "Jasmine (Aladdin)", human: false, Female: true, youtuber: false, movie: true, fictional: true, actor: false, musician: false, politician: false, scientist: false, sport: false, indian: false, alive: true, art: false, mustache: false, leader: true, comedian: false, video_game: false, hat: false, superhero: false, catchphrase: false, rich: true, inventor: false, space: false, apple: false, activist: true, score: 0 },

    { name: "Indira Gandhi", human: true, Female: true, youtuber: false, movie: false, fictional: false, actor: false, musician: false, politician: true, scientist: false, sport: false, indian: true, alive: false, mustache: false, art: false, leader: true, comedian: false, video_game: false, hat: false, superhero: false, catchphrase: false, rich: false, inventor: false, space: false, apple: false, activist: true, score: 0 },

    { name: "Barack Obama", human: true, Female: false, youtuber: false, movie: true, fictional: false, actor: false, musician: false, politician: true, scientist: false, sport: true, indian: false, alive: true, mustache: false, art: false, leader: true, comedian: false, video_game: false, hat: false, superhero: false, catchphrase: true, rich: false, inventor: false, space: false, apple: false, activist: true, score: 0 },

    { name: "Elon Musk", human: true, Female: false, youtuber: false, movie: true, fictional: false, actor: false, musician: false, politician: false, scientist: true, sport: false, indian: false, alive: true, mustache: false, art: false, leader: true, comedian: false, video_game: false, hat: false, superhero: false, catchphrase: false, rich: true, inventor: true, space: true, apple: false, activist: true, score: 0 },

    { name: "Sachin Tendulkar", human: true, Female: false, youtuber: false, movie: true, fictional: false, actor: false, musician: false, politician: true, scientist: false, sport: true, indian: true, alive: true, art: true, mustache: false, leader: true, comedian: false, video_game: false, hat: false, superhero: false, catchphrase: false, rich: true, inventor: false, space: false, apple: false, activist: true, score: 0 },

    { name: "Sania Mirza", human: true, Female: true, youtuber: false, movie: false, fictional: false, actor: false, musician: false, politician: false, scientist: false, sport: true, indian: true, alive: true, art: true, mustache: false, leader: false, comedian: false, video_game: false, hat: false, superhero: false, catchphrase: false, rich: true, inventor: false, space: false, apple: false, activist: true, score: 0 },

    { name: "Mahatma Gandhi", human: true, Female: false, youtuber: false, movie: false, fictional: false, actor: false, musician: false, politician: true, scientist: false, sport: false, activist: true, art: false, indian: true, alive: false, mustache: true, leader: true, comedian: false, video_game: false, hat: false, superhero: false, catchphrase: false, rich: false, inventor: false, space: false, apple: false, score: 0 },

    { name: "Srinivasa Ramanujan", human: true, Female: false, youtuber: false, movie: false, fictional: false, actor: false, musician: false, politician: false, scientist: true, sport: false, art: false, indian: true, alive: false, mustache: false, leader: false, comedian: false, video_game: false, hat: false, superhero: false, catchphrase: false, rich: false, inventor: true, space: false, apple: false, activist: false, score: 0 },

    { name: "Charlie Chaplin", human: true, Female: false, youtuber: false, movie: true, fictional: false, inventor: false, indian: false, alive: false, actor: true, sport: false, politician: false, space: false, apple: false, mustache: true, scientist: false, musician: false, leader: false, rich: false, comedian: true, video_game: false, hat: true, superhero: false, catchphrase: true, activist: true, art: true, score: 0 },

    { name: "Batman", human: true, Female: false, youtuber: false, movie: true, fictional: true, inventor: true, indian: false, alive: true, actor: false, sport: false, politician: false, art: true, space: false, apple: false, mustache: false, scientist: true, musician: false, leader: true, rich: true, comedian: false, video_game: false, hat: true, superhero: true, catchphrase: true, activist: true, score: 0 },
];

// ✅ Shuffle Questions Before Starting the Game
function shuffleQuestions() {
    questions.sort(() => Math.random() - 0.5);
    console.log("Questions shuffled:", questions);
}

// ✅ Start the Game
function startGame() {
    console.log("Game started");
    window.location.href = "playgame.html";
}

// ✅ Ask Next Question
function askQuestion() {
    const questionElement = document.getElementById("question");

    if (currentQuestionIndex < questions.length) {
        console.log(`Showing question ${currentQuestionIndex + 1}: ${questions[currentQuestionIndex].question}`);
        questionElement.innerText = questions[currentQuestionIndex].question;
    } else {
        console.log("No more questions. Fetching result...");
        fetchResult();
    }
}

// ✅ Process Answer
function sendAnswer(answer) {
    console.log(`User selected: ${answer}`);

    updateCharacterScores(answer, questions[currentQuestionIndex].key);

    currentQuestionIndex++; // Move to next question

    if (currentQuestionIndex < questions.length) {
        setTimeout(() => {
            askQuestion(); // Display next question
        }, 200);
    } else {
        fetchResult();
    }
}

// ✅ Update Character Scores
function updateCharacterScores(answer, key) {
    let pointValue = POINTS[answer];

    characters.forEach(character => {
        if (character.hasOwnProperty(key)) {
            if ((answer === "yes" || answer === "probably") && character[key] === true) {
                character.score += pointValue; // ✅ Add points if the attribute is true
            } else if ((answer === "no" || answer === "probably_not") && character[key] === false) {
                character.score += pointValue; // ✅ Add points if the attribute is false
            }
        }
    });

    console.log(`Updated scores after '${answer}' for key '${key}':`, characters);
}

// ✅ Determine Best-Matching Character(s)
function fetchResult() {
    console.log("Sorting characters based on scores...");

    // Sort characters by score in descending order
    characters.sort((a, b) => b.score - a.score);

    let highestScore = characters[0].score; // Get highest score
    let bestMatches = characters.filter(character => character.score === highestScore); // Get all characters with highest score

    console.log(`Best matches found:`, bestMatches);

    // Prepare result text
    let resultText;
    if (bestMatches.length === 1) {
        resultText = `Your character is: ${bestMatches[0].name}`;
    } else {
        let names = bestMatches.map(c => c.name).join(", ");
        resultText = `Your character could be: ${names}`;
    }

    // Store result in localStorage to display on result.html
    localStorage.setItem("gameResult", resultText);
    window.location.href = "result.html"; // Redirect to result page
}

// ✅ Show Final Result on `result.html`
function showFinalResult() {
    console.log("Displaying final result...");
    const resultText = localStorage.getItem("gameResult") || "No matching character found.";
    document.getElementById("result").innerText = resultText;
}

// ✅ Restart Game
function restartGame() {
    console.log("Restarting game...");
    window.location.href = "theme_selection.html"; // Redirects to theme selection
}
