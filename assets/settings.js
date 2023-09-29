function displayDefaults() {
    const difficulty = document.getElementById('difficulty').value;
    const scorer = new HeartRateScorerSettings(difficulty);
    const defaults = scorer.getDefaults();

    // Check for overrides in local storage
    const overrides = JSON.parse(localStorage.getItem(difficulty) || '{}');
    const lowerBound = overrides.lowerBound || defaults.lowerBound;
    const upperBound = overrides.upperBound || defaults.upperBound;
    const multiplier = overrides.multiplier || defaults.multiplier;

    // Prefill the input fields with rounded values
    document.getElementById('overrideLowerBound').value = Math.round((1 - lowerBound) * 100);
    document.getElementById('overrideUpperBound').value = Math.round((upperBound - 1) * 100);
    document.getElementById('overrideMultiplier').value = Math.round((multiplier - 1) * 100);
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

    // Also, save this configuration to the configurations list
    const configurations = JSON.parse(localStorage.getItem('configurations') || '[]');
    configurations.push({
        difficulty: difficulty,
        lowerBound: lowerBound,
        upperBound: upperBound,
        multiplier: multiplier
    });
    localStorage.setItem('configurations', JSON.stringify(configurations));

    // Refresh the displayed defaults and configurations
    displayDefaults();
    displayConfigurations();
}

function deleteConfiguration(index) {
    const configurations = JSON.parse(localStorage.getItem('configurations') || '[]');
    configurations.splice(index, 1);
    localStorage.setItem('configurations', JSON.stringify(configurations));
    displayConfigurations();
}

window.onload = function () {
    displayConfigurations();
    displayDefaults();
};
