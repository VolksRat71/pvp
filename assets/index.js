// Constants and Global Variables
let ageInputChanged = false;
let rangeValidationResult = false;
const entries = JSON.parse(localStorage.getItem('entries') || '[]');
let currentSettings = {
    easy: { lowerBound: 0.5, upperBound: 1.35, maxScore: 90 },
    medium: { lowerBound: 0.65, upperBound: 1.15, maxScore: 95 },
    hard: { lowerBound: 0.85, upperBound: 1.1, maxScore: 100 }
};

// Event Listeners
document.getElementById('difficulty').addEventListener('change', updateRangeHint);
document.getElementById('age').addEventListener('change', updateRangeHint);
document.getElementById('scorerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    calculateFinalScore();
});
document.getElementById('age').addEventListener('input', updateGoalHeartRateRangeEnd);
document.getElementById('goalHeartRateStart').addEventListener('input', updateGoalHeartRateRangeEnd);
document.getElementById('difficulty').addEventListener('input', updateGoalHeartRateRangeEnd);
document.getElementById('age').addEventListener('input', function() {
    ageInputChanged = true;
    debouncedValidation();
});


function updateGoalHeartRateRangeEnd() {
    const age = parseFloat(document.getElementById('age').value);
    const goalHeartRateStart = parseFloat(document.getElementById('goalHeartRateStart').value);
    const difficulty = document.getElementById('difficulty').value;

    // Check if the required fields have values
    if (!isNaN(age) && !isNaN(goalHeartRateStart) && difficulty) {
        const scorer = new HeartRateScorer(age, goalHeartRateStart, difficulty);
        document.getElementById('goalHeartRateEnd').value = scorer.targetRange.end.toFixed(0);
    } else {
        document.getElementById('goalHeartRateEnd').value = '';
    }
}

// Functions
function updateRangeHint() {
    const difficulty = document.getElementById('difficulty').value;
    const age = parseFloat(document.getElementById('age').value) || 25;  // Default age if not provided
    const goalHeartRateStart = parseFloat(document.getElementById('goalHeartRateStart').value);


    const scorer = new HeartRateScorer(age, goalHeartRateStart, difficulty); // Using goalStart for this instance

    // Set placeholders for the recommended heart rate range
    const {start, end} = scorer.getRecommendedHeartRateRange(age);

    document.getElementById('goalHeartRateStart').placeholder = start.toFixed(0);
    document.getElementById('goalHeartRateEnd').placeholder = end.toFixed(0);

    // Calculate and display the actual target range based on the difficulty and entered goal start
    const targetRange = scorer.calculateTargetRange();

    document.getElementById('rangeHint').textContent = `(${targetRange.start.toFixed(2)} to ${targetRange.end.toFixed(2)})`;

    // Display the difficulty hint
    const lowerBoundPercentage = (1 - currentSettings[difficulty].lowerBound) * 100;
    const upperBoundPercentage = (currentSettings[difficulty].upperBound - 1) * 100;
    const difficultyHint = `${lowerBoundPercentage.toFixed(2)}% under to ${upperBoundPercentage.toFixed(2)}% over`;
    document.getElementById('difficultyHint').textContent = difficultyHint;
}

function validateGoalHeartRateStart() {
    const age = parseFloat(document.getElementById('age').value) || 25;
    const difficulty = document.getElementById('difficulty').value;
    let goalHeartRateStart = parseFloat(document.getElementById('goalHeartRateStart').value);

    const scorer = new HeartRateScorer(age, goalHeartRateStart, difficulty);

    const minHint = document.getElementById('minHeartRateHint');
    const maxHint = document.getElementById('maxHeartRateHint');

    // Reset classes
    minHint.classList.remove('text-danger');
    maxHint.classList.remove('text-danger');
    minHint.classList.add('text-muted');
    maxHint.classList.add('text-muted');
    rangeValidationResult = true;

    // Set hints to default values
    minHint.textContent = `Minimum safe heart rate: ${scorer.minimumSafeHeartRate().toFixed(0)}`;
    maxHint.textContent = `Maximum heart rate: ${scorer.MHR.toFixed(0)}`;

    if(goalHeartRateStart !== null || goalHeartRateStart !== undefined) {
        if (goalHeartRateStart + scorer.getDifficultyRangeWidth() > scorer.MHR) {
            rangeValidationResult = false;
            maxHint.textContent = `Your input is too high! Maximum heart rate: ${scorer.MHR.toFixed(0)}`;
            maxHint.classList.remove('text-muted');
            maxHint.classList.add('text-danger');
        } else if (goalHeartRateStart < scorer.minimumSafeHeartRate()) {
            rangeValidationResult = false;
            minHint.textContent = `Your input is too low! Minimum safe heart rate: ${scorer.minimumSafeHeartRate().toFixed(0)}`;
            minHint.classList.remove('text-muted');
            minHint.classList.add('text-danger');
        }
    }

    document.getElementById('goalHeartRateEnd').value = (goalHeartRateStart + scorer.getDifficultyRangeWidth()).toFixed(0);
}

