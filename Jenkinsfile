pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'export API_V3="https://api.lavinia.no/api/v3.0.0/"'
        sh 'export SWAGGERUI="https://api.lavinia.no/"'
        sh 'export WIKI="https://project-lavinia.github.io/"'
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
          disableHostKeyChecking: true
        )
      }
    }
  }
}