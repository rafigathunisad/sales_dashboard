pipeline {
    agent any

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/rafigathunisad/sales_dashboard.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t raksha01/sales_dashboard:latest .'
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                docker login -u raksha01 -p YOUR_DOCKER_PASSWORD
                docker push raksha01/sales_dashboard:latest
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                ssh azureuser@4.186.30.108 << EOF
                docker pull raksha01/sales_dashboard:latest
                docker stop sales_dashboard || true
                docker rm sales_dashboard || true
                docker run -d -p 3000:3000 --name sales_dashboard raksha01/sales_dashboard:latest
                EOF
                '''
            }
        }

    }
}
