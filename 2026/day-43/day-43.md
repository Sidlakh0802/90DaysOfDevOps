
# 🎛️ Day 43 – Jobs, Steps, Env Vars & Conditionals

> **"Pipelines aren't just rigid lists of terminal commands. Today, I learned how to build smart, context-aware workflows that make decisions, pass data across servers, and control their own execution flow."**

---

## 🔗 Task 1: Multi-Job Workflow & Dependencies

By default, if you put multiple jobs in a GitHub Actions workflow, GitHub will spin up separate servers and run them all at the exact same time (in parallel) to save time. However, in DevOps, we usually need things to happen in a strict order: you cannot deploy code that hasn't been tested.

We solve this using the **`needs:`** keyword. 

**The Technical Definition:** The `needs` key explicitly defines a dependency chain. It forces a downstream job to wait in a "Pending" state until its prerequisite job finishes with a "Success" exit code.
**The Everyday Definition:** Think of it like a **relay race**. The `deploy` runner is standing on the track, waiting. It physically cannot start running until the `test` runner officially crosses the finish line and hands off the baton. If the `test` runner trips and crashes (fails), the race is called off, and the `deploy` runner never starts. This is how we protect production environments from broken code.

### 📄 `.github/workflows/multi-job.yml`
```yaml
name: Multi-Job Chain
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building the app"
  
  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Running tests"
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying"

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/d4f9fb39-fec4-46b1-a944-d3910b63112c" />

*(Self-Note: The Actions tab generates a beautiful visual graph showing this exact dependency chain!)*

---

## 🌍 Tasks 2, 3 & 4: Variables, Outputs, and Conditionals

I combined Tasks 2, 3, and 4 into a single workflow file called `data-and-logic.yml` to see how they all interact with each other.

### 1. Environment & Context Variables (Task 2)

Variables allow us to inject reusable data into our pipelines without hardcoding it. I scoped these variables at three different levels of visibility:

* **Workflow Level (`env:` at the very top):** This is the **Global Loudspeaker**. Any variable declared here (like `APP_NAME: myapp`) can be read by every single job and step.
* **Job Level:** This is the **Department Memo**. If I define `ENVIRONMENT: staging` inside a specific job, only the steps inside that isolated job can see it.
* **Step Level:** This is a **Sticky Note**. A variable like `VERSION: 1.0.0` defined on a single step is destroyed the moment that specific terminal command finishes.
* **Context Variables:** Data like `${{ github.actor }}` gives our pipeline "omniscience"—it inherently knows who triggered the pipeline and what commit hash is being tested.

### 2. Job Outputs (Task 3)

Every job boots up on a completely fresh, separate virtual machine. **They do not share memory or hard drives.** Setting an output is like **Job A writing a secure text message and sending it back to GitHub right before its server is destroyed**. When Job B boots up on a new server, it asks GitHub for that message using the `needs` context.

### 3. Conditionals & Flow Control (Task 4)

Conditionals (`if:`) act as traffic lights for our pipelines:

* **Branch Filtering (`if: github.ref == 'refs/heads/main'`):** Ensures a step only executes if the code is on the main branch.
* **Running on Failure (`if: failure()`):** Acts as a **Fire Alarm**. It runs *only* when something breaks, usually to trigger an automated alert.
* **The `continue-on-error: true` flag:** Tells GitHub, "Even if this command fails, put a band-aid on it, mark it green, and keep going."

### 📄 `.github/workflows/data-and-logic.yml`

```yaml
name: Data and Logic Explorer
on: [push]

# TASK 2: Workflow Level Variable
env:
  APP_NAME: myapp 

jobs:
  job-one-producer:
    runs-on: ubuntu-latest
    # TASK 2: Job Level Variable
    env:
      ENVIRONMENT: staging 
    
    # TASK 3: Exposing the step output to the job level so other jobs can see it
    outputs:
      shared_date: ${{ steps.date_generator.outputs.date }}
      
    steps:
      - name: Print Variables (Task 2)
        # TASK 2: Step Level Variable
        env:
          VERSION: 1.0.0 
        run: |
          echo "App: $APP_NAME, Env: $ENVIRONMENT, Ver:$VERSION"
          echo "Triggered by actor: ${{ github.actor }}, Commit SHA:${{ github.sha }}"
          
      - name: Set an Output (Task 3)
        id: date_generator
        run: echo "date=$(date)" >> $GITHUB_OUTPUT
        
      - name: Force a failure but continue (Task 4)
        continue-on-error: true
        run: exit 1

      - name: Run only if previous step failed (Task 4)
        if: failure()
        run: echo "The previous step failed, but we survived!"

  job-two-consumer:
    needs: job-one-producer
    runs-on: ubuntu-latest
    steps:
      - name: Read Output from Job One (Task 3)
        run: echo "The date generated in the previous server was ${{ needs.job-one-producer.outputs.shared_date }}"
      
      - name: Run ONLY on main branch (Task 4)
        if: github.ref == 'refs/heads/main'
        run: echo "This only prints if we are on the main branch!"

```

---

## 🧠 Task 5: The "Smart Pipeline" Synthesis

I combined all these concepts into a final `smart-pipeline.yml`. This utilized a highly common DevOps architecture known as the **"Diamond Pattern" (Fan-Out / Fan-In)**.

1. **Fan-Out:** The pipeline triggers on a push. It instantly spins up a `lint` job and a `test` job. Because neither `needs` the other, they run in parallel, cutting our execution time in half.
2. **Fan-In:** I created a `summary` job with `needs: [lint, test]`. This job acts as a manager. It waits until both parallel jobs succeed before booting up.
3. **Context Awareness:** Finally, the summary job dynamically reads the exact commit message entered by the developer using `${{ github.event.commits[0].message }}` and uses a bash `if/else` statement to evaluate if it was pushed to `main` or a feature branch.

### 📄 `.github/workflows/smart-pipeline.yml`

```yaml
name: Smart Pipeline
on: 
  push:
    branches:
      - '**' # Triggers on push to ANY branch

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Linting code..."
      
  test:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Testing code..."
      
  summary:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - name: Print Push Details
        run: |
          echo "Commit Message: ${{ github.event.commits[0].message }}"
          if [ "${{ github.ref }}" = "refs/heads/main" ]; then
            echo "This was a push to the MAIN branch."
          else
            echo "This was a push to a FEATURE branch."
          fi

```

```

```
