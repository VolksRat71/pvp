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

    getDifficultySettings() {
        const defaultSettings = {
            easy: {
                lowerBoundPercentage: 0.50,
                upperBoundPercentage: 1.35,
                width: 20,
                maxScore: 90
            },
            medium: {
                lowerBoundPercentage: 0.65,
                upperBoundPercentage: 1.15,
                width: 15,
                maxScore: 95
            },
            hard: {
                lowerBoundPercentage: 0.85,
                upperBoundPercentage: 1.10,
                width: 10,
                maxScore: 100
            }
        };

        // Check for overrides in local storage
        const overrides = JSON.parse(localStorage.getItem(this.difficulty) || '{}');
        return { ...defaultSettings[this.difficulty], ...overrides };
    }

    calculateMHR() {
        return 206.9 - (0.67 * this.age);
    }

    minimumSafeHeartRate() {
        return 0.50 * this.MHR;
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
            start: parseFloat(this.goalHeartRateStart),
            end: parseFloat(this.goalHeartRateStart) + width
        };
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

    baseScore(averageHeartRate) {
        const a = this.getMaximumScore();
        const c = (this.targetRange.end - this.targetRange.start) / 3;

        if (averageHeartRate < this.targetRange.start) {
            // Curve from 0 to max score
            return a * Math.exp(-Math.pow(averageHeartRate - this.targetRange.start, 2) / (2 * Math.pow(c, 2)));
        } else if (averageHeartRate <= this.targetRange.end) {
            // Within target range, full score
            return a;
        } else {
            // Curve from max score to 0
            return a - (a * Math.exp(-Math.pow(averageHeartRate - this.targetRange.end, 2) / (2 * Math.pow(c, 2))));
        }
    }

    finalScore(averageHeartRate) {
        const score = this.baseScore(averageHeartRate);
        return score < 0.5 ? 0 : Math.round(score);
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

