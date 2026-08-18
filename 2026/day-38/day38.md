Welcome to Day 38! Moving from Docker into YAML is the perfect transition. YAML is the absolute backbone of almost every modern DevOps tool—Kubernetes, Ansible, GitHub Actions, GitLab CI, and (as you already saw) Docker Compose.

Getting the syntax right (and avoiding the dreaded "Tab vs. Space" errors) will save you hours of debugging later on.



# 📝 Day 38 – YAML Basics

> **"Before writing a single CI/CD pipeline, you need to get comfortable with YAML — the language every pipeline is written in."**

---

## 📄 My YAML Files

### 1. `person.yaml` (Key-Value Pairs & Lists)
This file describes basic attributes and uses both block and inline list formats.

```yaml
---
name: Siddharth
role: DevOps Engineer
experience_years: 1
learning: true
tools:
  - Linux
  - Git
  - Docker
  - GitHub Actions
  - AWS
hobbies: [coding, Music, gaming]

```

### 2. `server.yaml` (Nested Objects & Multi-line Strings)

This file maps out a standard server and database configuration, utilizing nested mappings and different string preservation styles.

```yaml
---
server:
  name: web-app-prod
  ip: 10.0.0.45
  port: 8080

database:
  host: db.internal.local
  name: production_db
  credentials:
    user: admin
    password: supersecretpassword

startup_script: |
  #!/bin/bash
  echo "Server is booting up..."
  systemctl start nginx
  systemctl enable nginx

description: >
  This server is responsible for handling all incoming 
  web traffic and routing it to the appropriate internal 
  microservices securely.

```

---

## 🧠 Task Answers & Notes

### Task 2: What are the two ways to write a list in YAML?

1. **Block Format:** Using a hyphen and a space (`- `) on new lines for each item. This is standard for long or complex lists.
2. **Inline (Flow) Format:** Using square brackets separated by commas (`[item1, item2]`). This is best for short, simple lists on a single line.

### Task 3: What happens when you try adding a tab instead of spaces?

YAML **strictly forbids** tabs for indentation. If you use a tab, the YAML validator will instantly fail and throw a syntax error, usually something like: `found character '\t' that cannot start any token`. Always use the spacebar (2 spaces is the industry standard).

### Task 4: When would you use `|` vs `>`?

* **The `|` (Literal Block):** Preserves every single newline exactly as you type it. You use this for bash scripts, SSH keys, or configuration files where line breaks are critical to the code running correctly.
* **The `>` (Folded Block):** Folds all text into a single, continuous line (replacing newlines with spaces). You use this for writing long paragraphs, descriptions, or logs where you want the YAML file to look readable, but the program reading it just needs one long string.

### Task 5: Validating YAML

When I intentionally broke the indentation on the `database` block, `yamllint` threw the error: `mapping values are not allowed here` or `bad indentation of a mapping entry`. Fixing it back to strict 2-space indentation resolved the error immediately.

### Task 6: Spot the Difference

**The broken code:**

```yaml
name: devops
tools:
- docker
  - kubernetes

```

**What is wrong:** In YAML, items in the same list must share the exact same indentation level. In the broken block, `- kubernetes` is indented further than `- docker`. The YAML parser gets confused because it thinks `kubernetes` is supposed to be a child of `docker`, rather than a sibling in the same `tools` list.

---

## 💡 3 Key Things I Learned Today

1. **Indentation is Law:** YAML relies entirely on visual structure. Missing a single space or accidentally using a tab will break the entire configuration. (Always set your IDE to convert tabs to spaces!)
2. **Booleans vs. Strings:** Writing `true` or `false` without quotes is read as a boolean value. If you put quotes around them (`"true"`), the system reads it as standard text, which can break conditional logic in pipelines.
3. **Multi-line Magic:** Knowing the difference between `|` (literal) and `>` (folded) is incredibly useful. I'll need `|` constantly for writing inline shell scripts inside my CI/CD jobs.

```

```
