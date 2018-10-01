import * as React from "react";
import { PresentationType } from "../Types/PresentationType";
import { LagueDhontResult, PartyResult, DistrictResult } from "../Interfaces/Results";
import { ElectionOverview, DistrictOverview, SeatsPerParty, SeatDistribution, SingleDistrict } from "./Views";
import {
    getDistrictTableData,
    getPartyTableData,
    getSeatDistributionData,
    getSeatsPerPartyData,
    roundPartyResults
} from "./Utilities/PresentationUtilities";

export interface PresentationProps {
    currentPresentation: PresentationType;
    districtSelected: string;
    decimals: number;
    showPartiesWithoutSeats: boolean;
    results: LagueDhontResult;
}

export class PresentationComponent extends React.Component<PresentationProps, {}> {
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

    getDistricts(): string[] {
        const districts: string[] = [];
        this.props.results.districtResults.forEach((district) => {
            districts.push(district.name);
        });
        return districts;
    }

    render() {
        switch (this.props.currentPresentation) {
            case PresentationType.ElectionTable:
                return <ElectionOverview partyResults={this.getPartyTableData()} />;
            case PresentationType.DistrictTable:
                return <DistrictOverview districtResults={this.getDistrictTableData()} />;
            case PresentationType.SeatDistribution:
                return <SeatDistribution districtResults={this.getSeatDistributionData()} />;
            case PresentationType.SeatsPerParty:
                return <SeatsPerParty partyResults={this.getSeatsPerPartyData()} />;
            case PresentationType.SingleCountyTable:
                return (
                    <SingleDistrict
                        districtSelected={this.props.districtSelected}
                        districtResults={this.getSingleDistrictData()}
                    />
                );
            default:
                console.log(`Could not find presentation type ${this.props.currentPresentation}`);
                return <g />;
        }
    }
}
