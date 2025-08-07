export const cardContainerVariants = {
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};

export const sharedAnimationVariants = {
    visible: {
        opacity: 1,
        y: 0,
        marginBottom: "30px",
        marginTop: "30px",
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        }
    },
    center: {
        opacity: 1,
        y: "-25vh",
        marginBottom: "0px",
        marginTop: "0px",
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        }
    },
    hidden: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
}; 