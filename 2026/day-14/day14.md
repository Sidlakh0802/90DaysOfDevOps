
# Day 14 Networking Concepts

## Quick Concepts (OSI Model)

The OSI Model (The Theory):** A 7-layer framework (Physical, Data Link, Network, Transport, Session, Presentation, Application). 

**1 Layer 1 - Physical Layer**

This layer is responsible for sending the data

**2 Data Link**

This layer is used to transfer data between MAC addresses

**3 Network Layer**

This layer is used uses IP addresses to send the data between different networks

**4 Transport Layer**

This layer decides which method to use to transfer data either TCP OR UDP for faster communication

**5 Session Layer**

This layer create, manage and ends communication b/w devices

**6 Presentation Layer**

This layer converts data into human readable format

** Application**

This the layer where users interact with services, like web browsers, email, DNS etc

## TCP/IP Model

The TCP/IP Model (The Reality):** A simpler, practical 4-layer stack that the actual internet runs on (Network Access, Internet, Transport, Application).
**1 Link layer**

Handles communication inside local Network

**2 Internet Layer**

Uses IP addresses to send packets between different Networks

**3 Transport layer**

1) Decides whether to use TCP or UDP to transfer data b/w applications

**4 Application layer**

Contains all the protocols which directly use HTTP, HTTPS, DNS etc

## Protocols

| Protocols | Which layer |
| :--- | :--- |
| 1) HTTP and HTTPS | 1) Application Layer (used to load websites) |
| 2) DNS | Application Layer (converts domain name into IP addresses |
| 3) TCP | Transport Layer (Reliable communication with error checking) |
| 4) UDP | Transport Layer (Faster communication without guaranteed delivery |
| o) IP | Internet Layer (Responsible for Routing between Networks |

🔥 **A Real-World Example:**
When I type `curl https://example.com`, I am using the **Application layer** (HTTP) to fetch a webpage, which is packaged by the **Transport layer** (TCP) to ensure no data is lost, and routed across the internet by the **Network layer** (IP).
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/e8df494a-122a-4b7b-a2a6-f3eba9bd1ad4" />

## Part 2: Hands-on Networking Diagnostics Checklist

This section tracks the execution and observation of standard networking diagnostic commands.

### 1. Identity
*Find the local IP address of the machine.*
* **Command Executed:** `hostname -I` (or `ip addr show`)
* **Output:**
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/9278d465-3289-4925-ad80-d23711adc8cb" />

Observation: My Ip address for my Ubuntu machine is my Hostname

### 2. Reachability
*Check network connectivity and response times to a target.*
* **Command Executed:** `ping -c 4 google.com`
* **Output:**
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/bfba7dee-c01a-4309-b963-0a12cf1b3729" />



Observation: we used -c to track count  for packets delivered. All the packets were delivered successfully with zero packet loss


### 3. Path
*trace the route packets take to a network host.*
* **Command Executed:** `traceroute google.com` (`or tracepath google.com`)
* **Output:**
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/5cb300ed-d6b0-4ee5-a8ff-8296205d868b" />

Observation: there was 30 hops maximum but it exited after 17 hops 

### 4. Ports
*List open ports and listening services.*
* **Command Executed:** `ss -tulpn (or netstat -tulpn - requires sudo for full process info)`
* **Output:**
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/0140c292-1df9-439f-b982-a66d5e147b6e" />

Observation: the system is actively listening for incoming TCP connections on port 22 (SSH) and port 80 (HTTP) on all IPv4 interfaces (0.0.0.0). It is also listening locally on port 53 for DNS services. Note: The specific process names are not visible in the output because the command was executed without sudo privileges.


### 5. Name Resolution
*Query DNS to find the IP address of a domain.*
* **Command Executed:** `dig google.com +short`
* **Output:**
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/2b5ca1dc-e195-479d-b88e-974e4b94551e" />


Observation: Through DNS we got the IP Adress


### 6. HTTP check
*Fetch the HTTP headers from a web server.*
* **Command Executed:** `curl -I https://www.google.com`
* **Output:**
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/4a4cadce-0e50-4183-aff1-57fbeed26c33" />



Observation: Received an HTTP/2 200 OK response status, confirming the target web server is online, reachable over HTTPS, and successfully accepting requests.

### 7. Connection Snapshot
*View current active network connections.*
* **Command Executed:** `netstat -an | head -n 8`
* **Output:**
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/ccde3faf-fdae-489f-8bed-80c271cedcba" />




Observation: The snapshot of active connections displays 4 TCP sockets in the LISTEN state (waiting for incoming traffic on ports 80, 22, and 53). There is 1 active connection currently in the ESTABLISHED state (an inbound SSH connection on port 22), and 1 socket in the TIME_WAIT state (from an outbound connection to port 80).




