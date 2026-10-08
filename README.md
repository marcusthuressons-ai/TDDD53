# Årstidsrummet

Årstidsrummet is an interactive day-and-night simulation with seasonal skies, timed missions, and an analogue power gauge. It also includes a weather mode that plays back yesterday's weather for a selected location. The application interface is in Swedish; this README is in English.

## Getting started

### Easy installation on another computer

You need **Node.js and a web browser**. npm installs the application's dependencies; Python and pip are not required. The local database runs with the application, so you do not need to install a separate database server.

1. Get the project either by cloning the GitHub repository or by extracting `Arstidsrummet-kallkod.zip`. A GitHub clone has `package.json` and this README directly in its root. The release zip has the application inside `work/`. Keep the included hidden configuration files in either case.
2. Install **Node.js 24 LTS**, including npm, from the [official Node.js download page](https://nodejs.org/en/download). The project requires Node.js 22.13.0 or later. Use the installer for your operating system and keep the option that adds Node.js to PATH.
3. Open a new terminal after installation. On Windows, open the project folder in File Explorer, type `cmd` in the address bar, and press Enter. This opens Command Prompt in the project folder. On macOS or Linux, open a terminal and navigate to the extracted folder.
4. Check that Node.js and npm are available:

   ```sh
   node --version
   npm --version
   ```

5. Open the application folder containing `package.json`:

   - **GitHub clone:** use the cloned repository root. Do not run `cd work`; the application files are already in this folder.
   - **Release zip:** open the extracted folder, then run:

     ```sh
     cd work
     ```

6. For a **fresh installation**, run these commands one at a time. Wait for each command to finish successfully before continuing:

   ```sh
   npm run install:ci
   npm run build
   node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_heavy_korath.sql
   npm run dev
   ```

7. Open **http://127.0.0.1:5173/** in your browser, or use the address printed by the server. Keep the terminal open while using the app. Press **Ctrl+C** in that terminal to stop it.

Internet access is needed for installation and for retrieving yesterday's weather. Season mode can be used after installation without fetching weather data.

### Starting the app next time

Open a terminal in the folder containing `package.json` (the repository root for a GitHub clone, or `work/` for the release zip) and run:

```sh
npm run dev
```

You do not need to install dependencies, build, or initialize the database every time you use the app.

### Saved missions and the local database

The fresh-installation command creates the mission database using the Cloudflare D1 binding `DB`, declared in `.openai/hosting.json`. **Run that database initialization only once per fresh local database.** If an existing installation already has its database, skip the migration command.

Saved missions are stored in `.wrangler/state/` inside the application folder. Keep this directory to retain your missions. The source includes the author's 12 saved missions in `lib/default-missions.json`, including their saved power, season, sunlight, and wind settings where present. On first use, the app automatically imports these missions if no mission library exists. Existing libraries are never overwritten, and a library intentionally saved empty stays empty. New users can edit or delete the imported missions through **Mina uppdrag**. The included missions are a snapshot; later edits on the author's computer do not automatically update the shared defaults.

### Ports and the Windows launcher

The default address is **http://127.0.0.1:5173/**. During this project's development, the active preview uses **http://127.0.0.1:5174/**.

To select another port:

```sh
npm run dev -- --port 5174
```

If Vinext reports that a server is already running, stop that process before restarting the app.

The existing `outputs/Starta-Arstidsrummet.cmd` launcher uses the author's Codex-installed Node.js path. On another computer, use the portable npm commands above. A general-purpose double-click installer and launcher have not yet been added to the distribution.

### Common installation issues

- **`node` or `npm` is not recognized:** reopen the terminal after installing Node.js. If necessary, rerun the installer with the PATH option enabled.
- **PowerShell blocks `npm.ps1`:** use Command Prompt on Windows, or use `npm.cmd` instead of `npm` in the commands above.
- **`package.json` cannot be found:** check that the terminal is in the folder containing `package.json`.
- **The migration reports that the table already exists:** the database has already been initialized. Skip the migration and start the app.
- **Installation fails:** check your internet connection and Node.js version. Fix the reported error before continuing to the next command.

## Using the application

### Home screen

Choose **Årstidsläge** (season mode) or **Väderspelläge** (weather mode). The home screen contains the simulation controls, mission editor, and settings. A simulated day lasts 90, 180, or 360 seconds; the default is 180 seconds.

Use the expand icon to enter the immersive fullscreen view. The clock appears at the top centre, with the information card above the semicircular power gauge at the bottom. **Visa kontroller** returns to the home screen. Escape also exits fullscreen, or closes the end-of-day result card when it is open.

### Season mode and missions

Season mode provides spring, summer, autumn, and winter skies. In **Mina uppdrag**, create, edit, or delete missions and select optional season, sunlight, wind, consumption, and production settings. Click **Spara uppdrag** to save changes.

Mission titles determine the fullscreen schedule:

| Mission title | Simulated time |
| --- | --- |
| `Nattuppdrag` | 00:00–06:00 |
| `Morgonuppdrag` | 06:00–12:00 |
| `Eftermiddagsuppdrag` | 12:00–18:00 |
| `Kvällsuppdrag` | 18:00–00:00 |

Matching ignores capitalization and surrounding whitespace. Use these titles for cards that should appear in the scheduled fullscreen simulation. One matching card is selected randomly per interval. If a category has no saved cards, the application displays a message for that interval.

Start the day from the night mission. The remaining cards change automatically at 06:00, 12:00, and 18:00 without additional start clicks.

Near the end of their intervals, night, morning, and evening missions glow green and display **Grattis du klarade det!**. The afternoon mission glows red with a sad face and **Det här gick inte så bra**. These are scripted outcomes, not an assessment of user performance.

At the end of the day, the simulation pauses and shows **Grattis du klarade 3/4 uppdrag**, with confetti and an animated trophy. Close the result with its cross, or select **Kör igen** to immediately start another day with fresh random selections. When alternatives exist, the next day's selection avoids the previous card from the same category.

### Mission power gauge

Each mission can specify **Förbrukning (W)** (consumption) and **Produktion (W)** (production). Existing missions without these values behave as if both were zero.

- Consumption exceeding production moves the needle towards **För låg** on the left.
- Production exceeding consumption moves it towards **För hög** on the right.
- Equal consumption and production keep it in the centre.

The gauge has red–yellow–green–yellow–red zones. A net difference of 1,000 W reaches an outer limit. The needle moves smoothly away from the centre, then returns to the centre shortly before the next scheduled card.

### Weather mode

Choose a location in settings and retrieve yesterday's weather. Linköping is the initial location. The weather date is calculated in the selected location's timezone.

In fullscreen, a compact weather card replaces mission cards. It shows the location, date, wind speed, potential accumulated solar energy, and current combined solar and wind production. Start, pause, or replay the weather day from this card. Mission completion animations and the mission result card do not appear in weather mode.

Weather data comes from Open-Meteo and updates with the simulated hour. It represents modelled weather rather than exact on-site measurements.

## Weather energy model

The electricity calculations use an illustrative installation:

- **Solar:** 10 m² of panels with 20% efficiency. At 1,000 W/m² of incoming radiation, the model produces 2,000 W.
- **Wind:** a turbine rated at 2 kW. Production starts above 3 m/s and increases along a simplified cubic curve, reaching its maximum at 12 m/s. Output is capped at 2 kW above that speed.

Solar output uses the retrieved radiation values. When radiation is unavailable, daylight and cloud cover provide a simplified estimate. Solar production is zero at night; wind production can continue.

Potential stored solar energy is accumulated up to the clock's simulated time, including partial hours, and shown in kWh. The calculation assumes no storage losses or battery capacity limit. It resets when the day is restarted and retains the full-day total when the day finishes.

In weather mode, the power gauge follows combined solar and wind production. With no production it remains in the centre; higher production moves it to the right. It retains the 1,000 W full-scale reference, making changes in production more visible. This simplified simulation is not intended for sizing real electrical equipment.

## Development

The application uses React, TypeScript, Vinext/Vite, and Cloudflare Workers with D1 persistence.

| File or directory | Purpose |
| --- | --- |
| `app/page.tsx` | Application state, simulation timing, and main views |
| `app/globals.css` | Layout, styling, and animations |
| `components/power-gauge.tsx` | Semicircular gauge |
| `components/fullscreen-weather.tsx` | Compact weather card |
| `components/day-celebration.tsx` | End-of-day result dialog |
| `lib/default-missions.json` | Bundled starter missions |
| `lib/mission-library.ts` | Safe first-use initialization of the mission library |
| `lib/mission-schedule.ts` | Time intervals and random mission selection |
| `lib/mission-power.ts` | Mission power balance and needle movement |
| `lib/mission-celebration.ts` | Success/failure message timing |
| `lib/weather-energy.ts` | Solar, wind, and accumulated energy calculations |
| `lib/sky.ts` | Sky colours, daylight, and simulation helpers |
| `app/api/missions/route.ts` | Load, validate, and save missions |
| `app/api/weather/route.ts` | Location search and yesterday's weather |
| `drizzle/` | Database migration files |

Useful commands:

```sh
npm run build
npm run start
npm run lint
npx tsc --noEmit
```

`npm run start` previews the built Worker locally; it requires a completed build and does not publish the application. Use the URL printed by that server.

The scripts support portable execution on Windows, macOS, and Linux. A configured managed Linux environment uses the project's separate build wrapper. Publishing through Sites is a separate workflow from local development.

## Troubleshooting

- **Weather cannot be loaded:** check the internet connection, retry, or use season mode.
- **Missions cannot be loaded or saved:** check that the D1 binding exists and the local database has been initialized.
- **No mission for a time interval:** check the card's title against the schedule table and save the library.
- **Mission gauge stays centred:** set unequal consumption and production values and save. The gauge intentionally returns to the centre before a card change.
- **Weather gauge stays centred:** the current hour may have no sunlight and insufficient wind to generate power in the model.
- **Port or server conflict:** stop the previous development process and restart, using the printed server address.



