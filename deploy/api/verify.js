/**
 * FreightDX lab portal — server-side verification.
 * Answers live only here (Vercel Serverless), not in public/index.html.
 */
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

  function nrm(s) {
    return String(s == null ? '' : s).trim().toLowerCase();
  }

  var k1 = nrm(body.k1 || body.key);
  var k2 = nrm(body.k2 || body.ref);
  var k3 = nrm(body.k3 || body.osint);

  // Canonical secrets (compared case-insensitively)
  var WORD = 'm41lg8t3-';
  var PDF  = 'sh3ll-lq87-';
  var OSIN = 'pr0xy-d34d}';

  if (k1 === WORD && k2 === PDF && k3 === OSIN) {
    res.status(200).json({
      ok: true,
      flag: 'FLAG{FR8-m41lg8t3-sh3ll-LQ87-pr0xy-d34d}',
      message: 'Verification passed - case file released.'
    });
    return;
  }

  res.status(401).json({
    ok: false,
    error: 'Verification failed - one or more reference codes are incorrect.'
  });
};
