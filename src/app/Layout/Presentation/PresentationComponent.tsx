import * as React from "react";
import { PresentationType } from "../Types/PresentationType";
import { LagueDhontResult, PartyResult, DistrictResult, PartyRestQuotients, LevelingSeat } from "../Interfaces/Results";
import { ElectionOverview, DistrictOverview, SeatsPerParty, SeatDistribution, SingleDistrict } from "./Views";
import {
    getDistrictTableData,
    getPartyTableData,
    getSeatDistributionData,
    getSeatsPerPartyData,
    roundPartyResults
} from "./Utilities/PresentationUtilities";
import { RemainderQuotients } from "./Views/RemainderQuotients";

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

    getLevellingSeats() {
        /**
         * Flattens a cumbersome object
         * @param prqs a container object that needs to be flattened
         */
        function flattenPartyRestQuotients(prqs: PartyRestQuotients[]): LevelingSeat[] {
            const levellingSeats: LevelingSeat[] = [];
            prqs.forEach((prq) => {
                prq.levelingSeats.forEach((seat) => {
                    levellingSeats.push(seat);
                });
            });
            return levellingSeats;
        }
        const seats: LevelingSeat[] = [];
        const seatRounds = flattenPartyRestQuotients(this.props.results.levelingSeatDistribution);
        console.log("seatRounds", seatRounds);
        seatRounds.forEach((round) => {
            if (round.seatNumber > 0) {
                seats.push(round);
            }
        });
        function removeSeatDuplicates(seats: LevelingSeat[]): LevelingSeat[] {
            const existingSeatsSet: Set<string> = new Set();
            const uniqueSeats: LevelingSeat[] = [];
            seats.forEach((seat) => {
                if (!existingSeatsSet.has(seat.district + seat.seatNumber)) {
                    uniqueSeats.push(seat);
                    existingSeatsSet.add(seat.district + seat.seatNumber);
                }
            });
            return uniqueSeats;
        }

        function sortSeatsByNumber(seats: LevelingSeat[]): LevelingSeat[] {
            const sortedSeats: LevelingSeat[] = seats;
            sortedSeats.sort((a, b) => {
                if (a.seatNumber < b.seatNumber) {
                    return -1;
                } else if (a.seatNumber > b.seatNumber) {
                    return 1;
                } else {
                    return 0;
                }
            });
            return sortedSeats;
        }
        console.log("levelling seats:", sortSeatsByNumber(removeSeatDuplicates(seats)));
        return sortSeatsByNumber(removeSeatDuplicates(seats));
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
            case PresentationType.RemainderQuotients:
                this.getLevellingSeats();
                return (
                    <RemainderQuotients
                        districtResults={this.getSeatDistributionData()}
                        levellingSeats={this.getLevellingSeats()}
                        decimals={this.props.decimals}
                        showPartiesWithoutSeats={this.props.showPartiesWithoutSeats}
                    />
                );
            default:
                console.log(`Could not find presentation type ${this.props.currentPresentation}`);
                return <g />;
        }
    }
}
