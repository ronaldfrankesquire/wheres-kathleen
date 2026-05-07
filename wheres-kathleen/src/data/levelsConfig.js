import { levelOne } from "./levelOneConfig.js";
import { levelTwo } from "./levelTwoConfig.js";

const kathleenAssets = [
  ["Standing Kathleen", "/assets/kathleens/1. Standing.png"],
  ["Waving Kathleen", "/assets/kathleens/2. Waving.png"],
  ["Peeking Kathleen", "/assets/kathleens/3. Peeking.png"],
  ["Crouching Kathleen", "/assets/kathleens/4. Crouching.png"],
  ["Sitting Kathleen", "/assets/kathleens/5. Sitting.png"],
  ["Kathleen with Teddy", "/assets/kathleens/6. with Teddy.png"],
  ["Reading Kathleen", "/assets/kathleens/7. Reading.png"],
  ["Party Hat Kathleen", "/assets/kathleens/8. Party Hat.png"],
  ["Side Sit Kathleen", "/assets/kathleens/9. Side Sit.png"],
  ["Side Stand Kathleen", "/assets/kathleens/10. Side Stand.png"],
  ["Back Stand Kathleen", "/assets/kathleens/11. Back Stand.png"],
  ["Cheering Kathleen", "/assets/kathleens/12. Cheering.png"],
  ["Thinking Sit Kathleen", "/assets/kathleens/13. Thinking Sit.png"],
  ["Thinking Stand Kathleen", "/assets/kathleens/14. Thinking Stand.png"],
  ["Jumping Kathleen", "/assets/kathleens/15. Jumping.png"],
  ["Mini Heart Kathleen", "/assets/kathleens/16. Mini Heart.png"],
  ["Thumbs Up Kathleen", "/assets/kathleens/17. Thumbs Up.png"],
  ["Surprised Kathleen", "/assets/kathleens/18. Surprised.png"],
  ["Lying Down Kathleen", "/assets/kathleens/19. Lying Down.png"],
  ["Heart Kathleen", "/assets/kathleens/20. Heart.png"]
];

const hiddenKathleenTreatment = {
  hiddenFilter: "grayscale(1) contrast(0.7) brightness(1.08)",
  hiddenOpacity: 0.52
};

function createLevel(levelNumber, placements, options = {}) {
  const { kathleenDefaults, ...levelOptions } = options;

  return {
    id: `scene-level-${levelNumber}`,
    title: `Scene Level ${levelNumber}`,
    background: `/assets/backgrounds/Where's Kathleen - Scene Level ${levelNumber}.png`,
    ...levelOptions,
    kathleens: placements.map((placement, index) => {
      const [label, src] = kathleenAssets[index];

      return {
        ...hiddenKathleenTreatment,
        ...kathleenDefaults,
        id: `level-${levelNumber}-kathleen-${String(index + 1).padStart(2, "0")}`,
        label,
        src,
        x: placement[0],
        y: placement[1],
        width: placement[2],
        rotation: placement[3],
        zIndex: placement[4] ?? 4
      };
    })
  };
}

const levelThree = createLevel(3, [
  [8.2, 45.4, 4.9, -5, 5],
  [22.4, 36.9, 4.6, 6, 5],
  [31.8, 49.2, 4.5, -7, 5],
  [42.8, 42.4, 4.7, 5, 5],
  [53.5, 52.8, 4.9, -3, 5],
  [63.2, 39.8, 4.8, 4, 5],
  [75.5, 50.2, 4.6, -5, 5],
  [84.5, 36.5, 4.5, 8, 5],
  [91.8, 62.8, 4.9, -7, 5],
  [14.3, 74.1, 5, 4, 5],
  [25.2, 78.7, 4.8, -6, 5],
  [38.4, 65.7, 4.5, 9, 5],
  [51.2, 74.6, 4.8, -4, 5],
  [62.8, 67.4, 4.7, 3, 5],
  [72.7, 77.6, 4.6, 10, 5],
  [82.6, 72.1, 4.8, -5, 5],
  [92.7, 83.4, 4.5, 6, 5],
  [17.6, 24.9, 4.4, -8, 5],
  [67.6, 28.9, 5.1, -5, 5],
  [5.6, 61.6, 4.5, 8, 5]
]);

