## Core Types

> **Note:** This product is under development. Types and schemas may change between versions.

### How they relate

**List Metadata** is defined when you _create a list_. It describes the list and, crucially, defines the **schema** (columns) that every item in that list must follow.

**Curate Item** is the format used when you _submit an item_ to a list. Each item's `columns` must match the list's schema, and `values` holds the actual data for each column.

```
List created → List metadata (JSON string) emitted via ListMetadataSet
                         ↓
User submits item → CurateItem (JSON string) passed to contract
                         ↓
Contract emits JSON in events; subgraph parses into Registry + Item + ItemProp
```

---

### List Metadata

Defined when creating a list. Stored as JSON string; the contract emits it via `ListMetadataSet`. The subgraph parses the JSON into `Registry` + `FieldProp` entities.

| Field                        | Purpose                                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| `title`, `description`       | List display info                                                                              |
| `itemName`, `itemNamePlural` | Singular/plural labels for items (e.g. "Token" / "Tokens") — used in UI and dispute templates  |
| `logoURI`, `policyURI`       | Optional links                                                                                 |
| `isListOfLists`              | When `true`, items are sub-list contract addresses                                             |
| `columns`                    | **Schema for all items** — each item in this list must have these columns with matching labels |

```typescript
interface ListMetadata {
  title: string;
  description: string;
  itemName: string;
  itemNamePlural: string;
  logoURI?: string;
  policyURI?: string;
  isListOfLists?: boolean;
  columns: Array<{
    label: string;
    description: string;
    type: string; // e.g. "text", "address", "url"
    isIdentifier?: boolean; // up to 5; used for search indexing (key0..key4)
  }>;
}
```

---

### Curate Item

Format for submitting an item to a list. The item's `columns` must match the list's `columns` schema. The contract receives a JSON string and emits it in `NewItem` events. The subgraph parses the JSON into `Item` + `ItemProp` entities.

| Field     | Purpose                                                                 |
| --------- | ----------------------------------------------------------------------- |
| `columns` | Must mirror the list's columns (same labels, types). Defines structure. |
| `values`  | Actual data: `{ [column.label]: string }`                               |

```typescript
interface CurateItem {
  columns: Array<{
    label: string;
    description: string;
    type: string;
    isIdentifier?: boolean;
  }>;
  values: Record<string, string>; // key = column label, value = string
}
```

**Example** (for a list whose schema has `Name` and `URL` columns):

```json
{
  "columns": [
    { "label": "Name", "description": "Item name", "type": "text", "isIdentifier": true },
    { "label": "URL", "description": "Item URL", "type": "url" }
  ],
  "values": {
    "Name": "Example",
    "URL": "https://example.com"
  }
}
```

- `itemID` = `keccak256(abi.encodePacked(string))` — hash of the exact string passed to `addItem`/`addItemDirectly`
- Entity ID format: `<itemID>@<listAddress>`

---

### Item Status

| Status                  | Meaning                          |
| ----------------------- | -------------------------------- |
| `absent`                | Not on list, no pending requests |
| `registered`            | On list, no pending requests     |
| `registrationRequested` | Pending add request              |
| `clearingRequested`     | Pending removal request          |

---

## Dispute Templates

Located in `templates/` (`@kleros/curate-v2-templates`).

- **Registration:** disputing add requests — "Does the {{itemName}} comply?" → Yes, Add It / No, Don't Add It
- **Removal:** disputing remove requests — same question → Yes, Remove It / No, Don't Remove It
- **Data mappings:** GraphQL + JSON to populate placeholders from subgraph and item JSON

---

## Quick Reference

| Concept               | Location                                         |
| --------------------- | ------------------------------------------------ |
| Item schema           | `web/src/types/CurateItem.ts`                    |
| List metadata schema  | `web/src/types/ListMetadata.ts`                  |
| Subgraph schema       | `subgraph/schema.graphql`                        |
| Dispute templates     | `templates/index.ts`                             |
| Item parsing logic    | `subgraph/src/entities/Item.ts`                  |
| List metadata parsing | `subgraph/src/Curate.ts` (handleListMetadataSet) |

**Schemas may change.** Validate at runtime; prefer the Zod schemas in `web/src/types/` when available.
