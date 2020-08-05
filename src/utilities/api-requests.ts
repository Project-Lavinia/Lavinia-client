import axios, { AxiosError } from "axios";

/**
 * Delay that is multiplied by attempt number.
 * Rationale: 1*4 + 2*4 + 3*4 + 4*4 + 5*4 = 60
 * which is equal to the timeout duration
 */
const iterativeDelay = 4000;
const maxNumberOfAttempts = 5;

function handleError(uri: string, reason: AxiosError) {
    console.error(`Request to ${uri} failed with\n${reason}`);
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
    const response = await axios.get<T>(uri).catch((reason: AxiosError) => handleError(uri, reason));

    if (response && response.status === 200) {
        return response.data;
    }

    if (attemptNumber > maxNumberOfAttempts) {
        return defaultValue;
    }

    if (response && response.status === 429) {
        const retryAfter = response.headers["retry-after"];
        await new Promise((resolve) => setTimeout(resolve, retryAfter));
    } else {
        await new Promise((resolve) => setTimeout(resolve, attemptNumber * iterativeDelay));
    }

    return attemptRequest(uri, defaultValue, ++attemptNumber);
}
