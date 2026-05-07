# Where's Kathleen?

A mobile-friendly Vite + React seek-and-find prototype. The first level shows one busy black-and-white scene with 20 hidden Kathleen images. Tapping a Kathleen turns her colorful, plays a small pop animation, and updates the progress counter.

## Add Your Assets

1. Put the scene background image into:
   `public/assets/backgrounds/`

2. Put the Kathleen transparent PNG images into:
   `public/assets/kathleens/`

3. Open:
   `src/data/levelOneConfig.js`

4. Replace the placeholder background filename.

5. Replace each Kathleen `src` filename.

6. Adjust `x`, `y`, `width`, and `rotation` values until the Kathleens are hidden nicely in the scene.

7. Run:

   ```bash
   npm install
   npm run dev
   ```

## Editing Positions

In `src/data/levelOneConfig.js`, `x`, `y`, and `width` are percentages:

- `x` places Kathleen from left to right.
- `y` places Kathleen from top to bottom.
- `width` controls how large Kathleen appears.
- `rotation` tilts Kathleen in degrees.
- `zIndex` controls which Kathleens appear in front if they overlap.

Later, we can add more levels by creating additional config files and loading them from the app.
