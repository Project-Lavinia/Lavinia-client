import axios from "axios";
import { AxiosResponse, AxiosError } from "axios";

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

    while (data == defaultValue && attempt < 5) {
        await axios
            .get(uri)
            .then((res: AxiosResponse) => {
                data = res.data as T;
            })
            .catch((reason: AxiosError) => {
                console.error(`Request to ${uri} failed with\n${reason}`);
            });

        if (data == defaultValue) {
            console.log("Requesting: " + uri + " attempt: " + ++attempt);
            await new Promise(resolve => setTimeout(resolve, 30000));
        }
    }
    return data;
}
