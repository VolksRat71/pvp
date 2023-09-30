let myChart;

function saveSettings() {
    const difficulty = document.getElementById('difficulty').value;
    const overrides = {
        lowerBoundPercentage: parseFloat(document.getElementById('lowerBoundPercentage').value) / 100,
        upperBoundPercentage: parseFloat(document.getElementById('upperBoundPercentage').value) / 100 + 1,
        width: parseFloat(document.getElementById('width').value),
        maxScore: parseFloat(document.getElementById('maxScore').value)
    };

    localStorage.setItem(difficulty, JSON.stringify(overrides));
}

function loadSettings() {
    const difficulty = document.getElementById('difficulty').value;
    const settings = new HeartRateScorer(null, null, difficulty).getDifficultySettings();

    document.getElementById('lowerBoundPercentage').value = ((1 - settings.lowerBoundPercentage) * 100).toFixed(2);
    document.getElementById('upperBoundPercentage').value = ((settings.upperBoundPercentage - 1) * 100).toFixed(2);
    document.getElementById('width').value = settings.width;
    document.getElementById('maxScore').value = settings.maxScore;
}

async function loadExampleChart() {
    const difficulties = ['easy', 'medium', 'hard'];

    // Define a color mapping based on the DarkTheme
    const themeColors = {
        primary: '#186374',
        accent: '#B4483E',
        error: '#F24822',
        background: '#02202B',
        surface: '#082F39',
        text: '#ffffff'
    };

    const colors = {
        easy: themeColors.primary,
        medium: themeColors.accent,
        hard: themeColors.error
    };

    let datasets = [];

    for (let difficulty of difficulties) {
        const scorer = new HeartRateScorer(30, 80, difficulty);
        const data = scorer.generateCurveData();

        datasets.push({
            label: difficulty.charAt(0).toUpperCase() + difficulty.slice(1), // Capitalize the first letter
            data: data.y,
            borderColor: colors[difficulty],
            fill: false
        });
    }

    // Determine the x-axis range to cover the entire range of heart rates across all difficulties
    const allXValues = [...new HeartRateScorer(30, 80, 'easy').generateCurveData().x,
                        ...new HeartRateScorer(30, 80, 'medium').generateCurveData().x,
                        ...new HeartRateScorer(30, 80, 'hard').generateCurveData().x];
    const uniqueXValues = [...new Set(allXValues)].sort((a, b) => a - b);


    if(myChart) myChart.destroy();

    var ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: uniqueXValues,
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Heart Rate',
                        color: themeColors.text
                    },
                    ticks: {
                        color: themeColors.text
                    },
                    grid: {
                        color: themeColors.surface
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Score',
                        color: themeColors.text
                    },
                    min: 0,
                    max: 100,
                    ticks: {
                        color: themeColors.text
                    },
                    grid: {
                        color: themeColors.surface
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: themeColors.text
                    }
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            },
            backgroundColor: themeColors.background
        }
    });
}

// Add event listeners to each input field
const inputFields = ['lowerBoundPercentage', 'upperBoundPercentage', 'width', 'maxScore'];
for (let field of inputFields) {
    document.getElementById(field).addEventListener('input', () => {
        saveSettings();
        loadExampleChart();
    });
}

document.getElementById('difficulty').addEventListener('change', () => {
    loadSettings();
    loadExampleChart();
});

window.onload = () => {
    loadSettings();
    loadExampleChart();
};

