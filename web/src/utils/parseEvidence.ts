import { evidenceSchema } from "src/types/Evidence";

export const parseEvidence = (stringifiedEvidence: string) => {
  try {
    const parsedJson = JSON.parse(stringifiedEvidence);
    return evidenceSchema.parse(parsedJson);
  } catch (error) {
    console.log(`Unable to parse evidence: ${stringifiedEvidence}`);
    return;
  }
};
