FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the necessary port
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
