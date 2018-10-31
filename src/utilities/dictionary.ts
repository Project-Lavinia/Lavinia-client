export interface Dictionary<T> {
    [key: string]: T;
}

export function dictionaryToArray<T>(dictionary: Dictionary<T>): T[] {
    const array: T[] = [];

    for (const key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            array.push(dictionary[key]);
        }
    }

    return array;
}
