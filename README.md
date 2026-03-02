# Jira Local

Single-user dashboard for Jira Cloud. Pulls in your saved filters and displays them in five view modes: List, Board, Table, Timeline, and Compact. Credentials stay in your browser — nothing hits any server except your own Jira instance.

## Setup

```bash
npm install
npm run dev
```

## Connecting to Jira

1. Click "Connect to JIRA"
2. Enter your Jira instance URL (e.g. `https://your-company.atlassian.net`)
3. Enter your email and API token
4. Click "Test Connection", then "Connect"

**Getting an API token:** https://id.atlassian.com/manage-profile/security/api-tokens

## View modes

- **List** — full detail, all fields
- **Board** — kanban grouped by status
- **Table** — sortable columns
- **Timeline** — grouped by updated date
- **Compact** — minimal, good for quick scanning

## Stack

React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Lucide React

## Privacy

All data stored in localStorage. Credentials are base64-encoded before storage (obfuscation, not encryption). Nothing leaves your machine except Jira API calls.

## Bonus: CSS userscript

The `userscript/` folder has a Tampermonkey/Greasemonkey script that injects custom CSS into Jira Cloud — tighter density, better readability. Install it separately if you want it. See `userscript/README.md`.

## License

MIT
