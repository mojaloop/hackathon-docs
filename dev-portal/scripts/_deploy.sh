#!/usr/bin/env bash

# A simple manual deploy script... should be automated soon.


npm run release

export VERSION=`cat package.json | jq .version -r`
echo "Deploying Version: ${VERSION}"
docker-compose build

docker tag ldaly/dev-portal:latest ldaly/dev-portal/${VERSION}

# docker-compose push