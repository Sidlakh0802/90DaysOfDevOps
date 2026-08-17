
# 🚀 Day 36 – Docker Project: Dockerize a Full Application

> **"No tutorials. No hand-holding. Pick an app, write the Dockerfile, set up Compose, and ship it. This is what you do on the job."**

---

# 📖 Overview

Today's objective is to take a full-stack application and completely Dockerize it end-to-end. This involves writing a highly optimized, multi-stage Dockerfile, configuring a complex `docker-compose.yml` for multi-container orchestration, and pushing the final production-ready image to Docker Hub.

---

# 🏗️ What App I Chose and Why

**The App:** A Node.js Express Task Tracker API with a MongoDB backend. 
**Why I chose it:** 
1. **Real-World Architecture:** It perfectly represents a standard two-tier web application (Stateless API + Stateful Database).
2. **Environment Variables:** It requires injecting database credentials and connection strings securely via `.env` files.
3. **Continuity:** It builds directly on the Node.js optimization techniques I practiced on Day 35, taking them to a production level.

---

# 🐳 The Dockerfile (Multi-Stage & Optimized)

Here is the production-grade Dockerfile I wrote for the Node.js API, complete with comments explaining the architecture.

```dockerfile
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

```

### 🚫 The `.dockerignore` File

To ensure my local development files didn't bloat the image or overwrite the container's files, I added this `.dockerignore`:

```text
node_modules
.env
.git
Dockerfile
docker-compose.yml
README.md

```

---

# 🐙 Docker Compose Orchestration

This `docker-compose.yml` brings up both the Node API and the MongoDB database, handling networks, volumes, and strict startup ordering via healthchecks.

```yaml
version: '3.8'

networks:
  task-network:
    driver: bridge

volumes:
  mongo-data:

services:
  # --- API TIER ---
  api:
    image: sid0802/day-36-task-manager:v1.0
    build: .
    ports:
      - "3000:3000"
    networks:
      - task-network
    environment:
      - PORT=3000
      - MONGO_URI=mongodb://${MONGO_USER}:${MONGO_PASSWORD}@database:27017/tasks?authSource=admin
    depends_on:
      database:
        condition: service_healthy
    restart: on-failure

  # --- DATABASE TIER ---
  database:
    image: mongo:6.0
    networks:
      - task-network
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always

```

---

# 🔐 Configuration (`.env`)

To keep secrets out of version control, I created a `.env` file in the root directory:

```env
MONGO_USER=admin
MONGO_PASSWORD=supersecretdbpassword

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/3545a22e-165a-4f6f-ab73-284c2f7d426e" />
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/41cf36be-7558-44c5-85b5-1b38cad26281" />

---

# 🚧 Challenges Faced and How I Solved Them

### Challenge 1: The `npm ci` Lockfile Error

During the Docker build, the process crashed with an error stating `The npm ci command can only install with an existing package-lock.json`.

* **The Solution:** Because this was a fresh project without a generated `package-lock.json` on my host machine, I changed the builder stage to use `RUN npm install` instead, which safely generates the tree on the fly.

### Challenge 2: App Crashing Before DB was Ready

My Node app would instantly crash on startup because it tried to connect to MongoDB while MongoDB was still allocating memory and starting its internal engine.

* **The Solution:** I implemented a `healthcheck` on the MongoDB service using the `mongosh` ping command. I then added `depends_on: condition: service_healthy` to the API service. The API now patiently waits until the database is 100% ready to accept connections.

### Challenge 3: Connection String Resolution

I initially hardcoded `localhost` in my Node.js MongoDB connection string, but the connection refused.

* **The Solution:** Containers on a custom Docker network do not share `localhost`. I updated the connection string to use the database's service name (`database:27017`), allowing Docker's internal DNS to route the traffic correctly.

---

# 📦 Final Output & Delivery

* **Final Image Size:** 182 MB *(Massive reduction compared to a 1GB+ standard Node image!)*
* **Docker Hub Link:** [https://hub.docker.com/r/sid0802/day-36-task-manager](https://www.google.com/search?q=https://hub.docker.com/r/sid0802/day-36-task-manager)

### How to run this project from scratch:

```bash
# 1. Clone the repository (or just create the docker-compose.yml and .env)
# 2. Run the stack using the pre-built image from Docker Hub
docker compose up -d

```
