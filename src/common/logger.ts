// Lightweight logger: debug/info are silenced in production builds,
// warn/error always pass through. Components should use this instead of
// calling console.* directly so log noise can be controlled centrally.

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function enabled(level: LogLevel): boolean {
    if (import.meta.env.DEV) return true;
    return level === 'warn' || level === 'error';
}

function log(level: LogLevel, ...args: unknown[]): void {
    if (!enabled(level)) return;
    switch (level) {
        case 'debug':
            console.debug(...args);
            break;
        case 'info':
            console.info(...args);
            break;
        case 'warn':
            console.warn(...args);
            break;
        case 'error':
            console.error(...args);
            break;
    }
}

export const logger = {
    debug: (...args: unknown[]) => log('debug', ...args),
    info: (...args: unknown[]) => log('info', ...args),
    warn: (...args: unknown[]) => log('warn', ...args),
    error: (...args: unknown[]) => log('error', ...args),
};
