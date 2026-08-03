Task 1: Check Current Storage

* lsblk   # Lists all block devices (hard drives and partitions)
* pvs     # Shows Physical Volumes (should be empty right now)
* vgs     # Shows Volume Groups (should be empty)
* lvs     # Shows Logical Volumes (should be empty)
* df -h   # Shows current mounted drives and their available space
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/2e6a4d6e-0ea9-4a2c-94b8-400a96b7cd77" />

Task 2: Creating a Physical volume

Here we have taken loop1 as loop0 is already taken by Ubuntu in AWS Ec2 

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/e3568d50-b21c-4f7e-adf4-6c002c3ed8d5" />


Task 3: Creating a Physical volume

Now took my prepped drive and threw it into a new storage pool called devops-vg. This pool is known as a Volume Group (VG).

****Volume Group (VG**)** is the central administrative unit of the Logical Volume Manager (LVM) that combines multiple physical storage devices into a single, virtual storage pool. It acts as a container from which you can slice out flexible, resizable logical partitions

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/cc8aa6ff-499a-495f-8895-e52adfd54a65" />
