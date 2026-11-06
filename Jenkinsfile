pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t online-event-registration .'
            }
        }

        stage('Check Application') {
            steps {
                bat 'docker run --rm online-event-registration node --check server.js'
            }
        }
    }
}