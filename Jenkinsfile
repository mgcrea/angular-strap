node('master') {

  stage('Prepare Workspace') {
    // clean
    deleteDir()

    checkout scm
  }

  stage('Install Dependencies') {
    nodejs(nodeJSInstallationName: 'NodeJS 8.x') {
      sh 'npm install'
      sh 'bower install'
    }
  }

  stage('Build') {
    nodejs(nodeJSInstallationName: 'NodeJS 8.x') {
      sh 'npm run compile'
    }
  }

  stage('Test') {
    nodejs(nodeJSInstallationName: 'NodeJS 8.x') {
      sh 'npm run lint'
      sh 'npm test'
    }
  }
}
