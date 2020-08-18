pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'ls'
        sh 'yarn'
        sh 'webpack --env.NODE_ENV \\"production\\" -p --progress --colors'
      }
    }

  }
  environment {
    API_V3 = 'https://api.lavinia.no/api/v3.0.0/'
    SWAGGERUI = 'https://api.lavinia.no/'
    WIKI = 'https://project-lavinia.github.io/'
  }
}