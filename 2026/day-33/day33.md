# 🚀 Day 33 – Docker Compose: Multi-Container Basics

> **"Yesterday you manually created networks and volumes and ran containers one by one. Docker Compose does all of that in a single YAML file."**

---

# 📖 Overview

Today's objective is to run multi-container applications with a single command using Docker Compose. This lab covers verifying Docker Compose, writing a basic single-container compose file, setting up a complex two-container WordPress and MySQL stack with persistent volumes, mastering essential Compose commands, and managing environment variables.

---

# 🎯 Learning Objectives

By the end of this lab, I will be able to:

* Check and verify Docker Compose installation.
* Write declarative multi-container configurations using `docker-compose.yml`.
* Set up automatic networking and data persistence for multi-tier applications.
* Master core Compose lifecycle commands (`up`, `down`, `logs`, `ps`).
* Manage configuration securely using `.env` files.

---

# 🏗 Docker Compose Architecture

```text
 ┌─────────────────────────────────────────────────────────┐
 │               docker-compose.yml (YAML)                 │
 └─────────────┬─────────────────────────────┬─────────────┘
               │                             │
               ▼                             ▼
       ┌───────────────┐             ┌───────────────┐
       │ WordPress Svc │             │   MySQL Svc   │
       └───────┬───────┘             └───────┬───────┘
               │                             │
               └──────────────┬──────────────┘
                              ▼
                Auto-Created Bridge Network
                              │
                              ▼
                Named Volume (Data Persistence)

```

---

# 🧪 Task 1 – Install & Verify

## Step 1 – Check Docker Compose Version

### Command

```bash
docker compose version

```

### Observation

Docker Compose comes pre-installed with Docker Desktop (Windows/macOS). 
On Linux/Ubuntu Docker Engine installations, it must be explicitly installed 
via the `docker-compose-plugin` package. Running this command confirms the 
active version and verifies that the CLI plugin is linked and ready for use.
---

# 📦 Task 2 – Your First Compose File

## Step 1 – Create the Project Folder

### Command

```bash
mkdir compose-basics
cd compose-basics
touch docker-compose.yml

```

## Step 2 – Write the Compose File

Inside `docker-compose.yml`, I added the following configuration:

```yaml
version: '3.8'

services:
  webserver:
    image: nginx:alpine
    ports:
      - "8080:80"

```

## Step 3 – Start, Access, and Stop

### Commands

```bash
# Start the container in detached mode
docker compose up -d


# Stop and clean up the container
docker compose down

```

### What Happens?

Docker Compose reads the YAML file, automatically creates a default network, pulls the `nginx:alpine` image, maps port 8080 on the host to port 80 in the container, and starts the service. Accessing `http://<EC2-IP>:8080` displays the default Nginx welcome page.

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/a6f93c37-2cf4-4eee-8355-34ad104197ac" />

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/58299d0d-35f2-4220-af1c-22fe1f97feee" />

---

# 🏗 Task 3 – Two-Container Setup (WordPress & MySQL)

## Step 1 – Write the Multi-Container Compose File

I created a new project directory with a `docker-compose.yml` file to run WordPress and MySQL together:

```yaml
version: '3.8'

services:
  wordpress:
    image: wordpress:latest
    ports:
      - "80:80"
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: root
      WORDPRESS_DB_PASSWORD: secretpassword
      WORDPRESS_DB_NAME: wordpress
    restart: always

  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: secretpassword
      MYSQL_DATABASE: wordpress
    volumes:
      - db_data:/var/lib/mysql
    restart: always

volumes:
  db_data:

```

## Step 2 – Start and Verify Persistence

### Commands

```bash
# Start the stack
docker compose up -d

# Tear down the stack
docker compose down

# Bring it back up
docker compose up -d

```

### Observation

