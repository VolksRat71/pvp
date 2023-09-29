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
    constructor(goalHeartRate, difficulty = 'medium', age = 30, gender = 'male', height = 170, weight = 70) {
        this.age = age;
        this.gender = gender;
        this.height = height;
        this.weight = weight;
        this.difficulty = difficulty;
        this.MHR = this.calculateMHR();
        this.targetRange = this.calculateTargetRange();
        this.goalHeartRate = goalHeartRate || this.targetRange.center;
    }

    getLowerBound(goal = this.goalHeartRate) {
        switch (this.difficulty) {
            case 'easy':
                return goal * 0.50;
            case 'medium':
                return goal * 0.65;
            case 'hard':
                return goal * 0.85;
            default:
                throw new Error('Invalid difficulty level');
        }
    }

    getUpperBound(goal = this.goalHeartRate) {
        switch (this.difficulty) {
            case 'easy':
                return goal * 1.35;
            case 'medium':
                return goal * 1.15;
            case 'hard':
                return goal * 1.10;
            default:
                throw new Error('Invalid difficulty level');
        }
    }

    getRecommendedHeartRateRange(age) {
        const maxHeartRate = 220 - age;
        const minZone2 = maxHeartRate * 0.60;  // Zone 2 starts from 60% of Max HR
        const maxZone2 = maxHeartRate * 0.70;  // Zone 2 ends at 70% of Max HR
        return [minZone2, maxZone2];
    }

    calculateMHR() {
        return 206.9 - (0.67 * this.age);
    }

    calculateTargetRange() {
        const zone2Start = this.MHR * 0.60;
        const zone2End = this.MHR * 0.70;

        let width;
        switch (this.difficulty) {
            case 'hard':
                width = 10;  // Narrowest range
                break;
            case 'medium':
                width = 15;
                break;
            case 'easy':
            default:
                width = 20;  // Widest range
                break;
        }

        return {
            start: this.goalHeartRate,
            end: this.goalHeartRate + width,
            center: this.goalHeartRate + width / 2
        };
    }

    baseScore(averageHeartRate) {
        const a = this.getMaximumScore();
        const c = (this.targetRange.end - this.targetRange.center) / 3;

        if (averageHeartRate < 0.5 * this.MHR || averageHeartRate > this.MHR) {
            return 0;
        }

        return a * Math.exp(-Math.pow(averageHeartRate - this.targetRange.center, 2) / (2 * Math.pow(c, 2)));
    }

    getMaximumScore() {
        switch (this.difficulty) {
            case 'hard':
                return 100;
            case 'medium':
                return 95;
            case 'easy':
            default:
                return 90;
        }
    }

    finalScore(averageHeartRate) {
        return Math.round(this.baseScore(averageHeartRate));
    }
}

