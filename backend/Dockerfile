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



# Use official Node.js LTS image
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package*.json ./

# Install dependencies before copying source code
RUN npm install

# Install NestJS CLI globally (Fix for "nest: not found")
RUN npm install -g @nestjs/cli

# Copy the entire backend source code
COPY . .

# Expose the port NestJS runs on
EXPOSE 3000

# Run the NestJS application using Node instead of Nest CLI
CMD ["node", "dist/main"]