* **Automatic Networking:** Compose automatically places both containers on the same default network, allowing WordPress to communicate with MySQL simply by using its service name (`db:3306`).
* **Data Persistence:** Even after running `docker compose down` and removing the containers, bringing the stack back up with `docker compose up -d` preserves all setup configurations and blog posts because the data is safely stored in the `db_data` named volume.

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/31cc88a0-ff76-4f21-acda-0b448b732a7a" />

## APP WORKING
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/a6a212fa-5546-48d0-9b39-749d0a06c314" />

## SAME NETWORK

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/74697bb3-e0f4-4350-aa08-d754e132b85b" />



---

# 🛠 Task 4 – Compose Commands Reference

Here are the essential daily commands used to manage a Docker Compose stack:

| Operation | Command | Description |
| --- | --- | --- |
| **Start in background** | `docker compose up -d` | Builds, (re)creates, starts, and attaches to containers in the background. |
| **View running services** | `docker compose ps` | Lists all containers managed by the current Compose project. |
| **View all logs** | `docker compose logs -f` | Streams logs from all active services simultaneously. |
| **View specific logs** | `docker compose logs -f wordpress` | Streams logs for a single specified service (e.g., `wordpress`). |
| **Stop without removing** | `docker compose stop` | Stops running containers without deleting them or their data. |
| **Remove everything** | `docker compose down` | Stops and removes containers and networks created by `up`. |
| **Rebuild images** | `docker compose up --build -d` | Forces Docker to rebuild images if modifications were made to a Dockerfile. |

---

# 🔐 Task 5 – Environment Variables & `.env` Files

## Step 1 – Create a `.env` file

To keep credentials out of the main configuration file, I created a `.env` file in the same directory:

```env
DB_PASSWORD=supersecretsecurepassword
DB_NAME=my_custom_wordpress_db

```

## Step 2 – Reference Variables in `docker-compose.yml`

I updated the compose file to pull variables dynamically using syntax like `${VARIABLE_NAME}`:

```yaml
version: '3.8'

services:
  wordpress:
    image: wordpress:latest
    ports:
      - "80:80"
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: root
      WORDPRESS_DB_PASSWORD: ${DB_PASSWORD}
      WORDPRESS_DB_NAME: ${DB_NAME}
    restart: always

  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
    volumes:
      - db_data:/var/lib/mysql
    restart: always

volumes:
  db_data:

```

### Observation

Docker Compose automatically reads the `.env` file in the current working directory and injects the variables safely into the configuration during runtime, keeping secrets secure and separate from your infrastructure blueprint.


<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/aa2f51dc-6f03-4d3e-b7f9-43e93216a771" />

---

# 💡 Pro Tips

* Always place your `.env` file in the exact same directory as your `docker-compose.yml`.
* Use service names (like `db` or `wordpress`) as hostnames for internal container-to-container communication.
* Run `docker compose config` to validate your syntax and check how Compose interprets your environment variables before starting containers.
* Use `docker compose down -v` with caution—the `-v` flag deletes your named volumes and will wipe out database data permanently!

---

# 🌟 Key Takeaways

* Docker Compose replaces long, complex manual `docker run` commands with clean, version-controlled YAML files.
* A single command (`docker compose up -d`) sets up networks, volumes, and multiple containers simultaneously.
* Environment variables and `.env` files allow secure separation of configuration and secrets.
* Service discovery is built-in; containers can talk to each other using their service names out of the box.

---

# 🤔 Reflection

### What surprised you most about using Docker Compose?

I was amazed by how effortlessly it handles networking. Instead of manually creating a bridge network and connecting containers to it, Compose handles service discovery and internal DNS automatically through service names.

---

### Why is using a `.env` file better than hardcoding passwords in YAML?

It keeps sensitive credentials out of code repositories (like GitHub), making it much more secure and allowing the same configuration template to be easily reused across different environments (development, staging, production).

---

### Which Compose command do you think you'll use the most?

`docker compose up -d` for spinning up environments quickly, and `docker compose logs -f` for troubleshooting application errors in real time.

```

```
