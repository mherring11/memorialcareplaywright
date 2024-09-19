FROM mcr.microsoft.com/playwright:v1.30.0-focal

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port the app runs on (make sure it matches your server configuration)
EXPOSE 10000

# Start the Node.js application
CMD [ "npm", "start" ]
