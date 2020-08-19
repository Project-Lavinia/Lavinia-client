pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'ls'
        sh 'yarn'
        sh 'yarn build'
        sh 'ls'
      }
    }

  }
  environment {
    API_V3 = 'https://api.lavinia.no/api/v3.0.0/'
    SWAGGERUI = 'https://api.lavinia.no/'
    WIKI = 'https://project-lavinia.github.io/'
  }
}