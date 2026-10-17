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

## Q6 — Pixel flag part 1 (1 string)
Decode the inline `image015.png` MIME part; a `tEXt/Comment` chunk carries flag
part 1. What is the exact string? Answer format: exact chunk value, including
the trailing hyphen if present.

## Q7 — Macro reference code (1 string)
Inside `FedEx_WayBill_7465-2236-9012.docm`, the VBA `-enc` PowerShell blob decodes
(UTF-16LE) to a small payload whose first line assigns `$flag`. What is the exact
decoded flag value? Answer format: exact string.

## Q8 — PDF obfuscation filter (1 token)
The `/OpenAction` of `FedEx_WayBill_7465-2236-9012.pdf` points to a stream whose
`/Filter` is what? Answer format: name after the `/Filter` `/` (single token).

## Q9 — Red-herring URL (1 URL)
The decoded PDF JavaScript contains a `dead2` string — a URL an analyst might
mistake for the real beacon. What is the exact URL? Answer format: full URL.

## Q10 — PDF flag part 3 (1 string)
Assemble the four concatenated fragments assigned to `p2` inside the decoded
PDF JavaScript. What is the exact value? Answer format: exact string, including
the trailing brace if present.

## Q11 — First hop IP (1 IP)
The very first (topmost, recipient-added) `Received:` header mentions a source
server IP in brackets. What is it? Answer format: IPv4 address only.

## Q12 — Originating IP (1 IP)
What is the value of the `X-Originating-IP:` header? Answer format: IPv4
address only (brackets optional).

## Q13 — Decoy domain (1 domain)
`outbound_decoy.eml` links out to a different domain than the main campaign chain.
Which one? Answer format: domain only.

## Q14 — Master flag (1 string)
Open `deploy/public/index.html`, enter the two reference codes you recovered
(the Word-doc key from Q7 and the PDF reference from Q10). What exact string does
the portal release? Answer format: the assembled master flag.
