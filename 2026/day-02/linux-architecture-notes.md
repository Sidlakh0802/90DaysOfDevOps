Day 2 Homework

Linux Architecture

* Application
* Shell
* Kernel
* Hardware


Kernel
Kernel is the heart of Linux which contains the main code and manages hardware , memory and system processes and is written in C language.

Shell
Shell is called as a communicator between the Kernel and Linux in human readable language.

* It interacts with Kernel through binary.

Example
You asked echo "Hi".
Here echo is a command in Linux which is used to print, so it will follow a structure:
echo → Binary → Kernel → Output
Binary refers to packaging of commands to provide desired output.


Systemd and PID

Systemd = It is the first process in Linux which has PID 1.

PID = Process ID which is unique for each and every process.

Linux Boot Process

When the system is powered on, the motherboard activates the BIOS firmwar, which checks all hardware systems.
After the hardware check, the bootloader gets activated.

The bootloader loads the main Linux code and activates the kernel, which starts its first process systemd with PID 1.

After that, other processes and applications like Docker, etc., start running.

Short Note:
Systemd is used to boot up the Linux system and all the services.

Process States
Running - A process that is actively running or executing code.

Sleeping - These are processes waiting for some resources or tasks, like scheduling, configuration, or input.
Once they get the required input/resources, they start running.

Zombie- These are dead tasks/processes that are completed or cancelled but still remain in the background waiting to be cleaned up.

Linux Commands
cd → Change directory
ls→ To see the full list of files/folders
pwd→ To see the present working directory path
mkdir→ To create a new directory
touch→ To create a new file
