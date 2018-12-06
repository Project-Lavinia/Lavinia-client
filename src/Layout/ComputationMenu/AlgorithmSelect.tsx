import * as React from "react";

export interface AlgorithmSelectProps {
    algorithm: number;
    onAlgorithmChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export class AlgorithmSelect extends React.Component<AlgorithmSelectProps> {
    render() {
        return (
            <div className="form-group row">
                <label className="text-left col-sm-3 col-form-label" htmlFor="algorithm_select">
                    Algoritme
                </label>
                <div className="col-sm-9">
                    <select
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
        );
    }
}
