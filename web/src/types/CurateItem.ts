import { z } from "zod";

export const curateItemSchema = z.object({
  columns: z.array(
    z.object({
      label: z.string(),
      description: z.string(),
      isIdentifier: z.boolean().optional(),
      type: z.string(),
    })
  ),
  values: z.record(z.string(), z.string()),
});

export type CurateItem = z.infer<typeof curateItemSchema>;
