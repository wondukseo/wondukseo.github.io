(() => {
  const storageKey = 'theme';
  const root = document.documentElement;
  const body = document.body;
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle || !body) return;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const setTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    body.classList.toggle('theme-dark', theme === 'dark');
    body.classList.toggle('theme-light', theme === 'light');
    toggle.setAttribute('aria-pressed', theme === 'dark');
  };

  const getStoredTheme = () => {
    const stored = localStorage.getItem(storageKey);
    return stored === 'dark' || stored === 'light' ? stored : null;
  };

  const applyInitialTheme = () => {
    const stored = getStoredTheme();
    if (stored) {
      setTheme(stored);
      return;
    }
    setTheme(prefersDark.matches ? 'dark' : 'light');
  };

  applyInitialTheme();

  prefersDark.addEventListener('change', (event) => {
    if (!getStoredTheme()) {
      setTheme(event.matches ? 'dark' : 'light');
    }
  });

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(storageKey, next);
    setTheme(next);
  });
})();
