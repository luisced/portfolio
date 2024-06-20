# Use an official Node.js runtime as a parent image
FROM node:16-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json yarn.lock* ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app using npm start
CMD ["npm", "start"]

# Final stage: production image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app /app

# Install additional dependencies (if needed)
RUN npm install axios @splinetool/react-spline react-icons --save

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app using npm start
CMD ["npm", "start"]
