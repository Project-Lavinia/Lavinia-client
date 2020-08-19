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
      steps([$class: 'BapSshPromotionPublisherPlugin']) {
            sshPublisher(
                continueOnError: false, failOnError: true,
                publishers: [
                    sshPublisherDesc(
                        configName: "web-0",
                        verbose: true,
                        transfers: [
                            sshTransfer(execCommand: "/bin/rm -rf /var/www/*"),
                        ],
                        transfers: [
                            sshTransfer(sourceFiles: "dist/**",),
                            sshTransfer(execCommand: "sudo chcon -R -t httpd_sys_content_t /var/www/")
                        ]
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