class HeartRateScorerSettings {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty;
    }

    getDefaults() {
        let lowerBound, upperBound, multiplier;

        switch (this.difficulty) {
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

class HeartRateScorer {
    constructor(goalHeartRate, difficulty = 'medium') {
        this.goalHeartRate = goalHeartRate;
        this.difficulty = difficulty;
        this.multiplier = this.getMultiplier();
        this.lowerBound = this.getLowerBound();
        this.upperBound = this.getUpperBound();
    }

    getMultiplier() {
        switch (this.difficulty) {
            case 'hard':
                return 1.05;
            case 'medium':
                return 1.025;
            case 'easy':
            default:
                return 1;
        }
    }

    getLowerBound() {
        switch (this.difficulty) {
            case 'easy':
                return 0.50;
            case 'medium':
                return 0.65;
            case 'hard':
                return 0.50;
            default:
                throw new Error('Invalid difficulty level');
        }
    }

    getUpperBound() {
        switch (this.difficulty) {
            case 'easy':
                return 1.35;
            case 'medium':
                return 1.15;
            case 'hard':
                return 1.05;
            default:
                throw new Error('Invalid difficulty level');
        }
    }

    baseScore(averageHeartRate) {
        const a = 100;  // Base maximum score
        const c = (this.upperBound - this.goalHeartRate) / 3;

        if (averageHeartRate < this.lowerBound || averageHeartRate > this.upperBound) {
            return 0;
        }

        return a * Math.exp(-Math.pow(averageHeartRate - this.goalHeartRate, 2) / (2 * Math.pow(c, 2)));
    }

    finalScore(averageHeartRate) {
        return Math.round(this.baseScore(averageHeartRate) * this.multiplier);
    }
}
