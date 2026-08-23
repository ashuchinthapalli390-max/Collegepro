import { motionDuration, motionEase, softSpring, cardSpring, modalSpring, drawerSpring, motionStagger } from './tokens.js';

// -------------------------------------------------------------
// 1. Page & Route Transitions
// -------------------------------------------------------------
export const pageVariants = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionDuration.normal,
      ease: motionEase.standard,
      when: "beforeChildren",
      staggerChildren: motionStagger.normal
    }
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: motionDuration.fast,
      ease: motionEase.exit
    }
  }
};

export const routeVariants = {
  initial: {
    opacity: 0,
    y: 8
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.24,
      ease: motionEase.standard
    }
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: 0.16,
      ease: motionEase.exit
    }
  }
};

// -------------------------------------------------------------
// 2. Module Header & Breadcrumb Transitions
// -------------------------------------------------------------
export const breadcrumbContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02
    }
  }
};

export const breadcrumbItemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.18, ease: motionEase.standard }
  }
};

export const titleVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: motionEase.standard }
  }
};

export const subtitleVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: motionEase.standard, delay: 0.04 }
  }
};

export const actionClusterVariants = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.24,
      ease: motionEase.standard,
      staggerChildren: 0.04
    }
  }
};

export const actionButtonVariants = {
  hidden: { opacity: 0, x: 8, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.2, ease: motionEase.standard }
  },
  hover: {
    scale: 1.025,
    y: -1,
    transition: { duration: 0.15, ease: motionEase.softOut }
  },
  tap: {
    scale: 0.97,
    transition: { duration: 0.1 }
  }
};

// -------------------------------------------------------------
// 3. KPI Grid & Card Transitions
// -------------------------------------------------------------
export const kpiGridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.04
    }
  }
};

export const kpiCardVariants = {
  hidden: {
    opacity: 0,
    y: 14,
    scale: 0.975
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: cardSpring
  },
  hover: {
    y: -4,
    scale: 1.012,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.2, ease: motionEase.standard }
  }
};

export const kpiIconVariants = {
  hidden: { scale: 0.88, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.28, ease: motionEase.standard }
  }
};

// -------------------------------------------------------------
// 4. Tables, Lists & Rows Transitions
// -------------------------------------------------------------
export const tableContainerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.26,
      ease: motionEase.standard,
      when: "beforeChildren",
      staggerChildren: 0.03
    }
  }
};

export const tableRowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: motionEase.standard }
  },
  hover: {
    backgroundColor: "rgba(248, 250, 252, 0.9)",
    transition: { duration: 0.12 }
  }
};

// -------------------------------------------------------------
// 5. Modals, Drawers & Collapsible Sections
// -------------------------------------------------------------
export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: motionEase.standard }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.16, ease: motionEase.exit }
  }
};

export const modalContentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 10
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: modalSpring
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 6,
    transition: { duration: 0.16, ease: motionEase.exit }
  }
};

export const drawerContentVariants = {
  hidden: { x: "100%", opacity: 0.5 },
  visible: {
    x: 0,
    opacity: 1,
    transition: drawerSpring
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.2, ease: motionEase.exit }
  }
};

export const collapseVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    overflow: "hidden"
  },
  visible: {
    height: "auto",
    opacity: 1,
    overflow: "visible",
    transition: {
      height: { duration: 0.26, ease: motionEase.standard },
      opacity: { duration: 0.22, delay: 0.04 }
    }
  },
  exit: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
    transition: {
      height: { duration: 0.2, ease: motionEase.exit },
      opacity: { duration: 0.15 }
    }
  }
};

// -------------------------------------------------------------
// 6. Universal Micro-Interactions & Badges
// -------------------------------------------------------------
export const badgeStatusVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.18, ease: motionEase.standard } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.12 } }
};

export const tabIndicatorVariants = {
  layout: {
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 30
    }
  }
};

// -------------------------------------------------------------
// 7. Universal Primitives (fadeUp, fadeIn, slide, stagger)
// -------------------------------------------------------------
export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.26, ease: motionEase.standard } },
  visible: { opacity: 1, transition: { duration: 0.26, ease: motionEase.standard } }
};

export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: motionEase.standard } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: motionEase.standard } }
};

export const slideRight = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.26, ease: motionEase.standard } },
  visible: { opacity: 1, x: 0, transition: { duration: 0.26, ease: motionEase.standard } }
};

export const slideLeft = {
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.26, ease: motionEase.standard } },
  visible: { opacity: 1, x: 0, transition: { duration: 0.26, ease: motionEase.standard } }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.24, ease: motionEase.standard } },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.24, ease: motionEase.standard } }
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.03
    }
  },
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.03
    }
  }
};

export const staggerChild = {
  hidden: { opacity: 0, y: 12, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.26, ease: motionEase.standard } },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.26, ease: motionEase.standard } }
};

export const staggerFast = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.02
    }
  }
};

