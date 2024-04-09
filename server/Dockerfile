FROM node:20-alpine

WORKDIR /server

COPY . .
RUN npm install

EXPOSE 4000

CMD [ "node", "index.js" ]
