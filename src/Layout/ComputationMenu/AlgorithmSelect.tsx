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
                    Valgt metode
                </label>
                <div className="control">
                    <div className="select is-dark is-fullwidth">
                        <select
                            title="Beregningsmetode"
                            className="form-control"
                            id="algorithm_select"
                            name="calcMethod"
                            value={this.props.algorithm.toString()}
                            onChange={this.props.onAlgorithmChange}
                        >
                            <option value="1">Sainte-Lagüe</option>
                            <option value="2">d'Hondt</option>
                            <option value="3">Største brøk (Hare)</option>
                            <option value="4">Største brøk (Droop)</option>>
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}
