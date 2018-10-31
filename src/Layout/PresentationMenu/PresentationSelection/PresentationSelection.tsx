import * as React from "react";
import { PresentationType } from "../../Presentation/presentation-models";
import { ConnectedPresentationSelectionButton } from ".";

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
                <ConnectedPresentationSelectionButton
                    className="btn-block"
                    title={"Landsoversikt"}
                    presentationSelected={PresentationType.ElectionTable}
                />
                <ConnectedPresentationSelectionButton
                    className="btn-block"
                    title={"Distriktsoversikt"}
                    presentationSelected={PresentationType.DistrictTable}
                />
                <ConnectedPresentationSelectionButton
                    className="btn-block"
                    title={"Mandatfordeling"}
                    presentationSelected={PresentationType.SeatDistribution}
                />
                <ConnectedPresentationSelectionButton
                    className="btn-block"
                    title={"Mandater per parti"}
                    presentationSelected={PresentationType.SeatsPerParty}
                />
                <ConnectedPresentationSelectionButton
                    className="btn-block"
                    title={"Fylkestabeller"}
                    presentationSelected={PresentationType.SingleCountyTable}
                />
                <ConnectedPresentationSelectionButton
                    className="btn-block"
                    title={"Restkvotienter"}
                    presentationSelected={PresentationType.RemainderQuotients}
                />
                <ConnectedPresentationSelectionButton
                    className="btn-block"
                    title={"Utjevningsmandater"}
                    presentationSelected={PresentationType.LevellingSeats}
                />
            </React.Fragment>
        );
    }
}
