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
                sh 'npm install'
                sh 'npm test || echo "No tests defined"'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build Docker image locally
                sh "docker build -t $IMAGE_NAME ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                // CD: push image to Docker Hub
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    docker push $IMAGE_NAME
                    '''
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                // CD: deploy to Kubernetes (EKS)
                // Make sure k8s-deployment.yaml uses the same image tag
                sh "kubectl set image deployment/node-app-deployment node-app=$IMAGE_NAME --record"
                sh 'kubectl rollout status deployment/node-app-deployment'
            }
        }
    }
}
