# Best Practices & Implementation Notes

This document captures best practices and patterns used in the JIRA wrapper implementation, informed by current documentation and industry standards.

**Last Updated:** 2025-01-22

---

## JIRA API Best Practices

### Rate Limiting
- **JIRA Cloud Limits**: 
  - 300 requests per minute per user
  - 100 requests per minute per IP
- **Implementation**:
  - Rate limiter queue with 100ms delay between requests
  - Exponential backoff on 429 responses
  - Respect `Retry-After` header when provided
  - Retry logic with max 3 attempts

### Pagination
- **JIRA Limit**: Maximum 100 results per request
- **Implementation**:
  - Automatic pagination handling in `searchJQL`
  - Fetch all pages until maxResults reached
  - Efficient batching to minimize API calls

### Authentication
- **Method**: Basic Auth (email + API token)
- **Security**:
  - Tokens encrypted in localStorage (base64 obfuscation)
  - Never log or expose tokens
  - Clear error messages for auth failures

### Error Handling
- **401 Unauthorized**: Clear message about credentials
- **403 Forbidden**: Permission issue message
- **429 Rate Limited**: Automatic retry with backoff
- **Network Errors**: Exponential backoff retry
- **Other Errors**: Include status and error text

### Caching Strategy
- **Filter Results**: Cached with configurable TTL (default: 5 minutes)
- **Cache Key**: Filter ID or JQL query hash
- **Cache Invalidation**: Manual refresh or TTL expiration
- **Storage**: localStorage with automatic cleanup on quota exceeded

---

## React Query Best Practices (v5)

### Query Keys
- **Structure**: `['jira', 'filters', connectionId]`
- **Hierarchical**: `['jira', 'tickets', filterId, viewMode]`
- **Invalidation**: Use queryClient.invalidateQueries with prefixes

### Caching
- **Stale Time**: 5 minutes (matches localStorage cache TTL)
- **Cache Time**: 30 minutes (keep in memory)
- **Refetch**: On window focus, network reconnect

### Error Handling
- **Error Boundaries**: Catch React Query errors
- **User Feedback**: In-app error messages
- **Retry Logic**: Configured in React Query options

### Optimistic Updates
- **Not Used**: Read-only application, no mutations
- **Future**: Could add optimistic UI for filter switching

---

## Component Patterns

### Data Fetching
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['jira', 'filters', connection.id],
  queryFn: () => jiraClient.getFilters(),
  staleTime: 5 * 60 * 1000, // 5 minutes
  enabled: connection.connected,
});
```

### Loading States
- **Skeleton Loaders**: For initial loads
- **Spinner**: For quick refreshes
- **Progress Indicators**: For long operations

### Error States
- **Inline Errors**: Show in component
- **Error Messages**: User-friendly, actionable
- **Retry Buttons**: Allow manual retry

---

## Performance Optimizations

### API Calls
- **Batch Requests**: When possible
- **Request Deduplication**: React Query handles this
- **Caching**: Aggressive caching to reduce API calls

### Rendering
- **React.memo**: For expensive components
- **useMemo**: For computed values
- **useCallback**: For event handlers passed to children
- **Virtualization**: Not needed (reasonable ticket counts)

### Memory
- **Cache Cleanup**: Automatic on quota exceeded
- **Old Cache Removal**: Remove entries older than 1 hour
- **Limit Cache Size**: Max 50 cached filters

---

## Security Considerations

### Credential Storage
- **Encryption**: Base64 obfuscation (not real encryption, but better than plain text)
- **Future**: Consider using Web Crypto API for real encryption
- **No Transmission**: Credentials never sent except to JIRA

### CORS
- **JIRA Cloud**: Supports CORS for authenticated requests
- **No Proxy Needed**: Direct API calls from browser

### XSS Protection
- **No User Input in HTML**: All JIRA content sanitized
- **React Escaping**: Automatic XSS protection
- **Description Rendering**: Use `dangerouslySetInnerHTML` only with sanitization (future)

---

## Testing Strategy

### Unit Tests
- JIRA client methods
- Data transformation (mapIssue)
- Cache management
- Utility functions

### Integration Tests
- API calls with mock server
- React Query integration
- Error handling flows

### Manual Testing
- Keyboard navigation
- View mode switching
- Filter selection
- Error scenarios

---

## Known Limitations

### JIRA API
- **Read-Only**: No write operations (by design)
- **JIRA Cloud Only**: No Server/Data Center support
- **No Webhooks**: Uses polling for updates
- **Rate Limits**: Must respect 300 req/min limit

### Browser
- **localStorage Size**: ~5-10MB limit
- **CORS**: Requires proper JIRA CORS configuration
- **No Service Worker**: Offline support not implemented

### Performance
- **Large Result Sets**: May be slow with 1000+ tickets
- **No Virtualization**: All tickets rendered at once
- **No Debouncing**: Immediate filter execution

---

## Future Improvements

### v1.1
- Real encryption for API tokens (Web Crypto API)
- Service worker for offline support
- Virtual scrolling for large lists
- Advanced filtering within results

### v1.2
- OAuth authentication
- Webhook support (if JIRA supports it)
- Real-time updates (polling)
- Export to CSV/Excel

### v2.0
- Multiple JIRA instance support
- Custom view configurations
- Dashboard with multiple filters
- Analytics and reporting

---

## References

- [JIRA REST API v3 Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [React Query v5 Documentation](https://tanstack.com/query/latest)
- [JIRA Rate Limiting](https://developer.atlassian.com/cloud/jira/platform/rate-limiting/)
- [JIRA Authentication](https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/)

---

**Note**: This document should be updated as best practices evolve and new patterns are discovered.

