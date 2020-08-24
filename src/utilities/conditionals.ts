/**
 * Determines wether or not the 2005 reform applies to the given election.
 *
 * @param year The year to check
 */
export function reform2005Applies(year: number): boolean {
    return year >= 2005;
}
