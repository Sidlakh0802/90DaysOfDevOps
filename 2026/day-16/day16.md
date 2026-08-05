# Day 16: Shell Scripting Basics 📜

Welcome to my Day 16 folder of the `#90DaysOfDevOps` challenge! Today, I took my first major step into the world of automation by learning **Shell Scripting**.

Instead of typing the same Linux commands over and over, I learned how to write bash scripts that can make decisions, interact with users, and execute commands automatically. 

Here is a detailed breakdown of all the scripts I built today, what they do, and what I learned from each one!

---

## 📁 The Scripts & My Learnings

### 1. `hello.sh` - The First Step
* **What it does:** A simple script that prints "Hello, DevOps!" to the terminal.
* **The Learning:** I learned about the **Shebang (`#!/bin/bash`)**. Placing this at the very top of the script tells Linux exactly which interpreter to use. If someone else runs my script using a different shell (like Zsh), the shebang forces it to run safely in Bash. I also learned that scripts must be made executable using `chmod +x` before they can run!
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/df611c98-5afb-424d-acfd-382d8a3dcea4" />


### 2. `variables.sh` - Handling Data
* **What it does:** Stores a name and role in variables and prints them out using both single and double quotes to see the difference.
* **The Learning:** Bash is incredibly strict about spaces! You must write `NAME="Shubham"`, not `NAME = "Shubham"`. Furthermore, **quotes matter**. Double quotes (`" "`) will read and expand variables, while single quotes (`' '`) will print exactly what is typed, ignoring the variable completely.
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/34fc4548-c9a4-437f-b569-ffa870a7c7ec" />


### 3. `greet.sh` - Making it Interactive
* **What it does:** Pauses the script and asks the user to type in their name and their favorite DevOps tool, then prints a custom greeting.
* **The Learning:** Hardcoded scripts are boring. Using the `read -p` command allows the script to prompt the user for data on the same line and store that input directly into a variable for later use.
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/59a531c6-14c4-413d-81d0-6c357b25a3cc" />


### 4. `check_number.sh` & `file_check.sh` - Adding Logic
* **What they do:** 
  * `check_number.sh` asks for a number and tells you if it is positive, negative, or zero. 
  * `file_check.sh` asks for a filename and tells you if that file actually exists in the system.
* **The Learning:** I learned how to build `if-elif-else` statements. Bash math is unique—instead of `<` or `>`, we use `-gt` (greater than), `-lt` (less than), and `-eq` (equal to). For checking files, the `-f` flag is a lifesaver for verifying a file exists before a script tries to modify it!
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/4d5f341e-53ed-45a5-83dd-7421081a401e" />
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/de6faa74-9fdc-47cb-aee0-8769ec8f50ec" />



### 5. `server_check.sh` - The Final Boss
* **What it does:** Combines everything! It asks the user if they want to check the status of a specific service (like `sshd`). If they answer `y`, it runs the real Linux `systemctl status` command. If `n`, it politely skips.
* **The Learning:** This showed me the real power of DevOps scripting. I can take user input, run a logical check, and then execute actual OS-level commands based on that logic. This is exactly how massive automation tools work under the hood!
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/cc146fc5-319d-4538-ac2e-9f43eb5b6935" />


---

## 🚀 How to Run These Scripts

If you want to test these scripts on your own Linux terminal, follow these steps:

1. Give the script execute permissions using `chmod`:
   ```bash
   chmod +x <script_name>.sh
