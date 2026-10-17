# Safety Model — Email Phishing Lab

This document explains why the artefacts in this repository are safe for offline training and the rules you must follow.

## Core Guarantee

- **No live malware** is present.
- **No working C2** communication occurs.
- **No destructive behaviour** is implemented.
- All payloads are deliberately inert and only contain reference strings / flags used for verification inside the lab.

## What the artefacts actually do

| Artefact              | Real behaviour                                      | Lab behaviour                                      |
|-----------------------|-----------------------------------------------------|----------------------------------------------------|
| `.docm` macro         | Would normally drop / execute a payload             | Decodes a short PowerShell blob that only does `Write-Output $flag` and prints a dead URL |
| PDF `/OpenAction` JS  | Would normally open a URL or run code               | Only concatenates flag fragments and contains a red-herring URL |
| Tracking pixel PNG    | Would normally phone home                           | Static image; hidden data lives only in a `tEXt` chunk |
| ZIP password          | Normal protection                                   | Password is recoverable from the email body itself |
| IOC IPs               | Real malspam infrastructure                         | Present only as static indicators — **never contact them** |

## Mandatory Rules

1. **Always analyse inside an isolated virtual machine** with snapshots disabled (or at least with networking disabled).
2. **Never allow outbound network access** while the samples are open.
3. **Do not remove the ZIP password** and then execute the macro on a production machine.
4. **Do not submit the IOC IPs** to live reputation services from the analysis machine if that machine has any sensitive data.
5. Treat every file as you would a real malicious sample until you have personally verified the inert nature of the payload.

## Why real IOCs are used

Using real, publicly documented malspam IPs trains the analyst to pivot on genuine threat-intel data.  
The lab never contacts those IPs and never performs any network callback.

## Reporting issues

If you discover any artefact that appears to perform live network activity or destructive actions, please open an issue on the repository immediately so it can be corrected.
