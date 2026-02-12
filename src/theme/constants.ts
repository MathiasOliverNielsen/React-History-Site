// Theme constants for TypeScript components
export const theme = {
  fonts: {
    display: "Limelight, serif",
    body: "Linden Hill, serif",
  },
  colors: {
    cream: "#FFE89F",
    gold: "#D29F62",
    brown: "#695E48",
    sage: "#C7BD8D",
    dark: "#1F1F1F",
    black: "#151515",
    light: "#F5F5F5",
  },
  semantic: {
    bgPrimary: "var(--bg-primary)",
    bgSecondary: "var(--bg-secondary)",
    bgDark: "var(--bg-dark)",
    textPrimary: "var(--text-primary)",
    textSecondary: "var(--text-secondary)",
    textLight: "var(--text-light)",
    accentPrimary: "var(--accent-primary)",
    accentSecondary: "var(--accent-secondary)",
    borderColor: "var(--border-color)",
  },
  typography: {
    xs: "var(--text-xs)",
    sm: "var(--text-sm)",
    base: "var(--text-base)",
    lg: "var(--text-lg)",
    xl: "var(--text-xl)",
    "2xl": "var(--text-2xl)",
    "3xl": "var(--text-3xl)",
    "4xl": "var(--text-4xl)",
    "5xl": "var(--text-5xl)",
  },
  spacing: {
    xs: "var(--space-xs)",
    sm: "var(--space-sm)",
    md: "var(--space-md)",
    lg: "var(--space-lg)",
    xl: "var(--space-xl)",
    "2xl": "var(--space-2xl)",
  },
  radius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
  },
  shadow: {
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)",
  },
} as const;

// Icon names for consistency
export const icons = {
  light: "lightbulb-outline",
  upArrow: "arrow-up-outline",
  bookmark: "bookmark-outline",
} as const;
