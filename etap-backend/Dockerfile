# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app code
COPY . .

# Expose port
EXPOSE 9000

# Start the NestJS app
CMD ["npm", "run", "start:dev"]