const levelFour = createLevel(
  4,
  [
    [7.8, 42.1, 4.8, -5, 5],
    [19.9, 49.2, 4.5, 5, 5],
    [31.8, 59.5, 4.6, -6, 5],
    [43.7, 43.9, 4.8, 6, 5],
    [55.3, 55.9, 4.8, -4, 5],
    [66.4, 41.8, 4.6, 3, 5],
    [76.9, 52.4, 4.8, -5, 5],
    [88.4, 44.3, 4.5, 7, 5],
    [14.2, 74.4, 4.9, -7, 5],
    [25.2, 82.1, 4.6, 4, 5],
    [38.9, 75.9, 4.8, -5, 5],
    [51.3, 70.2, 4.4, 8, 5],
    [63.4, 79.2, 4.8, -4, 5],
    [75.6, 73.5, 4.7, 5, 5],
    [86.1, 83.2, 4.5, -8, 5],
    [93.4, 64.8, 4.6, 6, 5],
    [11.3, 28.8, 4.5, 7, 5],
    [37.1, 31.6, 4.5, -7, 5],
    [60.9, 30.9, 4.7, 5, 5],
    [82.3, 27.4, 4.5, -6, 5]
  ],
  {
    backgroundFilter: "grayscale(1) brightness(1.42) contrast(0.82)"
  }
);

const levelFive = createLevel(
  5,
  [
    [9.1, 72.5, 4.9, -6, 5],
    [19.4, 60.8, 4.6, 5, 5],
    [29.7, 45.2, 4.5, -6, 5],
    [39.9, 58.2, 4.7, 4, 5],
    [50.8, 72.6, 4.8, -5, 5],
    [61.5, 51.9, 4.8, 5, 5],
    [71.9, 68.7, 4.6, -4, 5],
    [82.8, 56.1, 4.5, 7, 5],
    [91.5, 72.8, 4.9, -6, 5],
    [13.6, 31.8, 4.5, 5, 5],
    [24.3, 24.6, 4.6, -7, 5],
    [35.8, 30.7, 4.4, 8, 5],
    [47.4, 39.6, 4.7, -5, 5],
    [58.9, 34.4, 4.6, 4, 5],
    [69.2, 25.6, 4.5, -8, 5],
    [79.7, 36.2, 4.6, 6, 5],
    [89.8, 25.4, 4.4, -5, 5],
    [24.8, 83.8, 4.5, 8, 5],
    [52.4, 86.2, 4.9, -6, 5],
    [77.8, 84.4, 4.5, 5, 5]
  ],
  {
    backgroundFilter: "grayscale(1) brightness(1.34) contrast(0.86)"
  }
);

const levelSix = createLevel(6, [
  [7.4, 39.5, 4.8, -5, 5],
  [17.6, 50.3, 4.6, 6, 5],
  [28.6, 36.8, 4.5, -7, 5],
  [39.1, 54.8, 4.7, 4, 5],
  [50.6, 42.7, 4.8, -4, 5],
  [61.7, 55.3, 4.7, 5, 5],
  [72.4, 40.9, 4.6, -6, 5],
  [84.2, 54.8, 4.7, 7, 5],
  [92.1, 68.6, 4.8, -5, 5],
  [13.3, 74.9, 4.9, 4, 5],
  [25.8, 82.1, 4.6, -7, 5],
  [37.4, 69.2, 4.5, 8, 5],
  [49.1, 79.6, 4.7, -4, 5],
  [60.8, 70.4, 4.6, 5, 5],
  [72.7, 83.7, 4.7, -8, 5],
  [84.9, 79.8, 4.6, 5, 5],
  [95.1, 42.1, 4.4, -6, 5],
  [22.4, 22.9, 4.5, 7, 5],
  [55.9, 28.5, 4.5, -5, 5],
  [76.2, 24.8, 4.5, 6, 5]
]);

const levelSeven = createLevel(7, [
  [7.9, 48.7, 4.8, -5, 5],
  [17.2, 38.4, 4.5, 5, 5],
  [27.9, 55.6, 4.6, -7, 5],
  [37.8, 42.5, 4.6, 4, 5],
  [48.9, 56.2, 4.8, -5, 5],
  [59.6, 43.8, 4.7, 5, 5],
  [70.7, 52.9, 4.6, -4, 5],
  [81.1, 41.7, 4.5, 7, 5],
  [91.3, 56.4, 4.9, -6, 5],
  [12.4, 78.2, 4.9, 5, 5],
  [24.1, 70.5, 4.6, -7, 5],
  [35.7, 80.9, 4.5, 8, 5],
  [47.6, 71.8, 4.8, -4, 5],
  [58.4, 79.1, 4.6, 4, 5],
  [69.6, 68.9, 4.5, -8, 5],
  [80.2, 81.8, 4.8, 5, 5],
  [92.4, 76.5, 4.6, -5, 5],
  [23.6, 26.8, 4.5, 8, 5],
  [52.5, 31.8, 4.9, -6, 5],
  [75.6, 25.6, 4.5, 5, 5]
]);

