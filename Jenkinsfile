pipeline {
    agent any

    environment {
        APP_IMAGE = 'docker-monitoring-demo:latest'
        APP_CONTAINER = 'dummy-app'
        DOCKER_NETWORK = 'monitoring-network'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Application') {
            steps {
                sh '''
                    echo "Running application tests..."

                    docker build \
                      --target testing \
                      -t ${APP_IMAGE}-test \
                      ./app
                '''
            }
        }

        stage('Build Production Image') {
            steps {
                sh '''
                    echo "Building production Docker image..."

                    docker build \
                      --target production \
                      -t ${APP_IMAGE} \
                      ./app
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                    echo "Deploying dummy-app..."

                    echo "Checking Docker network..."

                    docker network inspect ${DOCKER_NETWORK} >/dev/null 2>&1 || \
                    docker network create ${DOCKER_NETWORK}

                    echo "Removing old container if it exists..."

                    docker rm -f ${APP_CONTAINER} 2>/dev/null || true

                    echo "Starting new application container..."

                    docker run -d \
                      --name ${APP_CONTAINER} \
                      --network ${DOCKER_NETWORK} \
                      -p 5000:4500 \
                      -v /home/ubuntu/docker-monitoring-lab/logs:/app/logs \
                      --restart unless-stopped \
                      ${APP_IMAGE}

                    echo "Application deployed successfully."
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    echo "Waiting for application to start..."

                    sleep 5

                    echo "=========================================="
                    echo "Container Status"
                    echo "=========================================="

                    docker ps --filter "name=${APP_CONTAINER}"

                    echo "=========================================="
                    echo "Application Logs"
                    echo "=========================================="

                    docker logs --tail 20 ${APP_CONTAINER}

                    echo "=========================================="
                    echo "Testing Application Endpoint"
                    echo "=========================================="

                    docker run --rm \
                      --network ${DOCKER_NETWORK} \
                      curlimages/curl:latest \
                      -f http://${APP_CONTAINER}:4500/

                    echo "=========================================="
                    echo "Testing Health Endpoint"
                    echo "=========================================="

                    docker run --rm \
                      --network ${DOCKER_NETWORK} \
                      curlimages/curl:latest \
                      -f http://${APP_CONTAINER}:4500/health

                    echo "=========================================="
                    echo "Deployment Verification Successful"
                    echo "=========================================="
                '''
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'CI/CD pipeline failed.'
        }

        always {
            sh '''
                docker image rm ${APP_IMAGE}-test 2>/dev/null || true
            '''
        }
    }
}
