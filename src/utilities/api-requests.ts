import axios, { AxiosError } from "axios";


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
    let data = defaultValue;
    let attempt = 0;

    while (data === defaultValue && attempt < 5) {
        const response = await axios
            .get<T>(uri)
            .catch((reason: AxiosError) => handleError(uri, reason));

        if (response) {
            if (response.status === 200) {
                data = response.data;
            } else if (response.status === 429) {
                await new Promise((resolve) => setTimeout(resolve, 30000));
            } else {
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        }
        attempt++;
    }
    return data;
}