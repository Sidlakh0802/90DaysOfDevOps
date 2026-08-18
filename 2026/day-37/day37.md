
# 🧠 Day 37 – Docker Revision & Self-Assessment

> **"Taking a pause to consolidate knowledge ensures these concepts stick for the real-world job."**

---

# ✅ Self-Assessment Checklist

Here is my honest self-assessment of the Docker skills learned from Days 29 to 36:

* [x] Run a container from Docker Hub (interactive + detached)
* [x] List, stop, remove containers and images
* [x] Explain image layers and how caching works
* [x] Write a Dockerfile from scratch with FROM, RUN, COPY, WORKDIR, CMD
* [x] Explain CMD vs ENTRYPOINT
* [x] Build and tag a custom image
* [x] Create and use named volumes
* [x] Use bind mounts
* [x] Create custom networks and connect containers
* [x] Write a docker-compose.yml for a multi-container app
* [x] Use environment variables and .env files in Compose
* [x] Write a multi-stage Dockerfile
* [x] Push an image to Docker Hub
* [x] Use healthchecks and depends_on

---

# ⚡ Quick-Fire Questions (From Memory)

**1. What is the difference between an image and a container?**
An **image** is an immutable, read-only blueprint (like a recipe or a class in programming). A **container** is the live, running instance of that image (like the baked cake or an object).

**2. What happens to data inside a container when you remove it?**
It is permanently deleted. Container storage is ephemeral. To save data permanently, you must map it to a volume or bind mount.

**3. How do two containers on the same custom network communicate?**
They communicate using Docker's internal DNS. Instead of relying on IP addresses (which change), they simply use each other's container name or service name (e.g., `http://database:27017`).

**4. What does `docker compose down -v` do differently from `docker compose down`?**
A standard `down` stops and removes the containers and networks. Adding the `-v` flag also **deletes all named volumes** associated with the stack, wiping the persistent data.

**5. Why are multi-stage builds useful?**
They drastically reduce the final image size and improve security. Stage 1 compiles the code (using heavy tools), and Stage 2 takes only the finished artifact, leaving all the build tools and cached bloat behind.

**6. What is the difference between `COPY` and `ADD`?**
`COPY` simply copies local files/folders into the container. `ADD` does the same thing, but it has extra features: it can automatically extract `.tar` files and download files from URLs. (Best practice is to use `COPY` unless you specifically need those extra features).

**7. What does `-p 8080:80` mean?**
It is port mapping. It routes traffic from **Port 8080** on the host machine (your laptop/server) to **Port 80** inside the Docker container. 

**8. How do you check how much disk space Docker is using?**
`docker system df`

---

# 🔄 Revisit Weak Spots

*(Self-Note: Today I spent an extra 15 minutes revisiting `CMD` vs `ENTRYPOINT` to ensure I fully grasp the difference for interviews. `ENTRYPOINT` sets the hardcoded executable that cannot easily be overridden, while `CMD` provides the default arguments that can easily be swapped out by the user running the container.)*




# 🐳 The Ultimate Docker Cheat Sheet

> **A quick-reference guide for daily DevOps operations.**

### 📦 1. Container Commands (Lifecycle & Execution)
| Command | Description |
| :--- | :--- |
| `docker run -d -p 80:80 nginx` | Run a container in detached mode with port mapping |
| `docker run -it ubuntu bash` | Run a container interactively and open a bash shell |
| `docker ps` | List all running containers |
| `docker ps -a` | List ALL containers (running and stopped) |
| `docker stop <container_id>` | Gracefully stop a running container |
| `docker rm <container_id>` | Remove a stopped container |
| `docker rm -f <container_id>` | Forcefully stop and remove a container |
| `docker exec -it <container_id> sh` | Open a shell inside an already running container |
| `docker logs <container_id>` | View the console output/logs of a container |

### 🖼️ 2. Image Commands (Build & Distribute)
| Command | Description |
| :--- | :--- |
| `docker build -t myapp:v1 .` | Build an image from the Dockerfile in the current directory |
| `docker images` | List all downloaded/built images on your machine |
| `docker pull <image_name>` | Download an image from Docker Hub |
| `docker push <user>/<repo>:<tag>` | Push a tagged image to your Docker Hub repository |
| `docker tag <local> <remote>` | Tag an existing image for a remote repository |
| `docker rmi <image_id>` | Delete an image from your local machine |

### 💾 3. Volume Commands (Data Persistence)
| Command | Description |
| :--- | :--- |
| `docker volume create <name>` | Create a new named volume |
| `docker volume ls` | List all volumes on the host machine |
| `docker volume inspect <name>` | View detailed info (including host mount path) |
| `docker volume rm <name>` | Delete a specific volume |

### 🌐 4. Network Commands (Isolation & DNS)
| Command | Description |
| :--- | :--- |
| `docker network create <name>` | Create a custom bridge network |
| `docker network ls` | List all Docker networks |
| `docker network inspect <name>` | See which containers are connected to a network |
| `docker network connect <net> <con>`| Attach a running container to a network |

### 🐙 5. Docker Compose Commands (Orchestration)
| Command | Description |
| :--- | :--- |
| `docker compose up -d` | Build (if missing), create, and start containers in background |
| `docker compose up --build -d` | Force a fresh build of the images before starting |
| `docker compose down` | Stop and remove containers and networks |
| `docker compose down -v` | Stop and remove containers, networks, AND volumes |
| `docker compose logs -f` | Follow the logs of all services in real-time |
| `docker compose ps` | List status of services in the compose file |

### 🧹 6. Cleanup Commands (Disk Space Management)
| Command | Description |
| :--- | :--- |
| `docker system df` | Show exactly how much disk space Docker is using |
| `docker system prune -a` | **DANGER:** Delete ALL stopped containers, unused networks, and unused images |
| `docker volume prune` | Delete all anonymous/unattached volumes |

### 🏗️ 7. Dockerfile Instructions (The Blueprint)
| Instruction | Description |
| :--- | :--- |
| `FROM` | Sets the base image (e.g., `FROM node:18-alpine`) |
| `WORKDIR` | Sets the default directory inside the container for subsequent commands |
| `COPY` | Copies files from your host machine into the container |
| `RUN` | Executes a command during the **build** phase (e.g., `RUN npm install`) |
| `EXPOSE` | Documents the port the container will listen on (e.g., `EXPOSE 3000`) |
| `USER` | Switches the user context for security (e.g., `USER nodeapp`) |
| `CMD` | The default command to run when the container **starts** (can be overridden) |
| `ENTRYPOINT`| The strict command to run when the container starts (harder to override) |

```
