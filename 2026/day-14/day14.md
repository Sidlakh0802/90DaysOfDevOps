
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
*Find the local IP address of the machine.*
* **Command Executed:** `hostname -I` (or `ip addr show`)
* **Output:**
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/9278d465-3289-4925-ad80-d23711adc8cb" />

Observation: My Ip address for my Ubuntu machine is my Hostname


