FROM node:12

WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8085

CMD [ "npm", "start" ]