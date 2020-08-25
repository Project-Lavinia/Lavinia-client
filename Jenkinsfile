pipeline {
  agent any
  environment {
    ARTIFACT = "artifact.zip"
  }
  stages {
    stage('Build') {
      environment {
        GITHUB_TOKEN = credentials('jenkins_release_token')
        API_V3 = 'https://api.lavinia.no/api/v3.0.0/'
        SWAGGERUI = 'https://api.lavinia.no/'
        WIKI = 'https://project-lavinia.github.io/'
      }
      steps {
        sh 'yarn'
        sh 'yarn build'
        sh "cd dist; zip -r ../${ARTIFACT} *; cd .."
        archiveArtifacts artifacts: ARTIFACT
      }
    }

    stage('Deploy') {
      //when { tag "*.*.*" }
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
      when { tag "*.*.*" }
      environment {
        GITHUB_TOKEN = credentials('jenkins_release_token')
        REPOSITORY = "Project-Lavinia/Lavinia-client"
      }
      steps {
        publishArtifact()
      }
    }
  }
}

void publishArtifact() {
    def current_tag = sh(returnStdout: true, script: "git tag --sort version:refname | tail -1").trim()
    def release_data = sh(returnStdout: true, script: "curl https://api.github.com/repos/${REPOSITORY}/releases/tags/${current_tag}").trim()
    def release_json = readJSON text: release_data
    def release_id = release_json.id
    sh "curl -XPOST -H 'Authorization:token ${GITHUB_TOKEN}' -H 'Content-Type:application/octet-stream' --data-binary @${ARTIFACT} https://uploads.github.com/repos/${REPOSITORY}/releases/${release_id}/assets?name=${ARTIFACT}"
}