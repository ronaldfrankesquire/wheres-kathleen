// Level one setup for "Where's Kathleen?"
//
// Asset paths point to files inside the public folder.
// Example:
// public/assets/backgrounds/factory.png becomes "/assets/backgrounds/factory.png"
// public/assets/kathleens/waving.png becomes "/assets/kathleens/waving.png"
//
// This first playable scene uses "Where's Kathleen - Scene Level 1.png".
// You already have more background files in public/assets/backgrounds; later we
// can add more level config files that point at those images.
//
// Positioning notes:
// - x, y, and width are percentages.
// - x and y place Kathleen's center point relative to the background image.
// - width controls how large Kathleen appears.
// - rotation and zIndex are optional styling helpers.

export const levelOne = {
  id: "scene-level-1",
  title: "Scene Level 1",
  background: "/assets/backgrounds/Where's Kathleen - Scene Level 1.png",
  kathleens: [
    {
      id: "kathleen-01",
      label: "Standing Kathleen",
      src: "/assets/kathleens/1. Standing.png",
      x: 12,
      y: 68,
      width: 7,
      rotation: -4,
      zIndex: 2
    },
    {
      id: "kathleen-02",
      label: "Waving Kathleen",
      src: "/assets/kathleens/2. Waving.png",
      x: 28,
      y: 52,
      width: 6,
      rotation: 3,
      zIndex: 2
    },
    {
      id: "kathleen-03",
      label: "Peeking Kathleen",
      src: "/assets/kathleens/3. Peeking.png",
      x: 44,
      y: 74,
      width: 5.5,
      rotation: -8,
      zIndex: 3
    },
    {
      id: "kathleen-04",
      label: "Crouching Kathleen",
      src: "/assets/kathleens/4. Crouching.png",
      x: 63,
      y: 39,
      width: 4.8,
      rotation: 7,
      zIndex: 2
    },
    {
      id: "kathleen-05",
      label: "Sitting Kathleen",
      src: "/assets/kathleens/5. Sitting.png",
      x: 82,
      y: 58,
      width: 6.5,
      rotation: -2,
      zIndex: 3
    },
    {
      id: "kathleen-06",
      label: "Kathleen with Teddy",
      src: "/assets/kathleens/6. with Teddy.png",
      x: 18,
      y: 31,
      width: 5.2,
      rotation: 5,
      zIndex: 2
    },
    {
      id: "kathleen-07",
      label: "Reading Kathleen",
      src: "/assets/kathleens/7. Reading.png",
      x: 37,
      y: 24,
      width: 5.8,
      rotation: -6,
      zIndex: 2
    },
    {
      id: "kathleen-08",
      label: "Party Hat Kathleen",
      src: "/assets/kathleens/8. Party Hat.png",
      x: 57,
      y: 18,
      width: 4.6,
      rotation: 11,
      zIndex: 2
    },
    {
      id: "kathleen-09",
      label: "Side Sit Kathleen",
      src: "/assets/kathleens/9. Side Sit.png",
      x: 74,
      y: 27,
      width: 5.6,
      rotation: -10,
      zIndex: 2
    },
    {
      id: "kathleen-10",
      label: "Side Stand Kathleen",
      src: "/assets/kathleens/10. Side Stand.png",
      x: 91,
      y: 42,
      width: 5,
      rotation: 4,
      zIndex: 4
    },
    {
      id: "kathleen-11",
      label: "Back Stand Kathleen",
      src: "/assets/kathleens/11. Back Stand.png",
      x: 9,
      y: 86,
      width: 5.4,
      rotation: 9,
      zIndex: 3
    },
    {
      id: "kathleen-12",
      label: "Cheering Kathleen",
      src: "/assets/kathleens/12. Cheering.png",
      x: 24,
      y: 83,
      width: 4.8,
      rotation: -12,
      zIndex: 4
    },
    {
      id: "kathleen-13",
      label: "Thinking Sit Kathleen",
      src: "/assets/kathleens/13. Thinking Sit.png",
      x: 41,
      y: 91,
      width: 5.3,
      rotation: 6,
      zIndex: 4
    },
    {
      id: "kathleen-14",
      label: "Thinking Stand Kathleen",
      src: "/assets/kathleens/14. Thinking Stand.png",
      x: 56,
      y: 82,
      width: 6.1,
      rotation: -3,
      zIndex: 3
    },
    {
      id: "kathleen-15",
      label: "Jumping Kathleen",
      src: "/assets/kathleens/15. Jumping.png",
      x: 72,
      y: 87,
      width: 5,
      rotation: 13,
      zIndex: 4
    },
    {
      id: "kathleen-16",
      label: "Mini Heart Kathleen",
      src: "/assets/kathleens/16. Mini Heart.png",
      x: 88,
      y: 78,
      width: 6.2,
      rotation: -5,
      zIndex: 4
    },
    {
      id: "kathleen-17",
      label: "Thumbs Up Kathleen",
      src: "/assets/kathleens/17. Thumbs Up.png",
      x: 7,
      y: 47,
      width: 4.7,
      rotation: 2,
      zIndex: 2
    },
    {
      id: "kathleen-18",
      label: "Surprised Kathleen",
      src: "/assets/kathleens/18. Surprised.png",
      x: 33,
      y: 66,
      width: 4.9,
      rotation: 10,
      zIndex: 3
    },
    {
      id: "kathleen-19",
      label: "Lying Down Kathleen",
      src: "/assets/kathleens/19. Lying Down.png",
      x: 66,
      y: 64,
      width: 5.7,
      rotation: -7,
      zIndex: 3
    },
    {
      id: "kathleen-20",
      label: "Heart Kathleen",
      src: "/assets/kathleens/20. Heart.png",
      x: 94,
      y: 91,
      width: 4.9,
      rotation: 8,
      zIndex: 5
    }
  ]
};
