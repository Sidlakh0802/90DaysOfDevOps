
# 🚀 Day 34 – Docker Compose: Real-World Multi-Container Apps

> **"Yesterday we learned the basics. Today, we handle real-world scenarios—healthchecks, dependency management, and robust restart policies."**

---

# 📖 Overview

Today's objective is to build complex, production-like setups with Docker Compose. This lab covers building a 3-tier application stack (Web App, Database, Cache), utilizing custom Dockerfiles within Compose, configuring service dependencies with healthchecks, defining restart policies, explicitly managing networks and volumes, and exploring container scaling.

---

# 🎯 Learning Objectives

By the end of this lab, I will be able to:

* Build a multi-tier architecture (App + DB + Cache) using Docker Compose.
* Build custom images directly from a `docker-compose.yml` file.
* Use `depends_on` and `healthcheck` to control the exact startup order of services.
* Understand and apply different container `restart` policies.
* Define explicit custom networks, named volumes, and service labels.
* Scale services using Docker Compose and understand port-mapping limitations.

---

# 🛠️ Setup: The App Code

Before writing the Compose file, I created a simple Python Flask application that connects to Redis and PostgreSQL.

### 1. `app/requirements.txt`
```text
Flask==2.3.2
redis==4.5.5
psycopg2-binary==2.9.6

```

### 2. `app/app.py`

```python
import os
from flask import Flask
import redis
import psycopg2

app = Flask(__name__)
cache = redis.Redis(host='redis', port=6379)

@app.route('/')
def hello():
    try:
        cache.ping()
        cache_status = "Connected to Redis! 🟢"
    except Exception as e:
        cache_status = f"Redis Error: {e} 🔴"
        
    return f"<h1>Hello from Flask!</h1><p>{cache_status}</p>"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

```

---

# 🧪 Task 1 & 4: Build Your Own App Stack & Custom Dockerfiles

Instead of using a pre-built image for the web app, I wrote a `Dockerfile` and used the `build:` instruction in Docker Compose to build it dynamically.

### 1. `app/Dockerfile`

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
# Command to run the Flask app
CMD ["python", "app.py"]

```

### 2. Code Changes & Rebuilding (Task 4)

If I change `app.py`, I can rebuild the image and restart the container in one simple command without bringing the whole stack down:

```bash
docker compose up --build -d

```

---

# 🏗 Tasks 2, 3, & 5: The Ultimate `docker-compose.yml`

This file combines Tasks 2 (Healthchecks), 3 (Restart Policies), and 5 (Named Networks & Volumes) into one production-ready configuration.

```yaml
version: '3.8'

# Task 5: Explicit Networks
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge

# Task 5: Explicit Named Volumes
volumes:
  pg_data:

services:
  # --- WEB APP TIER ---
  web:
    build: ./app
    ports:
      - "5000:5000"
    networks:
      - frontend
      - backend
    # Task 2: Wait for DB to be HEALTHY, not just started
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    labels:
      - "env=development"
      - "tier=frontend"

  # --- DATABASE TIER ---
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: mydb
    volumes:
      - pg_data:/var/lib/postgresql/data
    networks:
      - backend
    # Task 3: Restart Policies
    restart: always
    # Task 2: Healthcheck
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U myuser -d mydb"]
      interval: 10s
      timeout: 5s
      retries: 5
    labels:
      - "tier=database"

  # --- CACHE TIER ---
  redis:
    image: redis:alpine
    networks:
      - backend
    restart: on-failure
    labels:
      - "tier=cache"

```

---

# 🔄 Task 2 Deep Dive: `depends_on` & Healthchecks

### Testing the Startup Order

When I ran `docker compose up -d`, I observed the following order:

1. `db` and `redis` started pulling and creating.
2. `web` waited in a "pending" state.
3. Once the database healthcheck passed (meaning PostgreSQL was fully ready to accept connections), the `web` container finally started.

**Why is this important?**
If a web app starts *before* the database finishes booting up, the app will try to connect, fail, and crash. `condition: service_healthy` solves this completely!

---

# ♻️ Task 3 Deep Dive: Restart Policies

I manually killed the database container using `docker kill <db_container_id>`. Because of the `restart: always` policy, Docker immediately spun it back up!

### When to use which policy?

* **`restart: always`**: The container will always restart if it stops, regardless of why it stopped (even if it crashed or was manually stopped). Best for critical infrastructure like databases or web servers that must remain online.
* **`restart: on-failure`**: The container will only restart if it exits with a non-zero exit code (an error). Best for background workers or scripts that are supposed to finish and stop successfully, but should retry if they crash.
* **`restart: unless-stopped`**: Similar to `always`, but if you manually stop the container, it will *not* automatically start back up when the Docker daemon reboots.

---
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/e9334b61-af3f-44e3-b7ab-b5ccdd6a16cf" />
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/474603a0-b32f-4c15-b5e2-edd8671efad0" />

# ⚖️ Task 6 (Bonus): Scaling

### Command

```bash
docker compose up --scale web=3 -d

```

### What happens? What breaks?

When running this command, Docker successfully creates 3 instances of the `web` container, but **it throws a Port Allocation Error** and fails to start two of them.

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/c6a6c69c-22ea-4570-b50c-35ccaa101ff9" />

### Why doesn't simple scaling work with port mapping?

In my compose file, I hardcoded the port mapping: `ports: - "5000:5000"`.

* Container 1 binds to port 5000 on my host machine.
* Container 2 tries to start and also bind to port 5000 on my host machine.
* The host machine rejects this because Port 5000 is already in use by Container 1!

**The Fix:**
To scale successfully, you must omit the host port and let Docker assign a random port, like this: `ports: - "5000"`. Then, you would put a Load Balancer (like an Nginx proxy) in front of them to route the traffic.

---

# 💡 Pro Tips

* Use `healthcheck` on databases and message queues to ensure they are truly ready before your app connects to them.
* Labels (`labels:`) do not change how the container runs, but they are incredibly useful for organizing, filtering, and monitoring services in production.
* Running `docker compose build --no-cache` forces Docker to completely rebuild your custom images from scratch, ignoring all previous layers.

---

# 🌟 Key Takeaways

* Docker Compose seamlessly integrates building custom images (`build:`) with pre-built images (`image:`).
* `depends_on` by itself only waits for a container to *start*. To wait for it to be *ready*, you must pair it with a `healthcheck`.
* Custom networks isolate traffic. In my setup, the `web` container can reach the internet (frontend) and the database (backend), but the database is securely isolated in the backend network.
* Scaling containers requires careful consideration of host port mappings to avoid collisions.

---

# 🤔 Reflection

### What surprised you most about Healthchecks?

I was surprised that Docker doesn't automatically know when a database is ready. Learning that a container being "Up" just means the OS started, not the database engine, was a major "aha!" moment.

### How did the custom networks improve security?

By defining a "backend" network for the database and cache, and not exposing their ports to the host machine, I ensured that absolutely no one from the outside world can directly access the database. Only the web app (which is on both networks) acts as the secure bridge!


