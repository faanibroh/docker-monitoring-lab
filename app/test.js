console.log("Running application test...");

const requiredValues = [
    "Docker",
    "Prometheus",
    "Grafana",
    "Loki",
    "Promtail",
    "SonarQube"
];

let failed = false;

requiredValues.forEach((value) => {
    if (!value) {
        failed = true;
    }
});

if (failed) {
    console.error("Test failed.");
    process.exit(1);
}

console.log("Application test completed successfully.");
process.exit(0);