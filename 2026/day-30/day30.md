# 🚀 Day 30 – Docker Images & Container Lifecycle

> **"Docker Images are the blueprints, and Containers are the running applications built from those blueprints."**

---

# 📖 Overview

Today's objective is to understand how Docker Images and Containers work together. This lab covers image management, image layers, the complete container lifecycle, inspecting running containers, viewing logs, and cleaning up Docker resources.

---

# 🎯 Learning Objectives

By the end of this lab, I will be able to:

* Understand Docker Images and Containers
* Learn the relationship between Images and Containers
* Understand Docker Image Layers and Caching
* Practice the complete Container Lifecycle
* Inspect Images and Containers
* View Container Logs
* Execute commands inside Containers
* Perform Docker Cleanup
* Analyze Docker Disk Usage

---

# 🏗 Docker Architecture

```text
                Docker Hub
                     │
             docker pull nginx
                     │
                     ▼
        Docker Image (Read-Only Template)
                     │
             docker run nginx
                     │
                     ▼
        Docker Container (Running Instance)
```

---

# 📦 Understanding Docker Images

## What is a Docker Image?

A **Docker Image** is a read-only template that contains everything required to run an application.

It includes:

* Application Code
* Runtime Environment
* Required Libraries
* Dependencies
* Environment Variables
* Configuration Files

An image cannot run by itself. It becomes useful only when Docker creates a container from it.

### Real Life Example

Imagine constructing a house.

* 🏗 Blueprint = Docker Image
* 🏠 Constructed House = Docker Container

One blueprint can be used to build many houses, just like one Docker image can create multiple containers.

---

# 🧪 Task 1 – Working with Docker Images

## Step 1 – Pull Images

### Command

```bash
docker pull nginx
docker pull ubuntu
docker pull alpine
```

### What Happens?

* Docker contacts Docker Hub.
* Downloads the image if it is not already present locally.
* Downloads only missing layers instead of the complete image.

### Screenshot
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/036d0034-3501-4ccf-982d-b5ad904db9d1" />


---

## Step 2 – List Local Images

### Command

```bash
docker images
```

### Observe

* Repository
* Tag
* Image ID
* Created Date
* Size

### Your Observation
* Docker stores each image with a unique Image ID, which uniquely identifies that image on the local machine.
* All images are tagged as latest, meaning Docker pulled the most recent version available from Docker Hub.
* The Alpine image is significantly smaller than the Ubuntu image because Alpine is designed as a minimal Linux distribution with only essential packages.
* The Nginx image is larger than Alpine because it includes the Nginx web server along with the necessary libraries and configuration files.
* The hello-world image is the smallest because it contains only a simple program that prints a welcome message and exits.
* I also noticed that Docker displays both Content Size and Disk Usage. The content size represents the actual size of the image itself, while disk usage can be higher because Docker stores image layers, metadata, and shared data on the local system.
### Screenshot

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/ef4c735b-195a-4891-91ed-24cc31497d3a" />


---

## Step 3 – Compare Ubuntu vs Alpine

| Ubuntu                   | Alpine                             |
| ------------------------ | ---------------------------------- |
| Large Image Size         | Very Small Image Size              |
| Includes many utilities  | Minimal Linux Distribution         |
| Suitable for development | Suitable for production containers |
| Longer download time     | Faster download                    |

### Why is Alpine Smaller?

Alpine Linux is designed to be lightweight.

It removes unnecessary packages, documentation, and utilities while keeping only the essential components required to run applications.

### Advantages of Alpine

* Faster image download
* Smaller storage usage
* Reduced attack surface
* Better security
* Faster deployments

### Your Observation

The three Images we downloaded form Hub have a huge storage gap!! Alpine image is approx 100-200 mb smaller than ubuntu and nginx which means, it will be more production friendly image, faster and will utilise less resources to run an application


---

## Step 4 – Inspect an Image

### Command

```bash
docker image inspect nginx
```

### Important Information to Observe

* Image ID
* Created Date
* Architecture
* Operating System
* Environment Variables
* Entrypoint
* Working Directory
* Root Filesystem
* Layers

### Screenshot

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/8c82ad5a-635f-4196-8d21-1f925414bae4" />



---

## Step 5 – Remove an Image

### Command

```bash
docker rmi ubuntu
```

### Observation

Docker removes the image only if it is not being used by any existing container.

### Screenshot

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/98a5239c-8cbd-43f5-95d9-6b64df7bd1d9" />


---

# 🧱 Task 2 – Understanding Docker Image Layers

## What are Docker Layers?

