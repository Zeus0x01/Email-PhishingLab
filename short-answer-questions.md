# short-answer-questions.md

One line per question — a single short, exact answer (IP / URL / header / string).
No explanations. Case-insensitive; leading/trailing spaces ignored.
Format hint in parentheses on each line.

## Q1 — Subject (1 string)
Decode the RFC 2047 `Subject` header of `mail/eml/inbound_message.eml`.
Answer format: exact decoded subject text.

## Q2 — Reply-To address (1 email address)
What is the exact `Reply-To` (and identical `Resent-Reply-To`) address in
`inbound_message.eml`? Answer format: full email address.

## Q3 — Envelope domain (1 domain)
Which domain does the `Return-Path`/`From` envelope use (the part after `@`)?
Answer format: domain only.

## Q4 — X-Beacon-Ref URL (1 URL)
`X-Beacon-Ref:` is a base64-wrapped value. What is the exact decoded URL?
Answer format: full URL, no trailing spaces.

## Q5 — ZIP password (1 token)
What is the password protecting the attached archive `FedEx_AWB_7465-2236-9012.zip`?
Answer format: password only.

## Q6 — Pixel flag part 0 (1 string)
Decode the inline `image015.png` MIME part; a `tEXt` chunk keyed `Comment` carries
flag part 0. What is the exact string? Answer format: exact chunk value, including
the trailing hyphen if present.

## Q7 — Pipeline token (1 token)
A second `tEXt` chunk (`Pipeline`), the base64 `Comments` property / hardcoded
channel inside the `.docm`, the decoded PowerShell stage-2, the decoded PDF JS and
the `X-Panel-Ref` header all reveal the same unique campaign identifier. What is it?
Answer format: exact token.

## Q8 — Macro reference code (1 string)
Inside `FedEx_WayBill_7465-2236-9012.docm`, the VBA `-enc` PowerShell blob decodes
(UTF-16LE) to a small payload whose first line assigns `$flag`. What is the exact
decoded value? Answer format: exact string, including the trailing hyphen.

## Q9 — PDF filter chain (2 tokens in order)
The `/OpenAction` of `FedEx_WayBill_7465-2236-9012.pdf` points to a stream with a
TWO-step `/Filter [ ... ]`. Name BOTH filters in the order they are applied when
decoding the stream. Answer format: comma-separated tokens, e.g. `A, B`.

## Q10 — Red-herring URL (1 URL)
The decoded PDF JavaScript contains a `dead2` string — a URL an analyst might
mistake for the real beacon. What is the exact URL? Answer format: full URL.

## Q11 — PDF flag part 2 (1 string)
Assemble the fragments concatenated inside `q2` of the decoded PDF JavaScript
(the `s4` function joins them into `p2`). What is the exact value? Answer format:
exact string, including the trailing hyphen.

## Q12 — First hop IP (1 IP)
The **topmost** `Received:` header — the first one in the file, i.e. the line at
the very top of the header block, added last by the recipient-side hop — mentions
a source server IP in brackets. The lower `Received:` hops list other IPs; only
the topmost header counts. What is it? Answer format: IPv4 address only.

## Q13 — Originating IP (1 IP)
What is the value of the `X-Originating-IP:` header? Answer format: IPv4
address only (brackets optional).

## Q14 — Decoy domain (1 domain)
`outbound_decoy.eml` links out to a domain outside the main campaign chain.
Which one? Answer format: domain only.

## Q15 — OSINT flag fragment (1 string)
The pipeline token (Q7) is the campaign identifier. The OSINT step uses it to
reveal the last fragment of the master flag. What is the exact OSINT-derived
fragment? Answer format: exact string, including the trailing brace if present.
Hint: your instructor explains where the token leads (public threat note /
archive snapshot) and distributes an offline snapshot of that note with the
instructor pack. This is the only step that cannot be completed from the
artefacts alone.

## Q16 — Master flag (1 string)
Open `deploy/public/index.html`, enter the three codes you recovered (the Word-doc
key from Q8, the PDF fragment from Q11 and the OSINT fragment from Q15). What exact
string does the portal release? Answer format: the assembled master flag.
Worth double points.

---

## Bonus questions (extra credit)

## Q17 — DKIM domain (1 domain)
The `DKIM-Signature:` line carries `d=...`. Which signing domain is claimed?
Answer format: domain only.

## Q18 — X-Mailer (1 string)
What is the exact `X-Mailer:` header value? Answer format: exact string.

## Q19 — Message-ID host (1 domain)
The `Message-ID:` right-hand side (after `@`) belongs to which host?
Answer format: host/domain only.

## Q20 — Attachment SHA256 (1 hash)
What is the SHA256 of the password-protected archive `FedEx_AWB_7465-2236-9012.zip`
(the file as distributed in `artifacts/archived/`, not the hash of its inner
members)? Answer format: full lowercase hex hash.

## Q21 — Document author metadata (1 string)
Real triage checks OOXML metadata hygiene. Open `docProps/core.xml` inside the
docm package (7-Zip / CyberChef "Extract Files" — no Office needed): the
`dc:creator` and `cp:lastModifiedBy` properties record the same author name,
with creation/modification timestamps. What is the exact name recorded?
Answer format: exact name as stored in `core.xml`.
