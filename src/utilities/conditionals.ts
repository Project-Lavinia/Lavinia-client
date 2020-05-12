/**
 * Determines wether or not district seats should be distributed for a given year.
 *
 * @param year The year to check
 */
export function shouldDistributeDistrictSeats(year: number): boolean {
    return year >= 2005;
}
