pipeline {
    agent any
    stages {
        stage('Install') {
            steps {
                sh 'npm --prefix functions install'
            }
        }
        stage('Make Quality') {
            environment {
                GITHUB_TOKEN = credentials('GITHUB_TOKEN_TWALL')
            }
            when {
                expression { BRANCH_NAME ==~ /(master|PR-[0-9]*)/ }
            }
            steps {
                sh 'npm --prefix functions run lint'

                script {
                    def scannerHome = tool 'SonarQube Scanner'
                    def scannerOptions = ''

                    if(env.BRANCH_NAME ==~ /PR-[0-9]*/) {
                      scannerOptions = scannerOptions + " -Dsonar.analysis.mode=preview"
                      scannerOptions = scannerOptions + " -Dsonar.github.repository=GDG-Lille/twall-functions"
                      scannerOptions = scannerOptions + " -Dsonar.github.oauth=${GITHUB_TOKEN}"
                      scannerOptions = scannerOptions + " -Dsonar.github.pullRequest=${env.CHANGE_ID}"
                    }

                    withSonarQubeEnv('SonarQube Server') {
                      sh "${scannerHome}/bin/sonar-scanner${scannerOptions}"
                    }
                }
            }
        }
        stage('Build') {
            steps {
                sh 'npm --prefix functions run build'
            }
        }
        stage('Deploy') {
            environment {
                FIREBASE_TOKEN = credentials('FIREBASE_TOKEN_TWALL')
            }
            when {
                expression { BRANCH_NAME ==~ /(master|PR-[0-9]*)/ }
            }
            steps {
                def project = ' -P default'

                if(env.BRANCH_NAME == 'master') {
                  project = ' -P prod'
                }

                sh "npm --prefix functions run deploy${project}"
            }
        }
    }
    post {
        always {
            deleteDir()
        }
    }
}
