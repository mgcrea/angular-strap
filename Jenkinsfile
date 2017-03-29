node('master') {
  checkout scm

  stage('Install Dependencies') {

    sh 'npm install'
    sh 'bower install'
  }

  stage('Build') {

    sh '$(npm bin)/gulp build'
  }

  stage('Test') {

    sh 'npm run lint'
    sh '$(npm bin)/gulp karma:unit'
  }

  milestone 1
}