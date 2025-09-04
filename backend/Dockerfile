# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the TypeScript application
RUN npm run build

# Remove dev dependencies and source files to reduce image size
RUN npm prune --production && rm -rf src tsconfig.json

# Expose the port the app runs on
EXPOSE 8080

# Set environment variable for the port
ENV PORT=8080
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]
