pipeline {
    agent any

    environment {
        APP_IMAGE = 'docker-monitoring-demo:latest'
        APP_CONTAINER = 'dummy-app'
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

                    docker rm -f ${APP_CONTAINER} 2>/dev/null || true

                    docker run -d \
                      --name ${APP_CONTAINER} \
                      -p 5000:4500 \
                      -v /home/ubuntu/docker-monitoring-lab/logs:/app/logs \
                      --restart unless-stopped \
                      ${APP_IMAGE}
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    echo "Waiting for application..."
                    sleep 5

                    echo "Container status:"
                    docker ps --filter "name=${APP_CONTAINER}"

                    echo "Application logs:"
                    docker logs --tail 20 ${APP_CONTAINER}

                    echo "Testing application endpoint..."
                    curl -f http://localhost:5000/ || exit 1

                    echo "Deployment verification successful."
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
