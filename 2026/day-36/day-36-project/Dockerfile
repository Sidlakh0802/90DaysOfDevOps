# ==========================================
# STAGE 1: Builder (The heavy compilation stage)
# ==========================================
FROM node:18.17.0-alpine3.18 AS builder
WORKDIR /app

# Copy dependency files first for layer caching
COPY package.json package-lock.json* ./

# Install ALL dependencies (using install since lockfile might not exist yet)
RUN npm install

# Copy the rest of the application code
COPY . .

# ==========================================
# STAGE 2: Production (The minimal runtime stage)
# ==========================================
FROM node:18.17.0-alpine3.18
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S nodeapp && adduser -S nodeapp -G nodeapp \
    && chown -R nodeapp:nodeapp /app

# Switch to the non-root user
USER nodeapp

# Copy ONLY the necessary files from the builder stage
COPY --from=builder --chown=nodeapp:nodeapp /app/node_modules ./node_modules
COPY --from=builder --chown=nodeapp:nodeapp /app/server.js .
COPY --from=builder --chown=nodeapp:nodeapp /app/package.json .

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]

