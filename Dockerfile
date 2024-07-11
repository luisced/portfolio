# Stage 1: Build the React application
FROM node:16-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock separately to leverage Docker cache
COPY package*.json yarn.lock* ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy SSL certificates (ensure they exist in the build context)
COPY luiscedillo.com.pem /etc/ssl/luiscedillo.com.pem
COPY luiscedillo.com.key /etc/ssl/luiscedillo.com.key

# Expose the ports the app runs on
EXPOSE 80
EXPOSE 443

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
