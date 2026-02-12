import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.scss';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Check localStorage on mount
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <img
        src={theme === 'dark' 
          ? 'https://api.builder.io/api/v1/image/assets/TEMP/491e9c2b6f4f07e5abb88789898abd1700348858?width=146'
          : 'https://api.builder.io/api/v1/image/assets/TEMP/87081cb0bb5351aca4ed9c8c3d17c539ca25001e?width=146'
        }
        alt="Theme toggle"
        width={73}
        height={73}
      />
    </button>
  );
}
