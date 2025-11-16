# JIRA Filter Wrapper

A modern, single-user JIRA filter wrapper that pulls in JIRA filters and displays them in multiple view modes. Built with React, TypeScript, and Vite.

## Features

- 🔌 **JIRA Cloud Integration** - Connect to your JIRA instance
- 📋 **Filter Management** - View and manage your saved JIRA filters
- 🎨 **Multiple View Modes** - List, Board, Table, Timeline, and Compact views
- ⚡ **Fast & Responsive** - Optimized with React Query and local caching
- 🌙 **Dark Mode** - Beautiful dark theme support
- ⌨️ **Keyboard Navigation** - Full keyboard support
- 💾 **Local Caching** - Cached filter results with configurable TTL

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Usage

### Connecting to JIRA

1. Click "Connect to JIRA" button
2. Enter your JIRA instance URL (e.g., `https://your-company.atlassian.net`)
3. Enter your email and API token
4. Click "Test Connection" to verify
5. Click "Connect" to save

### Getting an API Token

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a name and copy the token
4. Use this token when connecting

### Viewing Filters

1. Select a filter from the sidebar
2. Choose a view mode (List, Board, Table, Timeline, Compact)
3. Click on any ticket to view details
4. Click the refresh button to update tickets

## View Modes

- **List View**: Detailed list with all ticket information
- **Board View**: Kanban-style board grouped by status
- **Table View**: Sortable table with all fields
- **Timeline View**: Grouped by date (updated date)
- **Compact View**: Minimal list for quick scanning

## Design Decisions

For key architectural and design decisions, see [DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md). This includes:
- Single-user, no sharing architecture
- Accessibility scope (keyboard navigation + animations)
- Technical constraints and patterns

## Best Practices

For implementation best practices and patterns, see [BEST_PRACTICES.md](./BEST_PRACTICES.md).

## Project Structure

```
jira-wrapper/
├── src/
│   ├── components/
│   │   ├── jira/          # JIRA-specific components
│   │   ├── views/         # View mode components
│   │   ├── ticket/        # Ticket detail components
│   │   └── layout/        # Layout components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   │   ├── jira.ts        # JIRA API client
│   │   ├── storage.ts     # LocalStorage management
│   │   └── utils.ts       # Utility functions
│   ├── types/             # TypeScript types
│   └── App.tsx            # Main app component
├── prds/                  # Product requirements
└── DESIGN_DECISIONS.md    # Design decisions
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Query (TanStack Query)** - Data fetching and caching
- **Lucide React** - Icons

## Privacy

This app is designed for single-user use. All data is stored locally in your browser's localStorage. JIRA credentials are encrypted (base64 obfuscation) before storage. No data is sent to any server except your JIRA instance.

## License

MIT

