import React, { useEffect, useState } from 'react';
import './themeSwitcher.css';

const themes = [
  { id: 'light-premium', name: 'Light Premium', description: 'Off-white background, navy text, blue details' },
  { id: 'navy-first', name: 'Navy First', description: 'Navy surfaces with blue and orange highlights' },
  { id: 'blue-gradient', name: 'Blue Gradient', description: 'Blue-led look with navy contrast' },
];

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('kaamdaar-theme') || 'light-premium';
    } catch {
      return 'light-premium';
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.kaamdaarTheme = theme;
    try {
      localStorage.setItem('kaamdaar-theme', theme);
    } catch {
      // Theme still works for the current page if storage is unavailable.
    }
  }, [theme]);

  return (
    <div className="theme-switcher">
      <button
        className="theme-switcher__toggle"
        type="button"
        aria-expanded={open}
        aria-label="Choose website colour theme"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" className="theme-switcher__icon">◐</span>
        Theme
      </button>
      {open && (
        <div className="theme-switcher__panel">
          <div className="theme-switcher__heading">Preview colours</div>
          {themes.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`theme-switcher__option ${theme === option.id ? 'is-active' : ''}`}
              onClick={() => setTheme(option.id)}
              aria-pressed={theme === option.id}
            >
              <span className={`theme-switcher__swatch theme-switcher__swatch--${option.id}`} aria-hidden="true">
                <i /><i /><i />
              </span>
              <span className="theme-switcher__copy">
                <strong>{option.name}</strong>
                <small>{option.description}</small>
              </span>
              {theme === option.id && <span className="theme-switcher__check" aria-hidden="true">✓</span>}
            </button>
          ))}
          <p className="theme-switcher__note">Your choice is saved in this browser.</p>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
