# Day 18: Shell Scripting - Functions & Intermediate Concepts

Welcome to my Day 18 folder of the #90DaysOfDevOps challenge! Today, we transition from writing basic top-to-bottom scripts to writing clean, modular, and production-ready code.

Instead of typing commands repeatedly, I learned how to use Functions to reuse code, Local Variables to keep data contained safely, and Strict Mode (`set -euo pipefail`) to ensure my scripts fail fast and safely if something goes wrong.

Here is a detailed breakdown of all the scripts I built today, what they do, and what I learned from each one.

### 1. `functions.sh` - The Reusable Machines

* **What it does:** Defines two functions (`greet` and `add`), then calls them from the main script passing different arguments.
* **The Learning:** I learned that functions in bash act as reusable mini-programs. They accept their own arguments (`$1`, `$2`), which act as placeholders for whatever data you pass to them when you call them. You build the function once, and you can call it as many times as you need!



### 2. `disk_check.sh` - Functions with Return Values

* **What it does:** Uses separate functions to check disk usage (df -h) and free memory (free -h), keeping the logic organized.
* **The Learning:** Shell scripts do not "return" string or integer values like Python or Java. To get data out of a function, you have the function echo or print the result to the screen. I also learned that the -e flag enables the interpretation of backslash escapes (like \n for line breaks).



### 3. `strict_demo.sh` - Strict Mode

* **What it does:** Demonstrates how set -euo pipefail acts as an emergency braking system for your scripts, forcing them to stop if an error occurs instead of plowing ahead blindly.
* **The Learning:** Bash is too forgiving by default. set -e forces the script to stop immediately if any command fails. set -u catches variables you forgot to define. set -o pipefail ensures that if any part of a chained piped command (like cat file | grep error) fails, the entire chain is marked as a failure, stopping the script safely.


### 4. `local_demo.sh` - Local Variables

* **What it does:** Proves that variables in bash are global by default, and demonstrates how to fix this using the local keyword.
* **The Learning:** Bash variables are like water in a leaky bucket—they spill everywhere. Using local when defining variables inside a function acts like a locked door, keeping the variable strictly inside that function so it does not accidentally leak out and overwrite other parts of your script.



