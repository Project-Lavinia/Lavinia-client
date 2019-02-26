import { RootState } from "../reducers";
import { Version } from "./version";

/**
 * Loads the state from localStorage.
 *
 * @returns state if all goes well, else undefined.
 */
export const loadState = () => {
    try {
        const serializedState = localStorage.getItem("state");
        if (serializedState === null) {
            return undefined;
        }
        console.log("State loaded from local storage");
        return JSON.parse(serializedState) as RootState;
    } catch (err) {
        return undefined;
    }
};

/**
 * Saves the state given as parameter to localStorage.
 *
 * @param state state to save to localStorage.
 */
export const saveState = (state: RootState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("state", serializedState);
        console.log("State saved to local storage");
    } catch (err) {
        console.error(err);
    }
};

/**
 * Loads the persisted version from localStorage.
 *
 * @returns a Version if it exists, else undefined.
 */
export function loadVersion() {
    try {
        const serializedVersion = localStorage.getItem("version");
        if (serializedVersion == null) {
            return undefined;
        }
        return JSON.parse(serializedVersion) as Version;
    } catch (err) {
        return undefined;
    }
}

/**
 * Saves the version received as parameter to localStorage.
 *
 * @param version version to save
 */
export function saveVersion(version: Version) {
    try {
        const serializedVersion = JSON.stringify(version);
        localStorage.setItem("version", serializedVersion);
    } catch (err) {
        console.error(err);
    }
}
