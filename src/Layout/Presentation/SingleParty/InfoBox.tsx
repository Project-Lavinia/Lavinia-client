import * as React from "react";

export class InfoBox extends React.Component<{}> {

    render() {
        return (
            <div className="card has-background-primary has-text-light is-size-5">
                <div className="card-content">
                    <p>
                        En pokal betyr at partiet vant sistemandatet i fylket.
                        Svartmarkerte ruter i <i>margin i stemmer</i> kolonnen betyr at partiet
                        trengte færrest ekstra stemmer for å vinne sistemandatet for fylket.
                        I <i>siste kvotient</i> kolonnen betyr svartmarkerte ruter at partiet
                        hadde den største kvotienten utenom vinneren.
                    </p>
                </div>
            </div>
        );
    }
}
