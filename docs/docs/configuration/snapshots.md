---
id: snapshots
title: Snapshots
---

Security can save a snapshot image to `/media/security/clips` for each object that is detected named as `<camera>-<id>.jpg`. They are also accessible [via the api](../integrations/api/event-snapshot-events-event-id-snapshot-jpg-get.api.mdx)

Snapshots are accessible in the UI in the Explore pane. This allows for quick submission to the Security+ service.

To only save snapshots for objects that enter a specific zone, [see the zone docs](./zones.md#restricting-snapshots-to-specific-zones)

Snapshots sent via MQTT are configured in the [config file](https://docs.security.video/configuration/) under `cameras -> your_camera -> mqtt`
