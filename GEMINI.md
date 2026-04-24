# GEMINI.md — Angular Dynamic Pricing UI (Intern Assignment)

You are assisting with an Angular intern assignment. Your job is to help build a **Dynamic Pricing Management UI** using the latest Angular version with signals, standalone components, and signal-based forms.

Read all linked context files before generating any code. They are authoritative — do not deviate from them.

---

## Context Files (read all of these)

| File | Purpose |
|------|---------|
| [`ASSIGNMENT.md`](./ASSIGNMENT.md) | Full assignment brief, objectives, and requirements |
| [`DATA_SCHEMA.md`](./DATA_SCHEMA.md) | Detailed breakdown of `pricing.json` structure with annotated examples |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Component tree, signal state design, folder structure |
| [`UI_SPEC.md`](./UI_SPEC.md) | UI behavior spec derived from the design screenshot |

---

## Stack

- **Angular** — latest stable version (standalone components, no NgModules)
- **Signals** — `signal()`, `computed()`, `effect()` for all state
- **Signal-based forms** — use `linkedSignal` / manual signal binding instead of `ReactiveFormsModule` where possible; use `FormControl` wrapped in signals if needed
- **No external UI libraries** — plain CSS or Angular CDK only
- **TypeScript** — strict mode

---

## Key Rules for Code Generation

1. **All components must be standalone** (`standalone: true` in `@Component`).
2. **No `NgModule`** anywhere in the project.
3. **State lives in signals** — never use `BehaviorSubject` or `Observable` for local UI state.
4. **Pricing data is loaded from `assets/pricing.json`** via `HttpClient` once, then stored in a signal.
5. **The UI has expandable sections** (DEFAULT, INSERTS, FR, ADDITIONAL CHARGE). Each section is a collapsible panel.
6. **The DEFAULT section** renders a horizontal scrollable tier table (columns = item quantities, rows = price per item). Columns can be added or removed.
7. **Mixed value types exist in JSON** — prices can be numbers, `"n/a"`, `"dropout"`, or `"quote"`. Handle all gracefully.
8. **Do not mutate the original signal directly** — derive new arrays/objects and call `set()` or `update()`.
9. Follow the folder structure in `ARCHITECTURE.md` exactly.

---

## How to Work with Me

- When I say **"scaffold"**, generate the full folder/file structure with empty shells.
- When I say **"implement [component]"**, generate the full working code for that component.
- When I say **"wire up"**, connect signals and inputs/outputs between components.
- Always refer to `DATA_SCHEMA.md` before touching any data transformation logic.
- Always refer to `UI_SPEC.md` before making any layout or interaction decisions.
