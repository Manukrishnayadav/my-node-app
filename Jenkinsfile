pipeline {
    agent any

    environment {
        IMAGE_NAME = "manukrishnayadav/my-node-app:${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Pull code from GitHub
                git branch: 'main', url: 'https://github.com/Manukrishnayadav/my-node-app.git'
            }
        }

        stage('Build & Test') {
            steps {
                // CI: install dependencies and run tests
                bat 'npm install'
                bat 'npm test || echo No tests defined'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build Docker image locally
                bat "docker build -t %IMAGE_NAME% ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                // CD: push image to Docker Hub
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat """
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    docker push %IMAGE_NAME%
                    """
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                // CD: deploy to Kubernetes (EKS)
                bat "kubectl apply -f k8s-deployment.yaml"
                bat "kubectl rollout status deployment/node-app-deployment"
            }
        }
    }
}
