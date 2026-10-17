# README.md — Email Phishing Lab (Hard Difficulty)

Welcome to the **hard-mode** email phishing analysis lab. All artefacts here are *real
files* (real `.eml` mail source with real MIME encoding, real macro-enabled `.docm`,
real `.pdf` with embedded JavaScript), but **the final payload chain is inert** — there
is no live malware, no working C2, no destructive behaviour. The VBA payload and PDF
JS only reference indicators; nothing executes, downloads, or persists.

The **IOC IPs in the mail chain are real malspam entities with public reputation** on
sandboxes and threat-intel feeds (Open Threat Exchange / CAPE Sandbox tagged
`142.132.180.233`, `37.0.11.227`, `104.200.23.95`) so analysts are pivoting on
genuine indicators, as they would in a real triage. They must **never be contacted
live**; treat the lab as a 100% offline exercise.

> **Do not run anything on your own workstation** — treat all samples as you would in a
> real triage: isolated VM, snapshots off, no outbound networking.

## Directory layout

```
Email-PhishingLab/
├── README.md                         you are here
├── short-answer-questions.md         12 hard short-answer questions
├── mail/
│   └── eml/
│       ├── inbound_message.eml       THE mail source to analyse (styled phishing body)
│       └── outbound_decoy.eml        second-wave decoy (red herring)
├── artifacts/
│   ├── FedEx_WayBill_7465-2236-9012.docm
│   │                                 macro-enabled Word doc (inert dropper)
│   ├── FedEx_WayBill_7465-2236-9012.pdf     PDF with /OpenAction JS
│   ├── web/
│   │   ├── FedEx_Tracking_Portal.html        fake courier portal (open offline)
│   │   ├── inbound_message_body.html         styled mail body, locally clickable links
│   │   └── image015.png                      the mail's "tracking pixel" copy
│   └── archived/
│       ├── FedEx_AWB_7465-2236-9012.zip      password-protected archive (docm + pdf)
│       └── FedEx_AWB_public.zip              decoy, no password
└── deploy/                            the final verification portal (public build)
    ├── public/index.html              de-branded "FreightDX" case portal
    └── vercel.json                    static config + noindex headers
```

> The **instructor pack** (answer key, walkthrough, IOC list, rebuild sources)
> is distributed separately — it is deliberately **not** in this public repo,
> so players cannot shortcut the challenge.

## What you have to do

1. **Read the mail source raw.** Open `mail/eml/inbound_message.eml` in a text editor
   (Notepad++, Thunderbird "View -> Message Source", anything). Notice:
   everything is in RFC 822 raw form — no client has decoded it for you yet.
2. **Decode the mail (everything is encoded):**
   - `Subject` / `From` / `To` are `=?UTF-8?B?...?=` base64 — decode them.
   - Both body parts (`text/plain`, `text/html`) are **base64** — decode them.
   - A gateway header `X-Beacon-Ref` carries a base64-wrapped IOC URL — decode it.
   - Attachments are `base64` — extract the ZIP and the inline PNG.
3. **Inside the ZIP (password in the mail body) find the `.docm` + `.pdf`.**
4. **Macro analysis** — extract the VBA from the `.docm` (olevba, python-oletools, or
   Word's VBE) and deobfuscate the execution chain to recover the payload's inner
   string — **reference code 1**.
5. **PDF analysis** — open the PDF object structure; the `/OpenAction` is a
   `/JavaScript` stream filtered with `/ASCII85Decode`. Decode it and assemble the
   split strings — **reference code 2**.
6. **Tracking pixel** — decode the base64 of the inline PNG and inspect its
   chunks; a `tEXt/Comment` chunk carries **reference code 0** (the flag prefix).
7. **Verification portal** — open `deploy/public/index.html` in a browser and enter
   the two reference codes exactly as recovered. The portal verifies them and
   releases the final assembled flag. (Also reachable live at the URL your
   instructor hands out; `?key=...&ref=...` URL autofill is supported.)
8. Combine the three parts into the master flag and write your incident report —
   see `short-answer-questions.md` for the 12 report questions.

## Safety

- **No live binaries**, no working downloaders, no real C2.
- The `powershell` payload the docm decodes only does `Write-Output $flag` and prints
  a dead lab URL. This is safe to observe but avoid running it outside the VM.
- Do **not** remove the ZIP password or try to *execute* the macro outside the lab.

## Lab time budget

| Section | Suggested minutes |
|---|---|
| Mail source + headers | 15 |
| Attachment extraction | 10 |
| Macro deobfuscation | 25 |
| PDF JS decode | 20 |
| Portal verification | 10 |
| Flag assembly + write-up | 15 |
| **Total** | **95** |

## Tooling suggestions

- Thunderbird / Outlook / mutt / Evolution — to *view* the message.
- Notepad++ or vim — raw source viewing.
- python-oletools `olevba` — VBA extraction (or just Word VBE).
- `peepdf`, `pdfid`, `qpdf --qdf` — PDF structure analysis.
- 7-Zip — for the password-protected archive.
- CyberChef — for all base64 / RFC2047 / A85 decoding in one view.
