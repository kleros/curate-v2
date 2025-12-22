import { z } from "zod";

// https://docs.kleros.io/developer/arbitration-development/erc-1497-evidence-standard#evidence
export const evidenceSchema = z.object({
  name: z.string(),
  description: z.string(),
  fileURI: z.string().optional(),
  fileTypeExtension: z.string().optional(),
});

export type Evidence = z.infer<typeof evidenceSchema>;
