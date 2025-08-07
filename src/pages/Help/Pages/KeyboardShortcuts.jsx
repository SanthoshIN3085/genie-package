// File: src/components/Help/pages/KeyboardShortcuts.jsx
import React from "react";
import { motion } from "framer-motion";
import { KEYBOARD_SHORTCUTS_DATA } from "../constant";
import { HELP } from "../../../constant/textConstants";

const KeyboardShortcuts = ({}) => {
  return (
    <div className="Genie__help__shortcuts">
      <div className="Genie__help__shortcuts__header">
        <div className="Genie__help__faq-title">{HELP.KEYBOARD_SHORTCUTS.TITLE}</div>
        <div className="Genie__help__faq-subtitle">
          {HELP.KEYBOARD_SHORTCUTS.SUBTITLE}
        </div>
      </div>

      <div className="Genie__help__shortcuts-grid">
        {KEYBOARD_SHORTCUTS_DATA.map((shortcut, index) => (
          <motion.div
            key={index}
            className="Genie__help__shortcuts-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div md={5} className="Genie__help__shortcuts-item-action">
              {shortcut.action}
            </div>
            <div className="Genie__help__shortcuts-item-keys">
              {shortcut.keys.map((key, keyIndex) => (
                <span
                  key={keyIndex}
                  className="Genie__help__shortcuts-item-key"
                >
                  {key}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* <div className="Genie__help__shortcuts-footer">
                <motion.button className="Genie__help__shortcuts-footer-button" onClick={handleSave}>
                    <RSSecondaryButton>Reset</RSSecondaryButton>
                    <RSPrimaryButton>Save</RSPrimaryButton>
                </motion.button>
            </div> */}
    </div>
  );
};

export default KeyboardShortcuts;
