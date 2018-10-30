﻿import * as React from "react";
import { default as PresentationSelectionButton } from "./PresentationSelectionButtonContainer";
import { PresentationType } from "../Types/PresentationType";

export interface PresentationSelectionProps {
    currentSelection: PresentationType;
}

export class PresentationSelection extends React.Component {
    static defaultProps: PresentationSelectionProps = {
        currentSelection: PresentationType.ElectionTable
    };
    constructor(props: PresentationSelectionProps) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <h2>Presentasjonstyper</h2>
                <PresentationSelectionButton
                    className="btn-block"
                    title={"Landsoversikt"}
                    presentationSelected={PresentationType.ElectionTable}
                />
                <PresentationSelectionButton
                    className="btn-block"
                    title={"Distriktsoversikt"}
                    presentationSelected={PresentationType.DistrictTable}
                />
                <PresentationSelectionButton
                    className="btn-block"
                    title={"Mandatfordeling"}
                    presentationSelected={PresentationType.SeatDistribution}
                />
                <PresentationSelectionButton
                    className="btn-block"
                    title={"Mandater per parti"}
                    presentationSelected={PresentationType.SeatsPerParty}
                />
                <PresentationSelectionButton
                    className="btn-block"
                    title={"Fylkestabeller"}
                    presentationSelected={PresentationType.SingleCountyTable}
                />
                <PresentationSelectionButton
                    className="btn-block"
                    title={"Restkvotienter"}
                    presentationSelected={PresentationType.RemainderQuotients}
                />
                <PresentationSelectionButton
                    className="btn-block"
                    title={"Utjevningsmandater"}
                    presentationSelected={PresentationType.LevellingSeats}
                />
            </React.Fragment>
        );
    }
}