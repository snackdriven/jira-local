// ==UserScript==
// @name         Jira CSS Wrapper
// @namespace    https://github.com/snackdriven/jira-local
// @version      1.0.0
// @description  Custom CSS overrides for Jira Cloud - improve density, readability, and aesthetics
// @author       Kayla Gilbert
// @match        https://*.atlassian.net/*
// @match        https://*.jira.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION - Customize these values
    // ============================================
    const CONFIG = {
        // Enable/disable feature groups
        enableCompactMode: true,
        enableDarkModeEnhancements: true,
        enableBoardImprovements: true,
        enableBacklogImprovements: true,
        enableTicketDetailImprovements: true,
        enableNavigationImprovements: true,
        enableCustomColors: true,

        // Custom colors (used when enableCustomColors is true)
        colors: {
            accent: '#0052CC',           // Primary accent color
            accentHover: '#0065FF',      // Accent hover state
            background: '#FFFFFF',        // Main background
            backgroundAlt: '#F4F5F7',     // Alternate background
            text: '#172B4D',              // Primary text
            textMuted: '#5E6C84',         // Secondary text
            border: '#DFE1E6',            // Border color
            success: '#00875A',           // Success/Done status
            warning: '#FF991F',           // Warning/In Progress
            error: '#DE350B',             // Error/Blocked
        },

        // Density settings
        density: {
            rowHeight: '36px',            // Table row height
            cardPadding: '12px',          // Card padding
            fontSize: '13px',             // Base font size
            lineHeight: '1.4',            // Line height
        },
    };

    // ============================================
    // CSS MODULES
    // ============================================

    const CSS_MODULES = {
        // Compact mode - increase information density
        compactMode: `
            /* Reduce whitespace in ticket lists */
            [data-testid="software-board.board-container"] {
                padding: 8px !important;
            }

            /* Compact table rows */
            .ghx-issue,
            [data-testid*="issue-line"] {
                min-height: ${CONFIG.density.rowHeight} !important;
                padding: 4px 8px !important;
            }

            /* Smaller card padding on boards */
            [data-testid="platform-card.ui.card"] {
                padding: ${CONFIG.density.cardPadding} !important;
            }

            /* Compact backlog items */
            .ghx-backlog-container .ghx-issue-content {
                padding: 4px 8px !important;
            }

            /* Reduce panel padding */
            [data-testid="issue.views.issue-details.issue-layout.container"] {
                padding: 16px !important;
            }

            /* Tighter list spacing */
            .ghx-issue-fields {
                gap: 4px !important;
            }

            /* Compact sprint headers */
            .ghx-sprint-group .ghx-header {
                padding: 8px 12px !important;
            }
        `,

        // Dark mode enhancements (for Jira's built-in dark mode)
        darkModeEnhancements: `
            /* Better contrast for dark mode */
            @media (prefers-color-scheme: dark) {
                [data-theme="dark"] {
                    /* Improve link visibility */
                    a:not([class*="button"]) {
                        color: #579DFF !important;
                    }

                    /* Better code block contrast */
                    code, pre {
                        background-color: #1D2125 !important;
                        border-color: #3B475C !important;
                    }

                    /* Improve dropdown visibility */
                    [data-testid*="dropdown"],
                    [role="listbox"] {
                        background-color: #22272B !important;
                        border-color: #3B475C !important;
                    }
                }
            }

            /* Force better selection visibility */
            ::selection {
                background-color: rgba(0, 82, 204, 0.3) !important;
            }
        `,

        // Board view improvements
        boardImprovements: `
            /* Better column headers */
            [data-testid="platform-board-kit.ui.column.header"] {
                position: sticky !important;
                top: 0 !important;
                z-index: 10 !important;
                backdrop-filter: blur(8px) !important;
            }

            /* Card hover effects */
            [data-testid="platform-card.ui.card"]:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                transition: all 0.2s ease !important;
            }

            /* Column width optimization */
            [data-testid="platform-board-kit.ui.column.draggable-column"] {
                min-width: 280px !important;
                max-width: 320px !important;
            }

            /* Scrollable columns */
            [data-testid="platform-board-kit.ui.column.content"] {
                max-height: calc(100vh - 200px) !important;
                overflow-y: auto !important;
            }

            /* Hide empty columns option (uncomment to enable) */
            /*
            [data-testid="platform-board-kit.ui.column.draggable-column"]:has([data-testid="platform-board-kit.ui.column.content"]:empty) {
                display: none !important;
            }
            */

            /* Better WIP limits visibility */
            [data-testid*="column-limit"] {
                font-weight: 600 !important;
            }
        `,

        // Backlog improvements
        backlogImprovements: `
            /* Sticky sprint headers */
            .ghx-sprint-group .ghx-header {
                position: sticky !important;
                top: 0 !important;
                z-index: 5 !important;
                background: inherit !important;
            }

            /* Better drag handles */
            .ghx-grabber {
                opacity: 0.3 !important;
                transition: opacity 0.2s !important;
            }

            .ghx-issue:hover .ghx-grabber {
                opacity: 1 !important;
            }

            /* Highlight selected items */
            .ghx-issue.ghx-selected {
                background-color: rgba(0, 82, 204, 0.1) !important;
                border-left: 3px solid ${CONFIG.colors.accent} !important;
            }

            /* Story points visibility */
            [data-testid*="story-point"],
            .ghx-estimate {
                font-weight: 600 !important;
                background: rgba(0, 82, 204, 0.1) !important;
                padding: 2px 6px !important;
                border-radius: 4px !important;
            }

            /* Epic link styling */
            [data-testid*="epic-link"],
            .ghx-extra-field-content[data-fieldid="epic"] {
                padding: 2px 8px !important;
                border-radius: 12px !important;
                font-size: 11px !important;
            }
        `,

        // Ticket detail view improvements
        ticketDetailImprovements: `
            /* Better detail panel layout */
            [data-testid="issue.views.issue-details.issue-layout.container"] {
                max-width: 1400px !important;
                margin: 0 auto !important;
            }

            /* Improved description readability */
            [data-testid="issue.views.field.rich-text.description"] {
                font-size: ${CONFIG.density.fontSize} !important;
                line-height: ${CONFIG.density.lineHeight} !important;
            }

            /* Better comment styling */
            [data-testid*="comment"] {
                border-left: 2px solid ${CONFIG.colors.border} !important;
                padding-left: 12px !important;
                margin: 8px 0 !important;
            }

            /* Highlight your own comments */
            [data-testid*="comment"][data-is-author="true"] {
                border-left-color: ${CONFIG.colors.accent} !important;
                background: rgba(0, 82, 204, 0.03) !important;
            }

            /* Attachment preview improvements */
            [data-testid*="attachment"] img {
                max-height: 200px !important;
                object-fit: contain !important;
                border-radius: 4px !important;
            }

            /* Field labels */
            [data-testid*="field-label"] {
                font-weight: 500 !important;
                color: ${CONFIG.colors.textMuted} !important;
                text-transform: uppercase !important;
                font-size: 11px !important;
                letter-spacing: 0.5px !important;
            }

            /* Linked issues */
            [data-testid*="link-issue"] {
                padding: 6px 8px !important;
                background: ${CONFIG.colors.backgroundAlt} !important;
                border-radius: 4px !important;
                margin: 2px 0 !important;
            }
        `,

        // Navigation improvements
        navigationImprovements: `
            /* Compact top nav */
            [data-testid="atlassian-navigation"] {
                height: 48px !important;
            }

            /* Sidebar width */
            [data-testid="navigation-sidebar"] {
                width: 240px !important;
            }

            /* Breadcrumb styling */
            [data-testid*="breadcrumb"] {
                font-size: 12px !important;
            }

            /* Quick filters bar */
            [data-testid*="quick-filters"] {
                padding: 8px !important;
                gap: 4px !important;
            }

            /* Search improvements */
            [data-testid="search-dialog"] {
                max-width: 680px !important;
            }

            /* Project switcher */
            [data-testid*="project-switcher"] button {
                padding: 4px 8px !important;
            }
        `,

        // Custom color overrides
        customColors: `
            /* Status badge colors */
            [data-testid*="status"][data-status-category="done"],
            .ghx-label[title*="Done"],
            .ghx-label[title*="Closed"],
            .ghx-label[title*="Resolved"] {
                background-color: ${CONFIG.colors.success} !important;
            }

            [data-testid*="status"][data-status-category="inprogress"],
            .ghx-label[title*="Progress"],
            .ghx-label[title*="Review"] {
                background-color: ${CONFIG.colors.warning} !important;
            }

            [data-testid*="status"][data-status-category="blocked"],
            .ghx-label[title*="Blocked"],
            .ghx-label[title*="Impediment"] {
                background-color: ${CONFIG.colors.error} !important;
            }

            /* Priority indicators */
            [data-testid*="priority"][data-priority="highest"],
            .ghx-priority[title*="Highest"] {
                color: ${CONFIG.colors.error} !important;
            }

            /* Accent color for interactive elements */
            button[data-testid*="primary"],
            [data-testid*="button"][data-appearance="primary"] {
                background-color: ${CONFIG.colors.accent} !important;
            }

            button[data-testid*="primary"]:hover,
            [data-testid*="button"][data-appearance="primary"]:hover {
                background-color: ${CONFIG.colors.accentHover} !important;
            }
        `,

        // Base styles (always applied)
        base: `
            /* Smooth transitions */
            * {
                transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease !important;
            }

            /* Better focus indicators */
            *:focus-visible {
                outline: 2px solid ${CONFIG.colors.accent} !important;
                outline-offset: 2px !important;
            }

            /* Hide Atlassian promotions/ads */
            [data-testid*="discover"],
            [data-testid*="upgrade"],
            [data-testid*="premium-trial"] {
                display: none !important;
            }

            /* Consistent border radius */
            [data-testid*="card"],
            [data-testid*="panel"],
            [data-testid*="dropdown"] {
                border-radius: 6px !important;
            }

            /* Better scrollbars */
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            ::-webkit-scrollbar-track {
                background: transparent;
            }

            ::-webkit-scrollbar-thumb {
                background: ${CONFIG.colors.border};
                border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: ${CONFIG.colors.textMuted};
            }
        `,
    };

    // ============================================
    // INJECTION LOGIC
    // ============================================

    function injectStyles() {
        let css = CSS_MODULES.base;

        if (CONFIG.enableCompactMode) css += CSS_MODULES.compactMode;
        if (CONFIG.enableDarkModeEnhancements) css += CSS_MODULES.darkModeEnhancements;
        if (CONFIG.enableBoardImprovements) css += CSS_MODULES.boardImprovements;
        if (CONFIG.enableBacklogImprovements) css += CSS_MODULES.backlogImprovements;
        if (CONFIG.enableTicketDetailImprovements) css += CSS_MODULES.ticketDetailImprovements;
        if (CONFIG.enableNavigationImprovements) css += CSS_MODULES.navigationImprovements;
        if (CONFIG.enableCustomColors) css += CSS_MODULES.customColors;

        // Use GM_addStyle if available, otherwise inject manually
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        }

        console.log('[Jira CSS Wrapper] Styles injected successfully');
    }

    // ============================================
    // MENU COMMANDS (Tampermonkey menu)
    // ============================================

    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('Toggle Compact Mode', () => {
            CONFIG.enableCompactMode = !CONFIG.enableCompactMode;
            location.reload();
        });

        GM_registerMenuCommand('Toggle Dark Mode Enhancements', () => {
            CONFIG.enableDarkModeEnhancements = !CONFIG.enableDarkModeEnhancements;
            location.reload();
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    // Inject as early as possible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectStyles);
    } else {
        injectStyles();
    }

    // Re-inject on dynamic navigation (Jira is a SPA)
    const observer = new MutationObserver((mutations) => {
        // Check if major DOM changes occurred (route change)
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                // Debounce re-injection
                clearTimeout(window._jiraCssDebounce);
                window._jiraCssDebounce = setTimeout(injectStyles, 100);
                break;
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

})();
