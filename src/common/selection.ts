// Pure helpers around file selection (checkbox state).
// Type-only imports keep this module runnable directly under node:test.

import type { File } from '@/utils/dataTypedef';

// Return only files whose checked flag is true.
export function filterCheckedFiles(files: File[]): File[] {
    return files.filter(file => file.checked === true);
}

// Clear the checked flag on every file (in place).
export function clearChecked(files: File[]): void {
    for (const file of files) {
        file.checked = false;
    }
}

// Collect the ids of all checked files.
export function checkedFileIds(files: File[]): number[] {
    return filterCheckedFiles(files).map(file => file.id);
}
