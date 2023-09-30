const fs = require('fs');

function generateTestData() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);  // Set to yesterday
    startDate.setHours(12, 0, 0, 0);  // Set time to noon

    const duration = 5 * 60;  // 5 minutes in seconds
    const data = [];
    const bpmStart = 90;
    const bpmPeak = 150;
    const rippleAmplitude = 5;  // The amplitude of the ripple in bpm

    for (let i = 0; i < duration; i++) {
        const currentTime = new Date(startDate);
        currentTime.setSeconds(currentTime.getSeconds() + i);

        // Calculate heart rate
        let t = i / duration;
        let heartRate;

        if (t < 0.5) {
            heartRate = bpmStart + t * 2 * (bpmPeak - bpmStart);
        } else {
            heartRate = bpmPeak - (t - 0.5) * 2 * (bpmPeak - bpmStart);
        }

        // Add the ripple
        heartRate += rippleAmplitude * Math.sin(10 * Math.PI * t);

        data.push({
            timestamp: currentTime.toISOString(),
            heartRate: Math.round(heartRate)
        });
    }

    fs.writeFile("./assets/heart_rate_data.json", JSON.stringify(data, null, 2), (err) => {
        if (err)
            console.log(err);
        else {
            console.log("File written successfully\n");
            console.log("The written has the following contents:");
            console.log(fs.readFileSync("books.txt", "utf8"));
        }
    });
}

// Call the function to generate and download the data
generateTestData();