Docker Images are not stored as a single large file. Instead, they are made up of multiple read-only layers, where each layer represents a specific change made while building the image. This layered architecture is one of Docker's most powerful features because it makes images faster to build, easier to share, and more storage-efficient. Whenever Docker reads a Dockerfile, it processes each instruction from top to bottom. Most instructions, such as RUN, COPY, or ADD, create a new layer. Docker then stacks these layers together to build the final image.

For example:

```Dockerfile
FROM ubuntu
RUN apt update
RUN apt install nginx
COPY . .
CMD ["nginx"]
```

Each instruction above becomes a separate image layer.

The image created from this Dockerfile consists of multiple layers:

## Docker Image Layers

```text
                     Docker Image
                           ▲
                           │
          ┌──────────────────────────┐
          │ CMD ["nginx"]            │
          └──────────────────────────┘
                           ▲
          ┌──────────────────────────┐
          │ COPY . .                 │
          └──────────────────────────┘
                           ▲
          ┌──────────────────────────┐
          │ RUN apt install nginx    │
          └──────────────────────────┘
                           ▲
          ┌──────────────────────────┐
          │ RUN apt update           │
          └──────────────────────────┘
                           ▲
          ┌──────────────────────────┐
          │ FROM ubuntu              │
          └──────────────────────────┘
```
Each layer depends on the layer below it, and together they form the complete Docker image.

🔒 Read-Only Layers

All image layers are read-only (immutable), meaning they cannot be modified after they are created. When a container starts, Docker adds a writable layer on top of these image layers. Any changes made while the container is running—such as creating files or modifying data—are stored only in this writable layer, while the original image remains unchanged.



This is exactly how Docker layers work.

---

## View Image History

### Command

```bash
docker image history nginx
```

### Screenshot

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/f8b5f8be-fae1-4e31-a9ba-d49cbd140422" />


---

## What Did You Notice?

* Multiple layers are displayed.
* Some layers have actual sizes.
* Some layers show **0B**.

### Why do some layers show 0B?

Instructions such as:

* ENV
* LABEL
* CMD
* ENTRYPOINT
* WORKDIR

only change image metadata and do not add files, so they consume almost no additional storage.

---

## Why Docker Uses Layers

Docker layers provide several benefits:

### 🚀 Faster Builds

Docker caches each layer after it is built. If only one part of the Dockerfile changes, Docker reuses the unchanged layers and rebuilds only the modified ones, significantly reducing build time.

### 💾 Storage Efficiency

Multiple Docker images can share common layers. For example, if several images use the same Ubuntu base image, Docker stores that base layer only once, saving disk space

### ⚡ Faster Downloads

When pulling an image from Docker Hub, Docker downloads only the layers that are missing on the local machine instead of downloading the entire image every time.

### 🔁 Better Caching

Previously built layers are reused.

### 📦 Easy Version Control

Every layer represents a single change.

---

# 🔄 Task 3 – Docker Container Lifecycle

Containers move through different states during their lifetime.

```text
Create
   │
   ▼
Running
   │
Pause
   │
Unpause
   │
Stop
   │
Restart
   │
Kill
   │
Remove
```

---

## Step 1 – Create a Container

```bash
docker create --name demo-container nginx
```

**State:** `Created`

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/ae4f8487-0198-48af-9678-685573a10d3d" />


---

## Step 2 – Start the Container

```bash
docker start demo-container
```

**State:** `Running`
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/b6671463-5ecc-406c-9c72-a9b00d3e6f71" />


---

## Step 3 – Pause the Container

```bash
docker pause demo-container
```
Think of Pause as pressing the pause button on a movie. The container still exists but temporarily stops execution.

📸 Screenshot

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/4b9a6e1f-4e25-40cf-b5c9-9f3ef20ac28f" />


## Step 4 – Unpause the Container

```bash
docker unpause demo-container
```

**State:** `Running`

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/8d70246f-bc84-422a-b2cd-5fd06e3a72b4" />


---

## Step 5 – Stop the Container

```bash
docker stop demo-container
```

**State:** `Exited`

Docker gracefully stops the application running inside the container.

📸 Screenshot

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/011ea1c6-59bc-4ec7-9ef2-7ed082314ce2" />


## Step 6 – Restart the Container

```bash
docker restart demo-container
```

Docker performs:

```text
Stop
   ↓
Start
```

automatically.

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/4ed2488b-a787-4fa8-a020-06f00f71629c" />


---

## Step 7 – Kill the Container

```bash
docker kill demo-container
```

Unlike `docker stop`, this command immediately terminates the running process without waiting.

