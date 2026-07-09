import { loadVersion, saveVersion, loadState, loadDataVersion, saveDataVersion } from "./local-storage";

/**
 * Simple version validator.
 *
 * @param appVersion - expected app version from build metadata.
 * @param dataVersion - expected data version from build metadata.
 */
export function stateIsInvalid(appVersion?: string, dataVersion?: string) {
    const expectedVersion = resolveExpectedVersion(appVersion);
    const expectedDataVersion = resolveExpectedDataVersion(dataVersion);
    const localDataVersion = loadDataVersion();
    const localVersion = loadVersion();

    if (localDataVersion !== expectedDataVersion) {
        clearAndSave(expectedVersion, expectedDataVersion);
        return true;
    }

    if (localVersion) {
        if (isIncompatibleVersion(localVersion, expectedVersion) || !loadState()) {
            clearAndSave(expectedVersion, expectedDataVersion);
            return true;
        }
    } else {
        clearAndSave(expectedVersion, expectedDataVersion);
        return true;
    }
    return false;
}

function resolveExpectedVersion(rawVersion?: string): Version {
    if (rawVersion == null || rawVersion.trim().length === 0) {
        throw new TypeError("APP_VERSION is missing. Build configuration must inject APP_VERSION from package.json metadata.");
    }

    const [major, minor, patch] = rawVersion.split(".").map(Number);

    if (!Number.isFinite(major) || !Number.isFinite(minor) || !Number.isFinite(patch)) {
        throw new TypeError(`APP_VERSION is malformed: '${rawVersion}'. Expected semantic version format like '2.9.9'.`);
    }

    return { major, minor, patch };
}

function resolveExpectedDataVersion(dataVersion?: string): string {
    if (dataVersion == null || dataVersion.trim().length === 0) {
        throw new TypeError("DATA_VERSION is missing. Build configuration must inject DATA_VERSION from package.json metadata.");
    }

    return dataVersion;
}

/**
 * Checks whether the version passed in is compatible with the current version.
 *
 * @param version version to check against current version
 */
function isIncompatibleVersion(version: Version, expectedVersion: Version) {
    return version.major !== expectedVersion.major || version.minor !== expectedVersion.minor;
}

/**
 * Clears the localStorage, saves the current version, then returns false.
 */
function clearAndSave(version: Version, dataVersion: string) {
    localStorage.clear();
    saveVersion(version);
    saveDataVersion(dataVersion);
}

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
