


# 🚀 Day 31 – Dockerfile: Build Your Own Images

> **"This is the skill that separates someone who uses Docker from someone who actually ships with Docker."**

---

# 📖 Overview

Today's objective is to transition from running pre-made images to writing `Dockerfile`s and building custom images from scratch. This lab covers creating basic images, understanding Dockerfile instructions, comparing CMD and ENTRYPOINT, containerizing a web application, using `.dockerignore`, and optimizing build layers.

---

# 🎯 Learning Objectives

By the end of this lab, I will be able to:

* Write a `Dockerfile` from scratch.
* Understand core instructions: `FROM`, `RUN`, `COPY`, `WORKDIR`, `EXPOSE`, and `CMD`.
* Differentiate between `CMD` and `ENTRYPOINT`.
* Containerize a static web application using Nginx.
* Exclude files from the build context using `.dockerignore`.
* Optimize image builds by leveraging Docker layer caching.

---

# 🏗 The Docker Build Process

```text
 ┌────────────────┐        ┌────────────────┐        ┌────────────────┐
 │                │        │                │        │                │
 │   Dockerfile   ├───────►│  docker build  ├───────►│  Docker Image  │
 │ (Instructions) │        │   (The Engine) │        │  (Blueprint)   │
 │                │        │                │        │                │
 └────────────────┘        └────────────────┘        └────────────────┘

```

---

# 🧪 Task 1 – Your First Dockerfile

## Step 1 – Create the Setup

### Command

```bash
mkdir my-first-image
cd my-first-image
touch Dockerfile

```

## Step 2 – Write the Dockerfile

Inside the `Dockerfile`, I added the following:

```dockerfile
# Use ubuntu as the base image
FROM ubuntu:latest

# Install curl
RUN apt-get update && apt-get install -y curl

# Set a default command to print a message
CMD ["echo", "Hello from my custom image!"]

```

## Step 3 – Build and Run the Image

### Command

```bash
# Build the image and tag it
docker build -t my-ubuntu:v1 .

# Run a container from the new image
docker run my-ubuntu:v1

```

### What Happens?

* Docker reads the `Dockerfile` in the current directory (`.`).
* It pulls the Ubuntu base image, runs the installation for `curl`, and sets the default command.
* When running the container, it immediately prints "Hello from my custom image!" and exits.

### Screenshot

📸 `[Insert Screenshot of the terminal output here]`

---

# 🧱 Task 2 – Dockerfile Instructions

## Step 1 – Write a Comprehensive Dockerfile

I created a new `Dockerfile` to utilize all major instructions:

```dockerfile
# 1. Base Image
FROM ubuntu:latest

# 2. Set working directory inside the container
WORKDIR /app

# 3. Execute commands during the build process
RUN apt-get update && apt-get install -y python3

# 4. Copy files from the host to the container
COPY script.py .

# 5. Document the port the container will use
EXPOSE 8080

# 6. Default command to run when the container starts
CMD ["python3", "script.py"]

```

### Explanation of Instructions

* **`FROM`**: The starting point. Every Dockerfile must start with this.
* **`WORKDIR`**: Like running `cd /app`. Sets the directory for all following commands.
* **`RUN`**: Runs terminal commands *during* the build (creating a new layer).
* **`COPY`**: Copies files from my local computer into the image.
* **`EXPOSE`**: Documentation only; tells other developers what port the app uses.
* **`CMD`**: The default command that executes when a container is started from the image.

---

# 🔄 Task 3 – CMD vs ENTRYPOINT

## Step 1 – Testing CMD

### Dockerfile

```dockerfile
FROM alpine
CMD ["echo", "Hello CMD"]

```

### Commands & Observation

```bash
# Standard Run
docker run cmd-test
# Output: Hello CMD

# Custom Command Run
docker run cmd-test echo "Overridden!"
# Output: Overridden!

```

* **Observation:** `CMD` is easily overridden by passing a new command at the end of `docker run`.

## Step 2 – Testing ENTRYPOINT

### Dockerfile

