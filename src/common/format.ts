// Pure formatting helpers shared by components and the Utils facade.
// No store or network dependencies (type-only imports only) so these
// functions can run directly under node:test.

const TAG_COLORS = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
    '#F8B500',
    '#00CED1'
];

let tagColorIndex = 0;

// Return the next palette color (cycled) for newly created tags.
export function get_next_tag_color(): string {
    const color = TAG_COLORS[tagColorIndex % TAG_COLORS.length];
    tagColorIndex++;
    return color;
}

// Format a byte size as a KB/MB/GB display string.
export function gen_size_str(size: number): string {
    if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + "KB";
    }
    else if (size < 1024 * 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(2) + "MB";
    }
    else {
        return (size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }
}

// Pick a readable text color for an arbitrary capsule background:
// dark text on light backgrounds, white text otherwise.
export function tag_text_color(bgColor: string | undefined): string {
    if (!bgColor) return '#ffffff';
    const hex = bgColor.replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) return '#ffffff';
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 150 ? '#1f1f1f' : '#ffffff';
}

// Convert a tag name to its display name.
export function tagName2Display(name: string): string {
    if (!name) {
        return '';
    }
    return name;
}

// Convert Windows-style backslash paths to Linux-style slash paths.
export function convertToLinuxPath(path: string): string {
    return path.replace(/\\/g, '/');
}

// Backend returns UTC time (with Z suffix); convert to local timezone for
// display. Invalid input falls back to the raw string with 'T' replaced.
export function formatUtcToLocal(time: string | undefined): string {
    if (!time) return '';
    const d = new Date(time);
    if (isNaN(d.getTime())) return time.replace('T', ' ').slice(0, 19);
    const pad = (n: number): string => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
