import { z } from "zod";
import { curateItemSchema } from "./CurateItem";

/**
 * @description Curate Regisrty's metadata
 * @example 
 * {
  "title": "Random list",
  "description": "A random list",
  "columns": [
    {
      "label": "item",
      "description": "a",
      "type": "text",
      "isIdentifier": true,
    }
  ],
  "logoURI": "/ipfs/Qmb9SGhBKCWVuxGTnszb5xS4zjrRpHLHW43Lg5LQYd9cjg/96962-fox-gourmet.png",
  "policyURI": "/ipfs/QmQbDLDs8KZAoccJhBUMGorozb5nkjki5k4pFWso4jmvsZ/file-example_PDF_500_kB.pdf",
  "itemName": "Item",
  "itemNamePlural": "Items"
}
 */
export const listMetadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  itemName: z.string(),
  itemNamePlural: z.string(),
  logoURI: z.string().optional(),
  policyURI: z.string().optional(),
  isListsOfLists: z.string().optional(),
  columns: curateItemSchema.shape.columns,
});

export type ListMetadata = z.infer<typeof listMetadataSchema>;