```dockerfile
FROM alpine
ENTRYPOINT ["echo", "Hello ENTRYPOINT"]

```

### Commands & Observation

```bash
# Standard Run
docker run entry-test
# Output: Hello ENTRYPOINT

# Custom Arguments Run
docker run entry-test "Added text!"
# Output: Hello ENTRYPOINT Added text!

```

* **Observation:** `ENTRYPOINT` acts as a strict executable. Anything added to the end of `docker run` is passed as an *argument* to it, rather than overriding it.

### Your Notes: When to use which?

Use **`CMD`** when you want to provide a default command that a user can easily override (like dropping into `bash`). Use **`ENTRYPOINT`** when your container is designed to act as a single, dedicated executable and you only want users to pass flags or arguments to it.

---

# 🌐 Task 4 – Build a Simple Web App Image

## Step 1 – Create the HTML File

Created `index.html`:

```html
<!DOCTYPE html>
<html>
<head><title>Day 31 Web App</title></head>
<body>
    <h1>Welcome to my Custom Nginx Docker Image!</h1>
    <p>Built during the 90 Days of DevOps challenge.</p>
</body>
</html>

```

## Step 2 – Write the Dockerfile

```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/

```

## Step 3 – Build and Run

### Command

```bash
docker build -t my-website:v1 .
docker run -d -p 8080:80 my-website:v1

```

### What Happens?

Docker builds a custom Nginx image containing my static HTML file. Running it with port mapping allows me to view the website on my host machine.

### Screenshot

📸 `[Insert Screenshot of the Webpage in your Browser here]`

---

# 🛡️ Task 5 – .dockerignore

## Step 1 – Create a `.dockerignore` file

To prevent sensitive or massive files from being copied into the image, I created a `.dockerignore` file in the project folder:

```text
node_modules
.git
*.md
.env

```

## Step 2 – Build and Verify

### Observation

When running `docker build`, Docker checks this file first. The "build context" sent to the Docker daemon is significantly smaller because folders like `node_modules` and files like `.env` are completely ignored and excluded from the final image.

---

# ⚡ Task 6 – Build Optimization

## Step 1 – Testing the Cache

I built an image, changed one line at the bottom of the `Dockerfile`, and rebuilt it.

### Command

```bash
docker build -t cache-test .

```

### Observation

Docker outputs `CACHED` for all the steps above the changed line. It only took time to execute the single line I changed and the steps below it.

### Why does layer order matter for build speed?

Docker builds images in layers. If a layer changes, Docker invalidates the cache for that layer **and all layers below it**.
To optimize build speed, frequently changing lines (like `COPY . .` for application code) must be placed at the very bottom, while rarely changing lines (like `RUN apt-get update`) must be placed at the top.

---

# 💡 Pro Tips

* Always use `.dockerignore` to keep your images secure (no `.env` files!) and small (no `node_modules`).
* Group `RUN` commands together using `&&` to reduce the number of image layers created.
* Use lightweight base images like `alpine` whenever possible.
* The `.` at the end of `docker build -t name:tag .` is crucial—it defines the "build context" (the current directory).

---

# 🌟 Key Takeaways

* `Dockerfile`s are step-by-step instructions for building automated images.
* Each instruction in a Dockerfile creates a new, read-only image layer.
* `CMD` provides defaults that can be overridden, while `ENTRYPOINT` forces the container to run a specific executable.
* Proper layer ordering is the secret to blazing-fast container builds.

---

# 🤔 Reflection

### What surprised you most about writing Dockerfiles?

I was surprised by how similar it is to writing a regular bash script, but with the added superpower of being able to instantly package an entire operating system around the script.

---

### Why is layer caching so important in real-world DevOps?

In real-world projects, developers build images dozens of times a day. If Docker had to redownload Ubuntu and reinstall Python every single time I changed one line of HTML, deployments would take hours instead of seconds.

---

### Which instruction did you find most useful today?

The `COPY` instruction. It is the bridge between the code I write on my local laptop and the isolated environment inside the container.

```

```
