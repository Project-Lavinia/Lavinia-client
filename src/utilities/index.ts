/**
 * Utility to help with exhaustive checking of if-else if-else and switches,
 * especially useful for reducers and components.
 *
 * @param type - type to ensure is exhaustively checked
 */
export function checkExhaustively(type: never) {
    return type;
}
