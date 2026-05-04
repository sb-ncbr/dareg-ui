# Tokenized Search Date Picker — Implementation Plan

## 1. Analysis

### 1.1 Current Architecture

| Concern               | Current State                                                                                                                                                                                         |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Field Types**       | `InputType = "string" \| "number" \| "boolean" \| "date" \| "matrix"` is already defined. Date fields are identified by `field.inputType === "date"`.                                                 |
| **Token Building**    | `buildToken` in `tokenized-search.tsx` (lines 266–290) already casts date strings to `Date` objects: `const d = new Date(v); castedValue = isNaN(d.getTime()) ? v : d;`.                              |
| **API Serialization** | `buildApiQueryParamsFromTokens` in `search-api-service.tsx` (lines 214–226) detects `token.value instanceof Date` and converts it to an ISO string via `.toISOString()`.                              |
| **Value Input Stage** | When `popoverContentState === "enter_value"`, the `PopoverContent` renders API suggestions and a free-text option below. The actual `<input>` lives inside the `PopoverTrigger`.                      |
| **State Management**  | The main `SearchBar` component uses local `useState` for `model`, `field`, `operator`, and `inputValue`. The `useTokenBuilder` hook exists but is **not imported or consumed** by the main component. |
| **Existing Calendar** | `src/components/ui/calendar.tsx` is a shadcn/ui wrapper around `react-day-picker` v9, fully styled and ready for `mode="single"`.                                                                     |
| **Date Display**      | `formatTokenDisplayValue` in `src/utils/token-display.ts` handles date **ranges** (`{ from, to }`) but does not yet format a single `Date` token value.                                               |

### 1.2 Gaps Identified

1. **No visual date picker** is shown when a date-typed field reaches the `enter_value` stage; users must type dates manually.
2. **Suggestion API calls are fired for date fields**, returning irrelevant text suggestions that clutter the dropdown.
3. **No dedicated `Date` state** exists in the component; everything flows through `inputValue: string`, which forces re-parsing and loses the original `Date` object.
4. **Token display formatting** for single `Date` values falls back to `String(token.displayValue)`, which can render as an unparsed ISO string.

---

## 2. Proposed Changes

### 2.1 High-Level Flow

```
User selects date field (e.g. "Created (date)") + operator (e.g. "<")
        │
        ▼
State reaches "enter_value"
        │
        ▼
PopoverContent checks field.inputType === "date"
        │
        ├─► Yes → Render inline Calendar (mode="single") above suggestions
        │         User clicks a day
        │         ├─ setSelectedDate(date)
        │         ├─ setInputValue(date.toLocaleDateString("cs-CZ"))
        │         │
        │         ▼
        │         User presses Enter OR clicks "Add Filter"
        │         ├─ buildToken prioritizes selectedDate for token.value
        │         ├─ displayValue = selectedDate.toLocaleDateString("cs-CZ")
        │         │
        │         ▼
        │         Token added → API query built → Search executed
        │
        └─► No  → Render standard text suggestions (unchanged)
```

### 2.2 UI/UX Decisions

- **Inline Calendar**: Rendered directly inside the existing `PopoverContent` (no nested popover) to avoid focus-trap complexity and keep the existing blur-prevention logic (`onMouseDown={(e) => e.preventDefault()}`).
- **Single Mode**: `mode="single"` because each token represents one discrete date value. The operator (`<`, `>`, `=`, etc.) carries the semantic range meaning.
- **Manual Override Preserved**: The text input in the trigger remains active. Users can still type a date manually if they prefer. A helper hint is shown below the calendar.
- **Suggestions Suppressed**: API suggestion fetching is skipped entirely for date fields to eliminate noise.
- **Locale Display**: Dates are displayed in `cs-CZ` locale (consistent with existing `formatDate` utilities) while the API receives an ISO string.

---

## 3. File-by-File Implementation Steps

### 3.1 `src/components/tokenized-search/tokenized-search.tsx`

#### A. Import Calendar

Add to existing imports:

```typescript
import { Calendar } from "@/components/ui/calendar";
```

#### B. Add Component State

Near the other `useState` declarations (around line 82):

```typescript
const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
```

#### C. Reset `selectedDate` on State Transitions

- Inside `resetFilterBuildingState()` (around line 259):
  ```typescript
  setSelectedDate(undefined);
  ```
- Inside `handleBackspace` when clearing operator/field/model (around line 311):
  ```typescript
  setSelectedDate(undefined);
  ```
- When `setField` or `setOperator` is invoked inline (around lines 509, 514):
  ```typescript
  setSelectedDate(undefined);
  ```

#### D. Skip Suggestions for Date Fields

In the `useEffect` that calls `searchSuggestionsApi` (around line 151), add an early-return guard at the top:

```typescript
if (field?.inputType === "date") {
  setCurrentFieldSuggestions([]);
  setIsLoadingSuggestions(false);
  return;
}
```

