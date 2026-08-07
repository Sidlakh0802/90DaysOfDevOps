# Day 18: Shell Scripting - Functions & Intermediate Concepts

Welcome to my Day 18 folder of the #90DaysOfDevOps challenge! Today, we transition from writing basic top-to-bottom scripts to writing clean, modular, and production-ready code.

Instead of typing commands repeatedly, I learned how to use Functions to reuse code, Local Variables to keep data contained safely, and Strict Mode (`set -euo pipefail`) to ensure my scripts fail fast and safely if something goes wrong.

Here is a detailed breakdown of all the scripts I built today, what they do, and what I learned from each one.

### 1. `functions.sh` - The Reusable Machines

* **What it does:** Defines two functions (`greet` and `add`), then calls them from the main script passing different arguments.
* **The Learning:** I learned that functions in bash act as reusable mini-programs. They accept their own arguments (`$1`, `$2`), which act as placeholders for whatever data you pass to them when you call them. You build the function once, and you can call it as many times as you need!

* **The core concept:** Functions are like creating your own custom terminal commands.
* How it works: Instead of writing the same 5 lines of code every time you want to do something, you wrap those 5 lines in a function name (like greet() { ... }). The script ignores this block of code until you explicitly call its name at the bottom of the script.
* Arguments ($1, $2): When you call add 10 25, the numbers 10 and 25 are passed into the function. Inside the function, $1 becomes 10 and $2 becomes 25. It is completely dynamic, so you could call add 50 100 right after, and it would work perfectly without changing the function's code.
* Math in Bash: Notice the syntax $(($1 + $2)). Bash treats everything as text by default. Wrapping variables in double parentheses $(( ... )) is the strict signal to Bash that says, "Stop treating these as words, treat them as math numbers and calculate them."

### 2. `disk_check.sh` - Functions with Return Values

* **What it does:** Uses separate functions to check disk usage (df -h) and free memory (free -h), keeping the logic organized.
* **The Learning:** Shell scripts do not "return" string or integer values like Python or Java. To get data out of a function, you have the function echo or print the result to the screen. I also learned that the -e flag enables the interpretation of backslash escapes (like \n for line breaks).

* **The core concept:** Understanding how Bash outputs data.
  
* The "Return" Illusion: In languages like Python, a function can compute a number and return it secretly to the main program. Bash does not do this. If a Bash function finishes silently, it passes absolutely no text back to you.
* The Solution: The only way to get data out of a Bash function is to print it to the screen. Whatever the function prints (using echo or a command like df -h) is its output.
* echo -e: Standard echo is very literal. Adding -e tells it to look for special formatting codes. We used \n, which tells the terminal to hit "Enter" and create a blank new line before printing the text. This keeps your output from looking squished together.



### 3. `strict_demo.sh` - Strict Mode

* **What it does:** Demonstrates how set -euo pipefail acts as an emergency braking system for your scripts, forcing them to stop if an error occurs instead of plowing ahead blindly.
* **The Learning:** Bash is too forgiving by default. set -e forces the script to stop immediately if any command fails. set -u catches variables you forgot to define. set -o pipefail ensures that if any part of a chained piped command (like cat file | grep error) fails, the entire chain is marked as a failure, stopping the script safely.

* **The core concept:**  Protecting your servers from bad code.
* By default, Bash is a "blind runner." If line 2 fails, it will still try to run line 3, 4, and 5. This is how servers get accidentally destroyed. set -euo pipefail is your emergency braking system.
* set -e: If any command fails (like trying to delete a file that doesn't exist), the script stops instantly. It refuses to move to the next line.
* set -u: If you type echo $MY_VAR, but you forgot to actually create $MY_VAR, standard Bash will just print a blank space. Strict mode will yell "Unbound variable!" and kill the script. This saves you from catastrophic typos.
* set -o pipefail: If you have a chained command like Command A | Command B, and Command A fails, standard Bash only looks at Command B. Since Command B ran (even though it had no data), Bash thinks everything is fine. pipefail forces Bash to check the entire chain. If any piece fails, the whole script stops.


### 4. `local_demo.sh` - Local Variables

* **What it does:** Proves that variables in bash are global by default, and demonstrates how to fix this using the local keyword.
* **The Learning:** Bash variables are like water in a leaky bucket—they spill everywhere. Using local when defining variables inside a function acts like a locked door, keeping the variable strictly inside that function so it does not accidentally leak out and overwrite other parts of your script.

* **The core concept:** Containing your data so it doesn't leak.
* The Leaky Bucket: In Bash, if you create a variable inside a function (e.g., TEMP_FILE="/tmp/file1"), that variable immediately leaks out into the entire script. If you have 5 different functions, and they all accidentally use the name TEMP_FILE, they will start overwriting each other's data, causing massive bugs.
* The Locked Door: By placing the word local in front of the variable (e.g., local TEMP_FILE="/tmp/file1"), you lock that variable inside the function. The rest of the script cannot see it, cannot touch it, and the second the function finishes running, the variable is permanently destroyed.


### 5. `system_info.sh` - System Info Reporter

* **What it does:** A complete, modular, strict-mode script that generates a highly readable system report by chaining Linux tools together.
* **The Learning:** Wrapping logic inside functions and calling them from a main() block makes scripts significantly easier to read and troubleshoot. The true power of Linux is combining small, single-purpose tools (grep, awk, cut, sort) using pipes (|) to transform messy system data into exact, readable outputs.

* **The core concept:**  The Assembly Line (Pipes |).
* $( ... ) (Command Substitution): This tells Bash, "Run the command inside these parentheses first, and then paste the answer right here."
* Extracting the OS Name:
* cat /etc/os-release gets the giant block of OS text.
* | grep '^PRETTY_NAME' filters it down to the single line starting with PRETTY_NAME.

* | cut -d= -f2 chops the line in half at the equals sign (=) and only keeps the 2nd half.

* | tr -d '"' deletes the double quotes, leaving you with perfect text.

* Sorting Disk/CPU:
* We use sort -hr. The -h makes it smart enough to know that 2 Gigabytes is bigger than 500 Megabytes. The -r means "reverse", putting the biggest numbers at the very top of the list.
* The main() Function:
* Instead of scattering your commands all over the script, you put all your function calls inside one main() function at the bottom. This means anyone reading your script can just look at main() and instantly understand exactly what your script does step-by-step.


