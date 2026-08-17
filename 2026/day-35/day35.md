# 🚀 Day 35 – Multi-Stage Builds & Docker Hub

> **"Multi-stage builds are how real teams ship small, secure images. Docker Hub is how you distribute them. Both are interview favourites."**

---

# 📖 Overview

Today's objective is to understand how to build optimized Docker images and share them via Docker Hub. This lab explores the limitations of single-stage builds, the massive efficiency gains of multi-stage builds, publishing images to a global registry, and implementing critical Docker security and size best practices.

---

# 🎯 Learning Objectives

By the end of this lab, I will be able to:

* Identify why standard single-stage builds result in bloated image sizes.
* Write multi-stage Dockerfiles to drastically reduce final image sizes and improve security.
* Authenticate, tag, and push Docker images to Docker Hub.
* Manage Docker Hub repositories, tags, and descriptions.
* Apply core Docker best practices (minimal base images, non-root users, and reducing layers).

---

# 🧪 Task 1: The Problem with Large Images

To demonstrate the issue, I created a simple Node.js "Hello World" application.

### 1. `app.js`
```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from an unoptimized Docker container!');
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

```

### 2. `package.json`

```json
{
  "name": "day-35-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2"
  }
}

```

### 3. Single-Stage `Dockerfile`

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]

```

### 4. Build and Check Size

```bash
docker build -t single-stage-app .
docker images | grep single-stage-app

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/f78f2456-8115-45e7-bf7b-f22eb8d73211" />

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/0a7ac8be-7925-4b3d-bc12-fd1282aae474" />


**Observation:** The resulting image was massive (over **1.5 GB**). This is because the standard `node:18` base image contains a full Debian operating system, compiler tools, and a massive amount of unnecessary background software that a simple Express app doesn't need to run in production.

---

# 🏗 Task 2: Multi-Stage Build

To fix the bloat, I rewrote the Dockerfile to use a **Multi-Stage Build**.

### The Multi-Stage `Dockerfile`

```dockerfile
# --- Stage 1: Build Stage (The heavy workbench) ---
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
# Install ALL dependencies (including dev dependencies if we had them)
RUN npm install
COPY . .

# --- Stage 2: Final Production Stage (The minimal display case) ---
FROM node:18-alpine
WORKDIR /app
# Copy ONLY the essential built files from Stage 1
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app.js .
EXPOSE 3000
CMD ["node", "app.js"]

```

### Build and Check Size

```bash
docker build -t multi-stage-app .
docker images | grep multi-stage-app

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/8fa1250e-5c0e-4a46-9eba-bacaad23e815" />

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/58b7b782-cc68-423d-8dc4-4761a039329d" />


**Observation & Explanation:**
The new image size dropped drastically to around **186 MB**!
**Why is it so much smaller?**

1. **The Base Image:** The second stage uses `node:18-alpine`, which is built on Alpine Linux (a tiny 5MB OS), stripping out hundreds of megabytes of unnecessary OS tools.
2. **Left Behind Baggage:** The `builder` stage downloads the heavy stuff, but the `COPY --from=builder` command only transfers the final, necessary artifacts to the second stage. The entire first stage (and its cached bloat) is discarded and never makes it into the final image.

---

# ☁️ Task 3: Push to Docker Hub

To share this optimized image with the world, I pushed it to Docker Hub.

### Commands Used

```bash
# 1. Log in to Docker Hub via CLI
docker login

# 2. Tag the local image with my Docker Hub username
# Format: docker tag <local-image> <username>/<repository-name>:<tag>
docker tag multi-stage-app myusername/day-35-express:v1.0

# 3. Push the image to Docker Hub
docker push myusername/day-35-express:v1.0

# 4. Verify by deleting the local image and pulling it from the cloud
docker rmi myusername/day-35-express:v1.0
docker pull myusername/day-35-express:v1.0

```


---
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/0b6a28b0-2742-49c4-a78e-fbf9d1432a97" />
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/fab86647-ae59-4fe1-8784-de38ce42e31b" />

# 🏷️ Task 4: Docker Hub Repository

After pushing, I logged into my Docker Hub account in my web browser to manage the repository.

1. **Description:** I added a README description to the repository explaining what the image does and how to run it (`docker run -p 3000:3000 myusername/day-35-express:v1.0`).
2. **Tags:** I explored the "Tags" tab.
* **What happens if you pull a specific tag vs `latest`?**
If you run `docker pull myusername/repo:v1.0`, Docker pulls that exact, immutable snapshot of the code. If you run `docker pull myusername/repo` (which defaults to `:latest`), Docker grabs whatever image was pushed most recently with the `latest` tag. Relying on `latest` in production is dangerous because it can silently introduce breaking changes if a new version is pushed!



---

# 🔐 Task 5: Image Best Practices

I took the multi-stage build one step further and applied three massive industry best practices:

### The "Best Practice" `Dockerfile`

```dockerfile
FROM node:18.17.0-alpine3.18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .

# Final Stage
# Best Practice 1: Specific Tags (Not just 'node:18-alpine')
FROM node:18.17.0-alpine3.18 
WORKDIR /app

# Best Practice 2: Non-Root User (Security)
# Create a dedicated user/group and switch to it so the app doesn't run as root
RUN addgroup -S nodeapp && adduser -S nodeapp -G nodeapp \
    # Best Practice 3: Combine RUN commands to reduce layers
    && chown -R nodeapp:nodeapp /app

USER nodeapp

COPY --from=builder --chown=nodeapp:nodeapp /app/node_modules ./node_modules
COPY --from=builder --chown=nodeapp:nodeapp /app/app.js .

EXPOSE 3000
CMD ["node", "app.js"]

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/fc405f81-aada-491f-92fe-b5048a53e06a" />

### Why these matter:

* **Specific Tags:** Ensures builds are 100% reproducible months from now.
* **Non-Root User:** If a hacker finds a vulnerability in my Node app, they will only have the restricted permissions of `nodeapp`, preventing them from taking over the entire container or host system.
* **Combined RUN Commands (`&&`):** Every `RUN` creates a new layer in Docker. Combining them reduces the total number of layers, speeding up the build process and keeping the image size small.

---

# 🌟 Key Takeaways

* **Never ship a single-stage builder image to production.** The bloat wastes money on cloud storage and increases the attack surface for hackers.
* **Multi-stage builds act as a filter.** Stage 1 does the messy compiling; Stage 2 takes only the polished result.
* **Docker Hub is the GitHub for containers.** Tagging properly (`username/repo:tag`) is essential for version control and distribution.
* **Security starts in the Dockerfile.** Running containers as a non-root user is one of the easiest and most impactful security measures you can implement.

---

# 🤔 Reflection

### What was the most surprising size difference you saw today?

Seeing a Node application drop from over 1.5 GB to just under 190 MB simply by splitting the Dockerfile into two stages and swapping the base image. It completely changed my perspective on how container storage works.

### Why does a smaller image matter beyond just saving hard drive space?

Smaller images pull faster from ECR/Docker Hub, meaning auto-scaling groups can spin up new instances much quicker during high-traffic spikes. Furthermore, fewer OS tools in the image means fewer vulnerabilities to patch!

```

```
