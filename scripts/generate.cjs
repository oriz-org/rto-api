#!/usr/bin/env node
// Generate JSON files from data tables.

const fs = require('fs');
const path = require('path');
const { STATE_NAMES, RAW } = require('./build.cjs');
const rest = require('./data2.cjs');

const ROOT = path.resolve(__dirname, '..');
const OUT = ROOT; // write JSON to repo root; npm run prebuild mirrors into public/ for Astro
const CODES_DIR = path.join(OUT, 'codes');
const STATES_DIR = path.join(OUT, 'states');

fs.mkdirSync(CODES_DIR, { recursive: true });
fs.mkdirSync(STATES_DIR, { recursive: true });

// Merge data2 into RAW
for (const [sc, rows] of Object.entries(rest)) {
  RAW[sc] = rows;
}

const allRecords = [];

function buildRecord(stateCode, raw) {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return {
      code: raw.code,
      state_code: stateCode,
      state: STATE_NAMES[stateCode],
      office: raw.office || '',
      districts: raw.districts || [],
      notes: raw.notes || '',
    };
  }
  const [code, office, district, notes] = raw;
  return {
    code,
    state_code: stateCode,
    state: STATE_NAMES[stateCode],
    office: office || '',
    district: district || '',
    notes: notes || '',
  };
}

for (const stateCode of Object.keys(STATE_NAMES)) {
  const data = RAW[stateCode];
  if (!data) {
    console.warn(`No data for ${stateCode}`);
    continue;
  }

  let rows;
  if (Array.isArray(data)) {
    rows = data;
  } else {
    rows = [...(data.special || []), ...(data.older || [])];
  }

  const stateRecords = rows.map((r) => buildRecord(stateCode, r));

  for (const rec of stateRecords) {
    allRecords.push(rec);
    fs.writeFileSync(
      path.join(CODES_DIR, `${rec.code}.json`),
      JSON.stringify(rec, null, 2) + '\n'
    );
  }

  fs.writeFileSync(
    path.join(STATES_DIR, `${stateCode}.json`),
    JSON.stringify(
      {
        state_code: stateCode,
        state: STATE_NAMES[stateCode],
        count: stateRecords.length,
        codes: stateRecords,
      },
      null,
      2
    ) + '\n'
  );
}

allRecords.sort((a, b) => a.code.localeCompare(b.code));

const index = allRecords.map((r) => r.code);
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index) + '\n');

fs.writeFileSync(path.join(OUT, 'all.json'), JSON.stringify(allRecords, null, 2) + '\n');

const statesList = Object.keys(STATE_NAMES).map((sc) => ({
  state_code: sc,
  state: STATE_NAMES[sc],
  count: allRecords.filter((r) => r.state_code === sc).length,
}));
fs.writeFileSync(path.join(OUT, 'states.json'), JSON.stringify(statesList, null, 2) + '\n');

console.log(`Generated:`);
console.log(`  ${allRecords.length} code records in codes/`);
console.log(`  ${Object.keys(STATE_NAMES).length} state files in states/`);
console.log(`  index.json (${index.length} entries)`);
console.log(`  all.json (${allRecords.length} entries)`);
console.log(`  states.json (${statesList.length} entries)`);
