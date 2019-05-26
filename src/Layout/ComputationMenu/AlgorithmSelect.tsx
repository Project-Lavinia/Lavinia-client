import * as React from "react";

export interface AlgorithmSelectProps {
    algorithm: number;
    onAlgorithmChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export class AlgorithmSelect extends React.Component<AlgorithmSelectProps> {
    render() {
        return (
            <div className="field">
                <label className="label" htmlFor="algorithm_select">
                    Metode
                </label>
                <div className="control">
                    <div className="select is-primary is-fullwidth">
                        <select
                            title="Beregningsmetode"
                            className="form-control"
                            id="algorithm_select"
                            name="calcMethod"
                            value={this.props.algorithm.toString()}
                            onChange={this.props.onAlgorithmChange}
                        >
                            <option value="1">Sainte-Lagüe</option>
                            <option value="2">d'Hondt</option>>
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}
