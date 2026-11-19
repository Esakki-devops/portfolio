// Declarative Pipeline for the portfolio — tested, then cluster + public site.
// Requires the Pipeline plugins on Jenkins (workflow-job, workflow-cps,
// pipeline-model-definition / workflow-aggregator, pipeline-stage-view).
// Each stage drives the master node (.2) through the InfraMonitor agent; the
// agent exec token is read from /run/secrets/exec_token (mounted in the
// jenkins container). No secret is stored in this file.
pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  triggers {
    pollSCM('H/2 * * * *')
  }

  stages {
    stage('Pull')             { steps { agentExec('cd /var/www/portfolio && git pull --ff-only', 120, 160) } }
    stage('Install')          { steps { agentExec('cd /var/www/portfolio && npm ci', 300, 340) } }
    stage('Lint (code)')      { steps { agentExec('cd /var/www/portfolio && npm run lint', 120, 160) } }
    stage('Typecheck (test)') { steps { agentExec('cd /var/www/portfolio && npx --no-install tsc --noEmit', 180, 220) } }
    stage('Build')            { steps { agentExec('cd /var/www/portfolio && npm run build', 300, 340) } }
    stage('Restart')          { steps { agentExec('sudo systemctl restart portfolio', 60, 100) } }
    stage('Health')           { steps { agentExec('sleep 4; c=$(curl -s -o /dev/null -w %{http_code} http://127.0.0.1:3000/); echo health=$c; test $c = 200', 30, 70) } }
    stage('Deploy slave (.3)'){ steps { agentExec('python3 /usr/local/bin/portfolio-sync-slave 10.10.10.3 3001', 240, 260) } }
    stage('Deploy Cloudflare'){ steps { agentExec('/usr/local/bin/portfolio-deploy-cloudflare', 480, 520) } }
  }

  post {
    success { echo 'Pipeline OK — tested, cluster + public site updated.' }
    failure { echo 'Pipeline FAILED — nothing past the failing stage was deployed.' }
  }
}

// Runs one command on .2 via the agent. CMD is passed through the environment
// and the JSON payload is built with python, so there is no Groovy/shell quoting
// to get wrong regardless of what the command contains.
def agentExec(String cmd, int tmo, int maxt) {
  withEnv(["CMD=${cmd}", "TMO=${tmo}", "MAXT=${maxt}"]) {
    sh '''#!/bin/bash
set -e
TOKEN=$(cat /run/secrets/exec_token)
PAYLOAD=$(python3 -c "import json,os;print(json.dumps({'command':os.environ['CMD'],'timeout':int(os.environ['TMO'])}))")
resp=$(curl -sS --max-time "$MAXT" -X POST http://10.10.10.2:9100/exec \
  -H "X-Exec-Token: $TOKEN" -H "Content-Type: application/json" -d "$PAYLOAD")
echo "$resp" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('output') or d.get('error') or '');sys.exit(0 if d.get('ok') and d.get('rc')==0 else 1)"
'''
  }
}
