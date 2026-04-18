FROM node:20-alpine

WORKDIR /app/server

COPY server/package*.json ./
RUN npm install

WORKDIR /app

COPY . .

EXPOSE 8080

CMD ["node", "server/index.js"]
