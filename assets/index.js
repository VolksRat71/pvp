// Constants and Global Variables
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

function checkFormCompletion() {
    const age = parseFloat(document.getElementById('age').value);
    const goalHeartRateStart = parseFloat(document.getElementById('goalHeartRateStart').value);
    const difficulty = document.getElementById('difficulty').value;

    const calculateButton = document.getElementById('calculateButton');

    // Check if all form fields are filled out
    if (!isNaN(age) && !isNaN(goalHeartRateStart) && difficulty) {
        calculateButton.disabled = false;
    } else {
        calculateButton.disabled = true;
    }
}


function calculateFinalScore() {
    const difficulty = document.getElementById('difficulty').value;
    const age = parseFloat(document.getElementById('age').value) || 25;
    const goalStart = parseFloat(document.getElementById('goalHeartRateStart').value);
    const average = parseFloat(document.getElementById('averageHeartRate').value);

    const scorer = new HeartRateScorer(goalStart, difficulty, age);
    const score = scorer.finalScore(average)

    // Update and store the entries
    entries.push({
        date: new Date().toLocaleString(),
        goal: `${goalStart} - ${goalEnd}`,
        average: average,
        score: score,
        difficulty: difficulty
    });
    localStorage.setItem('entries', JSON.stringify(entries));

    displayEntries();
}

function displayEntries() {
    const entries = JSON.parse(localStorage.getItem('entries') || '[]');
    const table = document.getElementById('entriesTable');
    table.innerHTML = '';
    let totalScore = 0;
    entries.forEach((entry, index) => {
        totalScore += entry.score;

        // Create an instance of HeartRateScorerSettings to get the bounds
        const settings = new HeartRateScorerSettings(entry.difficulty);
        const defaults = settings.getDefaults();
        const scorer = new HeartRateScorer(entry.goal, entry.difficulty, );
        const lowerBoundPercentage = (1 - scorer.lowerBound) * 100; // Convert to percentage under
        const upperBoundPercentage = (scorer.upperBound - 1) * 100; // Convert to percentage over

        const row = table.insertRow();
        row.insertCell(0).innerHTML = entry.date;
        row.insertCell(1).innerHTML = entry.goal;
        row.insertCell(2).innerHTML = entry.average;
        row.insertCell(3).innerHTML = entry.score;
        row.insertCell(4).innerHTML = entry.multiplier;
        row.insertCell(5).innerHTML = entry.difficulty;
        row.insertCell(6).innerHTML = lowerBoundPercentage.toFixed(2) + '%';  // Display as percentage
        row.insertCell(7).innerHTML = upperBoundPercentage.toFixed(2) + '%';  // Display as percentage
        row.insertCell(8).innerHTML = `<button onclick="deleteEntry(${index})">Delete</button>`;
    });
    document.getElementById('totalScore').innerText = totalScore;
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