function initRangeHint() {
    const age = parseFloat(document.getElementById('age').value) || 25;
    const difficulty = document.getElementById('difficulty').value;
    let goalHeartRateStart = parseFloat(document.getElementById('goalHeartRateStart').value) || 0;

    const scorer = new HeartRateScorer(age, goalHeartRateStart, difficulty);
    const minHint = document.getElementById('minHeartRateHint');
    const maxHint = document.getElementById('maxHeartRateHint');

    minHint.textContent = `Minimum safe heart rate: ${scorer.minimumSafeHeartRate().toFixed(0)}`;
    maxHint.textContent = `Maximum heart rate: ${scorer.MHR.toFixed(0)}`;
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}


const debouncedValidation = debounce(validateGoalHeartRateStart, 1500);

function checkFormCompletion() {
    const age = parseFloat(document.getElementById('age').value);
    const goalHeartRateStart = parseFloat(document.getElementById('goalHeartRateStart').value);
    const difficulty = document.getElementById('difficulty').value;
    const calculateButton = document.getElementById('calculateButton');

    // Check if all form fields are filled out
    if (!isNaN(age) && !isNaN(goalHeartRateStart) && difficulty) {
        calculateButton.disabled = false && !rangeValidationResult;
    } else {
        calculateButton.disabled = true && !rangeValidationResult;
    }
}


function calculateFinalScore() {
    const difficulty = document.getElementById('difficulty').value;
    const age = parseFloat(document.getElementById('age').value) || 25;  // Default age if not provided
    const entries = JSON.parse(localStorage.getItem('entries') || '[]');
    const goalStart = parseFloat(document.getElementById('goalHeartRateStart').value);
    const goalEnd = goalStart + new HeartRateScorer(age, goalStart, difficulty).getDifficultyRangeWidth();
    const average = parseFloat(document.getElementById('averageHeartRate').value);
    const score = new HeartRateScorer(age, goalStart, difficulty).finalScore(average);

    storeFormData();

    entries.push({
        date: new Date().toLocaleString(),
        goal: `${goalStart} - ${goalEnd}`,
        average: average,
        score: score,
        difficulty: difficulty
    });
    localStorage.setItem('entries', JSON.stringify(entries));

    // Update the displayed entries
    displayEntries();
}

function displayEntries() {
    const entries = JSON.parse(localStorage.getItem('entries') || '[]');
    const table = document.getElementById('entriesTable');
    table.innerHTML = '';
    let totalScore = 0;

    entries.forEach((entry, index) => {
        totalScore += entry.score;

        const row = table.insertRow();
        row.insertCell(0).innerHTML = entry.date;
        row.insertCell(1).innerHTML = entry.goal;
        row.insertCell(2).innerHTML = entry.average;
        row.insertCell(3).innerHTML = entry.score;
        row.insertCell(4).innerHTML = entry.difficulty;
        row.insertCell(5).innerHTML = `<button onclick="deleteEntry(${index})">Delete</button>`;
    });

    document.getElementById('totalScore').innerText = totalScore;
}

function storeFormData() {
    const formData = {
        age: document.getElementById('age').value,
        goalHeartRateStart: document.getElementById('goalHeartRateStart').value,
        difficulty: document.getElementById('difficulty').value
    };

    localStorage.setItem('recentFormData', JSON.stringify(formData));
}

function prefillForm() {
    const storedData = JSON.parse(localStorage.getItem('recentFormData'));

    if (storedData) {
        document.getElementById('age').value = storedData.age;
        document.getElementById('goalHeartRateStart').value = storedData.goalHeartRateStart;
        document.getElementById('difficulty').value = storedData.difficulty;
        updateRangeHint();  // To reflect the changes in goal heart rate start and age
    }
}

function deleteEntry(index) {
    const entries = JSON.parse(localStorage.getItem('entries') || '[]');
    entries.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(entries));
    displayEntries();
}

// Initial setup
updateRangeHint();
displayEntries();
checkFormCompletion()
initRangeHint()
prefillForm();
