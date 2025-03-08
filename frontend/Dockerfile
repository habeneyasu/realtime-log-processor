
# Use the official Node.js image as the base image
FROM node:20-alpine AS base

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Use a smaller image for the final stage
FROM node:20-alpine AS production

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the base stage
COPY --from=base /app/package.json /app/package-lock.json* ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public

# Expose the port that Next.js runs on (default is 3000)
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]