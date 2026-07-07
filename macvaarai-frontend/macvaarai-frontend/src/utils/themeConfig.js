// Theme configuration based on organization/portal
export const getThemeConfig = () => {
  const pathname = window.location.pathname.toLowerCase();

  if (pathname.includes('vijaycare')) {
    return {
      name: 'vijaycare',
      primary: 'yellow',
      primaryShade: 'yellow-500',
      primaryDark: 'yellow-600',
      primaryLight: 'yellow-400',
      secondary: 'yellow-600',
      accent: 'yellow-500',
      gradient: 'from-yellow-500 to-yellow-700',
      headerGradient: 'from-yellow-600 to-yellow-800',
      buttonPrimary: 'bg-yellow-500 hover:bg-yellow-600',
      buttonPrimaryText: 'text-white',
      headerBg: 'bg-gradient-to-r from-yellow-600 to-yellow-800',
      headerText: 'text-white',
      accentText: 'text-yellow-500',
    };
  } else if (pathname.includes('modi')) {
    return {
      name: 'modi',
      primary: 'orange',
      primaryShade: 'orange-500',
      primaryDark: 'orange-600',
      primaryLight: 'orange-400',
      secondary: 'orange-600',
      accent: 'orange-500',
      gradient: 'from-orange-500 to-orange-700',
      headerGradient: 'from-orange-600 to-orange-800',
      buttonPrimary: 'bg-orange-500 hover:bg-orange-600',
      buttonPrimaryText: 'text-white',
      headerBg: 'bg-gradient-to-r from-orange-600 to-orange-800',
      headerText: 'text-white',
      accentText: 'text-orange-500',
    };
  } else {
    // Default blue theme
    return {
      name: 'default',
      primary: 'blue',
      primaryShade: 'blue-500',
      primaryDark: 'blue-600',
      primaryLight: 'blue-400',
      secondary: 'blue-600',
      accent: 'blue-500',
      gradient: 'from-blue-500 to-blue-700',
      headerGradient: 'from-blue-600 to-blue-800',
      buttonPrimary: 'bg-blue-600 hover:bg-blue-700',
      buttonPrimaryText: 'text-white',
      headerBg: 'bg-gradient-to-r from-blue-600 to-blue-800',
      headerText: 'text-white',
      accentText: 'text-blue-500',
    };
  }
};

// Get theme color value
export const getThemeColor = (colorName) => {
  const theme = getThemeConfig();
  return theme[colorName] || theme.primary;
};
