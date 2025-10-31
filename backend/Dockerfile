# ---- Backend Dockerfile ----
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Install nodemon globally for live reload
RUN npm install -g nodemon

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
