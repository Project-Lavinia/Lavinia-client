/**
 * Delay that is multiplied by attempt number.
 * Rationale: 1*4 + 2*4 + 3*4 + 4*4 + 5*4 = 60
 * which is equal to the timeout duration
 */
const iterativeDelay = 4000;
const maxNumberOfAttempts = 5;

function handleError(uri: string, reason: any) {
    console.error(`Request to ${uri} failed with\n${reason}`);
}

function isSuccessful(responseCode: number): boolean {
    return responseCode >= 200 && responseCode < 300;
}

async function parseData<T>(response: Response, defaultValue: T): Promise<T> {
    try {
        const json = await response.json();
        const result: T = JSON.parse(json);
        return result;
    } catch (ex) {
        return defaultValue;
    }
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
        return numSeconds * 1000 || defaultDelay;
    }

    const retryDate = Date.parse(retryHeader);
    if (Number.isNaN(retryDate)) {
        return defaultDelay;
    }

    const waitTime = retryDate - Date.now();
    return Math.max(0, waitTime);
}

/**
 * Attempts to request a set of information from the URI specified,
 * if something goes wrong or the returned data does not match the type
 * expected, it will return a default value specified
 *
 * @param uri The uri to attempt to request data from
 * @param defaultValue The value to return if something goes wrong
 */
export async function request<T>(uri: string, defaultValue: T): Promise<T> {
    return attemptRequest(uri, defaultValue, 1);
}

async function attemptRequest<T>(uri: string, defaultValue: T, attemptNumber: number): Promise<T> {
    const response = await fetch(uri).catch((reason) => handleError(uri, reason));

    if (response && isSuccessful(response.status)) {
        return parseData(response, defaultValue);
    }

    if (attemptNumber > maxNumberOfAttempts) {
        return defaultValue;
    }

    if (response && response.status === 429) {
        const delay = parseRetryHeaderToMs(response, 10000);
        await new Promise((resolve) => setTimeout(resolve, delay));
    } else {
        await new Promise((resolve) => setTimeout(resolve, attemptNumber * iterativeDelay));
    }

    return attemptRequest(uri, defaultValue, ++attemptNumber);
}
