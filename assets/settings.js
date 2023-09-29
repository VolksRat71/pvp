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

document.getElementById('difficulty').addEventListener('change', loadSettings);
window.onload = loadSettings;

