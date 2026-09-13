/** Folders are display metadata, never part of a question or set identity. */
export function folderPathError(value: unknown): string | null {
  if (!Array.isArray(value) || value.length > 6) return 'Use up to six folder levels.';
  for (const part of value) {
    if (typeof part !== 'string' || !part.trim() || part !== part.trim() || part.length > 80 ||
      /[\\/<>\u0000-\u001f\u007f]/.test(part) || ['.', '..', '__proto__', 'constructor', 'prototype'].includes(part)) {
      return 'Folder names must be 1–80 characters, without slashes, markup, or dot paths.';
    }
  }
  return null;
}

export function parseFolderInput(text: string): string[] {
  if (!text.trim()) return [];
  const path = text.split('/').map((part) => part.trim());
  const error = folderPathError(path);
  if (error) throw new Error(error);
  return path;
}

export function setFolder(set: { readonly folderPath?: readonly string[] }): readonly string[] {
  return !folderPathError(set.folderPath) && set.folderPath?.length ? set.folderPath : ['Unfiled'];
}

export function isWithinFolder(candidate: readonly string[], parent: readonly string[]): boolean {
  return parent.every((part, index) => candidate[index] === part);
}
