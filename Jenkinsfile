pipeline {
  agent any
  options {
    disableConcurrentBuilds()
  }
  environment {
      NPM = "/home/jenkins/.nvm/versions/node/v13.14.0/bin/npm"
      PM2 = "/home/jenkins/.nvm/versions/node/v13.14.0/bin/pm2"
      BASE = "/srv/"
      TARGET = "iotcloud"
  }
  stages {
    stage('Decide') {
      when { 
        not {
          anyOf {
            branch 'master'
          }
        }
      }
      steps {
        script {
          currentBuild.result = 'ABORTED'
          return
        }
      }
    }
    stage('Checkout') {      
      steps {        
        checkout scm
      }
    }
    stage('Transfer') {      
      steps {
        wrap([$class: 'BuildUser']) {
          sshPublisher(publishers: [sshPublisherDesc(configName: "$TARGET", transfers: [sshTransfer(cleanRemote: true, excludes: '', execCommand: '', execTimeout: 120000, flatten: false, makeEmptyDirs: true, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: "${BASE}${JOB_NAME}/", remoteDirectorySDF: false, removePrefix: '', sourceFiles: '**/*')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true)])
        }
      }
    }
    stage('Build') {
      steps {
        wrap([$class: 'BuildUser']) {
          sshPublisher(publishers: [sshPublisherDesc(configName: "$TARGET", transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: "cd ${BASE}${JOB_NAME} && ${NPM} install", execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '', remoteDirectorySDF: false, removePrefix: '', sourceFiles: '')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true, usePty:true)])
        }
      }
    }
    stage('Start') {
      steps {
        wrap([$class: 'BuildUser']) {
          sshPublisher(publishers: [sshPublisherDesc(configName: "$TARGET", transfers: [sshTransfer(cleanRemote: false, excludes: '', 
          execCommand: "cd ${BASE} && ${PM2} delete ${JOB_NAME} || : && ${PM2} start ${JOB_NAME} --name ${JOB_NAME} && ${PM2} save", 
          execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '',  remoteDirectorySDF: false, removePrefix: '', sourceFiles: '')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true, usePty:true)])
        }
      }
    }
  }
}