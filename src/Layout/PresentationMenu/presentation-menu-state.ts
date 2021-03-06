import { PresentationType, DisproportionalityIndex } from "../Presentation/presentation-models";

export interface PresentationMenuState {
    showComparison: boolean;
    showFilters: boolean;
    mergeDistricts: boolean;
    use2021Distribution: boolean;
    currentPresentation: PresentationType;
    districtSelected: string;
    partySelected: string;
    decimals: string;
    decimalsNumber: number;
    showPartiesWithoutSeats: boolean;
    disproportionalityIndex: DisproportionalityIndex;
}

export const unloadedState: PresentationMenuState = {
    showComparison: false,
    showFilters: false,
    mergeDistricts: false,
    use2021Distribution: false,
    currentPresentation: PresentationType.ElectionTable,
    decimals: "2",
    decimalsNumber: 2,
    showPartiesWithoutSeats: true,
    districtSelected: "Østfold",
    partySelected: "A",
    disproportionalityIndex: DisproportionalityIndex.GALLAGHER,
};