📸 Screenshot

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/8c49b678-c59b-4fe5-8e9c-86ae9e931162" />


## Step 8 – Remove the Container

```bash
docker rm demo-container
```

The container is permanently removed from the system.

📸 Screenshot

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/df682f71-1a4d-4e86-8f56-332f31d93b3b" />


## Container Lifecycle Summary

| Command        | Container State |
| -------------- | --------------- |
| docker create  | Created         |
| docker start   | Running         |
| docker pause   | Paused          |
| docker unpause | Running         |
| docker stop    | Exited          |
| docker restart | Running         |
| docker kill    | Exited          |
| docker rm      | Removed         |

---

# 🖥 Task 4 – Working with Running Containers

## Run an Nginx Container

```bash
docker run -d --name nginx-demo -p 8080:80 nginx
```

### Explanation

* `-d` → Detached Mode
* `--name` → Container Name
* `-p` → Port Mapping (Host:Container)

📸 Screenshot

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/cb136b9d-1107-4c46-8e81-860e058dfe1b" />


## View Logs

```bash
docker logs nginx-demo
```

Logs help identify:

* Startup messages
* Errors
* Requests
* Warnings

📸 Screenshot

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/0481ffda-0da5-4998-96c7-2c6398139414" />


## View Live Logs

```bash
docker logs -f nginx-demo
```

Similar to Linux:

```bash
tail -f logfile
```

Useful for monitoring applications in real time.

📸 Screenshot

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/f36463bf-6690-4e8f-8926-64783b982a67" />


## Access the Running Container

```bash
docker exec -it nginx-demo bash
```

If Bash is unavailable:

```bash
docker exec -it nginx-demo sh
```

Explore directories such as:

```text
/
etc
usr
var
tmp
home
```

📸 Screenshot

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/b2ec8669-e44a-4c67-8f21-09c1fc2eafca" />


## Execute a Single Command

```bash
docker exec nginx-demo ls /
```

Useful when you only need to execute one command without opening an interactive shell.

📸 Screenshot

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/f479d2d6-046b-40e0-9373-6f07637109bf" />


## Inspect the Container

```bash
docker inspect nginx-demo
```

Look for:

* Container ID
* Image
* IP Address
* Port Bindings
* Network
* Mount Points
* Restart Policy

📸 Screenshot

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/2b5259ce-c2c0-4a3f-b939-9366c6348b65" />


# 🧹 Task 5 – Docker Cleanup

## Stop All Running Containers

```bash
docker stop $(docker ps -q)
```

📸 Screenshot

---

## Remove All Stopped Containers

```bash
docker container prune
```

📸 Screenshot

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/67d21ac6-c996-40ac-89cf-0c2b20561612" />


## Remove Unused Images

```bash
docker image prune
```

📸 Screenshot

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/edf4646d-f806-44bd-9dc2-a777d87b06f4" />


## Check Docker Disk Usage

```bash
docker system df
```

This command displays:

* Images
* Containers
* Volumes
* Build Cache
* Total Disk Usage

📸 Screenshot

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/398394ba-f755-48f4-b314-4b005754e0af" />


# 💡 Pro Tips

* Use **Alpine** images whenever possible for lightweight production deployments.
* Use **docker inspect** to troubleshoot networking and configuration issues.
* Regularly clean up unused Docker resources to save disk space.
* Order Dockerfile instructions carefully to maximize build cache efficiency.
* Use detached mode (`-d`) for services like Nginx, databases, and APIs.

---

# 🌟 Key Takeaways

* Docker Images are immutable templates used to create containers.
* Containers are lightweight, isolated runtime instances of Docker Images.
* Docker Images are built using reusable layers, making builds faster and storage more efficient.
* Docker caching significantly reduces build time by reusing unchanged layers.
* The container lifecycle includes Created, Running, Paused, Exited, and Removed states.
* Commands like `docker logs`, `docker exec`, and `docker inspect` are essential for troubleshooting.
* Cleanup commands help maintain a healthy Docker environment and reclaim storage.

---

# 🤔 Reflection

### What surprised you most about Docker Image Layers?
I think image layers is like a script you speak lines one by one similarly docker layers helps in building the final image one by one

---

### Which container lifecycle command do you think you'll use most often?

Well I  think the most common command will be " docker start" and "docker restart" as debugging and changes will require the container to start or restart again

---

### When would you use `docker inspect` in a real project?

This will be majorly used when container crashes and to find configurations of the container like same network , correct architecture etc 

---

### Which Docker command did you find most useful today?

I would say "docker inspect" and "docker logs" to check the current scenario of the container 

---

