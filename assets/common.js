class HeartRateScorer {
    constructor(age, goalHeartRateStart, difficulty) {
        this.age = age || 30;
        this.difficulty = difficulty || 'medium';
        this.MHR = this.calculateMHR();
        this.recommendedRange = this.getRecommendedHeartRateRange();
        this.settings = this.getDifficultySettings();
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

    getAllDifficultySettings() {
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

        // Merge with overrides from local storage for each difficulty
        for (let difficulty in defaultSettings) {
            const overrides = JSON.parse(localStorage.getItem(difficulty) || '{}');
            defaultSettings[difficulty] = { ...defaultSettings[difficulty], ...overrides };
        }

        return defaultSettings;
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
        const maxPossibleEnd = start + this.settings.width;
        if (maxPossibleEnd > this.MHR) {
            return this.MHR - this.settings.width;
        }
        return start;
    }

    calculateTargetRange() {
        return {
            start: parseFloat(this.goalHeartRateStart),
            end: parseFloat(this.goalHeartRateStart) + this.settings.width
        };
    }

    generateCurveData() {
        // Retrieve all difficulty settings
        const allSettings = this.getAllDifficultySettings();

        // Calculate the lower and upper bounds for each difficulty
        let minLowerBound = Infinity;
        let maxUpperBound = -Infinity;

        for (let difficulty in allSettings) {
            const currentLowerBound = this.goalHeartRateStart * allSettings[difficulty].lowerBoundPercentage;
            const currentUpperBound = (this.goalHeartRateStart + allSettings[difficulty].width) * allSettings[difficulty].upperBoundPercentage;

            if (currentLowerBound < minLowerBound) {
                minLowerBound = currentLowerBound;
            }

            if (currentUpperBound > maxUpperBound) {
                maxUpperBound = currentUpperBound;
            }
        }

        const step = 1; // Define the step size for the x-axis values

        let x = [];
        let y = [];

        // Ensure key points are included in the x-axis values
        const keyPoints = [minLowerBound, this.targetRange.start, this.targetRange.end, maxUpperBound];

        for (let heartRate = minLowerBound; heartRate <= maxUpperBound; heartRate += step) {
            x.push(heartRate);
            y.push(this.baseScore(heartRate));
        }

        // Ensure all key points are present in the x-axis values
        for (let point of keyPoints) {
            if (!x.includes(point)) {
                x.push(point);
                y.push(this.baseScore(point));
            }
        }

        // Sort x and y arrays based on x values
        const combined = x.map((value, index) => ({ x: value, y: y[index] }));
        combined.sort((a, b) => a.x - b.x);

        return {
            x: combined.map(item => item.x),
            y: combined.map(item => item.y)
        };
    }

    baseScore(averageHeartRate) {
        const lowerBound = this.goalHeartRateStart * this.settings.lowerBoundPercentage;
        const upperBound = (this.goalHeartRateStart + this.settings.width) * this.settings.upperBoundPercentage;

        // If averageHeartRate is below the lower bound or above the upper bound, return 0
        if (averageHeartRate < lowerBound || averageHeartRate > upperBound) {
            return 0;
        }

        // If averageHeartRate is within the target range, return max score
        if (averageHeartRate >= this.goalHeartRateStart && averageHeartRate <= this.goalHeartRateStart + this.settings.width) {
            return this.settings.maxScore;
        }

        // If averageHeartRate is between the lower bound and the start of the target range
        if (averageHeartRate < this.goalHeartRateStart) {
            const slope = this.settings.maxScore / (this.goalHeartRateStart - lowerBound);
            return slope * (averageHeartRate - lowerBound);
        }

        // If averageHeartRate is between the end of the target range and the upper bound
        if (averageHeartRate > this.goalHeartRateStart + this.settings.width) {
            const slope = -this.settings.maxScore / (upperBound - (this.goalHeartRateStart + this.settings.width));
            return slope * (averageHeartRate - (this.goalHeartRateStart + this.settings.width)) + this.settings.maxScore;
        }
    }

    finalScore(averageHeartRate) {
        const score = this.baseScore(averageHeartRate);
        return score < 0.5 ? 0 : Math.round(score);
    }

}
