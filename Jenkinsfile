node('linux') {

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

try {
  if (env.BRANCH_NAME == "sumt-master" || env.BRANCH_NAME.startsWith('SS')) {
      build job: 'Foundation Controls(GitHub_develop)', wait: false
  }
} catch(e) {
  echo 'Unable to find the Foundation control branch for downstream building. Not failing the build for this...'
  emailext body: "Unable to find the Foundation control branch for angular-strap repository in github. Please view the build information here: ${env.BUILD_URL}",
      from: 'Jenkins CI Server <jenkins-no-reply@sumtotalsystems.com>',
      subject: 'The foundation-controls project build has failed',
	  to: 'SumTotal-DevOps-Build@skillsoft.com'
	  
      throw err
}

