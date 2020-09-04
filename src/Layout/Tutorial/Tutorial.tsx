import * as React from "react";
export interface TutorialProps {
    showTutorial: boolean;
    closeTutorial: () => void;
}

export class Tutorial extends React.Component<TutorialProps, {}> {
    public render() {
        const showTutorial = this.props.showTutorial ? " is-active" : "";
        const modalClass = "modal" + showTutorial;

        return (
            <div className={modalClass}>
                <div className="modal-background" onClick={this.props.closeTutorial} />
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Velkommen til Lavinia</p>
                        <button className="delete" aria-label="close" onClick={this.props.closeTutorial} />
                    </header>
                    <section className="modal-card-body">
                        <b>Lavinia</b>
                        <p>
                            Lavinia er et verktøy for å vise hvordan den norske valgordningen gjør om stemmer
                            til mandater ved stortingsvalg. Ved å justere på innstillingene for valgordningen kan du
                            se hvordan det påvirker resultatene og hvilke partier som vinner eller taper på forandringene.
                        </p>
                        <br />
                        <b>Programtips</b>
                        <p>
                            I Lavinia vil du se hjelpesymboler (<i className="fas fa-info-circle has-text-primary" />)
                            ved de forskjellige innstillingene. Dersom du holder musepekeren over de vil du få en kort
                            forklaring om innstillingen. Du kan klikke på symbolene for å få mer informasjon.
                        </p>
                        <br />
                        <b>Wiki</b>
                        <p>
                            For å lese mer som Lavinia og det norske valgsystemet kan du ta en titt på wikien vår:
                            <a target="_blank" rel="noopener noreferrer" href={process.env.WIKI}>
                                {" "}
                                {process.env.WIKI}
                            </a>
                        </p>
                        <br />
                        <b>Personvern</b>
                        <p>
                            Lavinia bruker ikke cookies, sporer deg ikke, og samler ikke inn informasjon om deg.
                        </p>
                    </section>
                    <footer className="modal-card-foot has-text-centered" style={{ justifyContent: "center" }}>
                        <button className="button is-medium" onClick={this.props.closeTutorial} id={"close_tutorial_button"}>
                            OK
                        </button>
                    </footer>
                </div>
            </div>
        );
    }
}
