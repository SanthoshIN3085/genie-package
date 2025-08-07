import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUI } from "../Reducers/genie/reducer";

// Theme color definitions
const themes = {
  light: {
    bg: "#ffffff",
    inner: "#ffffff",
    lighter: "#ffffff",
    bg1: "#ffffff",
    font1: "#111111",
    font2: "#333333",
    font3: "#666666",
    font4: "#666666",
    font5: "#666666",
    placeholder: "#cccccc",
    border1: "#e9e9e9",
    chat_bg: "rgba(255, 255, 255, 0.5)",
    chat_boder: "#c9c7fb",
    card_border: "#ced0d1",
  },
  dark: {
    bg: "#1c2030",
    inner: "#000000",
    lighter: "#323951",
    bg1: "#1f222b",
    font1: "#b3b3b3",
    font2: "#333333",
    font3: "#cccccc",
    font4: "#999999",
    font5: "#b3b3b3",
    placeholder: "#666666",
    border1: "#2f3136",
    chat_bg: "#14161e",
    chat_boder: "#252e62",
    card_border: "#2f3554",
  },
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state) => state.genie.ui);
  const [theme, setTheme] = useState(isDarkMode ? "dark" : "light");

  // Update theme when Redux state changes
  useEffect(() => {
    setTheme(isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Apply theme to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = themes[theme];

    // Set CSS custom properties
    Object.entries(currentTheme).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Set theme class on body for global styling
    document.body.className = document.body.className.replace(/theme-\w+/g, "");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    dispatch(updateUI({ isDarkMode: newTheme === "dark" }));
  };

  const value = {
    theme,
    isDarkMode: theme === "dark",
    colors: themes[theme],
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
