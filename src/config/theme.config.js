// src/config/theme.config.js
export const theme = {
  colors: {
    primary: "rgb(40, 169, 224)",
    secondary: "rgb(24, 119, 182)",
    accent: "rgb(96, 203, 240)",
    success: "#22c55e",
    warning: "#facc15",
    danger: "#ef4444",
    background: "#f8fafc",
    surface: "#ffffff",
    text: "#1e293b",
    muted: "#64748b",
  },

  font: {
    family: "'Poppins', 'Inter', sans-serif",
    size: {
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      title: "1.75rem",
    },
  },

  radius: {
    sm: "8px",
    md: "12px",
    lg: "20px",
    full: "9999px",
  },

  shadow: {
    sm: "0 2px 6px rgba(0,0,0,0.08)",
    md: "0 4px 12px rgba(0,0,0,0.12)",
  },

  transition: "all 0.25s ease-in-out",
};

export default theme;
