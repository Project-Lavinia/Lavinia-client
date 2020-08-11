export interface RawDictionaryEntry {
    id: number;
    key: string;
    value: number;
}

export function copyDictionary<T>(dictionary: _.Dictionary<T>): _.Dictionary<T> {
    const copy: _.Dictionary<T> = {};

    for (const entry in dictionary) {
        if (dictionary.hasOwnProperty(entry)) {
            copy[entry] = dictionary[entry];
        }
    }

    return copy;
}

export function dictionaryToArray<T>(dictionary: _.Dictionary<T>): T[] {
    const array: T[] = [];

    for (const key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            array.push(dictionary[key]);
        }
    }

    return array;
}

export function rawDictionaryToDictionary(rawDictionary: Array<RawDictionaryEntry>): _.Dictionary<number> {
    const dict: _.Dictionary<number> = {};

    rawDictionary.forEach((entry) => (dict[entry.key] = entry.value));

    return dict;
}
