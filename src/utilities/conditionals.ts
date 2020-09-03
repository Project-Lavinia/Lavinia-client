import { ComputationMenuPayload, ComputationMenuComparison } from "../Layout/ComputationMenu/computation-menu-models";

/**
 * Determines wether or not the 2005 reform applies to the given election.
 *
 * @param year The year to check
 */
export function reform2005Applies(year: number): boolean {
    return year >= 2005;
}

/**
 * Helper function to check if settings have changed.
 * @param settingsPayload The current chosen settings
 * @param comparison The original election settings
 */
export function settingsChanged(settingsPayload: ComputationMenuPayload, comparison: ComputationMenuComparison) {
   return (
       settingsPayload.algorithm !== comparison.algorithm ||
       comparison.firstDivisor !== settingsPayload.firstDivisor ||
       settingsPayload.electionThreshold !== comparison.electionThreshold ||
       comparison.districtThreshold !== settingsPayload.districtThreshold ||
       settingsPayload.levelingSeats !== comparison.levelingSeats ||
       settingsPayload.districtSeats !== comparison.districtSeats ||
       comparison.areaFactor !== settingsPayload.areaFactor
   );
}

export function boolify(input: any): boolean {
    const inverted = !input;
    const reverted = !inverted;
    return reverted;
}