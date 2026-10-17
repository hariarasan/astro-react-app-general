# Vedic Astrology App (React Native)

A React Native (TypeScript) Android app that collects birth details and
renders a Vedic astrology chart, chart analysis, and Dasha/Bhukti timeline
by calling the local `astro-fast-api` FastAPI service.

## Features

1. **Birth Details form** — first name, last name, date of birth, birth
   time (AM/PM), and birth location (city search). City search uses the
   free [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
   (no API key needed) to resolve latitude/longitude and the IANA
   timezone; `moment-timezone` then computes the exact UTC offset in
   effect at that place on the given birth date (handles historical DST
   correctly).
2. On submit, the app calls all 5 `astro-fast-api` endpoints in parallel:
   `rasi`, `navamsa`, `analysis`, `mahapurusha-yogas`, `dasha`.
3. **Hamburger drawer menu** with 3 scrollable sections:
   - **Chart** — Rasi (D1) chart, then Navamsa (D9) chart below it, each
     drawn as a traditional fixed-sign South Indian style 4x4 grid.
   - **Chart Analysis** — Vakram, Vilimbu/Sandhi, Atchi, Ucham, Neecham,
     Parivarthanai, planets in the 1st/5th/9th sign from Rahu & Ketu, the
     7th house lord, and the 5 Pancha Mahapurusha Yogas.
   - **Dasha** — current Mahadasha/Bhukti banner, expandable list of
     upcoming Mahadashas (each showing its 9 Bhuktis), with a toggle to
     reveal past Mahadashas.
4. Bright yellow (`#FFC72C`) + vibrant red (`#DA291C`) theme throughout.

## Project structure

```
src/
  api/            axios-free fetch client + one function per endpoint
  types/          TypeScript mirrors of the FastAPI Pydantic schemas
  services/       geocoding (Open-Meteo) + timezone offset resolution
  context/        BirthDataContext — form submission + API orchestration
  theme/          colors, spacing, typography
  navigation/     root stack (BirthDetails -> Main) + drawer navigator
  components/     forms, charts, analysis, dasha, and shared UI atoms
  screens/        BirthDetailsScreen, ChartsScreen, ChartAnalysisScreen, DashaScreen
```

## Running against `astro-fast-api`

1. Start the API (from the `astro-fast-api` folder):
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   `--host 0.0.0.0` is important so the emulator/device can reach it.

2. Install JS dependencies here (already done if you received this repo
   with `node_modules/` populated):
   ```bash
   npm install
   ```

3. Run on Android (emulator or connected device):
   ```bash
   npx react-native run-android
   ```

4. **API server URL**: configured via a `.env` file at the project root
   (copy `.env.example` if `.env` is missing) and read at build time via
   `react-native-config`. It currently points at the deployed backend,
   `API_BASE_URL=https://astro-fast-api.onrender.com`, so the app works
   without your Mac or a local server running. `.env` also has a commented
   -out local-testing line (`http://10.0.2.2:8000` - the special alias
   the **Android emulator** uses to reach your Mac's `localhost`; a
   **physical device** would instead use your Mac's LAN IP, e.g.
   `http://192.168.1.23:8000`; the **iOS simulator** can use
   `http://localhost:8000` directly) - swap the two lines to switch back
   to local testing. There is no in-app override - edit `.env` and
   rebuild (`npx react-native run-android`) for a change to take effect.
   Note: Render's free tier spins down when idle, so the first request
   after a while can take 30-60 seconds to wake it back up. After the
   loading spinner has been up for a few seconds, the app swaps in a
   friendlier "server may be waking up from sleep" message so this
   doesn't look like a stuck app (see `LoadingOverlay.tsx`).

5. The app allows cleartext (plain HTTP) traffic
   (`android:usesCleartextTraffic="true"` in AndroidManifest.xml) since
   it talks to a local, non-HTTPS dev API. If you later point this app at
   a real HTTPS backend, you can remove that attribute.

## Notes / assumptions

- The South Indian chart layout is **fixed by sign**, not by house, so
  each planet's own `sign` places it in the same cell on every chart —
  the lagna (ascendant) cell is highlighted with an "ASC" marker instead
  of the whole chart rotating.
- Geocoding and timezone offset resolution both happen client-side,
  exactly as the API's `README.md` expects ("The client is expected to
  resolve latitude, longitude, and this offset... before calling the
  API").
- No backend/API code was changed — this app only consumes the 5
  existing endpoints as documented in `astro-fast-api/README.md`.

## Regenerating native scaffolding

If `android/` (or `ios/`) ever gets corrupted, or you bump the React
Native version, `scripts/regenerate-native-scaffold.sh` rebuilds them
from a clean official React Native CLI template and re-applies this
project's customizations (cleartext HTTP, app name, react-native-config
wiring), then merges `package.json`. It does not touch `src/`, `App.tsx`,
or `.env`.

```bash
bash scripts/regenerate-native-scaffold.sh
npm install
npx react-native run-android
```
