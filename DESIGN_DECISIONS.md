# Design Decisions & Constraints

This document captures key architectural, UX, and design decisions for the JIRA Filter Wrapper project. These decisions align with the LiveJournal Clone project for consistency.

**Last Updated:** 2025-01-22

---

## Core Product Philosophy

### Single User, No Sharing
- **Decision**: Application is designed for a single user only
- **Implications**:
  - No user accounts or authentication (beyond JIRA auth)
  - No sharing features
  - No social features
  - No multi-user data isolation
  - No collaboration features
  - All preferences and cached data local to user's browser
- **Rationale**: Focus on personal JIRA filter management without distractions

### Privacy-First
- **Decision**: All data stored locally in browser localStorage (except JIRA API calls)
- **Implications**:
  - No cloud sync of preferences
  - No server-side storage
  - JIRA credentials stored locally (encrypted)
  - Cached filter results stored locally
  - Export/import functionality for user-controlled backups
- **Rationale**: Maximum privacy, user owns their data completely

### Single Developer
- **Decision**: Built and maintained by a single developer
- **Implications**:
  - Simpler architecture (no need for complex team workflows)
  - Direct user feedback loop
  - Faster iteration cycles
  - No need for extensive documentation for team handoffs
- **Rationale**: Personal project, not enterprise software

---

## Accessibility Scope

### ✅ Included: Keyboard Navigation
- **Decision**: Full keyboard support for all interactive elements
- **Implementation**:
  - Tab navigation through all components
  - Enter/Space to activate buttons and tickets
  - Arrow keys for navigation in segmented controls (view toggle)
  - Escape to close dropdowns and modals
  - Focus indicators visible on all elements (`focus:ring-2 focus:ring-primary-500`)
  - `tabIndex={0}` on keyboard-accessible elements
  - `onKeyDown` handlers for all interactive components
- **Rationale**: Essential for power users and basic accessibility

### ✅ Included: Smooth Animations
- **Decision**: Smooth, polished animations throughout
- **Implementation**:
  - Theme transitions: 200ms
  - View mode transitions: 300ms
  - Hover effects with transitions
  - Scale animations for active states
  - GPU-accelerated CSS transitions
  - `theme-transition` class for smooth theme changes
  - `view-transition` class for view mode changes
- **Rationale**: Better user experience, professional feel

### ❌ Excluded: Screen Reader Support
- **Decision**: No ARIA attributes, roles, or screen reader optimizations
- **Not Included**:
  - No `aria-label` attributes
  - No `aria-*` attributes
  - No `role` attributes
  - No semantic HTML roles
  - No screen reader announcements
- **Rationale**: Out of scope for this project, focus on visual experience

### ❌ Excluded: Touch-Specific Features
- **Decision**: Standard mouse/keyboard interactions only
- **Not Included**:
  - No touch target size requirements
  - No swipe gestures
  - No touch-specific interactions
  - No mobile-specific optimizations beyond responsive design
- **Rationale**: Desktop-first experience, touch is secondary

---

## Technical Architecture

### Frontend Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Data Fetching**: React Query (TanStack Query)
- **State Management**: React hooks (useState, useEffect, useCallback)
- **Storage**: localStorage (browser)

### Data Persistence
- **Storage**: Browser localStorage only
- **Format**: JSON serialization
- **Cached Data**: Filter results cached locally with TTL
- **Backup**: Export/import functionality (JSON files)
- **No Cloud**: No server-side storage or sync

### External Integrations
- **JIRA Cloud API**: REST API v3
  - Basic Auth (email + API token)
  - JQL query execution
  - Filter retrieval
  - Rate limiting handling

---

## UI/UX Patterns

### Theme System
- **Options**: Light, Dark, Auto (follows system preference)
- **Toggle**: Dropdown menu with keyboard navigation
- **Persistence**: Saved to localStorage
- **Transitions**: Smooth 200ms transitions
- **Implementation**: Tailwind dark mode classes

### View Modes
- **List View**: Simple list of tickets
- **Board View**: Kanban-style board by status
- **Table View**: Sortable table with all fields
- **Timeline View**: Grouped by date
- **Compact View**: Minimal information density
- **Toggle**: Segmented control with keyboard navigation (Arrow keys)
- **Persistence**: Saved to localStorage per filter

### Ticket Display
- **All Views**: Keyboard accessible (Enter/Space to open)
- **Focus Indicators**: Visible focus rings
- **Hover States**: Clear visual feedback
- **Clickable**: Entire ticket card is clickable

---

## Component Patterns

### Interactive Elements
- **Buttons**: Always keyboard accessible
- **Dropdowns**: Click to open, keyboard navigation, Escape to close
- **Modals**: Click outside or Escape to close
- **Focus Management**: Proper focus trapping in modals

### Form Elements
- **Validation**: Client-side only
- **Error Display**: In-app error messages (no browser alerts)
- **JQL Input**: Syntax validation before execution

### Data Fetching
- **React Query**: For JIRA API calls
- **Caching**: Local cache with configurable TTL
- **Loading States**: Clear loading indicators
- **Error Handling**: User-friendly error messages

---

## Development Guidelines

### When Adding Features
1. ✅ Ensure keyboard navigation works
2. ✅ Add smooth transitions/animations
3. ✅ Save preferences to localStorage
4. ❌ Don't add ARIA attributes
5. ❌ Don't add touch-specific features
6. ✅ Keep it single-user focused
7. ✅ Keep data local-only (except JIRA API)

### Code Style
- TypeScript strict mode
- Functional components with hooks
- Custom hooks for reusable logic
- Component-based architecture
- Tailwind for styling
- No CSS-in-JS

### Testing Approach
- Manual testing (keyboard navigation)
- Visual testing (animations, transitions)
- Browser testing (Chrome, Firefox, Safari)
- JIRA API integration testing

---

## References

- [SPARC Document](../prds/jira-wrapper-sparc.md) - Full product specification
- [LiveJournal Design Decisions](../livejournal-clone/DESIGN_DECISIONS.md) - Shared design principles

---

**Note**: This document should be updated when major architectural or design decisions are made. It serves as the source of truth for project constraints and patterns.

