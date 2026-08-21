
# 🏃‍♂️ Day 42 – Runners: GitHub-Hosted & Self-Hosted

> **"Every job needs a machine to run on. Today, I took control of the physical infrastructure that powers my CI/CD pipelines."**

---

## ☁️ Task 1: GitHub-Hosted Runners

A GitHub-hosted runner is a fresh, temporary virtual machine provided directly by GitHub. It acts like a fully furnished hotel room: the moment your workflow starts, GitHub hands you the keys to a brand new Ubuntu, Windows, or macOS server. The moment the job finishes, the server is completely destroyed and thrown away. GitHub manages all the maintenance, networking, and OS updates.

### 📄 `.github/workflows/hosted-runners.yml`
```yaml
name: GitHub Hosted Runners Explorer

on:
  push:
    branches: [ "main" ]

jobs:
  explore-ubuntu:
    runs-on: ubuntu-latest
    steps:
      - name: Print OS, Hostname, User
        run: |
          echo "OS: $RUNNER_OS"
          hostname
          whoami
          
      # (Task 2 included here)
      - name: Check Pre-installed Tools
        run: |
          docker --version
          python --version
          node --version
          git --version

  explore-windows:
    runs-on: windows-latest
    steps:
      - name: Print OS, Hostname, User
        run: |
          echo "OS: $env:RUNNER_OS"
          hostname
          whoami

  explore-macos:
    runs-on: macos-latest
    steps:
      - name: Print OS, Hostname, User
        run: |
          echo "OS: $RUNNER_OS"
          hostname
          whoami

```

---
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/a38a02fc-145f-456a-857a-5b30627772d1" />

## 🛠️ Task 2: Explore What's Pre-installed

When checking the `ubuntu-latest` runner, I was able to successfully print the versions for Docker, Python, Node, and Git without installing a single thing.

**Why does this matter?**
If runners did not come heavily pre-loaded with these developer tools, we would have to write dozens of lines of complex setup scripts to download and configure them every single time a pipeline ran. Pre-installed tools save massive amounts of execution time, keep our YAML files clean, and drastically reduce computing costs.

---

## 🖥️ Task 3: Set Up a Self-Hosted Runner

I successfully configured a self-hosted Linux runner. A self-hosted runner is a physical or virtual machine that *you* own (like an AWS EC2 instance) that is securely connected to GitHub. Instead of GitHub spinning up a temporary server, your machine constantly listens and says, "Give me the jobs, I will run them right here."

*(Note: My runner successfully showed up in my GitHub Settings with a green dot indicating it is **Idle** and ready for jobs! Screenshot attached in my repository).*
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/be105223-dbc4-4750-86e5-117f6bc234df" />
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/410f5bc2-a5a3-436c-845d-e5e085afc77b" />


---

## 🚀 Task 4: Use Your Self-Hosted Runner

To prove the runner was executing code on my actual machine, I wrote a workflow targeting `self-hosted`, printed the server's hostname, and created a text file. When I SSH'd back into my server, the file `i-was-created-by-github-actions.txt` was sitting right there in my directory!

### 📄 `.github/workflows/self-hosted.yml`

```yaml
name: Self-Hosted Runner Test

on:
  push:
    branches: [ "main" ]

jobs:
  run-on-my-machine:
    # Notice the label added here for Task 5!
    runs-on: [self-hosted, my-linux-runner]
    
    steps:
      - name: Prove it is my physical machine
        run: |
          hostname
          pwd
          
      - name: Create a physical file
        run: touch i-was-created-by-github-actions.txt

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/5d3d1644-0aa3-45c0-b2d1-8c7c80f4e066" />
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/629e1830-3bee-430b-a4f1-6bf49b4f3aa1" />

---

## 🏷️ Task 5: Labels

During configuration, I assigned the custom label `my-linux-runner` to my machine.

**Why are labels useful?**
Labels act as precise routing tags for your physical servers. If a company has 10 different self-hosted runners, labels ensure that a heavy Machine Learning pipeline is routed exactly to `[self-hosted, gpu-enabled]`, and a highly sensitive deployment script only goes to `[self-hosted, secure-internal-network]`.

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/8c25594d-c6ec-4e3c-b407-b976949ca9e4" />


---

## ⚖️ Task 6: GitHub-Hosted vs. Self-Hosted

Here is a quick breakdown of when to use which infrastructure:

| Feature | GitHub-Hosted | Self-Hosted |
| --- | --- | --- |
| **Who manages it?** | GitHub handles all hardware, networking, and OS updates. | You handle all OS updates, patches, and physical maintenance. |
| **Cost** | Pay-per-minute (includes a generous free tier). | You pay your cloud provider (AWS/Azure) for the constant VM uptime. |
| **Pre-installed tools** | Massive library of tools (Docker, Node, Java, etc.) | None. You must install exactly what your pipeline needs manually. |
| **Good for** | Standard web apps, open-source projects, generic builds. | Apps that need access to internal private VPNs, databases, or massive CPU. |
| **Security concern** | Very low. The VM is destroyed after every single run. | Moderate. Because the server persists between jobs, malicious code could leave malware behind. |

```

```
