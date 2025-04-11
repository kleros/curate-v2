import { z } from "zod";

/**
 * @description Schema for Curate Item
 * @example https://ipfs.io/ipfs/QmPoiGE34wnjzRVcSEK3gH2jL4sszyY1P2tpMeiiWFXysZ/item.json
 */
export const curateItemSchema = z.object({
  columns: z.array(
    z.object({
      label: z.string(),
      description: z.string(),
      isIdentifier: z.boolean().optional(),
      type: z.string(),
    })
  ),
  // for each columns.label, it's value as `columns.label : value`
  values: z.record(z.string(), z.string()),
});

export type CurateItem = z.infer<typeof curateItemSchema>;

export const validateItem = (data: string) => {
  try {
    const parsedData = JSON.parse(data);

    return curateItemSchema.safeParse(parsedData);
  } catch {
    return { success: false };
  }
};
