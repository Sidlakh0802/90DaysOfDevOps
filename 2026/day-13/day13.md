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

Task 4: Create Logical Volume
Then I asked to Go into my storage pool named devops-vg, take out 500 Megabytes of space, and make a new virtual drive named app-data.

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/396ce1fc-f2d3-4fe2-9858-b62bf46a6b7c" />

Task 5: Formatting and Mounting
1. **Format the Drive**: We used `mkfs.ext4` to format our new virtual drive with a clean grid so Linux knows how to store files.
2. **Create the Folder**: We used `mkdir -p` to create a fresh folder to act as the entryway for our storage.
3. **Connect the Drive**: We used `mount` to plug the virtual drive directly into that folder so we can access it.
4. **Verify the Space**: We used `df -h` to check our work, confirming the drive connected properly and showing us the available free space.

We used mkfs.ext4 to format our new virtual drive with a clean grid so Linux knows how to store files. Next, we used mkdir -p to create a fresh folder to act as the entryway for our storage. Then, we used mount to plug the virtual drive directly into that folder so we can access it. Finally, we used df -h to check our work, confirming the drive connected properly and showing us the available free space

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/b0745e07-51ed-4ebb-a8dc-fc499edcd440" />


Task 6  Increasing volume size
If want to extend my storage due to any volume issue , instead of taking my server offline, I just grabbed 200MB more from my devops-vg pool and stretched the drive. But here is the catch I learned: extending the LVM boundary isn't enough. You also have to tell the filesystem inside the drive to expand into that new empty space.
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/814e2dcf-42a8-436e-8f8a-53dcbf98abc3" />


## 🧠 Key Learnings from Each Task

| Task | Key Learning 1 | Key Learning 2 | Key Learning 3 |
|---|---|---|---|
| **Task 1: Check Storage** | Checking the disk layout (`lsblk`) first prevents accidental overwrites of important system drives. | `lsblk` shows the raw hardware, while `df -h` shows the storage that is actually usable and mounted. | Cloud servers (like AWS EC2) use loop devices for internal processes, so verifying device names is critical. |
| **Task 2: Physical Volume** | Raw hard drives cannot be used by LVM directly; they must be initialized first. | `pvcreate` acts as a reservation system, telling Linux the drive is specifically dedicated to LVM. | The `pvs` command is the quickest way to confirm a raw disk is prepped and ready for the storage pool. |
| **Task 3: Volume Group** | Volume Groups (VGs) act as a giant bucket, allowing you to combine multiple physical disks into one pool. | VGs completely abstract physical hardware limits—the OS just sees the pool size, not individual drives. | Standardized naming (like `devops-vg`) makes it easy to track what applications a storage pool is for. |
| **Task 4: Logical Volume** | Logical Volumes (LVs) are carved out of the VG pool, letting you set exact custom sizes. | LVs act exactly like traditional hard drive partitions, but they can be resized effortlessly later. | The `lvcreate` command claims space from the pool without affecting the rest of the available storage. |
| **Task 5: Format & Mount** | A new Logical Volume is useless until formatted (`mkfs.ext4`), which organizes how data will be saved. | Mounting attaches the raw drive to a normal folder (like `/mnt/app-data`) so you can interact with it. | Linux has built-in safety features that prevent you from formatting a drive that is currently mounted. |
| **Task 6: Extend Volume** | LVM allows you to extend server storage on the fly without shutting down the system (zero downtime). | Expanding storage is always a two-step process: expanding the volume bounds, then resizing the filesystem. | If you skip `resize2fs`, the block volume gets bigger, but the operating system won't see the new space. |
