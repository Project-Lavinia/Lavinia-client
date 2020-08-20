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
      when{
        branch 'master'
      }
      steps([$class: 'BapSshPromotionPublisherPlugin']) {
        script {
                def props = readProperties file: '/storage/jenkins_vars.properties'
                env.WEB_ROOT = props.WEB_ROOT
            }
        sshPublisher(
            continueOnError: false, failOnError: true,
            publishers: [
                sshPublisherDesc(
                    configName: "web-0",
                    verbose: true,
                    transfers: [
                        sshTransfer(execCommand: "sudo /bin/rm -rf ${WEB_ROOT}/*"),
                        sshTransfer(sourceFiles: "dist/**/*"),
                        sshTransfer(execCommand: "mv ${WEB_ROOT}/dist/* ${WEB_ROOT}/"),
                        sshTransfer(execCommand: "rm -r ${WEB_ROOT}/dist"),
                        sshTransfer(execCommand: "sudo chmod -R 0755 ${WEB_ROOT}"),
                        sshTransfer(execCommand: "sudo chcon -R -t httpd_sys_content_t ${WEB_ROOT}/")
                    ],
                )
            ]
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