# short-answer-questions.md

One short answer per question (IP / URL / header / string / hash).
Case-insensitive. Leading and trailing spaces ignored.

All artefacts needed are in the lab package you downloaded. No external
repo paths are required.

---

## Q1 — Subject
What is the decoded Subject of the inbound message?

## Q2 — Reply-To
What is the exact Reply-To address?

## Q3 — Envelope domain
What domain appears after `@` in the Return-Path / From envelope?

## Q4 — Beacon URL
The X-Beacon-Ref header is base64-encoded. What is the decoded URL?

## Q5 — Archive password
What password opens the attached FedEx AWB archive?

## Q6 — Pixel Comment
The tracking pixel PNG has a tEXt chunk named Comment. What is its value?

## Q7 — Campaign token
The same campaign identifier appears in the pixel Pipeline chunk, the document
property channel, the macro stage-2, the PDF JavaScript, and X-Panel-Ref.
What is that token?

## Q8 — Macro flag
In the Word macro, the PowerShell stage-2 assigns `$flag`. What is its value?

## Q9 — PDF filters
The PDF OpenAction stream uses a two-step filter chain. Name both filters in
the order they are applied when decoding. Format: `A, B`

## Q10 — Decoy URL
The decoded PDF JavaScript contains a `dead2` URL. What is it?

## Q11 — PDF fragment
In the decoded PDF JavaScript, the fragments joined into `p2` form which string?

## Q12 — First hop
In the topmost Received header (first in the file), what source IP appears in
brackets?

## Q13 — Originating IP
What is the X-Originating-IP value?

## Q14 — Decoy domain
The outbound decoy message links to a domain outside the main chain. Which domain?

## Q15 — OSINT
Recover the campaign ID.
Find a matching 2025 sample.
Use the install filename + C2 to locate the mutex.

## Q16 — Master flag
Assemble the master flag from:
- the macro flag (Q8)
- the PDF fragment (Q11)
- the OSINT answer (Q15)

Format starts with `FLAG{FR8-` followed by those three values in order.

---

## Bonus

## Q17 — DKIM domain
In the DKIM-Signature header, what is the value of `d=`?

## Q18 — X-Mailer
What is the exact X-Mailer header value?

## Q19 — Message-ID host
In Message-ID, what host appears after `@`?

## Q20 — Archive hash
What is the SHA256 of the password-protected FedEx AWB zip (the archive file
itself, not its contents)?

## Q21 — Document author
Inside the Word document package, what author name is recorded in the core
metadata (`dc:creator` / `cp:lastModifiedBy`)?