const levelEight = createLevel(8, [
  [8.2, 41.6, 4.8, -5, 5],
  [18.7, 33.8, 4.5, 5, 5],
  [29.4, 47.2, 4.6, -7, 5],
  [39.5, 38.7, 4.7, 4, 5],
  [49.7, 52.1, 4.9, -5, 5],
  [60.3, 42.8, 4.6, 5, 5],
  [70.5, 55.9, 4.7, -4, 5],
  [80.9, 40.2, 4.5, 7, 5],
  [91.8, 53.7, 4.8, -6, 5],
  [12.7, 70.4, 4.8, 4, 5],
  [24.5, 81.8, 4.7, -7, 5],
  [36.8, 66.4, 4.5, 8, 5],
  [48.1, 78.8, 4.8, -4, 5],
  [59.7, 68.4, 4.6, 5, 5],
  [70.8, 81.6, 4.6, -8, 5],
  [82.5, 72.7, 4.9, 5, 5],
  [93.1, 81.7, 4.5, -5, 5],
  [28.6, 22.9, 4.4, 7, 5],
  [55.4, 25.8, 4.8, -6, 5],
  [74.9, 26.8, 4.5, 5, 5]
]);

const levelNine = createLevel(9, [
  [8.8, 54.9, 4.8, -5, 5],
  [18.9, 42.8, 4.5, 5, 5],
  [29.6, 58.4, 4.6, -7, 5],
  [40.7, 43.5, 4.7, 4, 5],
  [51.5, 58.9, 4.8, -5, 5],
  [62.7, 43.4, 4.7, 5, 5],
  [73.8, 55.2, 4.6, -4, 5],
  [84.4, 42.5, 4.5, 7, 5],
  [93.5, 58.4, 4.8, -6, 5],
  [12.4, 76.8, 4.9, 4, 5],
  [23.8, 81.9, 4.6, -7, 5],
  [36.1, 70.4, 4.5, 8, 5],
  [48.7, 81.5, 4.8, -4, 5],
  [60.6, 72.1, 4.6, 5, 5],
  [72.2, 82.6, 4.6, -8, 5],
  [84.1, 76.8, 4.8, 5, 5],
  [94.7, 80.5, 4.5, -5, 5],
  [20.7, 25.6, 4.5, 7, 5],
  [54.6, 25.2, 4.7, -6, 5],
  [77.2, 28.4, 4.5, 5, 5]
]);

const levelTen = createLevel(
  10,
  [
    [7.8, 43.8, 4.8, -5, 5],
    [17.5, 54.2, 4.5, 5, 5],
    [28.8, 39.9, 4.6, -7, 5],
    [39.8, 53.8, 4.7, 4, 5],
    [50.4, 42.7, 4.8, -5, 5],
    [60.6, 57.5, 4.7, 5, 5],
    [70.8, 46.2, 4.6, -4, 5],
    [81.7, 59.5, 4.5, 7, 5],
    [92.4, 46.8, 4.7, -6, 5],
    [12.6, 76.8, 4.9, 4, 5],
    [24.5, 70.2, 4.6, -7, 5],
    [36.2, 80.8, 4.5, 8, 5],
    [48.5, 71.5, 4.8, -4, 5],
    [59.8, 81.9, 4.6, 5, 5],
    [71.6, 72.1, 4.6, -8, 5],
    [82.7, 81.7, 4.8, 5, 5],
    [94.2, 73.5, 4.5, -5, 5],
    [22.6, 26.8, 4.5, 7, 5],
    [55.8, 31.7, 4.7, -6, 5],
    [76.2, 29.6, 4.5, 5, 5]
  ],
  {
    backgroundFilter: "grayscale(1) brightness(1.44) contrast(0.8)"
  }
);

const levelEleven = createLevel(11, [
  [7.3, 51.8, 4.8, -5, 5],
  [17.9, 43.8, 4.5, 5, 5],
  [28.6, 57.2, 4.6, -7, 5],
  [39.7, 45.1, 4.7, 4, 5],
  [50.8, 58.3, 4.8, -5, 5],
  [61.5, 43.2, 4.7, 5, 5],
  [72.8, 54.4, 4.6, -4, 5],
  [83.2, 43.7, 4.5, 7, 5],
  [93.5, 56.7, 4.8, -6, 5],
  [12.7, 78.5, 4.9, 4, 5],
  [24.1, 70.4, 4.6, -7, 5],
  [36.4, 82.1, 4.5, 8, 5],
  [48.7, 73.5, 4.8, -4, 5],
  [60.2, 82.8, 4.6, 5, 5],
  [71.9, 71.6, 4.6, -8, 5],
  [83.7, 80.4, 4.8, 5, 5],
  [94.2, 78.9, 4.5, -5, 5],
  [22.4, 24.8, 4.5, 7, 5],
  [54.7, 27.2, 4.7, -6, 5],
  [76.5, 26.3, 4.5, 5, 5]
]);

function withHiddenKathleenTreatment(level) {
  return {
    ...level,
    kathleens: level.kathleens.map((kathleen) => ({
      ...kathleen,
      ...hiddenKathleenTreatment
    }))
  };
}

export const levels = [
  levelOne,
  levelTwo,
  levelThree,
  levelFour,
  levelFive,
  levelSix,
  levelSeven,
  levelEight,
  levelNine,
  levelTen,
  levelEleven
].map(withHiddenKathleenTreatment);
