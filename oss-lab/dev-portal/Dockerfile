FROM node:12.16.1-alpine

WORKDIR /opt/dev-portal

RUN apk add --no-cache -t build-dependencies git make gcc g++ python libtool autoconf automake \
  && cd $(npm root -g)/npm \
  && npm config set unsafe-perm true \
  && npm install -g node-gyp

COPY package.json package-lock.json* /opt/dev-portal/
RUN npm install

COPY docs /opt/dev-portal/docs
RUN npm run build

CMD [ "npm", "run", "serve" ]
