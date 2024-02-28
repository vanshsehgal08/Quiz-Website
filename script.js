document.addEventListener("DOMContentLoaded", function () {
    const createQuizButton = document.getElementById("createQuizButton");
    const addQuestionButton = document.getElementById("addQuestionButton");
    const createQuizForm = document.getElementById("createQuizForm");
    const quizContainer = document.getElementById("quiz");
    const submitQuizButton = document.getElementById("submitQuizButton");
    const quizLinkContainer = document.getElementById("quizLink");
    const resultContainer = document.getElementById("result");
    const resultContainerUser2 = document.getElementById("resultUser2");
    const submitButtonUser2 = document.getElementById("submitUser2");
    let questionCounter = 1;
    let quizData;

    addQuestionButton.addEventListener("click", function () {
        questionCounter++;
        const questionInputs = document.getElementById("questionInputs");
        const newQuestionDiv = document.createElement("div");
        newQuestionDiv.className = "questionInput";
        newQuestionDiv.innerHTML = `
        <label for="question${questionCounter}">Question ${questionCounter}:</label>
        <input type="text" id="question${questionCounter}" required>
        <label for="option${questionCounter}-1">Option 1:</label>
        <input type="text" id="option${questionCounter}-1" required>
        <label for="option${questionCounter}-2">Option 2:</label>
        <input type="text" id="option${questionCounter}-2" required>
        <label for="option${questionCounter}-3">Option 3:</label>
        <input type="text" id="option${questionCounter}-3" required>
        <label for="option${questionCounter}-4">Option 4:</label>
        <input type="text" id="option${questionCounter}-4" required>
        <label for="correctAnswer${questionCounter}">Correct Answer:</label>
        <select id="correctAnswer${questionCounter}" required>
            <option value="option${questionCounter}-1">Option 1</option>
            <option value="option${questionCounter}-2">Option 2</option>
            <option value="option${questionCounter}-3">Option 3</option>
            <option value="option${questionCounter}-4">Option 4</option>
        </select>
        `;
        questionInputs.appendChild(newQuestionDiv);
    });

    createQuizButton.addEventListener("click", function () {
        quizContainer.innerHTML = "";
        submitQuizButton.style.display = "block";
        if (submitButtonUser2) {
            submitButtonUser2.style.display = "none";
        }

        createQuizForm.style.display = "block";
        resultContainer.style.display = "none";
        resultContainerUser2.style.display = "none";
    });

    submitQuizButton.addEventListener("click", function () {
        quizData = getQuizData();
        const quizLink = generateQuizLink(quizData);
        quizLinkContainer.innerHTML = `<p>Quiz Link: <a href="${quizLink}" target="_blank">${quizLink}</a></p>`;
    });

    function getQuizData() {
        const quizData = [];
        const questionInputs = document.getElementsByClassName("questionInput");

        for (let i = 0; i < questionInputs.length; i++) {
            const questionInput = questionInputs[i];
            const question = questionInput.querySelector(
                `#question${i + 1}`
            ).value;
            const options = [];
            for (let j = 1; j <= 4; j++) {
                options.push(
                    questionInput.querySelector(`#option${i + 1}-${j}`).value
                );
            }
            const correctAnswer = questionInput.querySelector(
                `#correctAnswer${i + 1}`
            ).value;
            quizData.push({ question, options, answer: correctAnswer });
        }

        return quizData;
    }

    function generateQuizLink(quizData) {
        const encodedQuizData = encodeURIComponent(JSON.stringify(quizData));
        const quizID = Date.now();
        const quizLink = `${
            window.location.href.split("?")[0]
        }?quizid=${quizID}&data=${encodedQuizData}`;
        return quizLink;
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function displayQuiz(quizData) {
        quizContainer.innerHTML = "";
        window.quizData = quizData;

        quizData.forEach(function (questionData, index) {
            const questionElement = document.createElement("div");
            questionElement.className = "question";
            questionElement.textContent = `${index + 1}. ${
                questionData.question
            }`;

            const optionsElement = document.createElement("div");
            optionsElement.className = "options";

            questionData.options.forEach(function (option, optionIndex) {
                const optionLabel = document.createElement("label");
                optionLabel.className = "option";

                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = `question${index + 1}`;
                radio.value = `option${index + 1}${"-" + (optionIndex + 1)}`;
                radio.id = `option${index + 1}${"-" + (optionIndex + 1)}`;

                const optionText = document.createTextNode(option);

                optionLabel.appendChild(radio);
                optionLabel.appendChild(optionText);
                optionsElement.appendChild(optionLabel);
            });

            quizContainer.appendChild(questionElement);
            quizContainer.appendChild(optionsElement);
        });

        quizContainer.style.display = "block";
        submitQuizButton.style.display = "none";
        resultContainer.style.display = "none";
        resultContainerUser2.style.display = "none";
        const submitButtonUser2 = document.getElementById("submitUser2");
        if (submitButtonUser2) {
            submitButtonUser2.style.display = "block";
        }
    }

    const quizDataParam = getParameterByName("data");
    if (quizDataParam) {
        const quizDataUser2 = JSON.parse(decodeURIComponent(quizDataParam));
        displayQuiz(quizDataUser2);
    }

    function submitQuizUser2() {
        let scoreUser2 = 0;

        const urlParams = new URLSearchParams(window.location.search);
        const quizDataParam = urlParams.get("data");

        if (!quizDataParam) {
            console.error("Quiz data is not available.");
            return;
        }

        const quizData = JSON.parse(decodeURIComponent(quizDataParam));

        quizData.forEach(function (questionData, index) {
            const questionSelection = document.querySelector(
                `input[name="question${index + 1}"]:checked`
            );

            if (questionSelection) {
                const selectedValue = questionSelection.value;
                const correctAnswer = questionData.answer;
                console.log("Selected value:", selectedValue);
                console.log("Correct answer:", correctAnswer);
                if (selectedValue === correctAnswer) {
                    scoreUser2++;
                }
            } else {
                console.log("No option selected for question", index + 1);
            }
        });

        console.log("Score User 2:", scoreUser2);

        resultContainerUser2.textContent = `You scored ${scoreUser2} out of ${quizData.length}!`;
        resultContainerUser2.style.display = "block";
    }

    const submitQuizButtonUser2 = document.getElementById("submitUser2");
    if (submitQuizButtonUser2) {
        submitQuizButtonUser2.addEventListener("click", submitQuizUser2);
    }
});
