import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { domainToASCII } from 'node:url';
import { parse as parseDomain } from 'tldts';
import { distance as levenshtein } from 'fastest-levenshtein';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- LAYER 1: GOOGLE WEBRISK API ----------
const WEBRISK_ENDPOINT = 'https://webrisk.googleapis.com/v1/uris:search';
const THREAT_TYPES = ['SOCIAL_ENGINEERING', 'MALWARE', 'UNWANTED_SOFTWARE'];

function buildSearchURL(url) {
  const p = new URLSearchParams();
  p.set('uri', url);
  THREAT_TYPES.forEach(t => p.append('threatTypes', t));
  const k = process.env.cipherNovaAPIKEY;
  if (!k) throw new Error('Missing env var cipherNovaAPIKEY');
  p.set('key', k);
  return `${WEBRISK_ENDPOINT}?${p}`;
}

export async function urlChecker(url) {
  const r = await fetch(buildSearchURL(url));
  if (!r.ok) {
    const txt = await r.text().catch(() => '');
    throw new Error(`Web Risk API error ${r.status}: ${txt}`);
  }
  const data = await r.json();
  const types = data?.threat?.threatTypes ?? [];
  const result = types.length ? 'BLOCK' : 'ALLOW';
  return { result, types };
}

// ---------- LAYER 2: DOMAIN DATASET LOOKALIKE CHECKER ----------
const dataset_path = path.join(__dirname, '../data/suspicious_tlds.json');

let byFirst = {};           // domain names grouped by first letter for faster search
let cleanDomain = new Set();   // clean domain labels
let domainSet = new Set();  // full clean domains
let labelsCount = 0;
let layer2 = false;

export function lookalikeSearch(datasetPath = dataset_path) {
  try {
    const raw = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

    // accept labels or full domains from the dataset
    const labels = new Set();
    const domains = new Set();

    // separating the labels and domains into different sets
    for (const s of raw) {
      if (typeof s !== 'string') continue;
      const v = s.toLowerCase().trim();
      if (!v) continue;

      if (v.includes('.')) {
        const ascii = domainToASCII(v) || v;
        const info = parseDomain(ascii);
        if (info.domain) {
          domains.add(info.domain);
          if (info.domainWithoutSuffix && info.domainWithoutSuffix.length >= 2 && info.domainWithoutSuffix.length <= 20) {
            labels.add(info.domainWithoutSuffix);
          }
        }
      } else {
        // if no . == label
        if (v.length >= 2 && v.length <= 20) labels.add(v);
      }
    }

    cleanDomain = labels;
    domainSet = domains;

    // Build buckets from labels
    byFirst = {};
    for (const t of cleanDomain) {
      if (t.length < 3 || t.length > 20) continue;
      (byFirst[t[0]] ??= []).push({ t, L: t.length });
    }
    for (const k of Object.keys(byFirst)) byFirst[k].sort((a, b) => a.L - b.L);

    labelsCount = cleanDomain.size;
    layer2 = true;
    console.log(`Layer 2 dataset loaded: ${labelsCount} labels, ${domainSet.size} domains`);
  } catch (e) {
    layer2 = false;
    console.warn(`Could not load ${datasetPath}: ${e.message}. Layer 2 will be skipped.`);
  }
}

export function checkLookalike(url) {
  if (!layer2) {
    return { result: 'INDETERMINATE', reason: 'dataset not loaded', matches: [] };
  }

  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return { result: 'INDETERMINATE', reason: 'Invalid URL', matches: [] };
  }

  // converting to ascii for checking
  const asciiHost = domainToASCII(hostname) || hostname;
  const info = parseDomain(asciiHost);
  if (!info.domain || !info.publicSuffix || !info.domainWithoutSuffix) {
    return { result: 'INDETERMINATE', reason: 'Unparseable host', matches: [] };
  }

  const core = info.domainWithoutSuffix;   // "google"
  const etld1 = info.domain;               // "google.com"

  // if the domain is in the dataset then its clean
  if (domainSet.has(etld1)) {
    return { result: 'CLEAN', core, etld1, k: 0, matches: [{ term: core, dist: 0 }] };
  }

  let k;
  if (core.length <= 5) {
    k = 1;
  } else {
    k = 2;
  }

  // comparing the first letter to the bucket of domains with the same first letter
  const firstLetter = core[0];
  const bucket = byFirst[firstLetter] ? byFirst[firstLetter] : [];
  if (!bucket.length) {
    return { result: 'CLEAN', core, etld1, k, matches: [] };
  }

  const L = core.length;
  const lo = L - k, hi = L + k;

  const matches = [];
  for (const { t, L: lenT } of bucket) {
    if (lenT < lo) continue;
    if (lenT > hi) break;
    const d = levenshtein(core, t);
    if (d <= k) matches.push({ term: t, dist: d });
  }

  // 1) Exact-label allow -- clean.
  if (matches.some(m => m.dist === 0)) {
    return { result: 'CLEAN', core, etld1, k, matches: [{ term: core, dist: 0 }] };
  }

  // else check lookalikeness
  matches.sort((a, b) => a.dist - b.dist);
  if (matches.length > 10) matches.length = 10;

  const suspicious =
    matches.some(m => m.dist <= 1) || // any close neighbor
    (L >= 6 && matches.filter(m => m.dist === 2).length >= 2);

  return { result: suspicious ? 'LIKELY_LOOKALIKE' : 'CLEAN', core, etld1, k, matches };
}

// load dataset at startup for faster checks
lookalikeSearch();

// ---------- LAYER 3: SUSPICIOUS TLDs ----------
const suspicious_tlds_PATH = path.join(__dirname, '../data/domain.json');
const DEFAULT_suspicious_tlds = []; // (kept empty to preserve original behavior if file missing)

function loadSuspiciousTlds() {
  try {
    const data = fs.readFileSync(suspicious_tlds_PATH, 'utf8');
    const arr = JSON.parse(data);
    if (Array.isArray(arr) && arr.length) return new Set(arr.map(s => String(s).toLowerCase()));
  } catch {}
  return new Set(DEFAULT_suspicious_tlds);
}

const suspicious_tlds = loadSuspiciousTlds();

export function noteSuspiciousTld(url) {
  try {
    const hostname = new URL(url).hostname;
    const ascii = domainToASCII(hostname) || hostname;
    const info = parseDomain(ascii);
    if (!info.publicSuffix) {
      return { flagged: false, publicSuffix: null, tld: null, message: null };
    }
    const ps = info.publicSuffix.toLowerCase(); // e.g. "zip" or "co.uk"
    const last = ps.split('.').pop();           // e.g. "uk"
    const flagged = suspicious_tlds.has(ps) || suspicious_tlds.has(last);
    return {
      flagged,
      publicSuffix: ps,
      tld: last,
      message: flagged ? `Suspicious TLD detected: .${ps}` : null
    };
  } catch {
    return { flagged: false, publicSuffix: null, tld: null, message: null };
  }
}

// Small helper to expose stats to the router without changing logic
export function getMeta() {
  return {
    datasetSize: labelsCount,
    datasetReady: layer2,
    exactDomains: domainSet.size,
    suspiciousTldCount: suspicious_tlds.size,
  };
}
