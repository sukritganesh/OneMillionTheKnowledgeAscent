/** Additive, portable question media. Imported bytes travel with the question snapshot. */
export interface QuestionMedia {
  readonly kind: 'image' | 'video';
  readonly src: string;
  readonly mimeType: 'image/jpeg' | 'image/png' | 'image/webp' | 'video/mp4' | 'video/webm';
  readonly alt: string;
  /** A non-spoiling description of motion and any speech/sounds; required for video. */
  readonly description?: string;
  readonly credit: string;
  readonly license: string;
  readonly sourceUrl: string;
}

export const MAX_EMBEDDED_MEDIA_BYTES = 1024 * 1024;
export const BUNDLED_MEDIA_PATH = /^\/question-media\/([a-f0-9]{64})\.(jpg|png|webp|mp4|webm)$/;
const extensions: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'video/mp4': 'mp4', 'video/webm': 'webm' };
const plainText = (value: unknown, max: number): value is string => typeof value === 'string' && value.trim().length > 0 && value.length <= max && !/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value);

export function isMediaSourceUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 2000) return false;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
}

/** Checks signatures, not codecs: malformed/unsupported streams still get a friendly player error. */
export function mediaBytesMatch(bytes: Uint8Array, mime: string): boolean {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  if (mime === 'image/jpeg') return bytes.length > 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (mime === 'image/png') return [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value);
  if (mime === 'image/webp') return ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP';
  if (mime === 'video/mp4') return bytes.length >= 12 && ascii(4, 8) === 'ftyp';
  return mime === 'video/webm' && [26, 69, 223, 163].every((value, index) => bytes[index] === value);
}

export function questionMediaError(value: unknown, embeddedOnly = false): string | null {
  if (value === undefined) return null;
  if (!Array.isArray(value) || value.length < 1 || value.length > 3) return 'Media must contain one to three items, or be omitted.';
  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return 'Each media item must be an object.';
    const m = item as Record<string, unknown>;
    if (!['image', 'video'].includes(String(m.kind)) || typeof m.mimeType !== 'string' || !Object.hasOwn(extensions, m.mimeType) || !m.mimeType.startsWith(`${m.kind}/`)) return 'Media kind and supported MIME type must match.';
    if (!plainText(m.alt, 500) || !plainText(m.credit, 500) || !plainText(m.license, 240) || !isMediaSourceUrl(m.sourceUrl)) return 'Media requires alt text, credit, license and an HTTPS source page.';
    if ((m.kind === 'video' || m.description !== undefined) && !plainText(m.description, 2000)) return 'Video requires a non-spoiling text description of its motion and audio.';
    if (typeof m.src !== 'string') return 'Media src must be a string.';
    const bundled = BUNDLED_MEDIA_PATH.exec(m.src);
    if (bundled && !embeddedOnly && bundled[2] === extensions[m.mimeType]) continue;
    const prefix = `data:${m.mimeType};base64,`;
    if (!m.src.startsWith(prefix)) return embeddedOnly ? 'Imported media must be embedded as a base64 data URL; remote URLs and local paths are not supported.' : 'Media must use a hashed bundled path or a base64 data URL.';
    const encoded = m.src.slice(prefix.length);
    if (encoded.length > Math.ceil(MAX_EMBEDDED_MEDIA_BYTES / 3) * 4 || encoded.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) return 'Embedded media must be valid base64 and no larger than 1 MiB per item.';
    const decoded = atob(encoded);
    if (decoded.length > MAX_EMBEDDED_MEDIA_BYTES || !mediaBytesMatch(Uint8Array.from(decoded.slice(0, 16), (c) => c.charCodeAt(0)), m.mimeType)) return 'Media bytes do not match the declared type or exceed 1 MiB.';
  }
  return null;
}

/** Whitelist fields; never carry untrusted extras into saves or exports. */
export function copyQuestionMedia(media: readonly QuestionMedia[]): QuestionMedia[] {
  return media.map((m) => ({ kind: m.kind, src: m.src, mimeType: m.mimeType, alt: m.alt, ...(m.description ? { description: m.description } : {}), credit: m.credit, license: m.license, sourceUrl: m.sourceUrl }));
}
