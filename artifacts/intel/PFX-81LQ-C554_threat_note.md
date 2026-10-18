# Archival Threat Note — Courier Phishing Cluster (FreightDX / FedEx lure)

**Status:** PUBLIC / TRAINING MIRROR  
**Classification:** Open source intelligence snapshot for defensive research  
**Campaign identifier:** `PFX-81LQ-C554`  
**First observed (lab timeline):** 2026-10-17  
**Related AWB lure:** 7465-2236-9012

---

## Summary

Analysts tracking a small courier-themed phishing cluster observed a recurring **pipeline / panel registration token**:

```
PFX-81LQ-C554
```

The token appears across multiple artefacts in the same wave:
- custom mail gateway headers (`X-Panel-Ref`)
- staged PowerShell strings inside macro-enabled waybill documents
- PDF OpenAction side-channel comments
- tracking-pixel metadata (`tEXt` Pipeline key)

This note is a **static public mirror** of material that previously circulated in short-lived discussion channels and paste dumps. The live channels are no longer available; treat this file as the recoverable archive.

---

## Infrastructure notes (historical / dead)

Examples recovered from the same cluster (do **not** contact live):

| Role | Indicator |
|------|-----------|
| Beacon host | `104.200.23.95` |
| Panel path style | `/panel/register.php?cid=PFX-81LQ-C554` |
| Alternate host label | `723100.xyz` |
| Reply-To persona | `pedro.carlos4209@storyceroz.com` |

All URLs in this cluster were assessed as **lab-inert or historically dead** in the mirrored exercise set. No active exploitation is documented here.

---

## Analyst extraction note

During correlation of `PFX-81LQ-C554` dumps, one secondary string was consistently paired with the token in the final stage packaging notes:

```
pr0xy-d34d}
```

Operators used this as a **case-closure / verification fragment** in their internal runbooks (not as a victim-facing password). Defenders reconstructing the full chain should treat it as the OSINT-derived tail of the assembled case flag for this campaign wave.

---

## Handling

- Offline analysis only
- No credential use, no login attempts, no scanning of listed hosts
- This document exists so training labs remain solvable if ephemeral chat archives disappear

**Search keys:** `PFX-81LQ-C554`, `7465-2236-9012`, `FreightDX`, `FedEx Air WayBill`
