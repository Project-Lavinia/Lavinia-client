pipeline {
  agent any
  stages {
    stage('Build') {
      environment {
        API_V3 = 'https://api.lavinia.no/api/v3.0.0/'
        SWAGGERUI = 'https://api.lavinia.no/'
        WIKI = 'https://project-lavinia.github.io/'
      }
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
          disableHostKeyChecking: true
        )
      }
    }

    stage('Release') {
      steps {
        sh 'cd dist; zip -r ../artifacts.zip *; cd ..'
        archiveArtifacts artifacts: 'artifacts.zip'
      }
    }
  }

  post{
      always{
          cleanWs()
      }
  }
}