This prevents irrelevant API calls and keeps the dropdown clean.

#### E. Enhance `buildToken`

Modify the `buildToken` `useCallback` (around line 266) to accept and prioritize the `selectedDate`:

```typescript
const buildToken = useCallback(
  (v: string) => {
    if (!model || !field || !operator || v === "") return null;

    let castedValue: string | number | Date | boolean;
    let displayValue: string = v;

    if (field.inputType === "number") {
      const num = Number(v);
      castedValue = Number.isFinite(num) ? num : v;
    } else if (field.inputType === "date") {
      if (selectedDate) {
        castedValue = selectedDate;
        displayValue = selectedDate.toLocaleDateString("cs-CZ");
      } else {
        const d = new Date(v);
        castedValue = isNaN(d.getTime()) ? v : d;
      }
    } else if (v.toLowerCase() === "true" || v.toLowerCase() === "false") {
      castedValue = v.toLowerCase() === "true";
    } else {
      castedValue = v;
    }

    return {
      model,
      field: field.key,
      operator,
      value: castedValue,
      displayValue,
    } as Token;
  },
  [model, field, operator, selectedDate],
);
```

> **Rationale**: By keeping `selectedDate` in component state, we avoid re-parsing a locale string back into a `Date`. The token carries the exact `Date` object chosen from the calendar, ensuring accurate ISO serialization in the API layer.

#### F. Render Inline Calendar in `enter_value` Popover Content

Inside the `operator && popoverContentState === "enter_value"` block (around line 986), insert a conditional calendar block **above** the suggestions area:

```tsx
{
  field?.inputType === "date" && (
    <div className="flex justify-center border rounded-md p-2 bg-background">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          if (date) {
            setSelectedDate(date);
            setInputValue(date.toLocaleDateString("cs-CZ"));
          }
        }}
        initialFocus
      />
    </div>
  );
}
```

#### G. Conditional Suggestions Rendering for Date Fields

When `field?.inputType === "date"`, replace the standard suggestions list with a concise helper message. Keep the **Add Filter** button visible.

Replace the suggestions block (around lines 995–1101) with a conditional:

```tsx
{
  field?.inputType === "date" ? (
    <div className="text-xs text-gray-500 text-center py-2">
      Select a date from the calendar, or type a date manually and press Enter.
    </div>
  ) : (
    <>{/* existing suggestions loading + list UI */}</>
  );
}
```

#### H. Enable "Add Filter" Button for Calendar Selection

The existing **Add Filter** button (around line 1103) is disabled when `!inputValue`. Since `setInputValue` is called when a calendar date is selected, the button will naturally become enabled. No change required here.

---

### 3.2 `src/utils/token-display.ts`

#### Enhance Single Date Formatting

Add a check at the beginning of `formatTokenDisplayValue` (before the existing date-range check):

```typescript
export function formatTokenDisplayValue(token: Token): string {
  // NEW: Handle single Date values
  if (token.value instanceof Date) {
    return token.value.toLocaleDateString("cs-CZ");
  }

  const isDateRange =
    token.value &&
    typeof token.value === "object" &&
    "from" in token.value &&
    "to" in token.value &&
    !(token.value instanceof Date);

  // ... rest of existing function unchanged
}
```

> **Rationale**: Tokens created from the calendar will have `value: Date` and `displayValue: "1. 5. 2024"`. This guard ensures that even if `displayValue` is ever an ISO string, the badge renders a human-readable date.

---

### 3.3 `src/components/tokenized-search/hooks/useTokenBuilder.ts` (Optional)

The main component does **not** currently consume this hook. However, for future compatibility (or if the component is later refactored to use it), add parity:

#### A. Extend `BuilderState`

```typescript
export interface BuilderState {
  step: BuilderStep;
  model: string | null;
  field: FilterOption | null;
  operator: Operator | null;
  value: string;
  selectedDate?: Date | undefined; // NEW
}
```

#### B. Extend Actions

Add to `BuilderAction`:

```typescript
| { type: "SET_DATE"; date: Date | undefined }
```

Add to `reducer`:

```typescript
case "SET_DATE":
  return { ...state, selectedDate: action.date };
```

Add to hook return:

```typescript
const setDate = useCallback(
  (date: Date | undefined) => dispatch({ type: "SET_DATE", date }),
  [],
);
// expose in actions object
```

---

## 4. Integration Points

