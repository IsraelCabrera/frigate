---
id: third_party_extensions
title: Third Party Extensions
---

Being open source, others have the possibility to modify and extend the rich functionality Security already offers.
This page is meant to be an overview over additions one can make to the home NVR setup. The list is not exhaustive and can be extended via PR to the Security docs. Most of these services are designed to interface with Security's unauthenticated api over port 5000.

:::warning

This page does not recommend or rate the presented projects.
Please use your own knowledge to assess and vet them before you install anything on your system.

:::

## [Advanced Camera Card (formerly known as Security Card](https://card.camera/#/README)

The [Advanced Camera Card](https://card.camera/#/README) is a Home Assistant dashboard card with deep Security integration.

## [Double Take](https://github.com/skrashevich/double-take)

[Double Take](https://github.com/skrashevich/double-take) provides an unified UI and API for processing and training images for facial recognition.
It supports automatically setting the sub labels in Security for person objects that are detected and recognized.
This is a fork (with fixed errors and new features) of [original Double Take](https://github.com/jakowenko/double-take) project which, unfortunately, isn't being maintained by author.

## [Security Notify](https://github.com/0x2142/security-notify)

[Security Notify](https://github.com/0x2142/security-notify) is a simple app designed to send notifications from Security to your favorite platforms. Intended to be used with standalone Security installations - Home Assistant not required, MQTT is optional but recommended.

## [Security Snap-Sync](https://github.com/thequantumphysicist/security-snap-sync/)

[Security Snap-Sync](https://github.com/thequantumphysicist/security-snap-sync/) is a program that works in tandem with Security. It responds to Security when a snapshot or a review is made (and more can be added), and uploads them to one or more remote server(s) of your choice.

## [Security telegram](https://github.com/OldTyT/security-telegram)

[Security telegram](https://github.com/OldTyT/security-telegram) makes it possible to send events from Security to Telegram. Events are sent as a message with a text description, video, and thumbnail.

## [Periscope](https://github.com/maksz42/periscope)

[Periscope](https://github.com/maksz42/periscope) is a lightweight Android app that turns old devices into live viewers for Security. It works on Android 2.2 and above, including Android TV. It supports authentication and HTTPS.
