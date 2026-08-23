import { softSpring, cardSpring, buttonSpring, modalSpring, drawerSpring } from './tokens.js';

export const springPreset = {
  soft: softSpring,
  card: cardSpring,
  button: buttonSpring,
  modal: modalSpring,
  drawer: drawerSpring,
  gentle: {
    type: "spring",
    stiffness: 200,
    damping: 22
  },
  snappy: {
    type: "spring",
    stiffness: 450,
    damping: 30
  }
};
