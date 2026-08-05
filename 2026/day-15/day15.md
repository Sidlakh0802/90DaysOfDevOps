# Day 15

## Task 1: DNS checking

**Ans:** The computer first check its local machine to check if cache is there, if not it sends a Query to DNS resolver. The resolver sends it to root servers. Query to a DNS Resolver (usually provided). 

The Resolver Queries the Root Server, then the top-level domain (.com) servers and finally servers for Google to find exact IP. It then returns that IP to Browser so to connect to website.

**Q: What are these records types:**

| Type | Information |
| :--- | :--- |
| (1) "A" | Maps domain name to IPV4 addresses |
| (2) "AAAA" | Maps domain name to IPV6 addresses |
| (3) CName | Maps a domain name to another domain name (alias) |
| (4) MX | It is used to specify mail servers for handling emails for that domain |
| (5) NS | It specifies the name servers that hold DNS records for domain |

### Digging Google.com
* = IPV4 = A
* = Time to live = 184
* = IP address = changing
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/e3a38693-bbba-4a0c-9077-d062905cbd92" />

---

## Task 2

**What is an IPV4 addresses? How it Structured?**
It is a 32 old style of IP addresses ranging from (0 to 255).

**Difference B/w Public IP and Private IP**
* **Public IP** = This IP is used to connect with public internet and must be globally unique.
* **Private** = Used only for Private Network (like your Home AWS VPC) to talk with subnets.
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/7eea8220-4d9e-40c6-8eb2-bd7b191a12b0" />

**Based on output:**
* Private IP = 127.0.0.1
* Public IP = 172.31.21.196

---

## Task 3: CIDR & Subnets

**# What does /24 mean**
It means the 24 bits are locked in network id (xxxx).

**# What is Subnet**
It is used to break down a huge network into small-small chunks and to separate it in Private and Public Subnet. Private is mostly used to save data which is to be secured.

### CIDR Table

| CIDR | Subnet Mask | Total IP | Usable |
| :--- | :--- | :--- | :--- |
| /24 | 255.255.255.0 | 256 | 254 |
| /16 | 255.255.0.0 | 65,536 | 65,534 |
| /28 | 255.255.255.240 | 16 | 14 |

**Note:** We always subtract 2 because first IP is used reserved for Network address and the last is Reserved for Broadcast.

---

## Task 4 PORTS

It is like a specific address to IP. We need ports so a single server can run different services like (web, email and database).

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/5b5a205b-7578-4108-b39f-a0759653ac87" />

**Common Ports:**
* 22 = SSH
* 80 = HTTP
* 443 = HTTPS
* 53 = DNS
* 3306 = MySQL
* 6379 = Redis
* 27017 = Mongodb

---

## Task 5

**# You run curl " " what networking concept from today are involved**
**Ans:** DNS Resolves the domain myapp.com into a IP. Then HTTP request is routed over the network to that IP, by passing the default Port 80 and knocking port explicitly 8080.

**# If it is not reaching what step should you will do**
* - Ping (to check wether it is reaching)
* - checking the Port
* - checking firewall
