
function calculateScore(goal, average, difficulty) {
    // Check for overrides in local storage
    const overrides = JSON.parse(localStorage.getItem(difficulty) || '{}');
    const scorer = new HeartRateScorer(goal, difficulty, overrides);
    return scorer.finalScore(average);
}

function calculateFinalScore() {
    const entries = JSON.parse(localStorage.getItem('entries') || '[]');
    const goal = parseFloat(document.getElementById('goalHeartRate').value);
    const average = parseFloat(document.getElementById('averageHeartRate').value);
    const difficulty = document.getElementById('difficulty').value;
    const score = calculateScore(goal, average, difficulty);
    const scorer = new HeartRateScorer(goal, difficulty);
    const lowerBoundPercentage = (1 - scorer.lowerBound) * 100;
    const upperBoundPercentage = (scorer.upperBound - 1) * 100;

    entries.push({
        date: new Date().toLocaleString(),
        goal: goal,
        average: average,
        score: score,
        multiplier: scorer.multiplier,
        difficulty: difficulty,
        lowerBound: lowerBoundPercentage.toFixed(2) + '%',
        upperBound: upperBoundPercentage.toFixed(2) + '%'
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

        // Create an instance of HeartRateScorerSettings to get the bounds
        const settings = new HeartRateScorerSettings(entry.difficulty);
        const defaults = settings.getDefaults();
        const scorer = new HeartRateScorer(entry.goal, entry.difficulty);
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
    const scorer = new HeartRateScorer(goal, difficulty);
    const lowerBoundPercentage = (1 - scorer.lowerBound) * 100;
    const upperBoundPercentage = (scorer.upperBound - 1) * 100;

    entries.push({
        date: new Date().toLocaleString(),
        goal: goal,
        average: average,
        score: score,
        multiplier: scorer.multiplier,
        difficulty: difficulty,
        lowerBound: lowerBoundPercentage.toFixed(2) + '%',
        upperBound: upperBoundPercentage.toFixed(2) + '%'
    });
    localStorage.setItem('entries', JSON.stringify(entries));
    displayEntries();
}



// On page load, set form defaults from local storage and display entries
window.onload = function () {

    if (document.getElementById('entriesTable')) {
        displayEntries();
    }
};
