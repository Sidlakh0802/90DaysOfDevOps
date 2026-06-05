Day 1 Linux filesystem

Directory          Purpose                 Usecases

1) /
Purpose - Root directory
Usecases - Everything starts from here to check directories

2) /home
Purpose - User home directory
Usecases - files and folders are stored here

3) /root
Purpose - Root details
Usecases - these are used to check Root user personal details

4) /etc
Purpose - All the configuration
Usecases - used to check hostname and hosts

5) /var/log
Purpose - log files
Usecases - It is used to check the log files

6) /tmp
Purpose - Temporary file
Usecases - It used to check for tmp file to manage disk usage and memory

7) /var
Purpose - General
Usecases - this contains all the log and output



Hands on command output

. It shows log file with highest consumption of disk usage in a
human readable format

-s = Show total size
-h = Human readable

. It shows the hostname of the server

. It shows all the directories and other files of /home directory
with their permissions

Scenario 1

MyApp Not Working

1) systemctl status myapp

= to check whether it is active, failed or stopped

2) journalctl -u myapp -n 50

to check 50 lines of logs and errors

3) systemctl is-enabled myapp

= to check whether it will automatically starts after reboot

4) systemctl list-units --type=service | grep all myapp
= confirms wether service exists or not


Scenario 2 - High CPU Usage

1) top

= See live usage

2) ps aux --sort=-%CPU | head -10

= list the processes consuming most CPU

3) ps -fp <PID>

inspect top CPU consuming process with their process ID


Scenario 3 - Finding Logs

1) systemctl status docker

2) journalctl -u docker -n 50

3) journalctl -u docker --since "1 hour ago"

= this is used to check recent activity


Scenario 4 - Permission

Let's say file = backup.sh

1) ls -l backup.sh

= to check the permissions

2) chmod +x backup.sh

= to give executable permission

3) ls -l backup.sh

= Verify





<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/c09819b2-e70c-402e-b59a-e8fabd477e67" />
