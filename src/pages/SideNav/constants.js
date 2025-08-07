export const TOGGLE_ANIMATION = {
    initial: {
        rotate: 0,
        transition: {
            duration: 0.3,
            ease: "easeInOut"
        }
    },
    animate: {
        rotate: 180,
        transition: {
            duration: 0.3,
            ease: "easeInOut"
        }
    }
};

export const LIST_ANIMATION = {
    initial: {
        height: 0,
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: "easeInOut"
        }
    },
    animate: {
        height: "auto",
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: "easeInOut"
        }
    },
    exit: {
        height: 0,
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: "easeInOut"
        }
    }
};

export const SLIDE_ANIMATION = {
    initial: {
        x: -400,
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: "easeInOut"
        }
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: "easeInOut"
        }
    },
    exit: {
        x: -400,
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: "easeInOut"
        }
    }
}; 