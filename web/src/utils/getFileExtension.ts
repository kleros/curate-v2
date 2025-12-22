/**
 * Supported file extensions.
 * Extend this union when adding new file types.
 */
export type FileExtension = "pdf" | "png" | "jpg" | "jpeg" | "webp" | "gif" | "txt";

/**
 * Mapping of MIME types to their most common file extensions.
 * Note: MIME types are not guaranteed to be present or accurate.
 */
const MIME_TO_EXT: Record<string, FileExtension> = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "text/plain": "txt",
};

/**
 * Extracts the file extension from a File object's name.
 *
 * @param file - Browser File object
 * @returns The lowercase file extension, or null if not detectable
 *
 * @example
 * getExtensionFromFilename(file) // "pdf"
 */
export function getExtensionFromFilename(file: File): FileExtension | null {
  const name = file.name?.trim();
  if (!name) return null;

  const lastDot = name.lastIndexOf(".");
  if (lastDot <= 0) return null; // handles ".env", "README"

  return name.slice(lastDot + 1).toLowerCase() as FileExtension;
}

/**
 * Infers the file extension from the MIME type reported by the browser.
 *
 * @param file - Browser File object
 * @returns The inferred extension, or null if unsupported or missing
 *
 * @example
 * file.type === "application/pdf" → "pdf"
 */
export function getExtensionFromMime(file: File): FileExtension | null {
  if (!file.type) return null;
  return MIME_TO_EXT[file.type] ?? null;
}

/**
 * Determines the file extension by inspecting magic bytes
 * (file signature) from the beginning of the file.
 *
 * Only a small slice of the file is read for performance reasons.
 *
 * @param file - Browser File object
 * @returns The detected extension, or null if unknown
 *
 * @example
 * await getExtensionFromMagicBytes(file) // "pdf"
 */
export async function getExtensionFromMagicBytes(file: File): Promise<FileExtension | null> {
  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // PDF: %PDF
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return "pdf";
  }

  // PNG
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return "png";
  }

  // JPEG
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    return "jpg";
  }

  // WEBP (RIFF....WEBP)
  if (
    bytes[0] === 0x52 && // R
    bytes[1] === 0x49 && // I
    bytes[2] === 0x46 && // F
    bytes[3] === 0x46 && // F
    bytes[8] === 0x57 && // W
    bytes[9] === 0x45 && // E
    bytes[10] === 0x42 && // B
    bytes[11] === 0x50 // P
  ) {
    return "webp";
  }

  // GIF
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return "gif";
  }

  return null;
}

/**
 * Resolves a file's extension using a safe, layered strategy:
 *
 * 1. Filename (fast, user-intended)
 * 2. MIME type (browser-provided)
 * 3. Magic bytes (most trustworthy)
 *
 * @param file - Browser File object
 * @returns The resolved file extension, or null if unsupported
 *
 * @example
 * const ext = await getFileExtension(file);
 * if (!ext) throw new Error("Unsupported file type");
 */
export async function getFileExtension(file: File): Promise<FileExtension | null> {
  return getExtensionFromFilename(file) ?? getExtensionFromMime(file) ?? (await getExtensionFromMagicBytes(file));
}
