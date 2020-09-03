/**
 *
 * Adds an element to the array associated with a key, or creates a new array if one does not exist yet.
 *
 * @param key The key of the value the value which will be added
 * @param value The value that will be added to the array
 */
export function mapAdd<T>(map: Map<string, T[]>, key: string, value: T): Map<string, T[]> {
    const newMap = new Map(map.entries());
    if (map.has(key)) {
        const entry = map.get(key);
        if (entry !== undefined) {
            entry.push(value);
            newMap.set(key, entry);
        }
    } else {
        newMap.set(key, [value]);
    }

    return newMap;
}

/**
 *
 * Adds all entries from a list to the map.
 *
 * @param getKey A function that returns a key from a list entry
 * @param array A list of objects that should be added to the map
 */
export function mapAddFromArray<T>(map: Map<string, T[]>, getKey: (value: T) => string, array: T[]): Map<string, T[]> {
    let newMap = new Map(map.entries());
    for (let i = 0, n = array.length; i < n; i++) {
        const entry = array[i];
        const key = getKey(entry);
        newMap = mapAdd(newMap, key, entry);
    }

    return newMap;
}

export function createMapFromObject<T>(object: { [key: string]: T }): Map<string, T> {
    const newMap = new Map<string, T>();
    for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            newMap.set(key, object[key]);
        }
    }

    return newMap;
}
