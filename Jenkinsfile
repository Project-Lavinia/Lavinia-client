pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'yarn'
        sh 'yarn build'
      }
    }

    stage('Deploy') {
      steps {
        ansiblePlaybook(
          playbook: '/storage/web_deploy.yaml',
          credentialsId: 'ansible_key',
          inventory: '/storage/hosts',
          disableHostKeyChecking: true,
          ansibleName: 'centos'
        )
      }
    }
  }
  environment {
    API_V3 = 'https://api.lavinia.no/api/v3.0.0/'
    SWAGGERUI = 'https://api.lavinia.no/'
    WIKI = 'https://project-lavinia.github.io/'
  }
}