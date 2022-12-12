FROM node:18.0.0
ENV SERVER_HOME=/usr/src/server/
WORKDIR $SERVER_HOME
COPY ./package*.json $SERVER_HOME
RUN npm i -g npm@7.20.1
# RUN npm install -g npm@7.24.0
# RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm install --force
# RUN npm install
COPY . $SERVER_HOME
#EXPOSE 5000
CMD npm run start