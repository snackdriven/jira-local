# Jira CSS Wrapper - Tampermonkey Userscript

Custom CSS overrides for Jira Cloud to improve density, readability, and aesthetics.

## Installation

### Prerequisites

Install one of these browser extensions:
- [Tampermonkey](https://www.tampermonkey.net/) (recommended)
- [Violentmonkey](https://violentmonkey.github.io/)
- [Greasemonkey](https://www.greasespot.net/) (Firefox only)

### Install the Script

1. Open your userscript manager's dashboard
2. Click "Create new script" or "+"
3. Delete any default content
4. Copy and paste the contents of `jira-css-wrapper.user.js`
5. Save (Ctrl+S)

**Or** if hosting the file somewhere:
1. Click "Install from URL"
2. Enter the raw URL to the `.user.js` file

## Features

| Feature | Description |
|---------|-------------|
| **Compact Mode** | Reduces whitespace, smaller row heights, tighter padding |
| **Dark Mode Enhancements** | Better contrast and visibility for dark theme |
| **Board Improvements** | Sticky headers, hover effects, scrollable columns |
| **Backlog Improvements** | Sticky sprint headers, better drag handles, highlighted story points |
| **Ticket Detail Improvements** | Better layout, improved comment styling, attachment previews |
| **Navigation Improvements** | Compact nav, better search, improved breadcrumbs |
| **Custom Colors** | Status badges, priority indicators, accent colors |

## Configuration

Edit the `CONFIG` object at the top of the script:

```javascript
const CONFIG = {
    // Toggle features on/off
    enableCompactMode: true,
    enableDarkModeEnhancements: true,
    enableBoardImprovements: true,
    // ... etc

    // Customize colors
    colors: {
        accent: '#0052CC',
        success: '#00875A',
        // ... etc
    },

    // Adjust density
    density: {
        rowHeight: '36px',
        cardPadding: '12px',
        fontSize: '13px',
    },
};
```

## Customization Examples

### Hide Specific Elements

Add to any CSS module:
```css
/* Hide specific elements */
[data-testid="element-to-hide"] {
    display: none !important;
}
```

### Change Fonts

```css
/* Custom font */
body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
}
```

### Custom Board Column Width

```css
[data-testid="platform-board-kit.ui.column.draggable-column"] {
    min-width: 300px !important;
    max-width: 400px !important;
}
```

### Hide WIP Limits

```css
[data-testid*="column-limit"] {
    display: none !important;
}
```

## URL Matching

By default, the script runs on:
- `https://*.atlassian.net/*`
- `https://*.jira.com/*`

To add more domains, edit the `@match` directives in the userscript header:
```javascript
// @match        https://jira.mycompany.com/*
```

## Troubleshooting

### Styles not applying

1. Make sure the script is enabled in Tampermonkey
2. Check that the URL matches the `@match` patterns
3. Hard refresh the page (Ctrl+Shift+R)
4. Open browser console and look for "[Jira CSS Wrapper] Styles injected successfully"

### Styles conflict with Jira updates

Jira occasionally changes their DOM structure. If something breaks:
1. Open browser DevTools (F12)
2. Inspect the element that's broken
3. Find the new `data-testid` or class name
4. Update the selector in the script

### Performance issues

If you notice slowdowns:
1. Disable the MutationObserver at the bottom of the script
2. Or increase the debounce timeout from `100` to `500`

## Contributing

To add new CSS modules:

1. Add a new property to `CSS_MODULES`
2. Add a corresponding toggle in `CONFIG`
3. Add it to the `injectStyles()` function

## License

MIT
