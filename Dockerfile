# Use an official Node.js image as a base image
FROM node:20-buster

# Install required system libraries to run Playwright browsers
RUN apt-get update && apt-get install -y \
    libgstreamer-gl1.0-0 \
    libgstreamer-plugins-bad1.0-0 \
    libenchant-2-2 \
    libsecret-1-0 \
    libmanette-0.2-0 \
    libgles2-mesa \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Install Playwright browsers
RUN npx playwright install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port the app runs on (ensure this matches your server.js port)
EXPOSE 10000

# Start the Node.js application
CMD [ "npm", "start" ]

