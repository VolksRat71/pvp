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
    constructor(age, goalHeartRateStart, difficulty) {
        this.age = age || 30;
        this.difficulty = difficulty || 'medium';
        this.MHR = this.calculateMHR();
        this.recommendedRange = this.getRecommendedHeartRateRange();
        this.goalHeartRateStart = this.validateGoalHeartRateStart(goalHeartRateStart || 0);
        this.targetRange = this.calculateTargetRange();
    }

    calculateMHR() {
        return 206.9 - (0.67 * this.age);
    }

    getRecommendedHeartRateRange() {
        const zone2Start = this.MHR * 0.60;
        const zone2End = this.MHR * 0.70;
        return { start: zone2Start, end: zone2End };
    }

    validateGoalHeartRateStart(start) {
        const maxPossibleEnd = start + this.getDifficultyRangeWidth();
        if (maxPossibleEnd > this.MHR) {
            return this.MHR - this.getDifficultyRangeWidth();
        }
        return start;
    }

    calculateTargetRange() {
        const width = this.getDifficultyRangeWidth();
        return {
            start: this.goalHeartRateStart,
            end: this.goalHeartRateStart + width
        };
    }


    baseScore(averageHeartRate) {
        const a = this.getMaximumScore();
        const c = (this.targetRange.end - this.targetRange.start) / 3;

        if (averageHeartRate < this.targetRange.start || averageHeartRate > this.targetRange.end) {
            return a / 2 * Math.exp(-Math.pow(averageHeartRate - this.targetRange.start, 2) / (2 * Math.pow(c, 2)));
        }

        return a;
    }

    finalScore(averageHeartRate) {
        return Math.round(this.baseScore(averageHeartRate));
    }

    getDifficultyRangeWidth() {
        switch (this.difficulty) {
            case 'hard':
                return 10;  // Narrowest range
            case 'medium':
                return 15;
            case 'easy':
            default:
                return 20;  // Widest range
        }
    }

}

