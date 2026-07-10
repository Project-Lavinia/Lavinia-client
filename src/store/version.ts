import { loadVersion, saveVersion, loadState, loadDataVersion, saveDataVersion } from "./local-storage";

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

function isValidSemver(major: number, minor: number, patch: number): boolean {
    return Number.isFinite(major) && Number.isFinite(minor) && Number.isFinite(patch);
}

function resolveExpectedVersion(rawVersion?: string): Version {
    if (rawVersion == null || rawVersion.trim().length === 0) {
        throw new TypeError("APP_VERSION is missing. Build configuration must inject APP_VERSION from package.json metadata.");
    }

    const [major, minor, patch] = rawVersion.split(".").map(Number);

    if (!isValidSemver(major, minor, patch)) {
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

function isIncompatibleVersion(version: Version, expectedVersion: Version) {
    return version.major !== expectedVersion.major || version.minor !== expectedVersion.minor;
}

function clearAndSave(version: Version, dataVersion: string) {
    localStorage.clear();
    saveVersion(version);
    saveDataVersion(dataVersion);
}

function localStateMatchesExpected(expectedVersion: Version, expectedDataVersion: string): boolean {
    const localVersion = loadVersion();
    return loadDataVersion() === expectedDataVersion
        && !!localVersion
        && !isIncompatibleVersion(localVersion, expectedVersion)
        && !!loadState();
}

/**
 * Simple version validator.
 *
 * @param appVersion - expected app version from build metadata.
 * @param dataVersion - expected data version from build metadata.
 */
export function stateIsInvalid(appVersion?: string, dataVersion?: string) {
    const expectedVersion = resolveExpectedVersion(appVersion);
    const expectedDataVersion = resolveExpectedDataVersion(dataVersion);

    if (localStateMatchesExpected(expectedVersion, expectedDataVersion)) {
        return false;
    }
    clearAndSave(expectedVersion, expectedDataVersion);
    return true;
}
