FROM node:19
EXPOSE 8080
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]
