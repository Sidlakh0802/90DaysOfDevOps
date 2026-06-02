
• Let’s take a service say SSH

1. The SSH service is being used.
2. Check the basic system information

uname -i → To check which kernel I am using.

• I am using x86_64 kernel.

3. Check the OS of the machine - cat /etc/os-release
→ I am using Ubuntu machine.
→ Version 24.04 LTS

4. Check CPU and Memory - free -h

• The memory usage is fine.

• No strange process is there in my machine.

• CPU usage is completely normal.

5. Check Disk - df -h

→ To check disk usage.

• Disk size is 29 GB out of which 2.4 GB is used.

• Sufficient free space is available.

6. Check log storage - du -sh /var/log

→ To check the storage consumed by logs.

• Logs are not taking much space.

7. Checking port - ss -tulpn

• Yes, the port is aligned/listening on 22.

8. Check service response - curl -I http://google.com

• The service is responding normally.

9. Checking logs
journalctl -u ssh
tail -n 30

→ There is no error in the last 30 lines.

Final Verdict

• According to the findings, CPU usage is very low and memory usage is also low.

• Memory is barely used and no abnormal process is found.

• Disk usage is only around 10%, so sufficient space is left.

• SSH is listening on Port 22.

• No SSH errors found.


If it fails in future

• Restart SSH service.

• Check Port 22 connectivity.

• Check  logs.

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/472aefb0-c32d-4095-87a4-55ca1ead6556" />

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/d0a1df8d-a652-4ec8-bd59-0ecacaa4a6bb" />

