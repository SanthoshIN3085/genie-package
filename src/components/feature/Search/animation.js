// animation.js
export const expandCollapse = {
    hidden: { maxHeight: 0, opacity: 0, overflow: 'hidden' },
    visible: {
        maxHeight: 227,
        opacity: 1,
        overflow: 'hidden',
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        maxHeight: 0,
        opacity: 0,
        overflow: 'hidden',
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};
