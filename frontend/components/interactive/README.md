# Interactive Components

Components for in-browser Python code execution via Pyodide.

## Components

### PyodideProvider
Context provider that loads Pyodide for child components.

```tsx
import { PyodideProvider } from '@/components/interactive';

<PyodideProvider packages={['numpy']} autoLoad={false}>
  {/* Interactive cells here */}
</PyodideProvider>
```

**Props**:
- `packages`: Pre-load Python packages
- `autoLoad`: Load immediately vs on first use

### InteractiveCode
Editable code cell with in-browser Python execution.

```tsx
import { InteractiveCode } from '@/components/interactive';

<InteractiveCode
  code="print('Hello')"
  packages={['numpy']}
  runLabel="Run"
/>
```

**Features**:
- Syntax highlighting (basic)
- Auto-resize textarea
- Run/Reset buttons
- Error handling
- Stdout capture

## Hooks

- `usePyodide()`: Access Pyodide instance and loading state
