# Docker Monitoring Lab

A hands-on DevOps project demonstrating containerization, monitoring, centralized logging, code quality analysis, and CI/CD automation using Docker, Prometheus, Grafana, Loki, and Jenkins.

This project showcases a practical monitoring and deployment environment designed to simulate real-world DevOps workflows.

## Project Overview

The Docker Monitoring Lab demonstrates how to:

- Containerize applications using Docker
- Orchestrate multiple services using Docker Compose
- Monitor application and system metrics
- Collect and visualize logs centrally
- Automate testing and deployment using Jenkins
- Analyze code quality using SonarQube
- Build and deploy applications through CI/CD pipelines
- Deploy a monitoring environment on AWS EC2

## Architecture

```text
                   GitHub Repository
                          |
                          v
                       Jenkins
                          |
                +---------+---------+
                |         |         |
                v         v         v
              Test      Build     Deploy
                |         |         |
                +---------+---------+
                          |
                          v
                  Docker Containers
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
      Dummy App      Node Exporter     Promtail
          |               |               |
          |               v               v
          |          Prometheus           Loki
          |               |               |
          +---------------+---------------+
                          |
                          v
                       Grafana
                Metrics and Log Dashboards

                  SonarQube
              Code Quality Analysis
```

## Technology Stack

| Category | Technologies |
|---|---|
| Containerization | Docker |
| Container Orchestration | Docker Compose |
| Application | Node.js, Express |
| Monitoring | Prometheus |
| Visualization | Grafana |
| System Metrics | Node Exporter |
| Log Aggregation | Loki |
| Log Collection | Promtail |
| CI/CD | Jenkins |
| Code Quality | SonarQube |
| Cloud | AWS EC2 |
| Version Control | Git, GitHub |
| Operating System | Ubuntu Linux |

## Project Structure

```text
docker-monitoring-lab/
├── app/
│   ├── Dockerfile
│   ├── server.js
│   ├── package.json
│   ├── test.js
│   └── sonar-project.properties
│
├── prometheus/
├── loki/
├── promtail/
├── scripts/
│
├── docker-compose.yml
├── docker-compose.jenkins.yml
├── .gitignore
└── README.md
```

## Application

The project includes a Node.js and Express dummy application designed for monitoring and logging demonstrations.

### Application Features

- Dockerized Node.js application
- Health check endpoint
- API endpoint for sample data
- Continuous application logging
- Automated application tests
- Multi-stage Docker build

### Application Endpoints

| Endpoint | Purpose |
|---|---|
| `/health` | Application health check |
| `/api/data` | Sample API response |

The application runs internally on port `4500`.

## Docker Services

The project uses Docker Compose to manage the monitoring stack.

| Service | Purpose | Port |
|---|---|---|
| Dummy App | Node.js application | 5000 |
| Node Exporter | System metrics | 9100 |
| Prometheus | Metrics collection | 9090 |
| Grafana | Monitoring dashboards | 3000 |
| Loki | Log aggregation | 3100 |
| Promtail | Log collection | Internal |
| SonarQube | Code quality analysis | 9000 |

## Monitoring with Prometheus

Prometheus collects and stores monitoring metrics from the application and infrastructure.

### Monitoring Features

- System metrics collection
- Node Exporter integration
- Prometheus targets monitoring
- Infrastructure metrics
- Monitoring data visualization through Grafana

Access Prometheus:

```text
http://localhost:9090
```

## Visualization with Grafana

Grafana provides dashboards for visualizing metrics collected by Prometheus.

### Grafana Features

- Monitoring dashboards
- Prometheus data source integration
- Loki data source integration
- Application and infrastructure monitoring
- Centralized metrics and logs visualization

Access Grafana:

```text
http://localhost:3000
```

## Centralized Logging with Loki and Promtail

The project implements centralized logging using Loki and Promtail.

### Logging Architecture

```text
Docker Containers
       |
       v
    Promtail
       |
       v
      Loki
       |
       v
    Grafana
```

### Logging Features

- Application log collection
- Docker container log monitoring
- Centralized log aggregation
- Log querying through Grafana
- Integration between Loki and Grafana

Check Loki readiness:

```text
http://localhost:3100/ready
```

## Jenkins CI/CD Pipeline

Jenkins automates the application testing, Docker image building, and deployment process.

### Pipeline Stages

| Stage | Description |
|---|---|
| Test | Runs application tests |
| Build | Builds the Docker image |
| Deploy | Deploys the application container |

### CI/CD Workflow

```text
GitHub Repository
        |
        v
      Jenkins
        |
        v
    Application Tests
        |
        v
    Docker Image Build
        |
        v
    Docker Deployment
        |
        v
   Monitoring Stack
```

The Jenkins pipeline automates the process of testing, building, and deploying the application.

## Code Quality with SonarQube

SonarQube is integrated into the project for code quality analysis.

Features include:

- Static code analysis
- Code quality inspection
- Identification of potential code issues
- Code quality monitoring

Access SonarQube:

```text
http://localhost:9000
```

## Getting Started

### Prerequisites

Install the following tools:

- Docker
- Docker Compose
- Git
- Jenkins
- AWS CLI (for AWS deployment)

### Clone the Repository

```bash
git clone https://github.com/faanibroh/docker-monitoring-lab.git
```

Navigate into the project:

```bash
cd docker-monitoring-lab
```

### Start the Monitoring Stack

```bash
docker compose up -d
```

Check running containers:

```bash
docker ps
```

### View Container Logs

```bash
docker compose logs -f
```

### Stop the Stack

```bash
docker compose down
```

## AWS Deployment

The project was also deployed on an AWS EC2 instance running Ubuntu.

The AWS deployment demonstrates:

- Linux server administration
- Docker installation and configuration
- Docker Compose deployment
- Jenkins-based application deployment
- Cloud-based monitoring environment
- Application deployment on AWS

## DevOps Skills Demonstrated

This project demonstrates practical experience with:

- Docker containerization
- Docker Compose orchestration
- CI/CD pipeline development
- Jenkins automation
- Application testing
- Monitoring and observability
- Prometheus metrics collection
- Grafana dashboards
- Centralized logging
- Loki and Promtail integration
- SonarQube code quality analysis
- Linux administration
- AWS EC2 deployment
- Git and GitHub

## Author

**Muhammad Farhan Ali**

GitHub: [@faanibroh](https://github.com/faanibroh)

LinkedIn: [Muhammad Farhan Ali](https://www.linkedin.com/in/faanibroh/)

---

⭐ If you find this project useful, feel free to explore the repository and follow my DevOps learning journey.
