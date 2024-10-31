import { themes } from './pageData';

const setTheme = (theme = 'dark') => {
  const root = document.documentElement;
  const chooseTheme = themes[theme];
  Object.keys(chooseTheme).forEach((property) => {
    root.style.setProperty(`--${property}`, chooseTheme[property]);
  });
};
export default setTheme;
