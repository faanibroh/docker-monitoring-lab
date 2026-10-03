const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 4500;

app.use(express.json());

let requestCount = 0;

// ==========================================
// LOG DIRECTORY
// ==========================================

const logDirectory = "/app/logs";

const applicationLogFile = path.join(
    logDirectory,
    "application.log"
);

const errorLogFile = path.join(
    logDirectory,
    "error.log"
);

// Make sure the log directory exists
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// ==========================================
// LOG FUNCTIONS
// ==========================================

// Normal/application logs
function applicationLog(message) {

    const timestamp = new Date().toISOString();

    const logMessage =
        `[APP LOG] ${timestamp} | ${message}`;

    console.log(logMessage);

    fs.appendFileSync(
        applicationLogFile,
        logMessage + "\n"
    );
}

// Error logs
function errorLog(message) {

    const timestamp = new Date().toISOString();

    const logMessage =
        `[ERROR] ${timestamp} | ${message}`;

    console.error(logMessage);

    fs.appendFileSync(
        errorLogFile,
        logMessage + "\n"
    );
}

// ==========================================
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {

    requestCount++;

    const timestamp = new Date().toISOString();

    const message =
        `[REQUEST] ${timestamp} | GET / | Request #${requestCount}`;

    console.log(message);

    fs.appendFileSync(
        applicationLogFile,
        message + "\n"
    );

    res.send(`
        <!DOCTYPE html>

        <html>

        <head>

            <title>Docker Monitoring Demo - CI/CD v2</title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    margin-top: 100px;
                    background: #f4f4f4;
                }

                .container {
                    background: white;
                    width: 600px;
                    margin: auto;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 0 15px rgba(0,0,0,0.1);
                }

                h1 {
                    color: #333;
                }

                p {
                    font-size: 18px;
                }

            </style>

        </head>

        <body>

            <div class="container">

                <h1>Docker Monitoring Demo - CI/CD v2</h1>

                <p>Application is running successfully.</p>

                <p>Container: dummy-app</p>

                <p>Request Count: ${requestCount}</p>

                <p>
                    Monitoring:
                    Node Exporter + Prometheus + Grafana
                </p>

                <p>
                    Logging:
                    Promtail + Loki + Grafana
                </p>

            </div>

        </body>

        </html>
    `);
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", (req, res) => {

    const timestamp = new Date().toISOString();

    const message =
        `[HEALTH] ${timestamp} | Health check received`;

    console.log(message);

    fs.appendFileSync(
        applicationLogFile,
        message + "\n"
    );

    res.json({
        status: "healthy",
        application: "docker-monitoring-demo",
        timestamp: timestamp
    });
});

// ==========================================
// API DATA
// ==========================================

app.get("/api/data", (req, res) => {

    requestCount++;

    const timestamp = new Date().toISOString();

    const message =
        `[API] ${timestamp} | GET /api/data | Request #${requestCount}`;

    console.log(message);

    fs.appendFileSync(
        applicationLogFile,
        message + "\n"
    );

    res.json({
        message: "Dummy API is working",
        requestCount: requestCount,
        timestamp: timestamp
    });
});

// ==========================================
// TEST ERROR ENDPOINT
// ==========================================

app.get("/error", (req, res) => {

    errorLog(
        "Test error generated for log retention testing"
    );

    res.status(500).json({
        error: "Test error generated",
        timestamp: new Date().toISOString()
    });
});

// ==========================================
// 404 ERROR
// ==========================================

app.use((req, res) => {

    errorLog(
        `Route not found: ${req.method} ${req.originalUrl}`
    );

    res.status(404).json({
        error: "Route not found"
    });
});

// ==========================================
// START APPLICATION
// ==========================================

app.listen(PORT, () => {

    console.log("==========================================");
    console.log(" Docker Monitoring Demo Application");
    console.log("==========================================");

    console.log(
        `Application running on port ${PORT}`
    );

    console.log(
        `Health endpoint: http://localhost:${PORT}/health`
    );

    console.log(
        `API endpoint: http://localhost:${PORT}/api/data`
    );

    console.log(
        `Error test endpoint: http://localhost:${PORT}/error`
    );

    console.log(
        "Application started successfully."
    );

    console.log("==========================================");

    applicationLog(
        "Application started successfully"
    );
});

// ==========================================
// GENERATE NORMAL LOG EVERY 5 SECONDS
// ==========================================

setInterval(() => {

    const timestamp = new Date().toISOString();

    const message =
        `Application is running | Request count: ${requestCount}`;

    const logMessage =
        `[APP LOG] ${timestamp} | ${message}`;

    console.log(logMessage);

    fs.appendFileSync(
        applicationLogFile,
        logMessage + "\n"
    );

}, 5000);

