import * as React from "react";
import {
    ElectionOverview,
    DistrictOverview,
    SeatsPerParty,
    SeatDistribution,
    SingleDistrict,
    LevellingSeatOverview
} from ".";
import {
    getDistrictTableData,
    getPartyTableData,
    getSeatDistributionData,
    getSeatsPerPartyData,
    roundPartyResults,
    flattenPartyRestQuotients,
    removeSeatDuplicates,
    sortSeatsByNumber,
    getRoundsAssignedSeats
} from "./presentation-utilities";
import { RemainderQuotients } from "./RemainderQuotients/RemainderQuotients";
import { toMax } from "../../utilities/reduce";
import { LagueDhontResult, PartyResult, DistrictResult } from "../../computation";
import { PresentationType, DisproportionalityIndex } from "./presentation-models";

export interface PresentationProps {
    currentPresentation: PresentationType;
    districtSelected: string;
    decimals: number;
    showPartiesWithoutSeats: boolean;
    results: LagueDhontResult;
    disproportionalityIndex: DisproportionalityIndex;
    comparisonPartyResults: PartyResult[];
}

export class Presentation extends React.Component<PresentationProps, {}> {
    getPartyTableData(): PartyResult[] {
        return getPartyTableData(
            this.props.results.partyResults,
            this.props.showPartiesWithoutSeats,
            this.props.decimals
        );
    }

    getDistrictTableData(): DistrictResult[] {
        return getDistrictTableData(this.props.results.districtResults, this.props.decimals);
    }

    getSeatDistributionData(): DistrictResult[] {
        return getSeatDistributionData(
            this.props.results.districtResults,
            this.props.results.partyResults,
            this.props.showPartiesWithoutSeats
        );
    }

    getSeatsPerPartyData(): PartyResult[] {
        return getSeatsPerPartyData(this.props.results.partyResults, this.props.showPartiesWithoutSeats);
    }

    getSingleDistrictData(): DistrictResult[] {
        const data = getDistrictTableData(this.getSeatDistributionData(), this.props.decimals);
        const roundedData: DistrictResult[] = [];
        data.forEach((result) => {
            roundedData.push({
                ...result,
                partyResults: roundPartyResults(result.partyResults, this.props.decimals)
            });
        });
        return roundedData;
    }

    getPartyCodes(): string[] {
        const partyCodes: string[] = [];
        this.props.results.partyResults.forEach((party) => {
            partyCodes.push(party.partyCode);
        });
        return partyCodes;
    }

    getPartyNames(): string[] {
        const partyNames: string[] = [];
        this.props.results.partyResults.forEach((party) => {
            partyNames.push(party.partyName);
        });
        return partyNames;
    }

    getDistricts(): string[] {
        const districts: string[] = [];
        this.props.results.districtResults.forEach((district) => {
            districts.push(district.name);
        });
        return districts;
    }

    getWidestStringWidth(strings: string[] = []): number {
        return strings.map((value) => value.length).reduce(toMax, 0)!;
    }

    getLevellingSeats() {
        const flattened = flattenPartyRestQuotients(this.props.results.levelingSeatDistribution);
        const assignedSeats = getRoundsAssignedSeats(flattened);
        const noDuplicateSeats = removeSeatDuplicates(assignedSeats);
        return sortSeatsByNumber(noDuplicateSeats);
    }

    render() {
        switch (this.props.currentPresentation) {
            case PresentationType.ElectionTable:
                return (
                    <ElectionOverview
                        partyResults={this.getPartyTableData()}
                        decimals={this.props.decimals}
                        partyNameWidth={this.getWidestStringWidth(this.getPartyNames())}
                        disproportionalityIndex={this.props.disproportionalityIndex}
                    />
                );
            case PresentationType.DistrictTable:
                return (
                    <DistrictOverview
                        districtResults={this.getDistrictTableData()}
                        districtWidth={this.getWidestStringWidth(this.getDistricts())}
                        decimals={this.props.decimals}
                    />
                );
            case PresentationType.SeatDistribution:
                return (
                    <SeatDistribution
                        districtResults={this.getSeatDistributionData()}
                        districtWidth={this.getWidestStringWidth(this.getDistricts())}
                    />
                );
            case PresentationType.SeatsPerParty:
                return <SeatsPerParty partyResults={this.getSeatsPerPartyData()} />;
            case PresentationType.SingleDistrict:
                return (
                    <SingleDistrict
                        districtSelected={this.props.districtSelected}
                        districtResults={this.getSingleDistrictData()}
                        decimals={this.props.decimals}
                        disproportionalityIndex={this.props.disproportionalityIndex}
                    />
                );
            case PresentationType.RemainderQuotients:
                return (
                    <RemainderQuotients
                        districtResults={this.getSeatDistributionData()}
                        levellingSeats={this.getLevellingSeats()}
                        decimals={this.props.decimals}
                        showPartiesWithoutSeats={this.props.showPartiesWithoutSeats}
                    />
                );
            case PresentationType.LevellingSeats:
                return <LevellingSeatOverview levellingSeatQuotients={this.props.results.levelingSeatDistribution} />;
            default:
                console.log(`Could not find presentation type ${this.props.currentPresentation}`);
                return <g />;
        }
    }
}
