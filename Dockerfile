# Use an official Node.js runtime as a parent image
FROM node:16-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json yarn.lock* ./

# Install dependencies
RUN npm install

# Install additional dependencies using --legacy-peer-deps
RUN npm install axios @splinetool/react-spline react-icons react-typical --legacy-peer-deps --save

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy only the build output from the build stage
COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/node_modules /app/node_modules

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app using npm start
CMD ["npm", "start"]
