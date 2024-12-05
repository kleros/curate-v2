export const isUndefined = (maybeObject: any): maybeObject is undefined => typeof maybeObject === "undefined";
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Checks if a string is empty or contains only whitespace.
 */
export const isEmpty = (str: string): boolean => str.trim() === "";
