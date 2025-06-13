#Hosted
# Using Node.js 22 Alpine as base image
FROM node:22-alpine

# Install pnpm globally 
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Create applogs directory for logging
RUN mkdir -p /app/applogs

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Use a npm registry mirror & increase retries
RUN pnpm config set registry https://registry.npmmirror.com && \
    pnpm config set fetch-retries 5 && \
    pnpm config set fetch-retry-mintimeout 10000 && \
    pnpm config set fetch-retry-maxtimeout 60000

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

EXPOSE 9000

# Start application (pnpm run start:dev)
CMD ["pnpm", "run", "start:dev"]

#Local
# # Using Node.js 22 Alpine as base image
# FROM node:22-alpine

# #Install pnpm globally
# RUN npm install -g pnpm

# # Set working directory
# WORKDIR /app

# # Create applogs directory for logging
# RUN mkdir -p /app/applogs


# # Copy package files
# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml  ./

# # Install dependencies
# RUN pnpm install --frozen-lockfile

# # Copy all source code
# COPY . .

# EXPOSE 9000

# # Start application (pnpm run start:dev)
# CMD ["pnpm", "run", "start:dev"]