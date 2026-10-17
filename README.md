# Email Phishing Lab (Hard Difficulty)

> **Hard-mode email phishing analysis lab**  
> Real `.eml` / `.docm` / `.pdf` chain — fully inert, offline-only training exercise.

All artefacts are *real files* (real MIME encoding, real macro-enabled Word document, real PDF with embedded JavaScript), but **the final payload chain is inert**. There is no live malware, no working C2, and no destructive behaviour. The VBA payload and PDF JavaScript only reference indicators; nothing executes, downloads, or persists.

The **IOC IPs** in the mail chain (`142.132.180.233`, `37.0.11.227`, `104.200.23.95`) are real malspam entities with public reputation on Open Threat Exchange / CAPE Sandbox. Analysts pivot on genuine indicators as they would in a real triage. **Never contact them live** — treat this lab as a 100% offline exercise.

> ⚠️ **Do not run anything on your own workstation.**  
> Treat all samples as you would in a real triage: isolated VM, snapshots disabled, no outbound networking.

---

## Learning Objectives

By the end of this lab you will be able to:

- Parse and decode a fully encoded RFC 822 email (RFC 2047 headers, base64 bodies, custom headers).
- Extract and analyse multi-part MIME attachments (password-protected ZIP, inline PNG).
- Recover IOCs from email authentication results (SPF / DKIM / DMARC failures).
- Extract and deobfuscate VBA macros from a `.docm` (including PowerShell `-enc` payloads).
- Analyse PDF structure, extract `/OpenAction` JavaScript streams, and decode `/ASCII85Decode` filters.
- Inspect PNG metadata chunks (`tEXt`) for hidden data.
- Distinguish primary campaign artefacts from red-herring / decoy messages.
- Assemble a multi-part flag from independent analysis paths and verify it in a controlled portal.

## Prerequisites

- Comfortable with basic email headers and MIME structure.
- Familiarity with base64 / RFC 2047 decoding (CyberChef is enough).
- Ability to run `olevba` / `python-oletools` or open Word’s Visual Basic Editor.
- Basic PDF inspection tools (`pdfid`, `peepdf`, `qpdf`, or similar).
- A safe analysis environment (isolated VM strongly recommended).

## Directory Layout

```
Email-PhishingLab/
── README.md                         you are here
── SAFETY.md                         detailed safety model & warnings
── short-answer-questions.md         short-answer report questions
── mail/
│   └─ eml/
│       ── inbound_message.eml       THE mail source to analyse
│       └─ outbound_decoy.eml        second-wave decoy (red herring)
── artifacts/
│   ── FedEx_WayBill_7465-2236-9012.docm   macro-enabled Word (inert)
│   ── FedEx_WayBill_7465-2236-9012.pdf    PDF with /OpenAction JS
│   ── web/
│   │   ── FedEx_Tracking_Portal.html
│   │   ── inbound_message_body.html
│   │   └─ image015.png                   tracking pixel copy
│   └─ archived/
│       ── FedEx_AWB_7465-2236-9012.zip   password-protected (docm + pdf)
│       └─ FedEx_AWB_public.zip           decoy, no password
└─ deploy/                            final verification portal
    ── public/index.html              "FreightDX" case portal
    └─ vercel.json                    static + noindex headers
```

> The **instructor pack** (answer key, full walkthrough, IOC list, rebuild sources)  
> is distributed separately and is **not** present in this public repository.

---

## What You Have To Do

1. **Read the mail source raw**  
   Open `mail/eml/inbound_message.eml` in a text editor (or Thunderbird → View Message Source). Everything is still in RFC 822 form — no client has decoded it for you.

2. **Decode the mail**  
   - `Subject` / `From` / `To` are `=?UTF-8?B?...?=` (RFC 2047).  
   - Both body parts (`text/plain` and `text/html`) are base64.  
   - Gateway header `X-Beacon-Ref` carries a base64-wrapped IOC URL.  
   - Attachments are base64 — extract the ZIP and the inline PNG.

3. **Inside the ZIP** (password is recoverable from the mail body) you will find the `.docm` + `.pdf`.

4. **Macro analysis**  
   Extract the VBA from the `.docm` (`olevba`, python-oletools, or Word VBE) and deobfuscate the execution chain to recover the payload’s inner string → **reference code 1**.

5. **PDF analysis**  
   The `/OpenAction` points to a `/JavaScript` stream filtered with `/ASCII85Decode`. Decode it and assemble the split strings → **reference code 2**.

6. **Tracking pixel**  
   Decode the inline PNG and inspect its chunks. A `tEXt/Comment` chunk carries **reference code 0** (flag prefix).

7. **Verification portal**  
   Open `deploy/public/index.html` (or the live URL your instructor provides). Enter the two reference codes. The portal releases the final assembled flag.  
   URL autofill is supported: `?key=...&ref=...`

8. **Write the report**  
   Answer every question in `short-answer-questions.md` and submit the master flag.

---

## Lab Time Budget

| Section                    | Suggested minutes |
|---------------------------|-------------------|
| Mail source + headers     | 15                |
| Attachment extraction     | 10                |
| Macro deobfuscation       | 25                |
| PDF JS decode             | 20                |
| Portal verification       | 10                |
| Flag assembly + write-up  | 15                |
| **Total**                 | **~95**           |

---

## Tooling Suggestions

| Task                    | Tools                                      |
|-------------------------|--------------------------------------------|
| View message            | Thunderbird / Outlook / mutt / Evolution   |
| Raw source              | Notepad++ / vim / VS Code                  |
| VBA extraction          | `olevba` (python-oletools) or Word VBE     |
| PDF structure           | `pdfid`, `peepdf`, `qpdf --qdf`            |
| Archive                 | 7-Zip / `unzip`                            |
| All decoding            | CyberChef                                  |
| PNG chunks              | `pngcheck`, `exiftool`, or Python `png`    |

---

## Integrity Hashes (SHA-256)

```
inbound_message.eml                 2a8ba38de679fae6e7ac5bd830d8100df4fc7a725fd95cbec1cf6aa213994aa9
FedEx_WayBill_7465-2236-9012.docm  43a47c730b9bece395bbb416aadc503eca67fa916cb41ed6427c8940a2f70c93
FedEx_WayBill_7465-2236-9012.pdf   e16c6f3a658d63ad7fb2971ee3742126d0670f16695a4be6e9b230eec3cb109f
FedEx_AWB_7465-2236-9012.zip       3bd8c07dd9aa034d2cc6014f2d000184fa961c0b513633d9bcb24da1ae802eaf
image015.png                       110e52660c60fe1ca15c1703dafdace0137aacb6b807f1e5ff0608e09a5cee2d
```

Always verify hashes before analysis.

---

## Safety Summary

- No live binaries, no working downloaders, no real C2.
- The PowerShell payload decoded from the `.docm` only performs `Write-Output $flag` and prints a dead lab URL.
- Do **not** remove the ZIP password or execute the macro outside a controlled lab environment.
- Full details: see [SAFETY.md](SAFETY.md).

---

## License & Attribution

This lab is provided for educational and defensive training purposes only.  
All brand names, logos, and courier references are fictional training replicas and are not affiliated with any real organisation.
