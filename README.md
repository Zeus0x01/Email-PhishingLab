# README.md — Email Phishing Lab (Hard Difficulty, upgraded)

Welcome to the **hard-mode** email phishing analysis lab. All artefacts here are *real
files* (real `.eml` mail source with real MIME encoding, real macro-enabled `.docm`,
real `.pdf` with layered-encoded embedded JavaScript, real password-protected ZIP, real
remote PNG as the tracking pixel), but **the whole chain is inert** — there is no live
malware, no working downloader, no real C2, no persistence. See `SAFETY.md`.

The **IOC IPs/domains in the mail chain are real malspam entities with public reputation**
on sandboxes and threat-intel feeds (Open Threat Exchange / CAPE Sandbox tagged
`142.132.180.233`, `37.0.11.227`, `104.200.23.95`) so analysts pivot on genuine
indicators, as they would in real triage. They must **never be contacted live**;
the artefact chain is a 100% offline exercise, and the one OSINT step points at a
public, archival note — never at attacker infrastructure. Note that **these IOCs
will age out of reputation feeds**: malspam infrastructure decays, verdicts drop
off sandboxes/OTX dashboards, and blocklists expire. Treat the pivot exercise
(Q4, Q12–Q13, Q14) as time-sensitive — if an indicator no longer appears on a
feed, grade it from the instructor IOC list rather than re-pivoting live.

> **Do not run anything on your own workstation** — treat all samples as you would in a
> real triage: isolated VM, snapshots off, no outbound networking.

## Directory layout

```
Email-PhishingLab/
├── README.md                         you are here
├── SAFETY.md                         inert guarantees + handling rules
├── short-answer-questions.md         16 core + 5 bonus short-answer questions
├── mail/
│   └── eml/
│       ├── inbound_message.eml       THE mail source to analyse (styled phishing body)
│       └── outbound_decoy.eml        second-wave decoy (red herring)
├── artifacts/
│   ├── FedEx_WayBill_7465-2236-9012.docm
│   │                                 "protected view" macro doc (inert dropper chain)
│   ├── FedEx_WayBill_7465-2236-9012.pdf     PDF with /OpenAction JS (2-step filter)
│   ├── web/
│   │   ├── FedEx_Tracking_Portal.html        offline courier portal replica
│   │   ├── inbound_message_body.html         styled mail body, locally clickable links
│   │   └── image015.png                      the mail's "tracking pixel" copy
│   └── archived/
│       ├── FedEx_AWB_7465-2236-9012.zip      password-protected archive (docm + pdf)
│       └── FedEx_AWB_public.zip              decoy, no password
└── deploy/                            the final verification portal (public build)
    ├── public/index.html              de-branded "FreightDX" case portal (3 codes)
    ├── api/verify.js                  serverless verify endpoint (hash-only comparison)
    └── vercel.json                    static config + noindex headers
```

> The repo also keeps byte-identical `public/index.html` and `api/verify.js`
> copies at the repository root, so Vercel can build from the repo root without
> a Root Directory override. Keep the pairs in sync when editing.

> The **instructor pack** (flag scheme, answer key, walkthrough, IOC list, OSINT
> snapshot, decoded mail map) is NOT part of this public edition. This repo is
> deliberately official — instructors distribute the answer key separately.

## Learning objectives

* Full RFC822 header triage: hop chain, SPF/DKIM/DMARC verdicts, reply-to redirect,
  encoded bodies, custom gateway headers (base64-wrapped IOC + panel URL).
* Password-protected attachment handling (password is present in the mail body).
* Professional VBA macro analysis ("not-toy-level"): auto-exec entries, `ChrW`
  decoder chains, split concatenation, junk/decoy functions, document-property
  configuration channel, UTF-16LE `-enc` stage-2 decode.
* Hard PDF JavaScript analysis: two-step `/Filter [/ASCII85Decode /FlateDecode]`
  stream, fragment reassembly, red-herring separation.
* Tracking-pixel / stego metadata extraction (two `tEXt` chunks).
* OSINT pivot from a unique campaign token to one flag fragment.
* Flag-assembly: final verification portal + short-answer report.

## Prerequisites

* 7-Zip (or any ZIP tool able to prompt for a password)
* A hex/PNG chunk viewer (`pngcheck -v`, CyberChef "Extract Files", python `zlib`/`struct`)
* python-oletools (`olevba`) or the Word VBE for macro analysis
* peepdf / pdfid / qpdf or CyberChef ("From Base85" + "Flate" / "Gunzip") for the PDF
* CyberChef covers nearly every decode in one view (b64, RFC2047, UTF-16LE, A85)
* A browser for the portal (offline twin works without a server)

## Step-by-step trainee workflow

1. **Read the mail source raw.** Open `mail/eml/inbound_message.eml` as text
   (Notepad++, Thunderbird "View -> Message Source", CyberChef).
2. **Decode everything:**
   - `Subject` is fully RFC2047-B encoded (`=?UTF-8?B?...?=`); the `From` and
     `To` display names are encoded the same way (the bare address after
     `<>` stays plain, which is normal RFC behaviour);
   - both body parts (`text/plain`, `text/html`) are base64;
   - `X-Beacon-Ref` and `X-Panel-Ref` are base64-wrapped URLs.
3. **Extract attachments:** the password-protected ZIP, and the inline PNG pixel.
4. **Open the encrypted archive** with the password you find in the body
   (`Archive password: ...`) → recover `.docm` + `.pdf`.
