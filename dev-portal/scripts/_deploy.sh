#!/usr/bin/env bash

# A simple manual deploy script... should be automated soon.

./node_modules/.bin/standard-version --releaseCommitMessageFormat 'chore(release): {{currentTag}} [skip ci]'
git push --follow-tags origin master

export VERSION=`cat package.json | jq .version -r`
echo "Deploying Version: ${VERSION}"
docker-compose build

# re-tag the image docker-compose built for us
docker tag ldaly/dev-portal:latest ldaly/dev-portal:${VERSION}
docker push ldaly/dev-portal:${VERSION}