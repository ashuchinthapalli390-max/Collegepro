// =============================================================
// NEC Global Motion System: Timing, Easing & Spring Tokens
// =============================================================

export const motionDuration = {
  instant: 0.12,
  fast: 0.18,
  normal: 0.26,
  medium: 0.34,
  slow: 0.46,
};

export const motionEase = {
  standard: [0.22, 1, 0.36, 1], // Smooth cubic-bezier for standard institutional entrance
  enter: [0.16, 1, 0.3, 1],     // Swift deceleration for modals and drawers
  exit: [0.4, 0, 1, 1],         // Immediate acceleration for removals
  softOut: [0, 0, 0.2, 1],
  anticipate: [0.36, 0, 0.66, -0.56]
};

export const softSpring = {
  type: "spring",
  stiffness: 320,
  damping: 28,
  mass: 0.8,
};

export const cardSpring = {
  type: "spring",
  stiffness: 260,
  damping: 24,
  mass: 0.9,
};

export const buttonSpring = {
  type: "spring",
  stiffness: 400,
  damping: 25,
};

export const modalSpring = {
  type: "spring",
  stiffness: 340,
  damping: 30,
};

export const drawerSpring = {
  type: "spring",
  stiffness: 300,
  damping: 32,
};

export const motionStagger = {
  instant: 0.025,
  fast: 0.035,
  normal: 0.055,
  slow: 0.08,
};
