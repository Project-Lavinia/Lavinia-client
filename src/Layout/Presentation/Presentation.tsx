import * as React from "react";
import { ElectionOverview, DistrictOverview, SeatDistribution, SingleDistrict, LevellingSeatOverview } from ".";
import {
    getDistrictTableData,
    getPartyTableData,
    getSeatDistributionData,
    getSeatsPerPartyData,
    roundPartyResults,
    flattenPartyRestQuotients,
    removeSeatDuplicates,
    sortSeatsByNumber,
    getRoundsAssignedSeats,
    getLocalSeatDistribution,
} from "./presentation-utilities";
import { RemainderQuotients } from "./RemainderQuotients/RemainderQuotients";
import { toMax } from "../../utilities/reduce";
import { LagueDhontResult, PartyResult, DistrictResult, AlgorithmType } from "../../computation";
import { PresentationType, DisproportionalityIndex } from "./presentation-models";
import { ElectionComparison } from "./ElectionOverview/ElectionComparison";
import { checkExhaustively } from "../../utilities";
import { Dictionary } from "utilities/dictionary";

export interface PresentationProps {
    currentPresentation: PresentationType;
    districtSelected: string;
    decimals: number;
    showPartiesWithoutSeats: boolean;
    results: LagueDhontResult;
    disproportionalityIndex: DisproportionalityIndex;
    comparisonPartyResults: PartyResult[];
    showComparison: boolean;
    threshold: number;
    year: number;
    algorithm: AlgorithmType;
    showFilters: boolean;
    selectDistrict: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    partyMap: Dictionary<string>;
}

export class Presentation extends React.Component<PresentationProps, {}> {
    getPartyTableData(partyResults: PartyResult[]): PartyResult[] {
        return getPartyTableData(partyResults, this.props.showPartiesWithoutSeats, this.props.decimals);
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

    getLocalSeatDistribution(): DistrictResult[] {
        return getLocalSeatDistribution(this.props.results.districtResults, this.props.showPartiesWithoutSeats);
    }

    getSeatsPerPartyData(): PartyResult[] {
        return getSeatsPerPartyData(this.props.results.partyResults, this.props.showPartiesWithoutSeats);
    }

    getSingleDistrictData(): DistrictResult[] {
        const data = getDistrictTableData(this.getLocalSeatDistribution(), this.props.decimals);
        const roundedData: DistrictResult[] = [];
        data.forEach((result) => {
            roundedData.push({
                ...result,
                partyResults: roundPartyResults(result.partyResults, this.props.decimals),
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
                if (this.props.showComparison) {
                    return (
                        <ElectionComparison
                            comparisonPartyResults={this.getPartyTableData(this.props.comparisonPartyResults)}
                            currentPartyResults={this.getPartyTableData(this.props.results.partyResults)}
                        />
                    );
                }
                return (
                    <ElectionOverview
                        partyResults={this.props.results.partyResults}
                        comparisonPartyResults={this.props.comparisonPartyResults}
                        decimals={this.props.decimals}
                        showPartiesWithoutSeats={this.props.showPartiesWithoutSeats}
                        partyNameWidth={this.getWidestStringWidth(this.getPartyNames())}
                        disproportionalityIndex={this.props.disproportionalityIndex}
                        threshold={this.props.threshold}
                        showFilters={this.props.showFilters}
                    />
                );
            case PresentationType.DistrictTable:
                return (
                    <DistrictOverview
                        districtResults={this.getDistrictTableData()}
                        districtWidth={this.getWidestStringWidth(this.getDistricts())}
                        decimals={this.props.decimals}
                        algorithm={this.props.algorithm}
                        partyMap={this.props.partyMap}
                    />
                );
            case PresentationType.SeatDistribution:
                return (
                    <SeatDistribution
                        districtResults={this.getSeatDistributionData()}
                        districtWidth={this.getWidestStringWidth(this.getDistricts())}
                    />
                );
            case PresentationType.SingleDistrict:
                return (
                    <SingleDistrict
                        districtSelected={this.props.districtSelected}
                        districtResults={this.getSingleDistrictData()}
                        decimals={this.props.decimals}
                        disproportionalityIndex={this.props.disproportionalityIndex}
                        selectDistrict={this.props.selectDistrict}
                        algorithm={this.props.algorithm}
                        partyMap={this.props.partyMap}
                    />
                );
            case PresentationType.RemainderQuotients:
                return (
                    <RemainderQuotients
                        districtResults={this.getSeatDistributionData()}
                        levellingSeats={this.getLevellingSeats()}
                        finalQuotients={this.props.results.finalQuotients}
                        year={this.props.year}
                        decimals={this.props.decimals}
                        showPartiesWithoutSeats={this.props.showPartiesWithoutSeats}
                        algorithm={this.props.algorithm}
                    />
                );
            case PresentationType.LevellingSeats:
                return <LevellingSeatOverview levellingSeatQuotients={this.props.results.levelingSeatDistribution} />;
            default:
                checkExhaustively(this.props.currentPresentation);
                return;
        }
    }
}
