### TanStack Query Integration Plan

- **Central Client Setup**: Keep `queryClient.ts` as the single source with shared `QueryClient` configuration (cache, toasts). Ensure providers (likely in `app.tsx`) wrap navigation so every screen can consume the client.
- **Hook-Per-Feature Pattern**: Mirror the News example—each domain feature gets a dedicated hook under `app/services/queries/<Feature>` returning typed data, booleans, and helper handlers (e.g., `useInfinityNewsPage`). Hooks hide pagination/cursor quirks and expose normalized arrays.
- **API Layer Contracts**: Continue isolating raw HTTP calls in `app/services/api/<Feature>`. Hooks should only call the service methods, never inline `api.get`. This keeps request schemas/types in `NewService/NewType`.
- **State Replacement Strategy**: Replace screen-level manual state machines incrementally. For each screen, identify fetch/refresh/load-more blocks and swap them for the hook outputs. Remove redundant refs, caches, and dedupe logic once the hook handles them.
- **Testing/Validation**: After each hook adoption, manually verify initial load, pull-to-refresh, pagination, and error toasts. If backend lacks cursors, codify page-number logic (as done for News).
- **Enum Registration**: Every module that defines TanStack queries must add a key to `app/services/queries/EnumKey.ts` first (e.g., `EnumKey.NEWS`, `EnumKey.EVENT_NEWS`), then use that enum entry to build the query key so naming stays centralized.
- **Duplicate Call Safety**: Before building a new hook, **always search** for existing hooks or API usages for the same data (both in `app/services/queries` and screens). If an existing hook already calls that endpoint, either (a) reuse it directly, or (b) refactor it into a shared hook / shared query key so multiple hooks share the same cache. Never leave two independent hooks hitting the same endpoint with different `queryKey`s and identical parameters.

### Folder + Rule Guidelines

- **`app/services/api`**: REST clients only. Files follow `<Feature>Service.ts` and `<Feature>Type.ts` naming. No React logic here; only apisauce calls and type definitions.
- **`app/services/queries`**: Houses TanStack logic. Organize by feature (`News/`, `Portfolio/`, etc.). Each folder can expose multiple hooks plus shared helpers (e.g., `EnumKey.ts`). Keep hook filenames descriptive (`useInfinityNewsPage.ts`, `usePortfolioSummary.ts`).
- **Hook Composition Rules**:
  - Register a new entry in `EnumKey` before introducing a query key and prefer using `EnumKey.<MODULE>` as the base for `queryKey`.
  - Always import from `queryClient.ts` if you need cache invalidation outside hooks; never instantiate another `QueryClient`.
  - Standardize query keys as arrays (`["news-list"]`) and export them when multiple hooks share the same data.
  - Provide stable helper outputs (derived lists via `useMemo`, booleans, handlers) so screens don’t need post-processing.
  - Enforce error messaging via `meta.errorMessage` so the shared `QueryCache` toast remains meaningful.
- **UI Layer Usage**:
  - Screens/components only consume hook outputs; no direct API imports.
  - Skeletons/empties/errors should rely on `isLoading`, `error`, `hasNextPage`, etc., coming from the hook to keep UI logic thin.
- **Shared Utilities**: If pagination or dedupe logic is reused across features, lift it into `app/services/queries/utils/` and import from hooks to avoid duplication.
- **SignalR Integration**: For real-time data updates, integrate SignalR listeners directly into hooks using `queryClient.setQueryData`. This centralizes real-time logic and automatically updates all components using the hook. See `docs/signalr-tanstack-integration.md` for detailed implementation guide.

Following this plan keeps TanStack usage consistent, encourages reuse, and makes future feature migrations predictable.
