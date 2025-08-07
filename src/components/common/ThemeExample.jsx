import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeExample = () => {
  const { theme, isDarkMode, colors, toggleTheme } = useTheme();

  return (
    <div className="theme-example" style={{ padding: '20px' }}>
      <h2>Theme Context Example</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Current Theme: <strong>{theme}</strong></p>
        <p>Is Dark Mode: <strong>{isDarkMode ? 'Yes' : 'No'}</strong></p>
        <button onClick={toggleTheme}>
          Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {/* Using CSS custom properties */}
        <div className="theme-bg" style={{ padding: '15px', borderRadius: '8px' }}>
          <h3 className="theme-font1">Background (CSS Custom Property)</h3>
          <p className="theme-font2">This uses --theme-bg</p>
          <p className="theme-font3">Secondary text</p>
          <p className="theme-font4">Tertiary text</p>
        </div>

        {/* Using inline styles with theme colors */}
        <div style={{ 
          backgroundColor: colors.bg, 
          padding: '15px', 
          borderRadius: '8px',
          border: `1px solid ${colors.font3}`
        }}>
          <h3 style={{ color: colors.font1 }}>Background (Inline Style)</h3>
          <p style={{ color: colors.font2 }}>This uses colors.bg</p>
          <p style={{ color: colors.font3 }}>Secondary text</p>
          <p style={{ color: colors.font4 }}>Tertiary text</p>
        </div>

        {/* Inner background */}
        <div style={{ 
          backgroundColor: colors.inner, 
          padding: '15px', 
          borderRadius: '8px',
          border: `1px solid ${colors.font3}`
        }}>
          <h3 style={{ color: colors.font1 }}>Inner Background</h3>
          <p style={{ color: colors.font2 }}>This uses colors.inner</p>
          <p style={{ color: colors.font3 }}>Secondary text</p>
          <p style={{ color: colors.font4 }}>Tertiary text</p>
        </div>

        {/* Lighter background */}
        <div style={{ 
          backgroundColor: colors.lighter, 
          padding: '15px', 
          borderRadius: '8px',
          border: `1px solid ${colors.font3}`
        }}>
          <h3 style={{ color: colors.font1 }}>Lighter Background</h3>
          <p style={{ color: colors.font2 }}>This uses colors.lighter</p>
          <p style={{ color: colors.font3 }}>Secondary text</p>
          <p style={{ color: colors.font4 }}>Tertiary text</p>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Available Theme Colors:</h3>
        <pre style={{ 
          backgroundColor: colors.lighter, 
          color: colors.font1, 
          padding: '15px', 
          borderRadius: '8px',
          overflow: 'auto'
        }}>
          {JSON.stringify(colors, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ThemeExample; 