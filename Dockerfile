# Use Node.js LTS version
FROM node:22-slim

# Set working directory
WORKDIR /usr/src/app

# Copy only package.json first (to leverage Docker cache for dependencies)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code (but not node_modules, thanks to .dockerignore)
COPY . .

# 👈 delete .env inside container
# RUN rm -f .env  

# Build the NestJS app
RUN npm run build

# Expose port (your app runs on 5000 according to your config)
EXPOSE 5000

# Start the app (production recommended, but you can keep dev if needed)
CMD ["npm", "run", "start:prod"]
