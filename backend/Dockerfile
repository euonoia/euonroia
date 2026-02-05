# ---- Backend Dockerfile (Production) ----
FROM node:25.6.0-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first for caching
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy the rest of the backend code
COPY . .

# Ensure Node runs with proper environment for Render
ENV NODE_ENV=production

# Expose backend port (Render auto-detects this)
EXPOSE 5000

# Start the server with proper flags for stable production
CMD ["node", "--enable-source-maps", "index.js"]
