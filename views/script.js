const quizData = [
  {
    question: "What a beautiful sunset!",
    options: ["Exclamatory", "Interrogative", "Imperative", "Declarative"],
    answer: "Exclamatory",
    tooltip: "Hint: This sentence expresses strong emotion or admiration.",
  },
  {
    question: "How many stars are there in the Milky Way?",
    options: ["Exclamatory", "Interrogative", "Imperative", "Declarative"],
    answer: "Interrogative",
    tooltip: "Hint: It's a question asking for information.",
  },
  {
    question: "Please pass me the salt.",
    options: ["Exclamatory", "Interrogative", "Imperative", "Declarative"],
    answer: "Imperative",
    tooltip: "Hint: This sentence gives a command or request.",
  },
  {
    question: "The sun sets in the west.",
    options: ["Exclamatory", "Interrogative", "Imperative", "Declarative"],
    answer: "Declarative",
    tooltip: "Hint: It makes a statement or conveys information.",
  },
  {
    question: "Identify the part of speech for the word 'happiness.'",
    options: ["Noun", "Verb", "Adjective", "Adverb"],
    answer: "Noun",
    tooltip: "Hint: It represents a person, place, thing, or idea.",
  },
  {
    question: "Can you quickly solve this puzzle?",
    options: ["Noun", "Verb", "Adjective", "Adverb"],
    answer: "Adverb",
    tooltip: "Hint: It describes how the action is performed.",
  },
  {
    question: "Run to the store before it closes.",
    options: ["Noun", "Verb", "Adjective", "Adverb"],
    answer: "Verb",
    tooltip: "Hint: It denotes an action or state of being.",
  },
  {
    question: "The sky is so blue today.",
    options: ["Noun", "Verb", "Adjective", "Adverb"],
    answer: "Adjective",
    tooltip: "Hint: It modifies a noun by describing a quality.",
  },
  {
    question: "Define the word 'ephemeral.'",
    options: ["Permanent", "Temporary", "Eternal", "Infinite"],
    answer: "Temporary",
    tooltip: "Hint: It means lasting for a very short time.",
  },
  {
    question: "What does the term 'ubiquitous' mean?",
    options: ["Rare", "Everywhere", "Isolated", "Scattered"],
    answer: "Everywhere",
    tooltip:
      "Hint: It describes something present, appearing, or found everywhere.",
  },
];

let shuffledQuestions = [];

// Function to randomly select 5 questions from quizData and store it in shuffledQuestions array
function handleQuestions() {
  //the shuffledQuestions shuffles the question in the main data and randomIndex randomize index
  while (shuffledQuestions.length < 5) {
    const randomIndex = parseInt(Math.random() * quizData.length);

    const randomQuestion = quizData[randomIndex];
    if (!shuffledQuestions.includes(randomQuestion)) {
      shuffledQuestions.push(randomQuestion);
    }
  }
}

const quizContainer = document.getElementById("quiz");
const resultContainer = document.getElementById("result");
const submitButton = document.getElementById("submit");
const retryButton = document.getElementById("retry");
const showAnswerButton = document.getElementById("showAnswer");
const helpButton = document.getElementById("help");

let currentQuestionIndex = 0;
let userScore = 0;
let incorrectAnswersList = [];
let correctAnswersList = [];

// that Function is to shuffle the main array data or anyother array which is called on upper function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = parseInt(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// it displays the current question and its options and also progress number
function onHelpButtonClick() {
  const currentQuestionData = shuffledQuestions[currentQuestionIndex];
  alert(currentQuestionData.tooltip);

  // Remove the event listener after it has been triggered
  // helpButton.removeEventListener("click", onHelpButtonClick);
}
function displayQuestion() {
  const currentQuestionData = shuffledQuestions[currentQuestionIndex];
  document.querySelector("#count").innerText = `${currentQuestionIndex + 1}/5`;

  if (currentQuestionIndex === 4) {
    submitButton.textContent = "Finish";
  } else {
    submitButton.textContent = "Next Question";
  }
  //  helpButton.removeEventListener("click", onHelpButtonClick);
  helpButton.addEventListener("click", onHelpButtonClick);

  const questionElement = document.querySelector(".question");

  // Check if the element is found before trying to update its content
  if (questionElement) {
    questionElement.textContent = currentQuestionData.question;
  }

  const optionsElement = document.getElementsByClassName("options");

  const shuffledOptions = [...currentQuestionData.options];
  shuffleArray(shuffledOptions);

  for (let i = 0; i < shuffledOptions.length; i++) {
    const radioElement = document.getElementById(`option-${i}`);

    if (radioElement) {
      radioElement.type = "radio";
      radioElement.name = "quiz";
      radioElement.value = shuffledOptions[i];

      const existingLabel = document.getElementById(`option${i}`);

      if (existingLabel) {
        existingLabel.textContent = "";
        existingLabel.appendChild(radioElement);
        const optionText = document.createTextNode(shuffledOptions[i]);
        existingLabel.appendChild(optionText);
        existingLabel.appendChild(document.createElement("br"));
      }
    }
  }
}

