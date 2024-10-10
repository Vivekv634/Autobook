# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code to the working directory
COPY . .

# Copy environment variables file
COPY .env .env

# Build the Next.js application
# RUN npm run build

# Expose the port that Next.js will run on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "run", "dev"]
