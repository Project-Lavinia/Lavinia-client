import { loadVersion, saveVersion, loadState } from "./local-storage";

/**
 * Simple version validator.
 *
 * @param localVersion - version stored in localStorage.
 * @param appVersion - version from the application.
 */
export function stateIsInvalid() {
    const localVersion = loadVersion();
    if (localVersion) {
        if (isIncompatibleVersion(localVersion) || !loadState()) {
            clearAndSave();
            return true;
        }
    } else {
        clearAndSave();
        return true;
    }
    return false;
}

/**
 * Checks whether the version passed in is compatible with the current version.
 *
 * @param version version to check against current version
 */
function isIncompatibleVersion(version: Version) {
    return version.major !== currentVersion.major || version.minor !== currentVersion.minor;
}

/**
 * Clears the localStorage, saves the current version, then returns false.
 */
function clearAndSave() {
    localStorage.clear();
    saveVersion(currentVersion);
}

/**
 * The current version of the application.
 *
 * NB: This MUST be updated with any breaking state change!
 *
 * TODO: Configure this to be grabbed from package.json
 */
export const currentVersion: Version = {
    major: 2,
    minor: 9,
    patch: 0,
};

export interface Version {
    /**
     * Identifies which version of the application (model/API) was used. Used
     * in combination with the minor version number to check if state needs to
     * be reset.
     */
    major: number;
    /**
     * Identifies which state version relative to the major version was used,
     * causing potentially breaking changes requiring a state reset.
     */
    minor: number;
    /**
     * Identifies whether there have been any state changes at all; presumably
     * this field is only used for debugging, as breaking
     */
    patch: number;
}