5. **Macro analysis** (olevba / VBE): locate the auto-exec entries, follow the
   `ChrW`-decoder + split-concat strings to `powershell.exe -NoP -w Hidden -Enc <blob>`;
   decode the `<blob>` as UTF-16LE base64 → **reference code from the `$flag`
   variable (fragment 1)**. Also decode the base64 chunk the macro reads from the
   document-properties channel (and the same token in the pixel's second `tEXt`
   chunk and in `X-Panel-Ref`) → the **campaign token** to OSINT-pivot on.
6. **PDF analysis:** pull the `/OpenAction` → `/JavaScript` stream; apply the two
   declared filters in the order they decode (base85 then inflate); reassemble the
   split fragments that `s4()` joins into `p2` → **reference code (fragment 2)**.
   Split off the red-herring `dead2` URL from the real IOC.
7. **Tracking pixel:** decode the PNG's two `tEXt` chunks (Comment = **fragment 0**;
   Pipeline = the campaign token again — confirming the OSINT target).
8. **OSINT step:** use the campaign token to find the public threat note about this
   campaign (your instructor documents how the token is published/archived and
   distributes an offline snapshot of the note with the instructor pack).
   This is the **only step that is not solvable from the artefacts alone** —
   solo trainees need the instructor's snapshot (or access to the public
   archive); without it Q15 cannot be answered. The note contains
   **fragment C**.
9. **Verification portal:** open `deploy/public/index.html` (or the offline twin)
   and enter fragment 1, fragment 2 and fragment C. The portal assembles and
   releases the master flag. URL autofill: `?key=...&ref=...&osint=...`.
10. Write your incident report — see `short-answer-questions.md` (16 + 4 bonus).

## Lab time budget

| Section | Suggested minutes |
|---|---|
| Mail source + headers + decode | 20 |
| Attachment extraction + archive | 10 |
| Macro chain + stage-2 decode | 35 |
| Pixel metadata | 10 |
| PDF two-filter JS decode | 30 |
| OSINT pivot (fragment C) | 15 |
| Portal verification + flag assembly | 10 |
| Write-up (short answers) | 20 |
| **Total** | **~150** |

## Tooling suggestions

* Thunderbird / Outlook / mutt / Evolution — to *view* the message.
* Notepad++ or vim — raw source viewing.
* python-oletools `olevba` — VBA extraction and de-obfuscation.
* `peepdf`, `pdfid`, `qpdf --qdf`, mutool — PDF object/stream analysis.
* CyberChef — b64 / RFC2047 / UTF-16LE / From Base85 / Inflate in one pipeline.
* `pngcheck -v` / CyberChef "Extract Files" — PNG chunk dump.
* 7-Zip — password-protected archive.

## SHA256 (key artefacts, as shipped)

| File | SHA256 |
|---|---|
| `mail/eml/inbound_message.eml` | `8f8e6d51de63df0506fe6707809ac57cdd13febb143ca8ab6509d885230a4487` |
| `mail/eml/outbound_decoy.eml` | `f38104b106938166ca0acb9b0d49f72a0bf1dfb8d7beb65f44733c608e0d5215` |
| `artifacts/.../7465-2236-9012.docm` | `eaffdae38239dea6ccf7726004376ffddae02c2f48658caed34be8b0c430597f` |
| `artifacts/.../7465-2236-9012.pdf` | `6b1a9c0be286e01d43db3fa307fe75168886d356adeb13a89b3ee7a1bb23d910` |
| `artifacts/archived/FedEx_AWB_7465-2236-9012.zip` | `639507f9e4bbd215dc0b23a5c39a99e8a5e7bbcc1c59ba7da32a4161a4a53101` |
| `artifacts/archived/FedEx_AWB_public.zip` | `f9d6cac3cf3a9053ee1dddd950fef3d8d497328da11830eb2e07a8872359fe35` |
| `artifacts/web/image015.png` | `c000009daa8da04bd5d051e51c53cc05951f2ff32144a2cf5a7c3405910af99c` |
| `artifacts/web/FedEx_Tracking_Portal.html` | `f8d0d72126ab7f4b9388dff49d447237adec410f2da5c1a34a17f9a5c910f870` |
| `artifacts/web/inbound_message_body.html` | `1732c542a78df0ba652a5967ea68812afcd7794eaca2f3bc6ed0f8eb20f5ce2b` |
| `deploy/public/index.html` (and root `public/index.html` mirror) | `5f32e74e01992e309a1fbac9e617d6d486effe70c396e21878d5683cda8eabc4` |
| `deploy/api/verify.js` (and root `api/verify.js` mirror) | `fe76eb1089716b48aaa1521989706249694b632666e4dadca3ddadc944776862` |

## Safety summary (see SAFETY.md for the full model)

* No live malware, no working droppers, no C2 callbacks, no persistence, no destructive actions.
* The VBA `-enc` stage-2 only *reconstructs strings* and `Write-Output`s one of them; never executes downloads, drops files, or touches the registry/network.
* The PDF JavaScript only re-assembles strings and shows an alert; its `/URI` annotation is never fetched.
* All network indicators are offline-analysis-only; the OSINT fragment lives in a public/archivable instructor note, not on attacker infrastructure.
* `deploy/public/index.html` sends the three codes to the serverless `/api/verify` endpoint for checking (the page itself embeds no answer tokens); the offline twin `artifacts/web/FedEx_Tracking_Portal.html` is local JS only and never contacts the network.
