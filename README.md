# rto-api

> Free, public, REST-shaped static JSON API for Indian Regional Transport Office (RTO) vehicle registration codes.

Part of the [oriz](https://oriz.in) fleet.

---

## What this is

A static dataset of every Indian RTO code (`MH-12`, `DL-1`, `KA-01`, …) served as plain JSON files. No backend, no auth, no rate limits — fetch from GitHub directly or via a CDN. **1299 codes across 35 states & union territories.**

Each code includes:
- `code` — e.g. `"MH-12"`
- `state_code` — 2-letter prefix, e.g. `"MH"`
- `state` — expanded state name, e.g. `"Maharashtra"`
- `office` — RTO office location/city
- `district` — jurisdiction area
- `notes` — annotations (may be empty string)

States that use a "one state, one code" policy (Andhra Pradesh) carry a `districts: [...]` array on the single code record instead of duplicating that code per district.

---

## Endpoints

> All URLs are static JSON. The dataset lives on the `main` branch of this repo.

### Via jsDelivr (CDN — recommended for production)

```
https://cdn.jsdelivr.net/gh/oriz-org/rto-api@main/codes/<CODE>.json
https://cdn.jsdelivr.net/gh/oriz-org/rto-api@main/states/<STATE_CODE>.json
https://cdn.jsdelivr.net/gh/oriz-org/rto-api@main/states.json
https://cdn.jsdelivr.net/gh/oriz-org/rto-api@main/index.json
https://cdn.jsdelivr.net/gh/oriz-org/rto-api@main/all.json
```

### Via GitHub raw

```
https://raw.githubusercontent.com/oriz-org/rto-api/main/codes/<CODE>.json
```

### Via `rto.oriz.in` (coming soon)

A Cloudflare Pages mapping will expose the same files at `https://rto.oriz.in/codes/<CODE>.json`. Not wired yet — use jsDelivr until then.

### Endpoint reference

| Path | Returns |
|---|---|
| `/codes/<CODE>.json` | Single code record (e.g. `codes/MH-12.json`). |
| `/states/<STATE_CODE>.json` | All codes for one state (e.g. `states/MH.json`). |
| `/states.json` | Array of every state/UT with its code count. |
| `/index.json` | Compact array of every code string, for autocomplete. |
| `/all.json` | Array of every full code record (large; for bulk download). |

---

## Example response

`GET https://cdn.jsdelivr.net/gh/oriz-org/rto-api@main/codes/MH-12.json`

```json
{
  "code": "MH-12",
  "state_code": "MH",
  "state": "Maharashtra",
  "office": "Pune",
  "district": "Pune",
  "notes": ""
}
```

`GET https://cdn.jsdelivr.net/gh/oriz-org/rto-api@main/codes/AP-39.json`

```json
{
  "code": "AP-39",
  "state_code": "AP",
  "state": "Andhra Pradesh",
  "office": "RTA",
  "districts": [
    "Tirupati district",
    "Krishna district",
    "NTR district",
    "..."
  ],
  "notes": "One state-one code policy from Feb 2019. APSRTC vehicles use Z series; Police vehicles use P series."
}
```

---

## Data source

Parsed from [List of Regional Transport Office districts in India](https://en.wikipedia.org/wiki/List_of_Regional_Transport_Office_districts_in_India) on Wikipedia.

Wikipedia content is licensed under **CC BY-SA 4.0** — the dataset in this repo inherits that license. Attribution: "Source: Wikipedia / List of Regional Transport Office districts in India".

The build script (`scripts/`) is included so anyone can regenerate the dataset and audit the mapping.

---

## License

- **Code** (`scripts/`, build tooling): [MIT](./LICENSE)
- **Data** (`codes/`, `states/`, `index.json`, `all.json`, `states.json`): [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) per Wikipedia's terms.

---

## Contributing

Found a stale code, missing entry, or wrong jurisdiction? Open a PR against `scripts/build.js` or `scripts/data2.js` and re-run `node scripts/generate.js` — the JSON files are generated, not hand-edited.

Issues are welcome for data corrections, new states/UT codes, or API shape suggestions.

---

## Related

Part of the [oriz](https://oriz.in) fleet — free, no-auth, no-card-on-file utilities. See also the other public datasets at https://oriz.in.
