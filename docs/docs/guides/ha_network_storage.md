---
id: ha_network_storage
title: Home Assistant network storage
---

As of Home Assistant 2023.6, Network Mounted Storage is supported for Add-ons.

## Setting Up Remote Storage For Security

### Prerequisites

- Home Assistant 2023.6 or newer is installed
- Running Home Assistant Operating System 10.2 or newer OR Running Supervised with latest os-agent installed (this is required for supervised install)

### Initial Setup

1. Stop the Security Add-on

### Move current data

Keeping the current data is optional, but the data will need to be moved regardless so the share can be created successfully.

#### If you want to keep the current data

1. Move the security.db, security.db-shm, security.db-wal files to the /config directory
2. Rename the /media/security folder to /media/security_tmp

#### If you don't want to keep the current data

1. Delete the /media/security folder and all of its contents

### Create the media share

1. Go to **Settings -> System -> Storage -> Add Network Storage**
2. Name the share `security` (this is required)
3. Choose type `media`
4. Fill out the additional required info for your particular NAS
5. Connect
6. Move files from `/media/security_tmp` to `/media/security` if they were kept in previous step
7. Start the Security Add-on
