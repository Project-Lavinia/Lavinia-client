import { PresentationType } from "../Presentation/presentation-models";

export interface PresentationMenuState {
    currentPresentation: PresentationType;
    districtSelected: string;
    decimals: string;
    decimalsNumber: number;
    showPartiesWithoutSeats: boolean;
}

export const unloadedState: PresentationMenuState = {
    currentPresentation: PresentationType.ElectionTable,
    decimals: "2",
    decimalsNumber: 2,
    showPartiesWithoutSeats: false,
    districtSelected: "Østfold"
};
