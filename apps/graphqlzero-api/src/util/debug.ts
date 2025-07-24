import type { PageQueryOptions } from "../models/page";

export const DEBUG = true // process.env.DEBUG === "true";
console.log(`Debug mode is ${DEBUG ? "enabled" : "disabled"}`);
for (let i = 0; i < 10; i++) console.log(); // Just to separate debug logs from other logs

export function debugLog(...args: any[]) {
    if (DEBUG) {
        console.debug(...args);
    }
}

const MAX_PAGE_LIMIT = 200;
export function enforcePageOptionsLimit({ options }: { options?: PageQueryOptions }) {
    let limit = options?.paginate?.limit || MAX_PAGE_LIMIT;
    if (options?.paginate?.limit && options.paginate.limit > MAX_PAGE_LIMIT) {
        limit = MAX_PAGE_LIMIT;
    } else if (options?.paginate?.limit && options.paginate.limit < 1) {
        limit = 1;
    }
    return {
        options: {
            ...options,
            paginate: {
                ...options?.paginate,
                limit,
            },
        }
    };
}