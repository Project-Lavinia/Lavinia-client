/**
 * Delay that is multiplied by attempt number.
 * Rationale: 1*4 + 2*4 + 3*4 + 4*4 + 5*4 = 60
 * which is equal to the timeout duration
 */
const iterativeDelay = 4000;
const maxNumberOfAttempts = 5;

function isSuccessful(responseCode: number): boolean {
    return responseCode >= 200 && responseCode < 300;
}

export interface RequestResult<T> {
    httpStatus?: string | undefined;
    data: Promise<T> | T;
}

/**
 * Attempts to parse the HTTP response for how long
 * to delay the next fetch in milliseconds.
 *
 * If unable to find a time, it returns the default delay provided.
 *
 * @param response HTTP response to parse
 * @param defaultDelay Default time to wait (in ms)
 */
function parseRetryHeaderToMs(response: Response, defaultDelay: number): number {
    const retryHeader = response.headers.get("retry-after");

    if (retryHeader === null) {
        return defaultDelay;
    }

    const numSeconds = Number(retryHeader);
    if (Number.isFinite(numSeconds)) {
        return Math.max(0, numSeconds * 1000);
    }

    const retryDate = Date.parse(retryHeader);
    if (Number.isNaN(retryDate)) {
        return defaultDelay;
    }

    const waitTime = retryDate - Date.now();
    return Math.max(0, waitTime);
}

async function attemptRequest<T>(uri: string, attemptNumber: number): Promise<T> {
    const response = await fetch(uri).catch((reason: Error) => {return reason.message});
    console.log(attemptNumber);

    if (typeof response !== "string" && isSuccessful(response.status)) {
        return response.json() as Promise<T>;
    }

    if (attemptNumber > maxNumberOfAttempts) {
        if (typeof response !== "string") {
            throw new Error(response.statusText);
        } else {
            throw new Error(response);
        }
    }

    if (typeof response !== "string" && response.status === 429) {
        const delay = parseRetryHeaderToMs(response, 10000);
        await new Promise((resolve) => setTimeout(resolve, delay));
    } else {
        await new Promise((resolve) => setTimeout(resolve, attemptNumber * iterativeDelay));
    }

    return attemptRequest(uri, ++attemptNumber);
}

/**
 * Attempts to request a set of information from the URI specified.
 *
 * @param uri The uri to attempt to request data from
 */
export async function request<T>(uri: string): Promise<T> {
    return attemptRequest(uri, 1);
}
