# Architecture

```text
src/
  app/
    core/
    features/
    shared/
    ...
  main.ts
  styles.css
```

- `core/` contains app-wide infrastructure and singleton-style services.
- `features/` contains business features grouped by domain or use case.
- `shared/` contains reusable UI pieces, helpers, and common utilities.
