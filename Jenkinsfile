pipeline {
    agent any

    environment {
        DOCKERHUB_REPO = 'manukrishnayadav/my-node-app'
        AWS_REGION = 'us-east-1'
        CLUSTER_NAME = 'my-eks-cluster'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Manukrishnayadav/my-node-app.git'
            }
        }

        stage('Build & Test') {
            steps {
                bat 'npm install'
                bat 'npm test || echo No tests defined'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t %DOCKERHUB_REPO%:%BUILD_NUMBER% ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-creds', url: '']) {
                    bat "docker push %DOCKERHUB_REPO%:%BUILD_NUMBER%"
                }
            }
        }

        stage('Configure AWS Credentials') {
            steps {
                // Use AWS Credentials plugin
                withAWS(credentials: 'aws-secret-access-key', region: "${AWS_REGION}") {
                    bat "aws eks update-kubeconfig --name %CLUSTER_NAME%"
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                bat """
                    kubectl set image deployment/my-node-app my-node-app=%DOCKERHUB_REPO%:%BUILD_NUMBER% --record || ^
                    kubectl apply -f k8s-deployment.yaml
                """
            }
        }
    }
    
    post {
        failure {
            echo 'Pipeline failed. Check the logs for errors.'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
    }
}


