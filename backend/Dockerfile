# # Use an official Node.js image
# FROM node:18

# # Set the working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json to install dependencies
# COPY package*.json ./

# # Install dependencies inside the container
# RUN npm install

# # Copy the rest of the application files
# COPY . .

# # Expose the application port
# EXPOSE 3000

# # Start the NestJS application
# CMD ["npm", "run", "start"]



# # Use official Node.js LTS image
# FROM node:20

# # Set working directory inside the container
# WORKDIR /app

# # Install ts-node-dev for live reloading (add Nest CLI if needed)
# RUN npm install -g ts-node-dev @nestjs/cli

# # Copy package.json first (for cache efficiency)
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of your application code
# COPY . .

# # Expose NestJS default port
# EXPOSE 3000

# # Start with ts-node-dev for hot-reloading
# CMD ["npm", "run", "start:dev"]


# Use official Node.js LTS image
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy only package.json & lock file
COPY package*.json ./

# Install ALL dependencies (including dev)
RUN npm install

# Copy full backend source
COPY . .

# Install tsconfig-paths to support 'src/*' aliases in development
RUN npm install tsconfig-paths --save

# Expose NestJS port
EXPOSE 3000

# Run NestJS in development mode with tsconfig-paths support
CMD ["node", "-r", "tsconfig-paths/register", "node_modules/.bin/ts-node-dev", "--respawn", "--transpile-only", "src/main.ts"]



