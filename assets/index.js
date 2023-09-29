
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

    // ... (Rest of your HeartRateScorer class here)
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
    // ... (Existing calculateFinalScore function here)
}

function displayDefaults() {
    // ... (Existing displayDefaults function here)
}

function saveOverrides() {
    // ... (Existing saveOverrides function here)
}

function displayConfigurations() {
    // ... (Existing displayConfigurations function here)
}

function deleteConfiguration(index) {
    // ... (Existing deleteConfiguration function here)
}

// On page load, set form defaults from local storage and display entries
window.onload = function() {
    // ... (Existing window.onload logic here)
};
