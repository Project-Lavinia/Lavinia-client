def testPassed = true

pipeline {
  agent any
  environment {
    ARTIFACT = "artifact.zip"
  }
  stages {
    stage('Test') {
      environment {
        API_V3 = 'https://api.lavinia.no/api/v3.0.0/'
        SWAGGERUI = 'https://api.lavinia.no/'
        WIKI = 'https://wiki.lavinia.no/'
      }
      when {
          tag "*.*.*"
      }
      steps {
        script {
          try {
            sh 'yarn'
            sh 'yarn cy:test'
          } catch (ex) {
            unstable('Some tests failed')
            testPassed = false
          }
        }
        junit 'results/*.xml'
      }
    }

    stage('Build') {
      environment {
        API_V3 = 'https://api.lavinia.no/api/v3.0.0/'
        SWAGGERUI = 'https://api.lavinia.no/'
        WIKI = 'https://wiki.lavinia.no/'
      }
      steps {
        sh 'yarn'
        sh 'yarn build'
        sh "cd dist; zip -r ../${ARTIFACT} *; cd .."
        archiveArtifacts artifacts: ARTIFACT
      }
    }

    stage('Deploy') {
      when {
        allOf {
          tag "*.*.*"
          expression { testPassed }
        }
      }
      steps {
        sh 'ls -1'
        sh 'ls -1 dist'
        ansiblePlaybook(
          playbook: '/storage/web_deploy.yaml',
          credentialsId: 'ansible_key',
          inventory: '/storage/hosts',
          disableHostKeyChecking: true
        )
      }
    }

    stage('Release') {
      when {
        allOf {
          tag "*.*.*"
          expression { testPassed }
        }
      }
      environment {
        GITHUB_TOKEN = credentials('jenkins_release_token')
        REPOSITORY = "Project-Lavinia/Lavinia-client"
      }
      steps {
        sh 'ls -1'
        sh 'ls -1 dist'
        publishArtifact()
      }
    }
  }
}

void publishArtifact() {
    def current_tag = sh(returnStdout: true, script: "git tag --sort version:refname | sed '/v/d' | tail -1").trim()
    def release_data = sh(returnStdout: true, script: "curl https://api.github.com/repos/${REPOSITORY}/releases/tags/${current_tag}").trim()
    def release_json = readJSON text: release_data
    def release_id = release_json.id
    sh "curl -XPOST -H 'Authorization:token ${GITHUB_TOKEN}' -H 'Content-Type:application/octet-stream' --data-binary @${ARTIFACT} https://uploads.github.com/repos/${REPOSITORY}/releases/${release_id}/assets?name=${ARTIFACT}"
}