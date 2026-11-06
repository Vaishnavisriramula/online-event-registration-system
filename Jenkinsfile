pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Source Code') {
            steps {
                bat 'node --check server.js'
                bat 'node --check public\\script.js'
                bat 'node --check tests\\event.test.js'
            }
        }

        stage('Verify Docker Image') {
            steps {
                bat '"C:\\Users\\vaishnavi sriramula\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" image inspect online-event-registration:latest'
            }
        }

        stage('Test Docker Image') {
            steps {
                bat '"C:\\Users\\vaishnavi sriramula\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" run --rm online-event-registration:latest node --check server.js'
            }
        }
    }
}