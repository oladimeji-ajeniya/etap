# Use an appropriate base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json from your local directory to the container's working directory
COPY package.json package-lock.json ./

# Install dependencies without bcrypt
RUN npm install

# Install a specific version of bcrypt (5.0.0)
RUN npm install bcrypt@5.0.0 --build-from-source

# Rebuild bcrypt to ensure compatibility
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of your application code to the working directory
COPY . .

# Expose the necessary port
EXPOSE 3000

# Start your application
CMD ["npm", "start"]
