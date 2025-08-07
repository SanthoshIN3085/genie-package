import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RELEASE_NOTES,
    BETA_RELEASE_DATA,
    containerVariants,
    itemVariants,
    slideVariants,
    staggerVariants,
    fixItemVariants,
} from '../constant';
import { HELP } from '../../../constant/textConstants';

const ReleaseNotesSection = ({ title, data, selectedId, selectedSource, sourceKey, onSelect }) => (
    <div className="Genie__help__release-notes-card">
        <div className="Genie__help__release-notes-card__header">
            <h2 className="Genie__help__release-notes-card__title">{title}</h2>
        </div>
        <div className="Genie__help__release-notes-card__content">
            {data.map((release) => {
                const isActive = selectedId === release.id && selectedSource === sourceKey;
                return (
                    <div
                        key={release.id}
                        className={`Genie__help__release-item ${isActive ? 'Genie__help__release-item--active' : ''}`}
                        onClick={() => onSelect(release, sourceKey)}
                    >
                        <div className="Genie__help__release-item__title">{HELP.RELEASE_NOTES.RELEASE_PREFIX} {release.version}</div>
                    </div>
                );
            })}
        </div>
    </div>
);

const ReleaseNotes = () => {
    const [selectedRelease, setSelectedRelease] = useState(RELEASE_NOTES[0]);
    const [selectedSource, setSelectedSource] = useState('release');

    const handleSelect = (release, sourceKey) => {
        setSelectedRelease(release);
        setSelectedSource(sourceKey);
    };

    return (
        <motion.div
            className="Genie__help__release-notes"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="Genie__help__release-notes-header">
                <div className="Genie__help__faq-title">{HELP.RELEASE_NOTES.TITLE}</div>
                <div className="Genie__help__faq-subtitle">{HELP.RELEASE_NOTES.SUBTITLE}</div>
            </div>

            <div className="Genie__help__release-notes__container">
                <motion.div className="Genie__help__release-notes__sidebar" variants={itemVariants}>
                    <ReleaseNotesSection
                        title="Release notes"
                        data={RELEASE_NOTES}
                        selectedId={selectedRelease.id}
                        selectedSource={selectedSource}
                        sourceKey="release"
                        onSelect={handleSelect}
                    />
                </motion.div>

                <motion.div className="Genie__help__release-notes__main" variants={slideVariants}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${selectedSource}-${selectedRelease.id}`}
                            className="Genie__help__release-content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="Genie__help__release-content__header">
                                                <motion.div
                    className="Genie__help__release-content__version"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {HELP.RELEASE_NOTES.RELEASE_PREFIX} {selectedRelease.version}
                </motion.div>

                                <motion.p
                                    className="Genie__help__release-content__date"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {selectedRelease.releaseDate}
                                </motion.p>
                            </div>

                            <div className="Genie__help__release-content__body">
                                {/* What's New Section */}
                                {selectedRelease.whatsNew && selectedRelease.whatsNew.length > 0 && (
                                    <motion.div
                                        className="Genie__help__release-content__section"
                                        variants={staggerVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <motion.h3
                                            className="Genie__help__release-content__section-title"
                                            variants={fixItemVariants}
                                        >
                                            {HELP.RELEASE_NOTES.SECTIONS.WHATS_NEW}
                                        </motion.h3>
                                        <div className="Genie__help__release-content__fixes">
                                            {selectedRelease.whatsNew.map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="Genie__help__fix-item"
                                                    variants={fixItemVariants}
                                                >
                                                    <div className="Genie__help__fix-item__bullet">
                                                        <motion.div
                                                            className="Genie__help__fix-item__dot Genie__help__fix-item__dot--new"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ delay: index * 0.1 + 0.4, type: 'spring' }}
                                                        />
                                                    </div>
                                                    <div className="Genie__help__fix-item__content">
                                                        <motion.div
                                                            className="Genie__help__fix-item__description"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: index * 0.1 + 0.5 }}
                                                            dangerouslySetInnerHTML={{ __html: item }}
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Bug Fixes Section */}
                                {selectedRelease.bugFixes && selectedRelease.bugFixes.length > 0 && (
                                    <motion.div
                                        className="Genie__help__release-content__section"
                                        variants={staggerVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <motion.h3
                                            className="Genie__help__release-content__section-title"
                                            variants={fixItemVariants}
                                        >
                                            {HELP.RELEASE_NOTES.SECTIONS.BUG_FIXES}
                                        </motion.h3>
                                        <div className="Genie__help__release-content__fixes">
                                            {selectedRelease.bugFixes.map((fix, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="Genie__help__fix-item"
                                                    variants={fixItemVariants}
                                                >
                                                    <div className="Genie__help__fix-item__bullet">
                                                        <motion.div
                                                            className="Genie__help__fix-item__dot Genie__help__fix-item__dot--fix"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ delay: index * 0.1 + 0.4, type: 'spring' }}
                                                        />
                                                    </div>
                                                    <div className="Genie__help__fix-item__content">
                                                        <motion.p
                                                            className="Genie__help__fix-item__description"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: index * 0.1 + 0.5 }}
                                                        >
                                                            {fix}
                                                        </motion.p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Upcoming Release Section */}
                                {selectedRelease.upcomingRelease && selectedRelease.upcomingRelease.length > 0 && (
                                    <motion.div
                                        className="Genie__help__release-content__section"
                                        variants={staggerVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <motion.h3
                                            className="Genie__help__release-content__section-title"
                                            variants={fixItemVariants}
                                        >
                                            {HELP.RELEASE_NOTES.SECTIONS.COMING_SOON}
                                        </motion.h3>
                                        <div className="Genie__help__release-content__fixes">
                                            {selectedRelease.upcomingRelease.map((upcoming, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="Genie__help__fix-item"
                                                    variants={fixItemVariants}
                                                >
                                                    <div className="Genie__help__fix-item__bullet">
                                                        <motion.div
                                                            className="Genie__help__fix-item__dot Genie__help__fix-item__dot--upcoming"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ delay: index * 0.1 + 0.4, type: 'spring' }}
                                                        />
                                                    </div>
                                                    <div className="Genie__help__fix-item__content">
                                                        <motion.p
                                                            className="Genie__help__fix-item__description"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: index * 0.1 + 0.5 }}
                                                        >
                                                            {upcoming}
                                                        </motion.p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ReleaseNotes;
