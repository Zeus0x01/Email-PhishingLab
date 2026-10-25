# SAFETY.md — inert guarantees & analysis rules for the Email-PhishingLab artefact set

> READ THIS FIRST if you are deploying or detonating anything from this lab.
> The whole chain is a **training simulation built from inert artefacts**. This
> document states exactly what is inert, why, and under which rules the materials
> must be handled.

## 1. What this lab is

An offline phishing-analysis training exercise modelled on real hard-mode
malspam (courier/shipment-hold lure, encrypted attachment, macro dropper chain,
PDF OpenAction JavaScript, tracking pixel, OSINT pivot). All artefacts are real
files (real `.eml` mail source, real macro-enabled `.docm`, real `.pdf` with
embedded JavaScript, real password-protected ZIP, real PNG) — but **none of them
is **not able to act on your system**** in the way the corresponding malware family
would.

## 2. Inert guarantees (what each artefact is allowed to do)

| Artefact | Contains | Cannot do |
|---|---|---|
| `mail/eml/inbound_message.eml` | RFC822 source + base64 bodies + ZIP/PNG attachments | nothing — data only |
| `artifacts/web/*.html` | static replicas (portal + mail body) | never contact the network; JS is local-only |
| `artifacts/archived/*.zip` | password-protected archive | contains the two inert documents below |
| `.docm` VBA macro | Rebuild/decode of the classic dropper shape: auto-exec entry points, WScript.Shell Run of hidden PowerShell `-NoP -W Hidden -Enc` | no download, no file drop, no persistence, no registry, no network call; the decoded stage-2 only builds two strings and calls `Write-Output` |
| `.docm` document properties | `Comments` property = base64 of a lab token | decoded and displayed inside the waybill decoy; never executed |
| `.pdf` | OpenAction JavaScript, layered `/Filter [/ASCII85Decode /FlateDecode]` | only reconstructs strings, calls `app.alert`, never fetches the link; `/URI` annotation points at a dead host |
| tracking pixel (`image015.png`) | real remote PNG + two `tEXt` metadata chunks | metadata strings only |
| OSINT target (campaign token) | unique campaign token recovered from artefacts | no attacker infrastructure; the OSINT step requires public threat-intelligence research |

**Nothing in this lab is a functional dropper, downloader, C2 client, or
persistence mechanism.** Every "payload" reduces to `Write-Output`-style string
reconstruction.

## 3. Why realistic-looking IOCs may exist

Several indicators (IPs like `104.200.23.95` / `37.0.11.227` / `142.132.180.233`,
domains like `723100[.]xyz` or `storyceroz[.]com`) are **real malspam entities
with public sandbox/OTX reputation** in the original dataset this lab was modelled
on. They exist so triage pivots on genuine indicators — as an analyst would with
a real sample — and they are listed defanged in the instructor IOC list. Rules:

- They are **analysis artefacts only**: never contacted, never resolved as part
  of the lab flow.
- The lab is fully solvable **offline** for every step except the OSINT question
  (Q15), which intentionally requires public research.
- If you detonate anything anyway, do it in a **disposable VM with no outbound
  networking** and a snapshot taken.

## 4. The OSINT step

The campaign token recovered from the mail headers (`X-Panel-Ref`), the pixel
metadata, the macro (hardcoded channel + document-properties decode) and the PDF
JavaScript is a **lab invention**. Searching the token itself on the open
internet will not return a pre-packaged answer.

The intended research path is multi-hop:

1. Recover the campaign identifier from the artefacts.
2. Locate a publicly documented 2025 sample that uses a nearly identical delivery
   technique (courier / AWB / shipping-document lure + password-protected archive
   or script dropper).
3. From that sample’s configuration, extract the install filename and a C2.
4. Use the install filename + C2 combination to locate the matching public
   sandbox report and recover the mutex value.

This step requires real OSINT skill and cannot be completed from the artefacts
alone. The final answer for Q15 is the mutex string.

## 5. Build-time rules (regenerating artefacts)

- The `-enc` blob must decode to the approved inert stage-2 script in
  `sources/macro-source.vba` (string reconstruction + `Write-Output` only).
- The PDF JavaScript must never contain `getURL`, `net` requests, or `submitForm`
  with live endpoints; the two included `dead*` strings are decoys.
- Keep every URL domain either (a) a real, dead IOC documented in the instructor
  pack or (b) an RFC-6761 special-use / local lab host if you invent new ones.
- Run `sources/build_eml.py`, `build_pdf.py`, `build_docm.ps1`, `build_zip.ps1`
  on a build host only; never distribute the sources/ folder with the trainee
  package (it contains the decoded chain).

## 6. Detection shape vs real malware

The macro intentionally *mimics* real malspam techniques so triage practice
transfers:

- auto-exec entry points (`AutoOpen`, `Document_Open`)
- environment guard (`av_ip_block.txt` probe — malware's classic VM tripwire)
- `ChrW` reconstruction + split concatenation + junk functions + decoy names
- WScript.Shell Run of `powershell -NoP -w Hidden -Enc <utf16le-b64>`
- layered PDF filter chain + obfuscated OpenAction JS
- document-property–stored configuration channel + tracking-pixel metadata

Because the stage-2 body only assembles strings, detonating it yields **no**
observable dropper behaviour — which is exactly why it can be safely studied;
the analytical value is entirely in the decode work.
