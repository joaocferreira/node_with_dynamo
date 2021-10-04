FROM node:12.14.1-alpine


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./tmp/

RUN cd /tmp && npm install

RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

# Create app directory
WORKDIR /usr/src/app

COPY . .

EXPOSE 4040
