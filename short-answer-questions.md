# short-answer-questions.md

> Answer with 1–3 sentences each unless a question says otherwise. Full answer key in
> `answers.md`.

## Q1 (3 pts)
Decode the RFC 2047 `Subject` header of `mail/eml/inbound_message.eml`. What is the
exact decoded subject, and why do real malspam operators bother base64-encoding a
subject in the first place (two plausible的业务 reasons)?

## Q2 (3 pts)
Compare `Reply-To` / `Resent-Reply-To` with `From`/`Return-Path`. What BEC-style
social-engineering goal does this mismatch enable, and why would an ordinary
"Reply-All" button *not* catch it?

## Q3 (4 pts)
The `Received:` chain shows three hops. Why is the **second** hop suspicious on its
own line, independently of IP reputation? (Hint: TLS negotiation versus `ESMTPSA`.)
Name the single header that exposes this.

## Q4 (3 pts)
Two types of self-verifying headers exist in the message: `X-Antivirus-AV: ... CLEAN`
and `X-DMARC-Result: fail`. Explain the tension between these two and what a
boundary-aware mail gateway would do with this message.

## Q5 (5 pts)
The document `FedEx_WayBill_7465-2236-9012.docm` contains a macro in
`ThisDocument` with three layers:
1. a Char-code deobfuscator `fc(n)` used on two identifiers,
2. a pre-flight `Dir()` check,
3. a base64 blob passed to `powershell` with `-enc`.

(a) What is the exact PowerShell command decoded from the `-enc` blob (decode as
UTF-16LE), and (b) why is this chain **not** actually malicious in this lab build?

## Q6 (3 pts)
Explain the purpose of the "av_ip_block.txt" pre-flight check inside the macro. Is it
a defensive mechanism or an offensive sandbox-detection marker? Which real-world TTP
does it imitate?

## Q7 (4 pts)
The PDF has an `/OpenAction` that references object 7 with a `/Filter
/ASCII85Decode` stream. Write the two-line procedure you'd use to get the JS
source out of this PDF using nothing but Python's standard library (no
peepdf/qpdf), and name two indicators the obfuscation is meant to hide.

## Q8 (4 pts)
Inside the JS decoded in Q7, `p1` is a 10-char string and `p2` is assembled from
four concatenated fragments. The JS also references a URL that is documentation-only
per RFC 5737. Which "red herring" string is included on purpose so an analyst
mistakes it for the actual beacon (quote it)?

## Q9 (3 pts)
The ZIP `FedEx_AWB_7465-2236-9012.zip` is password-protected, but the mail body
公开ly tells the user the password. From a **phishing-efficiency** standpoint, what
does this "public password" pattern achieve? Name the single security control it bypasses
most reliably.

## Q10 (2 pts)
Where (file + header field) is flag part 1 exactly, and why is it invisible in
Thunderbird even after extracting the PNG?

## Q11 (4 pts)
The message has `X-MimeOLE: Produced By Microsoft MimeOLE V6.1.7601.0` alongside
`X-Mailer: FedEx Courier Express 2026.00`. Explain the contradiction and how you
would harden a mail gateway against such a mismatch.

## Q12 (5 pts)
Reconstruct the flag chain (order: mail → macro → PDF) without running anything in
Word or Acrobat — write down the three short strings and the assembled master flag.

## Q12b (4 pts)
Open the replica `artifacts/web/FedEx_Tracking_Portal.html` offline. Name the two
fields it asks for, state which artefact each code comes from, and explain how the
portal assembles the final flag inside its JavaScript (three tokens — where do they
come from inside the page source, and why is nothing printed in plain text in the
HTML)?

## Q13 (bonus, 2 pts)
The decoy `outbound_decoy.eml` uses `storyceroz[.]com` instead of the main
`723100[.]xyz` chain. What **campaign pattern** does the presence of a
"second-wave" message with a plain (unencrypted) ZIP link suggest? Answer from
traffic-analysis experience.
