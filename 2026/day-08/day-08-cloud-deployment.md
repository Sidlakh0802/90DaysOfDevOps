Day 8 Cloud Server SetupDocker, NGINX and Web developement
* Launched the EC2 Instance with keypair
* Give Security Group TCP Port 80
* Now connect with SSH
sudo apt-get update
sudo apt-get install nginx -y
* Now to verify
systemctl status nginx
* Check logs
cat /var/log/nginx/access.log
OR Do manual
cd /var/log/nginx
cat access.log

* Create a file nginx.txt in Home directory
-> Now you can save this file logs in nginx.txt
cat /var/log/nginx/access.log > ~/nginx.txt

Show content | Path of logs | Redirect ion | home directory | filename

⸻

-> For downloading in your local

* Need Public IP from EC2 instance 
* Key Pair
* If SSH is there use

ifconfig.me

now do this comand in local 

scp -i key.pem ubuntu@xx.xx.xx.xx:~/nginx.txt

Breakdown:

* scp = command
* -i key.pem = key file
* ubuntu@xx.xx.xx.xx = IP Address
* :~/nginx.txt = file path in home directory
* Download to current folder
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/8bd9906e-07a2-4fb8-b182-ec8fa33fe9e9" />
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/6fca6369-15aa-4677-bb6c-1d59b8088104" />
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/bd599e41-1691-4026-aea8-3a672d729c65" />


