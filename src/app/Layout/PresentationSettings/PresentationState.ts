import { PresentationType } from "../Types/PresentationType";

export interface PresentationState {
    currentPresentation: PresentationType;
    decimals: string;
    decimalsNumber: number;
    showPartiesWithoutSeats: boolean;
}

export const unloadedState: PresentationState = {
    currentPresentation: PresentationType.ElectionTable,
    decimals: "2",
    decimalsNumber: 2,
    showPartiesWithoutSeats: false
};
