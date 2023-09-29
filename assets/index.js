class HeartRateScorer {
    constructor(goalHeartRate, difficulty = 'medium') {
        this.goalHeartRate = goalHeartRate;
        this.difficulty = difficulty;
        this.multiplier = this.getMultiplier();
    }

    getMultiplier() {
        switch(this.difficulty) {
            case 'hard':
                return 1.05;
            case 'medium':
                return 1.025;
            case 'easy':
            default:
                return 1;
        }
    }

    baseScore(averageHeartRate) {
        const a = 100;
        let lowerBound, upperBound, c;

        switch(this.difficulty) {
            case 'easy':
                lowerBound = this.goalHeartRate * 0.70;
                upperBound = this.goalHeartRate * 1.10;
                c = (upperBound - this.goalHeartRate) / 3;
                break;
            case 'medium':
                lowerBound = this.goalHeartRate * 0.80;
                upperBound = this.goalHeartRate * 1.05;
                c = (upperBound - this.goalHeartRate) / 3;
                break;
            case 'hard':
                lowerBound = this.goalHeartRate * 0.90;
                upperBound = this.goalHeartRate * 1.025;
                c = (upperBound - this.goalHeartRate) / 3;
                break;
            default:
                throw new Error('Invalid difficulty level');
        }

        if (averageHeartRate < lowerBound || averageHeartRate > upperBound) {
            return 0;
        }

        return a * Math.exp(-Math.pow(averageHeartRate - this.goalHeartRate, 2) / (2 * Math.pow(c, 2)));
    }

    finalScore(averageHeartRate) {
        return Math.round(this.baseScore(averageHeartRate) * this.multiplier);
    }
}

class HeartRateScorerSettings {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty;
    }

    getDefaults() {
        let lowerBound, upperBound, multiplier;

        switch(this.difficulty) {
            case 'easy':
                lowerBound = 0.70;
                upperBound = 1.10;
                multiplier = 1;
                break;
            case 'medium':
                lowerBound = 0.80;
                upperBound = 1.05;
                multiplier = 1.025;
                break;
            case 'hard':
                lowerBound = 0.90;
                upperBound = 1.025;
                multiplier = 1.05;
                break;
            default:
                throw new Error('Invalid difficulty level');
        }

        return {
            lowerBound: lowerBound,
            upperBound: upperBound,
            multiplier: multiplier
        };
    }
}

function calculateFinalScore() {
    const goal = parseFloat(document.getElementById('goalHeartRate').value);
    const average = parseFloat(document.getElementById('averageHeartRate').value);
    const difficulty = document.getElementById('difficulty').value;
    const scorer = new HeartRateScorer(goal, difficulty);
    const score = scorer.finalScore(average);

    document.getElementById('scoreOutput').innerText = score;

    // Save goal, average, and other details to local storage
    const entries = JSON.parse(localStorage.getItem('entries') || '[]');
    entries.push({
        date: new Date().toLocaleString(),
        goal: goal,
        average: average,
        score: score,
        multiplier: scorer.multiplier,
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
        row.insertCell(4).innerHTML = entry.multiplier;
        row.insertCell(5).innerHTML = entry.difficulty;
        row.insertCell(6).innerHTML = `<button onclick="deleteEntry(${index})">Delete</button>`;
    });
    document.getElementById('totalScore').innerText = totalScore;
}

function deleteEntry(index) {
    const entries = JSON.parse(localStorage.getItem('entries') || '[]');
    entries.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(entries));
    displayEntries();
}

function displayDefaults() {
    const difficulty = document.getElementById('difficulty').value;
    const scorer = new HeartRateScorerSettings(difficulty);
    const defaults = scorer.getDefaults();

    // Check for overrides in local storage
    const overrides = JSON.parse(localStorage.getItem(difficulty) || '{}');
    const lowerBound = overrides.lowerBound || defaults.lowerBound;
    const upperBound = overrides.upperBound || defaults.upperBound;
    const multiplier = overrides.multiplier || defaults.multiplier;

    document.getElementById('defaultLowerBound').textContent = ((1 - lowerBound) * 100).toFixed(2);
    document.getElementById('defaultUpperBound').textContent = ((upperBound - 1) * 100).toFixed(2);
    document.getElementById('defaultMultiplier').textContent = ((multiplier - 1) * 100).toFixed(2);
}

function saveOverrides() {
    const difficulty = document.getElementById('difficulty').value;
    const lowerBound = 1 - parseFloat(document.getElementById('overrideLowerBound').value) / 100;
    const upperBound = 1 + parseFloat(document.getElementById('overrideUpperBound').value) / 100;
    const multiplier = 1 + parseFloat(document.getElementById('overrideMultiplier').value) / 100;

    // Save the overrides to local storage
    const overrides = {
        lowerBound: lowerBound,
        upperBound: upperBound,
        multiplier: multiplier
    };

    localStorage.setItem(difficulty, JSON.stringify(overrides));

    // Refresh the displayed defaults
    displayDefaults();
}

function displayConfigurations() {
    const configurations = JSON.parse(localStorage.getItem('configurations') || '[]');
    const table = document.getElementById('configurationsTable');
    table.innerHTML = '';
    configurations.forEach((config, index) => {
        const row = table.insertRow();
        row.insertCell(0).innerHTML = config.difficulty;
        row.insertCell(1).innerHTML = ((1 - config.lowerBound) * 100).toFixed(2);
        row.insertCell(2).innerHTML = ((config.upperBound - 1) * 100).toFixed(2);
        row.insertCell(3).innerHTML = ((config.multiplier - 1) * 100).toFixed(2);
        row.insertCell(4).innerHTML = `<button onclick="deleteConfiguration(${index})">Delete</button>`;
    });
}

function deleteConfiguration(index) {
    const configurations = JSON.parse(localStorage.getItem('configurations') || '[]');
    configurations.splice(index, 1);
    localStorage.setItem('configurations', JSON.stringify(configurations));
    displayConfigurations();
}

// On page load, set form defaults from local storage and display entries
window.onload = function() {
    displayDefaults();
    displayConfigurations();
    displayEntries();
};