// Function to check the user's answer and proceed to the next question
function checkAnswer() {
  // Find the selected option (the answer the user picked)
  const selectedOptionElement = document.querySelector(
    'input[name="quiz"]:checked'
  );

  // Check if an option is selected
  if (selectedOptionElement) {
    // Get the user's answer from the selected option
    const userAnswer = selectedOptionElement.value;

    // Check if the user's answer is correct
    if (userAnswer === shuffledQuestions[currentQuestionIndex].answer) {
      // Increase the user's score for a correct answer
      userScore++;

      // Store the question and answer in the correct answers list
      correctAnswersList.push({
        question: shuffledQuestions[currentQuestionIndex].question,
        answer: userAnswer,
      });
    } else {
      // If the answer is incorrect, store the details in the incorrect answers list
      incorrectAnswersList.push({
        question: shuffledQuestions[currentQuestionIndex].question,
        userAnswer: userAnswer,
        correctAnswer: shuffledQuestions[currentQuestionIndex].answer,
      });
    }

    // Move to the next question
    currentQuestionIndex++;

    // Uncheck the selected option for the next question
    selectedOptionElement.checked = false;

    // Check if there are more questions
    if (currentQuestionIndex < shuffledQuestions.length) {
      // If there are more questions, display the next question
      displayQuestion();
    } else {
      // If all questions are answered, display the final result
      displayResult();
    }
  }
}

// Function to display the final result
function displayResult() {
  quizContainer.style.display = "none";
  submitButton.style.display = "none";
  retryButton.style.display = "inline-block";
  showAnswerButton.style.display = "inline-block";
  helpButton.style.display = "none";
  document.querySelector("#count").innerText = ``;
  resultContainer.innerHTML = `You scored ${userScore} out of ${shuffledQuestions.length}! `;
}

// to reset the quiz for another attempt
function retryQuiz() {
  currentQuestionIndex = 0;
  userScore = 0;
  incorrectAnswersList = [];
  quizContainer.style.display = "block";
  submitButton.style.display = "inline-block";
  retryButton.style.display = "none";
  showAnswerButton.style.display = "none";
  resultContainer.innerHTML = "";
  shuffledQuestions = []; // Reset shuffledQuestions array
  handleQuestions();
  displayQuestion();
}

// Function to display correct answers for incorrect responses
function showAnswer() {
  let correctAnswersHtml = "";
  let incorrectAnswersHtml = "";

  for (let i = 0; i < incorrectAnswersList.length; i++) {
    incorrectAnswersHtml += `
        <p>
          <strong>Question:</strong> ${incorrectAnswersList[i].question}<br>
          <strong>Your Answer: </strong> ${incorrectAnswersList[i].userAnswer}<br>
          <strong>Correct Answer: </strong> ${incorrectAnswersList[i].correctAnswer}
        </p>
      `;
  }

  for (let i = 0; i < correctAnswersList.length; i++) {
    correctAnswersHtml += `
        <p>
          <strong>Question: </strong> ${correctAnswersList[i].question}<br>
          <strong>Your Correct Answer: </strong> ${correctAnswersList[i].answer}<br>
          
      `;
  }

  // Save the result in local storage to retrieve it on summary.html
  localStorage.setItem(
    "quizResult",
    JSON.stringify({
      userScore,
      totalQuestions: shuffledQuestions.length,
      incorrectAnswersHtml,
      correctAnswersHtml,
    })
  );

  // Redirect to summary.html
  window.location.href = "summary.html";
}

// Event listeners for buttons
submitButton.addEventListener("click", checkAnswer);
retryButton.addEventListener("click", retryQuiz); // this is for retry quiz
showAnswerButton.addEventListener("click", showAnswer);

// intial setup
handleQuestions();
displayQuestion();
