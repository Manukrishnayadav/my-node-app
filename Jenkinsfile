pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds') // Your DockerHub credentials ID
        DOCKERHUB_REPO = 'manukrishnayadav/my-node-app'        // Docker Hub repo
        AWS_REGION = 'us-east-1'
        CLUSTER_NAME = 'my-eks-cluster'
        IMAGE_TAG = "${BUILD_NUMBER}"                           // Jenkins build number as image tag
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
                bat "docker build -t %DOCKERHUB_REPO%:%IMAGE_TAG% ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-creds', url: '']) {
                    bat "docker push %DOCKERHUB_REPO%:%IMAGE_TAG%"
                }
            }
        }

        stage('Configure Kubeconfig') {
            steps {
                bat "aws eks update-kubeconfig --name %CLUSTER_NAME% --region %AWS_REGION%"
            }
        }

        stage('Update Deployment YAML and Deploy to EKS') {
            steps {
                // Replace the image in k8s-deployment.yaml dynamically
                bat """
                powershell -Command "(Get-Content k8s-deployment.yaml) -replace 'image:.*', 'image: %DOCKERHUB_REPO%:%IMAGE_TAG%' | Set-Content k8s-deployment.yaml"
                kubectl apply -f k8s-deployment.yaml
                """
            }
        }
    }
}

