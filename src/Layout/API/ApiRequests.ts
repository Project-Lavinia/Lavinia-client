import axios from "axios";

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
    await axios
        .get(uri)
        .then((res) => {
            data = res.data as T;
        })
        .catch((error) => {
            console.error(`Request to ${uri} failed with\n${error}`);
        });
    return data;
}
