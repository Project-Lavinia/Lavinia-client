import { Dictionary } from "../Interfaces/Utilities";

export function dictionaryToArray<T>(dictionary: Dictionary<T>): T[] {
    const array: T[] = [];

    for (const key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            array.push(dictionary[key]);
        }
    }

    return array;
}
