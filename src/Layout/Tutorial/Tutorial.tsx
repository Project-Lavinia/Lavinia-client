import * as React from "react";
export interface TutorialProps {
    showTutorial: boolean
    closeTutorial: () => void
}

export class Tutorial extends React.Component<TutorialProps, {}> {

    public render() {
        const showTutorial = this.props.showTutorial ? " is-active" : "" ;
        const modalClass = "modal" + showTutorial;

        return (
            <div className={modalClass}>
            <div className="modal-background" onClick={() => this.props.closeTutorial()}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                <p className="modal-card-title">Velkommen til Lavinia</p>
                <button className="delete" aria-label="close" onClick={() => this.props.closeTutorial()}></button>
                </header>
                <section className="modal-card-body">
                    <b>Program tips</b>
                    <p>
                        I Lavinia vil du se hjelpesymboler 
                        (<i className="fas fa-info-circle has-text-primary" />) 
                        ved de forskjellige valgmulighetene. 
                        Dersom du holder musepekeren over de 
                        vil du få en kort forklaring om valgmuligheten.
                        Du kan klikke på symbolene for å få mer informasjon.
                    </p>
                    <br />
                    <b>Wiki</b>
                    <p>
                        For å lese mer som Lavinia og det norske valgsystemet
                        kan du ta en titt på wikien vår: 
                         <a target="_blank"
                            rel="noopener noreferrer"
                            href="https://project-lavinia.github.io/#Lavinia"> https://project-lavinia.github.io/#Lavinia
                            </a>
                    </p> 
                </section>
                <footer className="modal-card-foot">
                    <button className="button" onClick={() => this.props.closeTutorial()}>Ok</button>
                </footer>
            </div>
            </div>
        );
    }
}