# Use Node 18
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Expose Vite’s default dev port
EXPOSE 5173

# Run Vite dev server and make it accessible outside container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
