/**
 * FreightDX lab portal — server-side verification.
 *
 * No plaintext answer keys in this repo: the fragments are compared as
 * salted HMAC-SHA256 digests. Deploy instructors can rotate the salt by
 * setting the LAB_VERIFY_HMAC_KEY environment variable and re-deriving the
 * digests below; the built-in salt is only an offline lab default, and the
 * canonical keys ship with the instructor pack, not with this repository.
 */
var crypto = require('crypto');

module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method not allowed' });
    return;
  }

  var body = req.body || {};
  // Support raw string body if platform did not parse JSON
  if (typeof body === 'string') {
    try { body = JSON.parse(body || '{}'); } catch (e) { body = {}; }
  }

  var r1 = String(body.k1 || body.key || '');
  var r2 = String(body.k2 || body.ref || '');
  var r3 = String(body.k3 || body.osint || '');

  function nrm(s) {
    return String(s == null ? '' : s).trim().toLowerCase();
  }

  var k1 = nrm(r1);
  var k2 = nrm(r2);
  var k3 = nrm(r3);

  var salt = process.env.LAB_VERIFY_HMAC_KEY || 'freightdx-lab-2026-pepper';
  function mac(s) {
    return crypto.createHmac('sha256', salt).update(Buffer.from(s)).digest('hex');
  }

  // Digests of the reference codes (normalized to lowercase for comparison)
  var D_KEY  = 'c19773dff874bd08eb74d0544b9d9bfa59c992bdff958ce64c6f30567f307763';
  var D_REF  = 'd9861d5e257fceeda47d3f414c447b99fd8321e2c4aa5120b8fd0299267e8d2e';
  var D_OSIN = 'a1752c33098b5adb42999b3d1f5468242f06e7aa73e1dc5ef20dfaafaa74423f';

  var t1 = safeEqual(mac(k1), D_KEY);
  var t2 = safeEqual(mac(k2), D_REF);
  var t3 = safeEqual(mac(k3), D_OSIN);

  if (t1 && t2 && t3) {
    res.status(200).json({
      ok: true,
      // Master flag is assembled from the codes exactly as the trainee typed
      // them; typed per the artefacts it matches the canonical master flag.
      flag: 'FLAG{FR8-' + r1.trim() + r2.trim() + r3.trim(),
      message: 'Verification passed - case file released.'
    });
    return;
  }

  res.status(401).json({
    ok: false,
    error: 'Verification failed - one or more reference codes are incorrect.'
  });
};

// Constant-time comparison (Node >=6.6); falls back for safety.
function safeEqual(a, b) {
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch (e) {
    if (a.length !== b.length) return false;
    var diff = 0;
    for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
  }
}
