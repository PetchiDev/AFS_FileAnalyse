// Responsive Breakpoints Constants
export const BREAKPOINTS = {
  MOBILE: '480px',
  TABLET: '768px',
  DESKTOP: '1024px',
  LARGE_DESKTOP: '1440px'
};

// Media Query Helpers
export const MEDIA_QUERIES = {
  MOBILE: `(max-width: ${BREAKPOINTS.MOBILE})`,
  TABLET: `(max-width: ${BREAKPOINTS.TABLET})`,
  DESKTOP: `(max-width: ${BREAKPOINTS.DESKTOP})`,
  LARGE_DESKTOP: `(min-width: ${BREAKPOINTS.LARGE_DESKTOP})`,
  TABLET_UP: `(min-width: ${parseInt(BREAKPOINTS.TABLET) + 1}px)`,
  DESKTOP_UP: `(min-width: ${parseInt(BREAKPOINTS.DESKTOP) + 1}px)`
};

// CSS Custom Properties for Breakpoints (for use in CSS)
export const CSS_BREAKPOINTS = {
  MOBILE: '480px',
  TABLET: '768px',
  DESKTOP: '1024px',
  LARGE_DESKTOP: '1440px'
};

