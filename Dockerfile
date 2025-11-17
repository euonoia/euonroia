
FROM node:18-alpine AS frontend

WORKDIR /app/frontend

# Install frontend dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source
COPY frontend/ ./

# Build Vite production files
RUN npm run build


FROM node:18-alpine

WORKDIR /app

# Install backend dependencies first for caching
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source code
COPY backend/ ./

# Copy built frontend into backend public folder
COPY --from=frontend /app/frontend/dist ./public

# Environment
ENV NODE_ENV=production

# Expose backend port
EXPOSE 5000

# Start backend
CMD ["node", "index.js"]
