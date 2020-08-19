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

    stage('Deploy') {
      steps {
        sh 'ping web-0.lavinia.no'
        sh '/storage/deploy_client.sh'
      }
    }

  }
  environment {
    API_V3 = 'https://api.lavinia.no/api/v3.0.0/'
    SWAGGERUI = 'https://api.lavinia.no/'
    WIKI = 'https://project-lavinia.github.io/'
  }
}