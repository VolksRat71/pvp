// ./theme/DarkTheme.js

import { DefaultTheme } from 'react-native-paper';

const DarkTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
        ...DefaultTheme.colors,
        primary: '#186374',       // Primary blue shade for primary actions
        accent: '#B4483E',        // Reddish shade for secondary actions (react-native-paper uses accent instead of secondary)
        error: '#F24822',         // Bright red for error or accent highlights
        background: '#02202B',    // Darkest shade for background
        surface: '#082F39',       // Slightly lighter shade for contrast elements like cards (react-native-paper uses surface instead of paper)
        text: '#ffffff',          // Assuming white as the default text color for dark theme, modify as needed
    },
    // Typography configuration can be applied directly to React Native components.
    // react-native-paper doesn't have a direct way to specify fontFamily in the theme.
};

export default DarkTheme;
