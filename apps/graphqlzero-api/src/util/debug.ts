export const DEBUG = process.env.DEBUG === "true";

export function debugLog(...args: any[]) {
    if (DEBUG) {
        console.debug(...args);
    }
}