FROM node:18

# Install Python and build essentials
RUN apt-get update && apt-get install -y python3 make g++

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the necessary port
EXPOSE 9000

# Command to run the app
CMD ["npm", "run", "start:prod"]