| Integration Point                  | How It Connects                                                                                                                                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **shadcn/ui Calendar**             | Imported from `@/components/ui/calendar.tsx` and rendered inline with `mode="single"`. No additional popover wrapper is needed because the calendar lives inside the existing `PopoverContent`. |
| **Token Builder Hook**             | The main `SearchBar` manages state locally; `useTokenBuilder.ts` updates are optional for future consumers.                                                                                     |
| **API Query Converter**            | `buildApiQueryParamsFromTokens` already handles `token.value instanceof Date` by calling `.toISOString()`. **No changes required** in the API layer.                                            |
| **Display Formatter**              | `formatTokenDisplayValue` is updated to render single `Date` tokens in `cs-CZ` locale, ensuring badges look correct.                                                                            |
| **Suggestion System**              | An early-return in the suggestions `useEffect` prevents irrelevant API calls and empty suggestion lists for date fields.                                                                        |
| **Existing Date Range Components** | `DoubleRangeCalendarPopover` and `DoubleRangeCalendar` (used in `enhanced-filter-dialog.tsx`) are **not affected**. This plan targets only the single-date tokenized search flow.               |

---

## 5. Edge Cases

| Edge Case                                                          | Handling Strategy                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User types an invalid date manually**                            | `buildToken` falls back to the raw string when `new Date(v)` returns `Invalid Date`. The API receives a string; backend behavior degrades gracefully.                                                                                                                                                          |
| **User clears input after picking a calendar date**                | `selectedDate` remains in state, but `buildToken` guards against `v === ""` and returns `null`. The token is not created until the input is non-empty or the user re-selects a date.                                                                                                                           |
| **Timezone offset (local vs UTC)**                                 | `selectedDate` is a local `Date` object. `buildApiQueryParamsFromTokens` calls `.toISOString()`, converting to UTC. This is acceptable because the backend expects ISO timestamps. If strict local-midnight semantics are ever required, format explicitly to `YYYY-MM-DDT00:00:00.000Z` in the API converter. |
| **Popover closes when clicking calendar**                          | The existing `PopoverContent` has `onMouseDown={(e) => e.preventDefault()}`, which prevents the input blur from closing the popover. Clicking a calendar day is safe.                                                                                                                                          |
| **Keyboard-only users**                                            | The `Calendar` component supports full keyboard navigation (arrow keys, Enter to select, Page Up/Down for months). The text input remains focusable for manual entry. The `initialFocus` prop auto-focuses the calendar grid when it appears.                                                                  |
| **Rapid field/operator switching**                                 | `selectedDate` is reset whenever `field` or `operator` changes (via `setSelectedDate(undefined)`), preventing a stale date from being attached to the wrong filter.                                                                                                                                            |
| **Date field with any operator (`=`, `<`, `>`, `<=`, `>=`)**       | All operators use the same single-date picker. The operator itself defines the semantic meaning. No per-operator UI branching is needed.                                                                                                                                                                       |
| **Mobile / small viewports**                                       | The calendar renders inside the popover, whose width is `w-[var(--radix-popover-trigger-width)]`. The `Calendar` component uses `w-fit` by default; ensure the container allows horizontal centering (`flex justify-center`) to prevent clipping on narrow screens.                                            |
| **User presses Backspace from `enter_value` with a selected date** | `handleBackspace` clears `operator` and calls `setSelectedDate(undefined)`, returning the user to the operator selection step with a clean state.                                                                                                                                                              |

---

## 6. Architecture Diagram

```mermaid
flowchart TD
    A[User selects date field + operator] --> B{State == 'enter_value'?}
    B -->|Yes| C{field.inputType == 'date'?}
    C -->|Yes| D[Render inline Calendar<br/>mode=single above suggestions]
    C -->|No| E[Render standard text suggestions]
    D --> F[User clicks a date]
    F --> G[setSelectedDate(date)]
    G --> H[setInputValue(date.toLocaleDateString)]
    H --> I[User presses Enter<br/>or clicks Add Filter]
    I --> J[buildToken uses selectedDate<br/>for value & displayValue]
    J --> K[Token appended to tokens[]]
    K --> L[buildApiQueryParamsFromTokens<br/>converts Date → ISO string]
    L --> M[API Search executed]
    E --> N[Existing text flow unchanged]
```

---

## 7. Summary of Changes

| File                                                              | Change Type | Description                                                                                                                                 |
| ----------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/tokenized-search/tokenized-search.tsx`            | Modify      | Add `selectedDate` state, reset logic, suggestion skip for dates, enhanced `buildToken`, inline Calendar render, conditional suggestion UI. |
| `src/utils/token-display.ts`                                      | Modify      | Add `token.value instanceof Date` formatting at the top of `formatTokenDisplayValue`.                                                       |
| `src/components/tokenized-search/hooks/useTokenBuilder.ts`        | Optional    | Add `selectedDate` to `BuilderState`, reducer, and actions for future compatibility.                                                        |
| `src/components/ui/calendar.tsx`                                  | None        | Consumed as-is; no modifications needed.                                                                                                    |
| `src/components/tokenized-search/types/search-models.ts`          | None        | Types already support `Date` as a token value.                                                                                              |
| `src/components/tokenized-search/services/search-api-service.tsx` | None        | Already serializes `Date` values to ISO strings.                                                                                            |
