# ARCHITECTURE.md — Component Tree & Signal State Design

---

## Folder Structure

```
src/
├── app/
│   ├── models/
│   │   └── pricing.models.ts          # All TypeScript interfaces (see DATA_SCHEMA.md)
│   │
│   ├── services/
│   │   └── pricing-state.service.ts   # Loads JSON, owns root signal, exposes mutators
│   │
│   ├── components/
│   │   ├── pricing-shell/             # Root page container; renders all section panels
│   │   │   ├── pricing-shell.component.ts
│   │   │   └── pricing-shell.component.css
│   │   │
│   │   ├── section-panel/             # Collapsible section wrapper (header + toggle)
│   │   │   ├── section-panel.component.ts
│   │   │   └── section-panel.component.css
│   │   │
│   │   ├── tier-table/                # The horizontal scrollable pricing table
│   │   │   ├── tier-table.component.ts
│   │   │   └── tier-table.component.css
│   │   │
│   │   ├── additional-charges/        # Renders all additional charge sub-sections
│   │   │   ├── additional-charges.component.ts
│   │   │   └── additional-charges.component.css
│   │   │
│   │   └── charge-field/              # Single adaptive charge field (routes by shape)
│   │       ├── charge-field.component.ts
│   │       └── charge-field.component.css
│   │
│   ├── app.component.ts               # Bootstraps pricing-shell
│   ├── app.component.html
│   └── app.config.ts                  # provideHttpClient(), etc.
│
└── assets/
    └── pricing.json                   # Copy the provided pricing.json here
```

---

## Component Responsibilities

### `PricingStateService`
- Injects `HttpClient`, loads `assets/pricing.json` on init
- Owns `pricingState = signal<RuiData | null>(null)`
- Exposes mutation methods:
  - `updateFlatPrice(section, colIndex, value)`
  - `updateSizePrice(rowIndex, colIndex, value)`
  - `addColumn(section)`
  - `removeColumn(section, colIndex)`
  - `updateDiscount(section, value)`
  - `updateAdditionalCharge(chargeKey, field, value)`

### `AppComponent`
- Bootstraps the app, renders `<app-pricing-shell>`

### `PricingShellComponent`
- Injects `PricingStateService`
- Renders four `<app-section-panel>` instances: DEFAULT, INSERTS, FR, ADDITIONAL CHARGE
- Passes relevant slice of signal state down as `@Input` to each child

### `SectionPanelComponent`
- `@Input() title: string`
- `@Input() expanded: boolean = false`
- `@Input() showAddColumn: boolean = false`
- `@Output() addColumn = new EventEmitter<void>()`
- Internal signal: `isOpen = signal(this.expanded)`
- Toggle on header click
- Projects content via `<ng-content>`

### `TierTableComponent`
- `@Input() itemTier: number[]` — column headers
- `@Input() rows: TierRow[]` — array of `{ label: string; prices: PriceValue[] }`
- `@Input() discount: number | undefined`
- `@Output() priceChange = new EventEmitter<{ rowIndex: number; colIndex: number; value: PriceValue }>()`
- `@Output() tierChange = new EventEmitter<{ colIndex: number; value: number }>()`
- `@Output() removeColumn = new EventEmitter<number>()`
- `@Output() discountChange = new EventEmitter<number>()`
- Renders a CSS grid or `<table>` with horizontal scroll

### `AdditionalChargesComponent`
- `@Input() charges: AdditionalCharge`
- `@Output() chargeChange = new EventEmitter<{ key: string; field: string; index?: number; value: any }>()`
- Iterates over charge keys, renders `<app-charge-field>` for each

### `ChargeFieldComponent`
- `@Input() label: string` — human-readable name (snake_case → Title Case)
- `@Input() chargeData: any` — the raw charge object
- `@Output() change = new EventEmitter<{ field: string; index?: number; value: any }>()`
- Detects shape of `chargeData` and renders the correct template variant (see DATA_SCHEMA.md §3)

---

## Signal State Flow

```
PricingStateService
  └── pricingState: Signal<RuiData | null>
        │
        ▼
  PricingShellComponent
  (reads signal, passes slices down)
        │
        ├── TierTableComponent (DEFAULT)
        │     └── emits changes → service.updateFlatPrice / addColumn / removeColumn
        │
        ├── TierTableComponent (INSERTS)
        │     └── emits changes → service.updateFlatPrice
        │
        ├── TierTableComponent (FR — size-tiered)
        │     └── emits changes → service.updateSizePrice
        │
        └── AdditionalChargesComponent
              └── emits changes → service.updateAdditionalCharge
```

**Rule:** Components are presentational — they receive data via `@Input` and emit changes via `@Output`. Only `PricingShellComponent` calls service mutators.

---

## Signal Form Pattern

Do NOT use `FormGroup` / `FormControl` from `ReactiveFormsModule`.  
Instead, bind inputs directly to signals using a helper pattern:

```ts
// In TierTableComponent
rows = input.required<TierRow[]>();        // signal input
localRows = linkedSignal(() => this.rows()); // local editable copy

updateCell(rowIndex: number, colIndex: number, event: Event) {
  const val = (event.target as HTMLInputElement).value;
  this.localRows.update(rows => {
    const clone = structuredClone(rows);
    clone[rowIndex].prices[colIndex] = isNaN(+val) ? val : +val;
    return clone;
  });
  this.priceChange.emit({ rowIndex, colIndex, value: ... });
}
```

Use `signal()` + `(input)` event binding — not `[(ngModel)]` or `formControl`.

---

## Styling

- Use plain CSS (scoped per component via `ViewEncapsulation.Emulated`)
- Section header bar: dark navy `#2c3e7a` background, white text, uppercase
- Expand/collapse toggle: `+` / `-` on the right
- Table inputs: borderless inputs inside bordered cells
- Add Column button: teal/cyan background (`#17a2b8`), white text
- Remove column button (×): small, gray, top of column
- Discount and charge fields: light gray background input, red asterisk for required
- Required marker: `*` in red beside the label
