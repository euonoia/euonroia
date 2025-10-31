# ---- Backend Dockerfile (Production) ----
FROM node:18-alpine

# Create and set working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY package*.json ./

# Install only production dependencies (smaller, faster image)
RUN npm install --production

# Copy the rest of your backend code
COPY . .

# Expose your backend port (Render will auto-detect this)
EXPOSE 5000

# Start your server
CMD ["node", "index.js"]
