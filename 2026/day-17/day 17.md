# Day 17: Shell Scripting Level Up (Loops, Args & Error Handling) 🚀🛡️

Welcome to my Day 17 folder of the #90DaysOfDevOps challenge! Today, I leveled up my automation skills by making my shell scripts dynamic, scalable, and resilient.

Instead of writing basic top-to-bottom scripts, I learned how to use loops to automate repetitive tasks, command-line arguments to pass data instantly, and error handling to prevent scripts from breaking servers.

Here is a detailed breakdown of all the scripts I built today, what they do, and what I learned from each one!

## 📁 The Scripts & My Learnings

### 1. `for_loop.sh` & `count.sh` - The Automation Workhorses

* **What they do:** `for_loop.sh` cycles through a predefined list of 5 fruits and prints them one by one. `count.sh` counts from 1 to 10 instantly using a numerical range.
* **The Learning:** I learned that loops save you from writing repetitive code. The `{1..10}` syntax is a huge timesaver! If I ever need to create 100 dummy files for testing, I don't need a massive script—I can just loop through a range.

### 2. `countdown.sh` - The Conditional Counter

* **What it does:** Asks the user for a number, counts down to zero, and pauses for one second between each number.
* **The Learning:** A `while` loop runs *as long as* a condition is true. I also learned that math in Bash requires a special syntax. You cannot simply write `num = num - 1`. You have to wrap math operations in `$(( ))` to perform actual calculations (like `num=$((num - 1))`).

### 3. `greet.sh` & `args_demo.sh` - Skipping the Prompt

* **What they do:** Instead of pausing the script with `read` to ask for a name, these scripts take data directly from the execution command (e.g., `./greet.sh Shubham`). 
* **The Learning:** Command-line arguments (`$1` for the first argument, `$#` for the count, `$@` for all arguments) are how CI/CD tools automate scripts. By passing data instantly, scripts can run entirely on their own without needing a human to type answers.

### 4. `install_packages.sh` - The Package Manager

* **What it does:** Loops through a list of essential tools (Nginx, Curl, Wget). It checks if they are installed, and if not, automatically installs them. It also verifies if the user is running the script as `root`.
* **The Learning:** I learned how to hide messy terminal output by appending `&> /dev/null` to commands, keeping the script's output clean. I also learned how to use `$EUID` to strictly enforce admin privileges before a script attempts to modify system packages.

### 5. `safe_script.sh` - Failing Safely

* **What it does:** Simulates creating directories and files, but uses advanced error handling to stop the script if something goes wrong rather than plowing ahead blindly.
* **The Learning:** By default, Bash completely ignores errors and keeps executing the next lines of code! Adding `set -e` at the top of the script forces it to stop immediately on any failure. Furthermore, using the `||` (OR) operator is an elegant way to handle errors in one line (e.g., `mkdir /tmp/test || echo "Folder already exists!"`).

---

## 🚀 How to Run These Scripts

If you want to test these scripts on your own Linux terminal, follow these steps:

1. Clone this repository and navigate to this folder.
2. Give the script execute permissions using `chmod`:
   ```bash
   chmod +x <script_name>.sh
